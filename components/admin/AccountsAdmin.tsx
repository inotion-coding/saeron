"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";

const SUBJECTS = ["국어", "수학", "영어", "사회", "과학", "관리자"];
const LEVEL_LABEL: Record<number, string> = {
  1: "개발자",
  2: "원장·실장",
  3: "선생님",
};

type TeacherOpt = { id: string; name: string; subject_group?: string };
type Account = {
  user_id: string;
  name: string;
  subject: string;
  level: number;
  teacherName?: string;
};

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-3.5 text-sm text-foreground transition-colors " +
  "placeholder:text-muted-foreground hover:border-point/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/**
 * 계정 관리 — 1·2급만. 강사(3급) 계정 생성·삭제·임시비번 설정.
 * 실제 계정 생성은 Edge Function(admin-users)이 서버에서 처리(비밀키 안전).
 */
export default function AccountsAdmin() {
  const router = useRouter();
  const [callerLevel, setCallerLevel] = useState(9);
  const [callerId, setCallerId] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "denied">("loading");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [teachers, setTeachers] = useState<TeacherOpt[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // 생성 폼
  const [showForm, setShowForm] = useState(false);
  const [fSubject, setFSubject] = useState("");
  const [fName, setFName] = useState("");
  const [fPassword, setFPassword] = useState("");
  const [fLevel, setFLevel] = useState(3);
  const [fTeacher, setFTeacher] = useState("");

  const load = useCallback(async () => {
    const [ld, profs, tchs] = await Promise.all([
      supabase.from("login_directory").select("email, subject, name, user_id"),
      supabase.from("profiles").select("id, level, name, teacher_id"),
      supabase.from("teachers").select("id, name, subject_group").order("sort_order"),
    ]);
    const profList = (profs.data as { id: string; level: number; teacher_id: string | null }[]) ?? [];
    const tchList = (tchs.data as TeacherOpt[]) ?? [];
    const list: Account[] = ((ld.data as { subject: string; name: string; user_id: string | null }[]) ?? [])
      .filter((l) => l.user_id)
      .map((l) => {
        const p = profList.find((x) => x.id === l.user_id);
        const t = p?.teacher_id ? tchList.find((x) => x.id === p.teacher_id) : undefined;
        return {
          user_id: l.user_id as string,
          name: l.name,
          subject: l.subject,
          level: p?.level ?? 9,
          teacherName: t?.name,
        };
      })
      .sort((a, b) => a.level - b.level);
    setAccounts(list);
    setTeachers(tchList);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) {
        router.replace("/admin/login");
        return;
      }
      setCallerId(s.session.user.id);
      const { data: prof } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", s.session.user.id)
        .single();
      if (!active) return;
      const lv = (prof as { level: number } | null)?.level ?? 9;
      setCallerLevel(lv);
      if (lv > 2) {
        setStatus("denied");
        return;
      }
      await load();
      if (active) setStatus("ready");
    })();
    return () => {
      active = false;
    };
  }, [router, load]);

  function resetForm() {
    setFSubject("");
    setFName("");
    setFPassword("");
    setFLevel(3);
    setFTeacher("");
  }

  async function createAccount() {
    setError("");
    setNotice("");
    if (!fSubject || !fName.trim() || !fPassword) {
      setError("과목·이름·비밀번호를 입력해 주세요.");
      return;
    }
    setBusy(true);
    try {
      const { data, error: e } = await supabase.functions.invoke("admin-users", {
        body: {
          action: "create",
          subject: fSubject,
          name: fName.trim(),
          password: fPassword,
          level: fLevel,
          teacher_id: fTeacher || null,
        },
      });
      if (e) throw e;
      if (!data?.ok) {
        setError(data?.error ?? "계정 생성에 실패했습니다.");
        return;
      }
      setNotice(`"${fName.trim()}" 계정을 만들었습니다.`);
      resetForm();
      setShowForm(false);
      await load();
    } catch {
      setError("요청에 실패했습니다. (Edge Function 배포 여부를 확인하세요)");
    } finally {
      setBusy(false);
    }
  }

  /** 강사 전원 계정 일괄 생성 (비번 saeronedu, 3급, 프로필 연결). 이미 있으면 건너뜀. */
  async function bulkCreateTeachers() {
    if (
      !window.confirm(
        `강사 ${teachers.length}명의 로그인 계정을 만들까요?\n비밀번호는 모두 "saeronedu"로 설정됩니다.`,
      )
    )
      return;
    setError("");
    setNotice("");
    setBusy(true);
    let created = 0;
    let skipped = 0;
    let failed = 0;
    try {
      for (const t of teachers) {
        const { data, error: e } = await supabase.functions.invoke("admin-users", {
          body: {
            action: "create",
            subject: t.subject_group ?? "관리자",
            name: t.name,
            password: "saeronedu",
            level: 3,
            teacher_id: t.id,
          },
        });
        if (e) {
          failed += 1;
          continue;
        }
        if (data?.ok) created += 1;
        else if (String(data?.error ?? "").includes("이미")) skipped += 1;
        else failed += 1;
      }
      await load();
      setNotice(
        `완료 — 생성 ${created}명, 건너뜀(이미 있음) ${skipped}명${
          failed ? `, 실패 ${failed}명` : ""
        }. (비번: saeronedu)`,
      );
      if (created === 0 && failed > 0) {
        setError(
          "계정을 만들지 못했습니다. accounts.sql 실행 + Edge Function(admin-users) 배포를 확인하세요.",
        );
      }
    } catch {
      setError("요청에 실패했습니다. (Edge Function 배포 여부 확인)");
    } finally {
      setBusy(false);
    }
  }

  async function removeAccount(a: Account) {
    if (!window.confirm(`"${a.name}" 계정을 삭제할까요?`)) return;
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const { data, error: e } = await supabase.functions.invoke("admin-users", {
        body: { action: "delete", user_id: a.user_id },
      });
      if (e) throw e;
      if (!data?.ok) {
        setError(data?.error ?? "삭제에 실패했습니다.");
        return;
      }
      setNotice(`"${a.name}" 계정을 삭제했습니다.`);
      await load();
    } catch {
      setError("요청에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(a: Account) {
    const pw = window.prompt(`"${a.name}"의 새 임시 비밀번호 (6자 이상)`);
    if (!pw) return;
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const { data, error: e } = await supabase.functions.invoke("admin-users", {
        body: { action: "setPassword", user_id: a.user_id, password: pw },
      });
      if (e) throw e;
      if (!data?.ok) {
        setError(data?.error ?? "변경에 실패했습니다.");
        return;
      }
      setNotice(`"${a.name}"의 임시 비밀번호를 설정했습니다.`);
    } catch {
      setError("요청에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <p className="text-center text-sm text-muted-foreground">불러오는 중…</p>;
  }
  if (status === "denied") {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          계정 관리는 2급 이상만 접근할 수 있습니다.
        </p>
        <Link
          href="/admin/dashboard"
          className="mt-4 inline-block text-sm font-semibold text-point hover:underline"
        >
          ← 대시보드
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← 대시보드
          </Link>
          <h1 className="mt-2 text-h2 font-bold text-foreground">계정 관리</h1>
        </div>
        {!showForm && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={bulkCreateTeachers}
              disabled={busy}
            >
              강사 전원 계정 생성
            </Button>
            <Button variant="primary" onClick={() => setShowForm(true)}>
              새 계정
            </Button>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        회원가입 기능이 없으므로, 여기서 만든 계정으로만 로그인할 수 있습니다. 로그인은
        <b> 과목·이름·비밀번호</b>로 합니다.
      </p>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}
      {notice && <p className="mt-4 text-sm text-point">{notice}</p>}

      {/* 생성 폼 */}
      {showForm && (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-card">
          <h2 className="text-h3 font-bold text-foreground">새 계정 만들기</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field label="과목">
              <select
                className={`${fieldBase} h-11 cursor-pointer appearance-none pr-9`}
                value={fSubject}
                onChange={(e) => setFSubject(e.target.value)}
              >
                <option value="" disabled>
                  과목 선택
                </option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="이름">
              <input
                className={`${fieldBase} h-11`}
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                placeholder="선생님 이름"
              />
            </Field>
            <Field label="임시 비밀번호">
              <input
                className={`${fieldBase} h-11`}
                value={fPassword}
                onChange={(e) => setFPassword(e.target.value)}
                placeholder="6자 이상 (첫 로그인 후 변경 안내)"
              />
            </Field>
            <Field label="등급">
              <select
                className={`${fieldBase} h-11 cursor-pointer appearance-none pr-9`}
                value={fLevel}
                onChange={(e) => setFLevel(Number(e.target.value))}
              >
                <option value={3}>선생님 (3급)</option>
                {callerLevel === 1 && <option value={2}>원장·실장 (2급)</option>}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="연결 강사 (선택 — 3급 본인 프로필/시간표용)">
                <select
                  className={`${fieldBase} h-11 cursor-pointer appearance-none pr-9`}
                  value={fTeacher}
                  onChange={(e) => setFTeacher(e.target.value)}
                >
                  <option value="">없음</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="primary" onClick={createAccount} disabled={busy}>
              {busy ? "만드는 중…" : "계정 만들기"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                resetForm();
                setError("");
              }}
              disabled={busy}
            >
              취소
            </Button>
          </div>
        </div>
      )}

      {/* 계정 목록 */}
      <ul className="mt-8 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border">
        {accounts.map((a) => (
          <li key={a.user_id} className="flex items-center gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold text-foreground">{a.name}</p>
                <span className="shrink-0 rounded-full border border-point/40 px-2 py-0.5 text-[11px] font-bold text-point">
                  {LEVEL_LABEL[a.level] ?? "-"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                로그인: {a.subject} · {a.name}
                {a.teacherName ? ` · 연결강사: ${a.teacherName}` : ""}
              </p>
            </div>
            {a.user_id !== callerId && (
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => resetPassword(a)}
                  disabled={busy}
                  className="rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-sm font-semibold text-foreground hover:border-point/50"
                >
                  비번 재설정
                </button>
                <button
                  type="button"
                  onClick={() => removeAccount(a)}
                  disabled={busy}
                  className="rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-sm font-semibold text-error hover:border-error"
                >
                  삭제
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
