"use client";

import { useState } from "react";
import Link from "next/link";
import { getLatestNotice } from "@/lib/data/notices";
import Container from "./layout/Container";

/**
 * 공지 배너 (홈 상단) — DESIGN.md §5
 * 최신 공지 1건을 정적으로 노출. (슬라이드/캐러셀 없음)
 * 닫기 가능. 데이터: lib/data/notices.ts
 */
export default function NoticeBar() {
  const [hidden, setHidden] = useState(false);
  const notice = getLatestNotice();

  if (!notice || hidden) return null;

  return (
    <section data-tone="paper" className="border-b border-border" aria-label="공지">
      <Container className="py-[clamp(2.5rem,1.5rem+3vw,4rem)]">
        {/* 상단: 배지 + 닫기 */}
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.08em] text-point">
            <span className="h-px w-7 bg-point" aria-hidden="true" />
            공지사항
          </span>
          <button
            type="button"
            onClick={() => setHidden(true)}
            aria-label="공지 닫기"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-background hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 1l12 12M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* 본문: 최신 공지 */}
        <Link href={notice.href ?? "#"} className="group block" title={notice.title}>
          <p className="line-clamp-2 text-[clamp(1.2rem,0.95rem+1.6vw,1.9rem)] font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
            {notice.title}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {notice.date.replace(/-/g, ".")}
          </p>
        </Link>
      </Container>
    </section>
  );
}
