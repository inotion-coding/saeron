"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFeaturedNotices } from "@/lib/data/notices";
import Container from "./layout/Container";

const AUTO_INTERVAL = 4500; // ms

/**
 * 메인 공지 배너 슬라이드 (풀블리드) — DESIGN.md §5
 * 대표사진이 배너 전체를 덮고, 좌측 어두운 스크림 위에 흰 글씨(또렷).
 * featured 자동 롤링, 점 인디케이터, 일시정지·reduced-motion. 닫기·화살표 없음.
 */
export default function NoticeBar() {
  const items = getFeaturedNotices();
  const count = items.length;

  const [index, setIndex] = useState(0);
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

  if (count === 0) return null;

  const go = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <section
      data-tone="paper"
      aria-roledescription="carousel"
      aria-label="공지 슬라이드"
    >
      <div
        className="relative h-[clamp(15rem,11rem+13vw,22rem)] overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        aria-live="polite"
      >
        <div
          className="flex h-full transition-transform duration-500 ease-[var(--ease-out-soft)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((notice, i) => {
            const cover = notice.images?.[0];
            return (
              <div key={notice.id} className="relative h-full w-full shrink-0">
                {cover && (
                  <Image
                    src={cover}
                    alt=""
                    fill
                    sizes="100vw"
                    priority
                    className="object-cover"
                  />
                )}
                {/* 가독성 스크림 (좌측 강함) */}
                <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-black/10" />

                <Container className="relative z-10 flex h-full flex-col justify-center">
                  <span className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.08em] text-point-bright">
                    <span className="h-px w-7 bg-point-bright" aria-hidden="true" />
                    공지사항
                  </span>
                  <Link
                    href={`/notices/${notice.id}`}
                    tabIndex={i === index ? 0 : -1}
                    className="group mt-3 block max-w-2xl"
                    title={notice.title}
                  >
                    <p className="line-clamp-3 text-[clamp(1.4rem,1rem+2vw,2.6rem)] font-extrabold leading-snug text-white group-hover:underline">
                      {notice.title}
                    </p>
                  </Link>
                  <p className="mt-3 text-sm text-white/80 sm:text-base">
                    {notice.date.replaceAll("-", ".")}
                  </p>
                </Container>
              </div>
            );
          })}
        </div>

        {/* 점 인디케이터 (하단 오버레이) */}
        {count > 1 && (
          <div className="absolute inset-x-0 bottom-0 z-20">
            <Container className="pb-5">
              <div className="flex items-center gap-2">
                {items.map((notice, i) => (
                  <button
                    key={notice.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`${i + 1}번째 공지로 이동`}
                    aria-current={i === index}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      i === index
                        ? "w-6 bg-point-bright"
                        : "w-2 bg-white/45 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </Container>
          </div>
        )}
      </div>
    </section>
  );
}
