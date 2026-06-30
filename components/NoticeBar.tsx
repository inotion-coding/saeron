"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getSortedNotices } from "@/lib/data/notices";
import Container from "./layout/Container";

const AUTO_INTERVAL = 4000; // ms

/**
 * 메인 공지 슬라이드 배너 (1단계) — 여러 공지를 큰 배너로 롤링 노출.
 * - 자동 전환(4초), hover/focus 시 일시정지, prefers-reduced-motion 존중
 * - 좌우 이동 버튼 + 인디케이터(점), 닫기 가능
 * 데이터: lib/data/notices.ts
 */
export default function NoticeBar() {
  const notices = getSortedNotices();
  const count = notices.length;

  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (count <= 1 || paused || reducedMotion.current) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_INTERVAL);
    return () => window.clearInterval(id);
  }, [count, paused]);

  if (count === 0 || hidden) return null;

  const go = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <section
      className="border-b border-border bg-surface"
      aria-roledescription="carousel"
      aria-label="공지 슬라이드"
    >
      <Container className="py-[clamp(2rem,1.2rem+3vw,4rem)]">
        {/* 상단: 배지 + 닫기 */}
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center rounded-[var(--radius-sm)] bg-primary px-2.5 py-1 text-xs font-bold tracking-wide text-primary-foreground">
            공지
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

        {/* 본문: 좌우 버튼 + 슬라이드 뷰포트 */}
        <div className="flex items-center gap-2 sm:gap-4">
          {count > 1 && (
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="이전 공지"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              <Chevron dir="left" />
            </button>
          )}

          <div
            className="relative min-w-0 flex-1 overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            aria-live="polite"
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {notices.map((notice, i) => (
                <div
                  key={notice.id}
                  className="flex min-h-[5rem] w-full shrink-0 flex-col justify-center gap-2 sm:min-h-[6.5rem]"
                  aria-hidden={i !== index}
                >
                  <Link
                    href={notice.href ?? "#"}
                    tabIndex={i === index ? 0 : -1}
                    className="group block"
                    title={notice.title}
                  >
                    <p className="line-clamp-2 text-[clamp(1.25rem,1rem+1.8vw,2rem)] font-bold leading-snug text-foreground group-hover:text-primary">
                      {notice.title}
                    </p>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {notice.date.replace(/-/g, ".")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {count > 1 && (
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="다음 공지"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              <Chevron dir="right" />
            </button>
          )}
        </div>

        {/* 하단: 인디케이터 점 */}
        {count > 1 && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {notices.map((notice, i) => (
              <button
                key={notice.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}번째 공지로 이동`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-primary"
                    : "w-2 bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d={dir === "left" ? "M9 2L4 7l5 5" : "M5 2l5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
