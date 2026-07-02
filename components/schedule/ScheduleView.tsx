"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import {
  DIVISIONS,
  SUBJECT_GROUPS,
  type Division,
  type SubjectGroup,
} from "@/lib/data/teachers";
import { getSchedule } from "@/lib/data/schedule";

type SubjectFilter = SubjectGroup | "전체";

/** 필터 탭 (텍스트 + 골드 언더라인) — 강사 페이지와 동일 */
function FilterTab({
  active,
  onClick,
  size = "sm",
  children,
}: {
  active: boolean;
  onClick: () => void;
  size?: "sm" | "lg";
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group relative transition-colors ${
        size === "lg" ? "py-1.5 text-base font-bold" : "py-1 text-sm font-semibold"
      } ${active ? "text-point" : "text-muted-foreground hover:text-foreground"}`}
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

/** 1열 강사명 — teacherSlug 있으면 강사 페이지 링크(골드 언더라인) */
function TeacherName({
  slug,
  name,
}: {
  slug?: string;
  name: string;
}) {
  if (!slug) return <span className="font-bold text-foreground">{name}</span>;
  return (
    <Link
      href={`/teachers/${slug}`}
      className="group relative font-bold text-foreground transition-colors hover:text-point"
    >
      {name}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-point transition-all duration-200 ease-[var(--ease-out-soft)] group-hover:w-full"
      />
    </Link>
  );
}

// 3열 그리드 규격(가로 스크롤 위해 최소폭 지정)
const GRID = "grid grid-cols-[minmax(8rem,1fr)_minmax(9rem,1.1fr)_minmax(11rem,1.4fr)]";

/**
 * 수업 시간표 (탭) — 1차 부(고등/중등) + 2차 과목(전체/5과목) 필터.
 * 3열: [ (과목) 강사 | 수업(+대상) | 요일·시간 ]. 열 구분 골드선(1↔2 굵게·2↔3 얇게),
 * 3열 내 여러 시간·행 사이는 회색 얇은선. 모바일은 가로 스크롤.
 */
export default function ScheduleView() {
  const [division, setDivision] = useState<Division>("high");
  const [subject, setSubject] = useState<SubjectFilter>("전체");

  const rows = useMemo(
    () => getSchedule(division, subject),
    [division, subject],
  );

  return (
    <div>
      {/* 1차: 부 */}
      <div className="flex justify-center gap-7 sm:gap-10">
        {DIVISIONS.map((d) => (
          <FilterTab
            key={d.value}
            active={division === d.value}
            onClick={() => setDivision(d.value)}
            size="lg"
          >
            {d.label}
          </FilterTab>
        ))}
      </div>

      {/* 2차: 과목 (전체 + 5) */}
      <div className="mt-4 flex flex-wrap justify-center gap-5 sm:gap-7">
        {(["전체", ...SUBJECT_GROUPS] as SubjectFilter[]).map((s) => (
          <FilterTab key={s} active={subject === s} onClick={() => setSubject(s)}>
            {s}
          </FilterTab>
        ))}
      </div>

      {/* 표 */}
      {rows.length === 0 ? (
        <p className="mt-14 text-center text-muted-foreground">
          해당 조건의 시간표가 없습니다.
        </p>
      ) : (
        <div className="mx-auto mt-12 max-w-3xl overflow-x-auto">
          <div className="min-w-[36rem] overflow-hidden rounded-[var(--radius-md)] border border-border">
            {/* 헤더 */}
            <div
              className={`${GRID} bg-surface text-xs font-bold tracking-[0.02em] text-muted-foreground`}
            >
              <div className="px-3 py-2.5">강사</div>
              <div className="border-l-[3px] border-point px-4 py-2.5">수업</div>
              <div className="border-l border-point/50 px-4 py-2.5">시간</div>
            </div>

            {/* 데이터 행 */}
            {rows.map((e, i) => (
              <Reveal
                as="div"
                key={`${e.teacherSlug ?? e.teacherName}-${e.course}-${i}`}
                delay={(i % 6) * 50}
                className={`${GRID} border-t border-border`}
              >
                {/* 1열: (과목) 강사 */}
                <div className="flex items-center gap-1.5 px-3 py-3.5">
                  <span className="shrink-0 text-xs font-bold text-point">
                    {e.subjectGroup}
                  </span>
                  <TeacherName slug={e.teacherSlug} name={e.teacherName} />
                </div>

                {/* 2열: 수업 (+대상) — 1↔2 굵은 골드선 */}
                <div className="flex flex-col justify-center border-l-[3px] border-point px-4 py-3.5">
                  <span className="font-semibold text-foreground">
                    {e.course}
                  </span>
                  {e.target && (
                    <span className="mt-0.5 text-xs text-muted-foreground">
                      {e.target}
                    </span>
                  )}
                </div>

                {/* 3열: 시간(여러 개면 회색 얇은선) — 2↔3 얇은 골드선 */}
                <div className="border-l border-point/50">
                  {e.times.map((t, j) => (
                    <div
                      key={j}
                      className={`px-4 py-2.5 text-sm leading-relaxed ${
                        j > 0 ? "border-t border-border" : ""
                      }`}
                    >
                      <span className="font-semibold text-foreground">
                        {t.days}
                      </span>{" "}
                      <span className="text-muted-foreground">{t.time}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
