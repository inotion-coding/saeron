"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import TeacherPhoto from "@/components/TeacherPhoto";
import { fetchPublicTeacherBySlug } from "@/lib/content/teachers";
import type { Teacher } from "@/lib/data/teachers";
import {
  getScheduleByTeacherSlug,
  formatScheduleDays,
} from "@/lib/data/schedule";

/**
 * 강사 상세(client) — slug로 Supabase에서 실시간 조회.
 * 관리자 수정이 재배포 없이 즉시 반영되도록 빌드타임이 아닌 런타임에 읽는다.
 * (개별 주소는 유지: 빌드 시 shell 생성, 내용은 클라에서 최신 조회)
 */
export default function TeacherDetailClient({ slug }: { slug: string }) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  useEffect(() => {
    let active = true;
    fetchPublicTeacherBySlug(slug)
      .then((t) => {
        if (!active) return;
        if (t) {
          setTeacher(t);
          setStatus("ready");
        } else {
          setStatus("missing");
        }
      })
      .catch(() => {
        if (active) setStatus("missing");
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const backLink = (
    <Link
      href="/teachers"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M10 12L6 8l4-4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      강사 목록
    </Link>
  );

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-3xl">
        {backLink}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          불러오는 중…
        </p>
      </div>
    );
  }

  if (status === "missing" || !teacher) {
    return (
      <div className="mx-auto max-w-3xl">
        {backLink}
        <p className="mt-12 text-center text-sm text-muted-foreground">
          강사 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const sections = [
    { label: "학력", items: teacher.education },
    { label: "출강 이력", items: teacher.experience },
    { label: "합격 · 수상 실적", items: teacher.achievements },
    { label: "저서", items: teacher.books },
  ].filter((s) => s.items && s.items.length > 0);

  const classes = getScheduleByTeacherSlug(teacher.id); // 수업 시간표(코드 데이터)

  return (
    <div className="mx-auto max-w-3xl">
      {backLink}

      <Reveal className="mt-8">
        {/* 헤더: 사진 + 정체성 */}
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-9 sm:text-left">
          <div className="w-40 shrink-0 sm:w-44">
            <TeacherPhoto
              teacher={teacher}
              sizes="(max-width: 640px) 160px, 176px"
              className="rounded-[var(--radius-sm)] border border-border"
            />
          </div>
          <div>
            <span className="inline-flex rounded-[var(--radius-sm)] border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {teacher.subject}
            </span>
            <h1 className="mt-3 text-h1 font-bold text-foreground">
              {teacher.name}
            </h1>
            <p className="mt-2 whitespace-pre-line text-lead text-muted-foreground">
              {teacher.resolve}
            </p>
          </div>
        </div>

        {/* 이력 섹션 (+ 수업 시간표) */}
        {(sections.length > 0 || classes.length > 0) && (
          <dl className="mt-10 border-t border-border">
            {sections.map((s) => (
              <div
                key={s.label}
                className="grid gap-1.5 border-b border-border py-5 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:py-6"
              >
                <dt className="text-sm font-bold tracking-[0.02em] text-point">
                  {s.label}
                </dt>
                <dd>
                  <ul className="space-y-1 text-base leading-relaxed text-foreground/90">
                    {s.items!.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}

            {/* 수업 시간표 — 이력과 동일 규격. 수업명 아래 시간, 얇은 선으로 구분 */}
            {classes.length > 0 && (
              <div className="grid gap-1.5 border-b border-border py-5 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:py-6">
                <dt className="text-sm font-bold tracking-[0.02em] text-point">
                  수업 시간표
                </dt>
                <dd>
                  <div className="divide-y divide-border">
                    {classes.map((c, i) => (
                      <div key={i} className="py-2.5 first:pt-0 last:pb-0">
                        <p className="text-base font-bold text-foreground">
                          {c.course}
                          {c.target && (
                            <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                              {c.target}
                            </span>
                          )}
                        </p>
                        <ul className="mt-1 space-y-0.5 text-sm leading-relaxed">
                          {c.times.map((t, j) => (
                            <li key={j}>
                              <span className="font-semibold text-foreground/90">
                                {formatScheduleDays(t.days)}
                              </span>{" "}
                              <span className="text-muted-foreground">
                                {t.time}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            )}
          </dl>
        )}
      </Reveal>

      <div className="mt-10">
        <Button href="/teachers" variant="secondary" withArrow>
          강사 목록으로
        </Button>
      </div>
    </div>
  );
}
