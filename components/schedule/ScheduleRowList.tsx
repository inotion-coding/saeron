import type { ScheduleRow } from "@/lib/data/schedule";

/** 시계 아이콘 */
function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-accent"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * 시간표 행 목록 (프레젠테이션) — /schedule와 강사 상세 하단에서 공용.
 * 대상 배지 + 반/과목 + 내용 + 개강 / 시간 / 비고를 한 행 카드로 정리(반응형).
 */
export default function ScheduleRowList({ rows }: { rows: ScheduleRow[] }) {
  return (
    <ul className="mt-1">
      {rows.map((r, i) => (
        <li
          key={i}
          className="border-t border-border/70 py-3 first:border-t-0"
        >
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="shrink-0 text-xs font-bold tracking-[0.02em] text-accent">
              {r.target}
            </span>
            {r.course && (
              <span className="font-semibold text-foreground">{r.course}</span>
            )}
            {r.content && (
              <span className="text-sm text-muted-foreground">{r.content}</span>
            )}
            {r.open && (
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                개강 {r.open}
              </span>
            )}
          </div>
          <p className="mt-1.5 flex items-start gap-1.5 text-sm leading-relaxed text-foreground/90">
            <ClockIcon />
            <span className="break-keep">{r.time}</span>
          </p>
          {r.note && (
            <p className="mt-1 text-xs font-medium text-accent">※ {r.note}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
