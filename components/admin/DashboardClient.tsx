"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  function AdminMenuCard({
    href,
    title,
    desc,
    disabled,
  }: {
    href: string;
    title: string;
    desc: string;
    disabled?: boolean;
  }) {
    if (disabled) {
      return (
        <div className="flex cursor-not-allowed items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-surface px-5 py-4 opacity-60">
          <div className="min-w-0 flex-1">
            <h2 className="text-h3 font-bold text-foreground">{title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
          </div>
          <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            준비 중
          </span>
        </div>
      );
    }
    return (
      <Link
        href={href}
        className="group flex items-center gap-4 rounded-[var(--radius-lg)] border-2 border-border bg-background px-5 py-4 shadow-card transition-colors hover:border-point"
      >
        <div className="min-w-0 flex-1">
          <h2 className="text-h3 font-bold text-foreground group-hover:text-point">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 text-muted-foreground/50 transition-colors group-hover:text-point"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>
    );
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

      {/* 관리 메뉴 (등급별) — 한 줄에 하나씩 */}
      <div className="mt-10 space-y-3">
        {profile && profile.level <= 2 && (
          <AdminMenuCard
            href="/admin/notices"
            title="공지 관리"
            desc="공지 추가·수정·삭제, 포스터 이미지 업로드"
          />
        )}
        {profile && profile.level <= 2 && (
          <AdminMenuCard
            href="/admin/teachers"
            title="강사 프로필 관리"
            desc="강사 추가·수정·삭제, 사진·학력·이력 편집"
          />
        )}
        {profile && profile.level <= 2 && (
          <AdminMenuCard
            href="/admin/schedule"
            title="시간표 관리"
            desc="수업 추가·수정·삭제 (강사·과목·부·요일·시간)"
          />
        )}
        {profile && profile.level <= 2 && (
          <AdminMenuCard
            href="/admin/inquiries"
            title="상담 신청"
            desc="홈페이지 상담 폼으로 접수된 문의 확인·처리"
          />
        )}
        {profile && profile.level <= 2 && (
          <AdminMenuCard
            href="/admin/accounts"
            title="계정 관리"
            desc="강사 계정 생성·삭제·임시 비밀번호 설정"
          />
        )}

        {/* 3급(선생님) — 본인 것만 */}
        {profile && profile.level === 3 && (
          <AdminMenuCard
            href="/admin/teachers"
            title="내 프로필"
            desc="내 강사 프로필(사진·각오·학력·이력) 수정"
          />
        )}
        {profile && profile.level === 3 && (
          <AdminMenuCard
            href="/admin/schedule"
            title="내 시간표"
            desc="내 수업 시간표 추가·수정"
          />
        )}
      </div>
    </div>
  );
}
