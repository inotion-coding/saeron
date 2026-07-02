"use client";

import { useState, type ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

/** 카테고리 탭 (텍스트 + 골드 언더라인) — 시간표·강사 페이지와 동일 패턴 */
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

/** 프로그램 카테고리 — 부(部)별로 눌러서 확인. 내용은 추후 채움. */
const CATEGORIES = [
  { id: "prep", label: "예비 중등부" },
  { id: "middle", label: "중등부" },
  { id: "high", label: "고등부" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

/**
 * 프로그램 — /programs.
 * 상단 카테고리 탭(예비 중등부·중등부·고등부)으로 부별 전환.
 * 탭 아래 상세 내용은 준비 중(추후 카테고리별로 채움).
 */
export default function ProgramList() {
  const [active, setActive] = useState<CategoryId>("prep");
  const activeLabel =
    CATEGORIES.find((c) => c.id === active)?.label ?? "";

  return (
    <div>
      {/* 카테고리 탭 */}
      <div className="flex flex-wrap justify-center gap-7 sm:gap-10">
        {CATEGORIES.map((c) => (
          <CategoryTab
            key={c.id}
            active={active === c.id}
            onClick={() => setActive(c.id)}
          >
            {c.label}
          </CategoryTab>
        ))}
      </div>

      {/* 내용 — 준비 중 (추후 카테고리별 상세로 교체) */}
      <div className="mx-auto mt-16 max-w-3xl">
        <Reveal key={active} className="text-center">
          <p className="text-muted-foreground">
            {activeLabel} 프로그램 내용은 준비 중입니다.
          </p>
        </Reveal>
      </div>
    </div>
  );
}
