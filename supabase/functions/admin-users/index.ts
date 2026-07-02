// 계정 관리 Edge Function — 1·2급만 호출 가능. 서버에서 service_role 키로 처리.
// 배포: Supabase 대시보드 → Edge Functions → admin-users (아래 코드 붙여넣고 Deploy)
//  - SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY 는 Edge Functions에 자동 주입됨.
// 액션: create(계정 생성) / delete(삭제) / setPassword(임시 비번 설정)
// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization") ?? "";

    // 호출자 신원 확인
    const caller = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
    } = await caller.auth.getUser();
    if (!user) return json(200, { ok: false, error: "로그인이 필요합니다." });

    const admin = createClient(url, service);
    const { data: prof } = await admin
      .from("profiles")
      .select("level")
      .eq("id", user.id)
      .single();
    const callerLevel = (prof?.level as number) ?? 9;
    if (callerLevel > 2)
      return json(200, { ok: false, error: "권한이 없습니다." });

    const body = await req.json();
    const action = body.action as string;

    if (action === "create") {
      const subject = String(body.subject ?? "").trim();
      const name = String(body.name ?? "").trim();
      const password = String(body.password ?? "");
      const level = Number(body.level);
      const teacher_id = body.teacher_id || null;
      if (!subject || !name || !password)
        return json(200, { ok: false, error: "과목·이름·비밀번호를 입력해 주세요." });
      if (password.length < 6)
        return json(200, { ok: false, error: "비밀번호는 6자 이상이어야 합니다." });
      if (![1, 2, 3].includes(level))
        return json(200, { ok: false, error: "등급이 올바르지 않습니다." });
      if (callerLevel === 2 && level !== 3)
        return json(200, {
          ok: false,
          error: "2급은 3급(선생님) 계정만 만들 수 있습니다.",
        });

      const { data: dup } = await admin
        .from("login_directory")
        .select("email")
        .eq("subject", subject)
        .eq("name", name)
        .maybeSingle();
      if (dup)
        return json(200, {
          ok: false,
          error: "같은 과목·이름의 계정이 이미 있습니다.",
        });

      const email = `${crypto.randomUUID()}@saeron.local`;
      const { data: created, error: cErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (cErr || !created.user)
        return json(200, { ok: false, error: cErr?.message ?? "계정 생성 실패" });
      const uid = created.user.id;

      const { error: pErr } = await admin
        .from("profiles")
        .insert({ id: uid, level, name, teacher_id });
      if (pErr) {
        await admin.auth.admin.deleteUser(uid);
        return json(200, { ok: false, error: "프로필 생성 실패" });
      }
      const { error: lErr } = await admin
        .from("login_directory")
        .insert({ email, subject, name, user_id: uid });
      if (lErr) {
        await admin.auth.admin.deleteUser(uid);
        return json(200, { ok: false, error: "로그인 매핑 생성 실패" });
      }
      return json(200, { ok: true });
    }

    if (action === "delete") {
      const user_id = String(body.user_id ?? "");
      if (!user_id) return json(200, { ok: false, error: "대상이 없습니다." });
      if (user_id === user.id)
        return json(200, { ok: false, error: "본인 계정은 삭제할 수 없습니다." });
      const { data: target } = await admin
        .from("profiles")
        .select("level")
        .eq("id", user_id)
        .single();
      const targetLevel = (target?.level as number) ?? 9;
      if (callerLevel === 2 && targetLevel !== 3)
        return json(200, {
          ok: false,
          error: "2급은 3급 계정만 삭제할 수 있습니다.",
        });
      const { error: dErr } = await admin.auth.admin.deleteUser(user_id);
      if (dErr) return json(200, { ok: false, error: dErr.message });
      return json(200, { ok: true });
    }

    if (action === "setPassword") {
      const user_id = String(body.user_id ?? "");
      const password = String(body.password ?? "");
      if (!user_id || password.length < 6)
        return json(200, {
          ok: false,
          error: "비밀번호는 6자 이상이어야 합니다.",
        });
      const { data: target } = await admin
        .from("profiles")
        .select("level")
        .eq("id", user_id)
        .single();
      const targetLevel = (target?.level as number) ?? 9;
      if (callerLevel === 2 && targetLevel !== 3)
        return json(200, {
          ok: false,
          error: "2급은 3급 계정만 변경할 수 있습니다.",
        });
      const { error: sErr } = await admin.auth.admin.updateUserById(user_id, {
        password,
      });
      if (sErr) return json(200, { ok: false, error: sErr.message });
      return json(200, { ok: true });
    }

    return json(200, { ok: false, error: "알 수 없는 요청입니다." });
  } catch {
    return json(200, { ok: false, error: "서버 오류가 발생했습니다." });
  }
});
