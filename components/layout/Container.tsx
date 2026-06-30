import type { ReactNode } from "react";

/**
 * 페이지 최대폭 + 좌우 패딩 래퍼 (DESIGN.md §3)
 * 유동 우선: 폭은 % 기반, 좌우 패딩만 단계적으로 키운다.
 */
export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--container-page)] px-4 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
