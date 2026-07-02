"use client";

import { useState, type ReactNode } from "react";
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

      {/* 해당 부의 과정 카드 */}
      <div className="mx-auto mt-12 max-w-2xl space-y-5">
        {items.map((p, i) => (
          <Reveal
            as="div"
            key={p.id}
            delay={(i % 3) * 90}
            className="rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-card sm:p-8"
          >
            <span className="inline-flex rounded-full border border-point/45 px-2.5 py-0.5 text-xs font-bold tracking-[0.02em] text-point">
              {p.target}
            </span>
            <h2 className="mt-3 text-h3 font-bold text-foreground">{p.name}</h2>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {p.summary}
            </p>
            <ul className="mt-5 space-y-2">
              {p.points.map((pt, j) => (
                <li
                  key={j}
                  className="flex gap-2.5 text-sm leading-relaxed text-foreground/90"
                >
                  <span
                    className="mt-0.5 shrink-0 font-bold text-point"
                    aria-hidden="true"
                  >
                    ·
                  </span>
                  <span className="break-keep">{pt}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      {/* 하단 상담 CTA */}
      <Reveal className="mx-auto mt-14 max-w-2xl rounded-[var(--radius-lg)] border border-border bg-surface px-6 py-8 text-center">
        <p className="text-base font-semibold text-foreground">
          우리 아이에게 맞는 과정이 궁금하신가요?
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          현재 학년·성적에 맞춰 학습 방향을 상담해 드립니다.
        </p>
        <div className="mt-5 flex justify-center">
          <Button href="/contact" variant="primary" withArrow>
            상담 신청
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
