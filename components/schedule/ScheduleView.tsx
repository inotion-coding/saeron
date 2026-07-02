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
import { getSchedule, formatScheduleDays } from "@/lib/data/schedule";

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

  // 강사별로 묶기 (같은 강사 반복 X — 강사 아래 여러 수업)
  const groups = useMemo(() => {
    const filtered = getSchedule(division, subject);
    const map = new Map<
      string,
      {
        teacherSlug?: string;
        teacherName: string;
        subjectGroup: SubjectGroup;
        courses: {
          course: string;
          target?: string;
          times: { days: string; time: string }[];
        }[];
      }
    >();
    for (const e of filtered) {
      const key = e.teacherSlug ?? `${e.subjectGroup}|${e.teacherName}`;
      let g = map.get(key);
      if (!g) {
        g = {
          teacherSlug: e.teacherSlug,
          teacherName: e.teacherName,
          subjectGroup: e.subjectGroup,
          courses: [],
        };
        map.set(key, g);
      }
      g.courses.push({ course: e.course, target: e.target, times: e.times });
    }
    return Array.from(map.values());
  }, [division, subject]);

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

      {/* 목록 — 박스 없이 세로. 강사별 묶음, 강사 사이 회색 구분선 */}
      {groups.length === 0 ? (
        <p className="mt-14 text-center text-muted-foreground">
          해당 조건의 시간표가 없습니다.
        </p>
      ) : (
        <div className="mx-auto mt-12 max-w-md">
          {groups.map((g, gi) => (
            <Reveal
              as="div"
              key={g.teacherSlug ?? `${g.subjectGroup}-${g.teacherName}`}
              delay={(gi % 6) * 60}
              className={gi > 0 ? "mt-10 border-t border-border pt-10" : ""}
            >
              {/* 강사: (과목) 이름 */}
              <div className="flex items-baseline gap-2">
                <span className="shrink-0 text-sm font-bold text-point">
                  {g.subjectGroup}
                </span>
                <span className="text-lg">
                  <TeacherName slug={g.teacherSlug} name={g.teacherName} />
                </span>
              </div>

              {/* 강사 아래 굵은 골드선 */}
              <div className="mt-3 border-t-[3px] border-point" aria-hidden="true" />

              {/* 수업들 */}
              <div className="mt-5 space-y-6">
                {g.courses.map((c, ci) => (
                  <div key={ci}>
                    {/* 수업 (+대상) */}
                    <div>
                      <span className="text-base font-semibold text-foreground">
                        {c.course}
                      </span>
                      {c.target && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          {c.target}
                        </span>
                      )}
                    </div>

                    {/* 수업 아래 얇은 골드선 */}
                    <div
                      className="mt-2 border-t border-point/50"
                      aria-hidden="true"
                    />

                    {/* 시간들: 요일(왼쪽) · 시간(오른쪽) */}
                    <div className="mt-1 divide-y divide-border">
                      {c.times.map((t, j) => (
                        <div
                          key={j}
                          className="flex items-baseline justify-between gap-6 py-2 text-sm"
                        >
                          <span className="font-semibold tracking-[0.02em] text-foreground">
                            {formatScheduleDays(t.days)}
                          </span>
                          <span className="tabular-nums tracking-[0.04em] text-muted-foreground">
                            {t.time}
                          </span>
                        </div>
                      ))}
                    </div>
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
