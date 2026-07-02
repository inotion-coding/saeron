"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScheduleRowList from "./ScheduleRowList";
import { fetchScheduleByTeacherSlug } from "@/lib/content/schedule";
import type { TeacherSchedule } from "@/lib/data/schedule";

/**
 * 강사 상세 하단의 "2026 수업 시간표" 섹션(client) — 해당 강사(slug)의 시간표를 Supabase에서 조회.
 * 시간표가 없으면 아무것도 렌더하지 않는다.
 */
export default function TeacherScheduleSection({ slug }: { slug: string }) {
  const [sch, setSch] = useState<TeacherSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchScheduleByTeacherSlug(slug)
      .then((s) => {
        if (active) setSch(s ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading || !sch || sch.rows.length === 0) return null;

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="flex items-center gap-2.5 text-h3 font-bold text-foreground">
        <span className="h-5 w-1 rounded-full bg-point" aria-hidden="true" />
        2026 수업 시간표
      </h2>
      {sch.note && (
        <p className="mt-2 text-sm text-muted-foreground">{sch.note}</p>
      )}
      <ScheduleRowList rows={sch.rows} />
      <p className="mt-4 text-right">
        <Link
          href="/schedule"
          className="text-sm font-semibold text-muted-foreground underline-offset-2 transition-colors hover:text-point hover:underline"
        >
          전체 시간표 보기 →
        </Link>
      </p>
    </div>
  );
}
