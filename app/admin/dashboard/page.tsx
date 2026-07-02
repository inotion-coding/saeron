import type { Metadata } from "next";
import DashboardClient from "@/components/admin/DashboardClient";

export const metadata: Metadata = {
  title: "관리자 대시보드",
  robots: { index: false, follow: false }, // 검색엔진 비노출
};

/**
 * 관리자 대시보드 — 로그인 성공 후 도착지(보호 영역).
 * 세션 확인·프로필 조회·메뉴는 client 컴포넌트 DashboardClient.
 */
export default function AdminDashboardPage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <DashboardClient />
      </div>
    </div>
  );
}
