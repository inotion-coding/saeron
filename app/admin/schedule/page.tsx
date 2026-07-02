import type { Metadata } from "next";
import ScheduleAdmin from "@/components/admin/ScheduleAdmin";

export const metadata: Metadata = {
  title: "시간표 관리",
  robots: { index: false, follow: false }, // 검색엔진 비노출
};

/**
 * 관리자 시간표 관리 — 로그인·등급 확인 후 수업 CRUD(1·2급 전체 / 3급 본인).
 * 실제 처리는 client 컴포넌트 ScheduleAdmin.
 */
export default function AdminSchedulePage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <ScheduleAdmin />
      </div>
    </div>
  );
}
