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

/**
 * 수업 시간표 (탭) — 1차 부(고등/중등) + 2차 과목(전체/5과목) 필터.
 * 한 수업을 세로 행으로: (과목)강사 → [굵은 골드선] → 수업(+대상) → [얇은 골드선] → 시간들.
 * 시간이 여러 개면 회색 얇은선으로 구분. 박스 없이 선만으로 정돈.
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

      {/* 목록 — 박스 없이 세로 행 + 골드선 */}
      {rows.length === 0 ? (
        <p className="mt-14 text-center text-muted-foreground">
          해당 조건의 시간표가 없습니다.
        </p>
      ) : (
        <div className="mx-auto mt-12 max-w-md space-y-12">
          {rows.map((e, i) => (
            <Reveal
              as="div"
              key={`${e.teacherSlug ?? e.teacherName}-${e.course}-${i}`}
              delay={(i % 6) * 60}
            >
              {/* 행 1: (과목) 강사 */}
              <div className="flex items-baseline gap-2">
                <span className="shrink-0 text-sm font-bold text-point">
                  {e.subjectGroup}
                </span>
                <span className="text-lg">
                  <TeacherName slug={e.teacherSlug} name={e.teacherName} />
                </span>
              </div>

              {/* 1↔2 굵은 골드선 */}
              <div className="mt-3 border-t-[3px] border-point" aria-hidden="true" />

              {/* 행 2: 수업 (+대상) */}
              <div className="pt-3">
                <span className="text-base font-semibold text-foreground">
                  {e.course}
                </span>
                {e.target && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {e.target}
                  </span>
                )}
              </div>

              {/* 2↔3 얇은 골드선 */}
              <div className="mt-3 border-t border-point/50" aria-hidden="true" />

              {/* 행 3: 시간들 (여러 개면 회색 얇은선) */}
              <div className="mt-1 divide-y divide-border">
                {e.times.map((t, j) => (
                  <div key={j} className="py-2 text-sm leading-relaxed">
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
      )}
    </div>
  );
}
