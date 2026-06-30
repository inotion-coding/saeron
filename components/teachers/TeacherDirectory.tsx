"use client";

import { useMemo, useState, type ReactNode } from "react";
import TeacherCard from "./TeacherCard";
import Reveal from "@/components/ui/Reveal";
import {
  DIVISIONS,
  SUBJECT_GROUPS,
  getTeachers,
  type Division,
  type SubjectGroup,
} from "@/lib/data/teachers";

type SubjectFilter = SubjectGroup | "전체";

/** 상단바 내비 스타일 탭 (텍스트 + 골드 언더라인) */
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

/**
 * 강사 필터 디렉토리 (client) — DESIGN.md §6 (강사)
 * 1차 필터: 부(중등부/고등부) · 2차 필터: 과목(전체/국어/수학/영어/사회/과학).
 */
export default function TeacherDirectory() {
  const all = getTeachers();
  const [division, setDivision] = useState<Division>("middle");
  const [subject, setSubject] = useState<SubjectFilter>("전체");

  const filtered = useMemo(
    () =>
      all.filter(
        (t) =>
          t.divisions.includes(division) &&
          (subject === "전체" || t.subjectGroup === subject)
      ),
    [all, division, subject]
  );

  return (
    <div>
      {/* 1차: 부 (가운데 탭) */}
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

      {/* 2차: 과목 (가운데 탭) */}
      <div className="mt-4 flex flex-wrap justify-center gap-5 sm:gap-7">
        {(["전체", ...SUBJECT_GROUPS] as SubjectFilter[]).map((s) => (
          <FilterTab
            key={s}
            active={subject === s}
            onClick={() => setSubject(s)}
          >
            {s}
          </FilterTab>
        ))}
      </div>

      {/* 그리드 */}
      {filtered.length > 0 ? (
        <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((t, i) => (
            <Reveal as="li" key={t.id} delay={(i % 4) * 80}>
              <TeacherCard teacher={t} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="mt-12 text-center text-muted-foreground">
          해당 조건의 강사가 없습니다.
        </p>
      )}
    </div>
  );
}
