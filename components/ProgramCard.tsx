import Link from "next/link";
import type { Program } from "@/lib/data/programs";

/**
 * 프로그램 카드 (DESIGN.md §4) — 각진 에디토리얼 박스.
 * hover 시 위로 뜨지 않고, 골드(point) 얇은 테두리가 들어온다.
 * 콘텐츠 최소화: 대상 라벨 · 과정명 · 한 줄 요약 · 진입 화살표.
 */
export default function ProgramCard({
  program,
  href = "/programs",
}: {
  program: Program;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-[var(--radius-sm)] border-2 border-border bg-background p-7 shadow-card transition-colors duration-200 ease-[var(--ease-out-soft)] hover:border-point"
    >
      <span className="text-xs font-bold uppercase tracking-[0.06em] text-accent">
        {program.target}
      </span>

      <h3 className="mt-3 text-h3 font-bold text-foreground">{program.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {program.summary}
      </p>

      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-foreground transition-colors group-hover:text-point">
        자세히 보기
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5"
        >
          <path
            d="M3 8h9M8.5 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
