import type { Metadata } from "next";
import PasswordChange from "@/components/admin/PasswordChange";

export const metadata: Metadata = {
  title: "내 비밀번호 변경",
  robots: { index: false, follow: false }, // 검색엔진 비노출
};

/**
 * 내 비밀번호 변경 — 로그인한 모든 등급이 본인 비밀번호를 직접 변경.
 * 실제 처리는 client 컴포넌트 PasswordChange (supabase.auth.updateUser).
 */
export default function AdminPasswordPage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-lg">
        <PasswordChange />
      </div>
    </div>
  );
}
