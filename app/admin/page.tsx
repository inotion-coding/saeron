import type { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "관리자 접속",
  robots: { index: false, follow: false }, // 검색엔진 비노출
};

/**
 * 관리자 접속 게이트 — 푸터 "관리자 페이지 접속"의 목적지.
 * 경고 문구를 보여주고, [확인] 시 로그인 화면(/admin/login)으로 이동.
 * (SiteChrome가 /admin 이하는 사이트 헤더·푸터 없이 렌더)
 */
export default function AdminGatePage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface px-4 py-16">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-background p-8 text-center shadow-card sm:p-10">
        {/* 경고 아이콘 */}
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-point/10"
          aria-hidden="true"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              stroke="var(--color-point)"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-5 text-h3 font-bold text-foreground">
          관리자 페이지 접속
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          관리자 이외 계정으로 로그인 시도 시,
          <br />
          <span className="font-bold text-point">영구 차단</span>될 수 있습니다.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button href="/admin/login" variant="primary" className="w-full">
            확인
          </Button>
          <Button href="/" variant="ghost" className="w-full">
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
