import type { Metadata } from "next";
import AccountsAdmin from "@/components/admin/AccountsAdmin";

export const metadata: Metadata = {
  title: "계정 관리",
  robots: { index: false, follow: false }, // 검색엔진 비노출
};

/**
 * 관리자 계정 관리 — 1·2급만. 계정 생성/삭제/임시비번은 Edge Function(admin-users) 경유.
 * 실제 처리는 client 컴포넌트 AccountsAdmin.
 */
export default function AdminAccountsPage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <AccountsAdmin />
      </div>
    </div>
  );
}
