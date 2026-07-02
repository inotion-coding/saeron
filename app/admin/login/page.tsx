import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "관리자 로그인",
  robots: { index: false, follow: false }, // 검색엔진 비노출
};

/**
 * 관리자 로그인 — 게이트(/admin) 확인 후 도착지.
 * (과목 + 이름 + 비밀번호) 방식. 실제 처리는 client 컴포넌트 LoginForm.
 */
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-4 py-16">
      <div className="w-full max-w-sm rounded-[var(--radius-lg)] border border-border bg-background p-8 text-center shadow-card sm:p-10">
        <span className="eyebrow justify-center">
          <span className="h-px w-7 bg-point" aria-hidden="true" />
          ADMIN
        </span>
        <h1 className="mt-4 text-h3 font-bold text-foreground">관리자 로그인</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          과목·이름·비밀번호로 로그인하세요.
        </p>

        <LoginForm />
      </div>
    </div>
  );
}
