"use client";

import { useEffect, useState, type ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import {
  PROGRAM_DIVISIONS,
  getProgramsByDivision,
  type ProgramDivision,
} from "@/lib/data/programs";

/** 카테고리 탭 (텍스트 + 골드 언더라인) — 강사·시간표 페이지와 동일 패턴 */
function CategoryTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative py-1.5 text-base font-bold transition-colors ${
        active ? "text-point" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-point transition-all duration-200 ease-[var(--ease-out-soft)] ${
          active ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </button>
  );
}

/**
 * 프로그램 — /programs.
 * 부(예비 중등부·중등부·고등부) 탭 → 해당 부의 과정 카드 목록 + 하단 상담 CTA.
 * 콘텐츠는 lib/data/programs.ts에서 주입.
 */
export default function ProgramList() {
  const [active, setActive] = useState<ProgramDivision>("prep");

  // 홈 등에서 ?tab=high 로 들어오면 해당 부 탭을 연다
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t === "prep" || t === "middle" || t === "high") setActive(t);
  }, []);

  const items = getProgramsByDivision(active);

  return (
    <div>
      {/* 부 탭 */}
      <div className="flex flex-wrap justify-center gap-7 sm:gap-10">
        {PROGRAM_DIVISIONS.map((d) => (
          <CategoryTab
            key={d.id}
            active={active === d.id}
            onClick={() => setActive(d.id)}
          >
            {d.label}
          </CategoryTab>
        ))}
      </div>

      {/* 해당 부의 과정 — 박스 없이 골드 헤어라인으로 구분 */}
      <div className="mx-auto mt-14 max-w-2xl">
        {items.map((p, i) => (
          <Reveal
            as="div"
            key={p.id}
            delay={(i % 3) * 90}
            className="border-t border-point/20 py-11 first:border-t-0 first:pt-0"
          >
            {/* 대상 (골드 eyebrow) */}
            <p className="text-sm font-bold uppercase tracking-[0.06em] text-point">
              {p.target}
            </p>
            {/* 과정명 (크고 굵게) */}
            <h2 className="mt-2 text-h2 font-extrabold tracking-[-0.01em] text-foreground">
              {p.name}
            </h2>
            {/* 소개 */}
            <p className="mt-3 text-lead leading-relaxed text-muted-foreground">
              {p.summary}
            </p>
            {/* 특징 */}
            <ul className="mt-6 space-y-3">
              {p.points.map((pt, j) => (
                <li
                  key={j}
                  className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-foreground/90"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-point"
                    aria-hidden="true"
                  />
                  <span className="break-keep">{pt}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      {/* 하단 상담 CTA — 박스 없이 골드 라인 구분 */}
      <Reveal className="mx-auto mt-4 max-w-2xl border-t border-point/30 pt-11 text-center">
        <p className="text-h3 font-bold text-foreground">
          우리 아이에게 맞는 과정이 궁금하신가요?
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          현재 학년·성적에 맞춰 학습 방향을 상담해 드립니다.
        </p>
        <div className="mt-6 flex justify-center">
          <Button href="/contact" variant="primary" withArrow>
            상담 신청
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
