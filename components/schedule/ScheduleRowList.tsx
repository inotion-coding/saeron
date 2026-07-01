import type { ScheduleRow } from "@/lib/data/schedule";

/**
 * 시간표 행 목록 (프레젠테이션) — /schedule와 강사 상세 하단에서 공용.
 * 핵심(대상·반/과목·시간)만 또렷하게, 부가정보(내용·개강·비고)는 가볍게.
 * 구분선은 은은한 금색 헤어라인, 대상은 금색 라인 배지로 고급화.
 */
export default function ScheduleRowList({ rows }: { rows: ScheduleRow[] }) {
  return (
    <ul className="mt-2">
      {rows.map((r, i) => (
        <li
          key={i}
          className="border-t border-point/15 py-3.5 first:border-t-0"
        >
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="shrink-0 rounded-full border border-point/45 px-2 py-0.5 text-xs font-bold tracking-[0.02em] text-point">
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
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground/90 break-keep">
            {r.time}
          </p>
          {r.note && (
            <p className="mt-1 text-xs font-medium text-point">※ {r.note}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
