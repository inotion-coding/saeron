"use client";

import { useState } from "react";
import Link from "next/link";
import { getLatestNotice } from "@/lib/data/notices";
import Container from "./layout/Container";

/**
 * 메인 기본 공지 영역 (1단계) — 최신 공지 1건을 상단에 노출, 닫기 가능.
 * 데이터: lib/data/notices.ts
 */
export default function NoticeBar() {
  const [hidden, setHidden] = useState(false);
  const notice = getLatestNotice();

  if (!notice || hidden) return null;

  const formatted = notice.date.replace(/-/g, ".");

  return (
    <div className="border-b border-border bg-surface text-foreground">
      <Container className="flex items-center gap-3 py-2">
        <span className="shrink-0 rounded-[var(--radius-sm)] bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
          공지
        </span>

        <Link
          href={notice.href ?? "#"}
          className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
          title={notice.title}
        >
          {notice.title}
        </Link>

        <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
          {formatted}
        </span>

        <button
          type="button"
          onClick={() => setHidden(true)}
          aria-label="공지 닫기"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1l12 12M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </Container>
    </div>
  );
}
