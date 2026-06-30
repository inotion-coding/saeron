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
import {
  schedules,
  COMMON_NOTICES,
  type TeacherSchedule,
  type ScheduleRow,
} from "@/lib/data/schedule";
import ScheduleRowList from "./ScheduleRowList";

type SubjectFilter = SubjectGroup | "전체";

/** 상단바 내비 스타일 탭 (텍스트 + 골드 언더라인) — 강사 페이지와 동일 */
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

/** 강사명 링크 — 사이트 주효과(hover 시 골드 언더라인 바 등장) */
function TeacherBarLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group relative inline-block text-h3 font-bold text-foreground transition-colors hover:text-point"
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-point transition-all duration-200 ease-[var(--ease-out-soft)] group-hover:w-full"
      />
    </Link>
  );
}

/** 강사 1명 시간표 블록 (선으로 구분, 박스 없음) */
function TeacherBlock({ t, rows }: { t: TeacherSchedule; rows: ScheduleRow[] }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {t.teacherId ? (
          <TeacherBarLink href={`/teachers/${t.teacherId}`}>
            {t.name}
          </TeacherBarLink>
        ) : (
          <span className="text-h3 font-bold text-foreground">{t.name}</span>
        )}
        <span className="text-sm font-semibold text-accent">
          {t.subjectGroup}
        </span>
        {t.note && (
          <span className="text-sm text-muted-foreground">· {t.note}</span>
        )}
      </div>
      <ScheduleRowList rows={rows} />
    </div>
  );
}

/**
 * 수업 시간표 (client) — DESIGN.md §6 (시간표)
 * 1차 부(중등/고등)·2차 과목(전체/5과목) 필터 → 과목별 강사 블록(선 구분, 박스 없음).
 * 강사명(프로필 보유 시) 클릭 → /teachers/[id]. 항목마다 Reveal 스태거(강사 페이지와 동일).
 */
export default function ScheduleView() {
  const [division, setDivision] = useState<Division>("high");
  const [subject, setSubject] = useState<SubjectFilter>("전체");

  const groups = useMemo(() => {
    const result: {
      subjectGroup: SubjectGroup;
      items: { t: TeacherSchedule; rows: ScheduleRow[] }[];
    }[] = [];
    for (const sg of SUBJECT_GROUPS) {
      if (subject !== "전체" && subject !== sg) continue;
      const items = schedules
        .filter((t) => t.subjectGroup === sg)
        .map((t) => ({ t, rows: t.rows.filter((r) => r.division === division) }))
        .filter((x) => x.rows.length > 0);
      if (items.length) result.push({ subjectGroup: sg, items });
    }
    return result;
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

      {/* 2차: 과목 */}
      <div className="mt-4 flex flex-wrap justify-center gap-5 sm:gap-7">
        {(["전체", ...SUBJECT_GROUPS] as SubjectFilter[]).map((s) => (
          <FilterTab key={s} active={subject === s} onClick={() => setSubject(s)}>
            {s}
          </FilterTab>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="mt-14 text-center text-muted-foreground">
          해당 조건의 시간표가 준비 중입니다.
        </p>
      ) : (
        <div className="mx-auto mt-12 max-w-3xl">
          {groups.map((g) => (
            <div key={g.subjectGroup} className="mt-14 first:mt-0">
              {subject === "전체" && (
                <Reveal className="mb-7 flex items-center gap-3">
                  <h2 className="text-h3 font-bold text-foreground">
                    {g.subjectGroup}
                  </h2>
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                </Reveal>
              )}
              <div>
                {g.items.map(({ t, rows }, i) => (
                  <Reveal
                    as="div"
                    key={t.name}
                    delay={(i % 4) * 70}
                    className="border-t border-border pt-7 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-7"
                  >
                    <TeacherBlock t={t} rows={rows} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 공통 안내 — 선으로 구분(박스 없음) */}
      <Reveal className="mx-auto mt-16 max-w-3xl border-t border-border pt-8">
        <p className="text-sm font-bold text-point">공통 안내</p>
        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
          {COMMON_NOTICES.map((n, i) => (
            <li key={i} className="flex gap-2">
              <span className="select-none text-point" aria-hidden="true">
                ·
              </span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
