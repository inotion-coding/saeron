import Link from "next/link";
import type { Program } from "@/lib/data/programs";
import Badge from "@/components/ui/Badge";

/**
 * 프로그램 카드 (DESIGN.md §4) — 홈 미리보기 및 /programs 공용.
 * hover 시 리프트 + 보더 강조 + 화살표 이동.
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
      className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-card transition-[transform,box-shadow,border-color] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-foreground/15 hover:shadow-hover sm:p-7"
    >
      <Badge variant="accent">{program.target}</Badge>

      <h3 className="mt-4 text-h3 font-bold text-foreground">{program.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {program.summary}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {program.tags.map((tag) => (
          <li key={tag}>
            <Badge>{tag}</Badge>
          </li>
        ))}
      </ul>

      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
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
