import type { Metadata } from "next";
import InquiriesAdmin from "@/components/admin/InquiriesAdmin";

export const metadata: Metadata = {
  title: "상담 신청",
  robots: { index: false, follow: false }, // 검색엔진 비노출
};

/**
 * 관리자 상담 신청 열람 — 1·2급만. 공개 폼(inquiries) 제출 확인·처리·삭제.
 * 실제 처리는 client 컴포넌트 InquiriesAdmin.
 */
export default function AdminInquiriesPage() {
  return (
    <div className="min-h-dvh bg-background px-4 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <InquiriesAdmin />
      </div>
    </div>
  );
}
