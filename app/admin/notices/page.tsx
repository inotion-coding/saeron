import type { Metadata } from "next";
import NoticesAdmin from "@/components/admin/NoticesAdmin";

export const metadata: Metadata = {
  title: "공지 관리",
  robots: { index: false, follow: false }, // 검색엔진 비노출
};

/**
 * 관리자 공지 관리 — 로그인·등급(≤2) 확인 후 CRUD.
 * 실제 처리는 client 컴포넌트 NoticesAdmin.
 */
export default function AdminNoticesPage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <NoticesAdmin />
      </div>
    </div>
  );
}
