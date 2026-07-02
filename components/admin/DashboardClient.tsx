"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";

const LEVEL_LABEL: Record<number, string> = {
  1: "개발자",
  2: "원장·실장",
  3: "선생님",
};

type Profile = { level: number; name: string };

/**
 * 관리자 대시보드(보호 영역) — 로그인 세션 확인 후 표시.
 * 세션 없으면 로그인 화면으로. 프로필(등급·이름) 조회해 환영 + 로그아웃.
 * TODO(admin): 등급별 관리 메뉴(공지·강사·시간표·계정)를 다음 단계에서 추가.
 */
export default function DashboardClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");

  useEffect(() => {
    let active = true;

    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        router.replace("/admin/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("level, name")
        .eq("id", session.user.id)
        .single();

      if (!active) return;

      if (!data) {
        // 로그인은 됐지만 프로필(등급)이 없으면 접근 불가 → 로그아웃 후 로그인 화면
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      setProfile(data as Profile);
      setStatus("ready");
    })();

    return () => {
      active = false;
    };
  }, [router]);

  async function onLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (status === "loading") {
    return (
      <p className="text-center text-sm text-muted-foreground">불러오는 중…</p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">
            <span className="h-px w-7 bg-point" aria-hidden="true" />
            ADMIN
          </span>
          <h1 className="mt-3 text-h2 font-bold text-foreground">
            {profile?.name || "관리자"}님, 환영합니다
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            등급: {profile ? LEVEL_LABEL[profile.level] ?? "-" : "-"}
            {profile ? ` (${profile.level}급)` : ""}
          </p>
        </div>
        <Button variant="secondary" onClick={onLogout}>
          로그아웃
        </Button>
      </div>

      <div className="mt-10 rounded-[var(--radius-lg)] border border-border bg-surface p-6 text-sm leading-relaxed text-muted-foreground">
        관리 메뉴(공지·강사 프로필·시간표·계정)는 다음 단계에서 등급에 맞게 추가됩니다.
      </div>
    </div>
  );
}
