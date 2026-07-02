/**
 * 공개 시간표 데이터 (Supabase 읽기) — /schedule 탭 및 강사 상세 하단(client).
 * public.schedule_classes 행을 화면용 ScheduleEntry 로 변환. teacher_id는 강사 slug로.
 * 관리자 편집이 재배포 없이 즉시 반영되도록 런타임(클라이언트)에서 조회.
 */
import { supabase } from "@/lib/supabaseClient";
import type { ScheduleEntry, ScheduleTime } from "@/lib/data/schedule";
import type { Division, SubjectGroup } from "@/lib/data/teachers";

const COLS =
  "id, teacher_id, teacher_name, subject_group, division, course, target, times, sort_order";

type Row = {
  id: string;
  teacher_id: string | null;
  teacher_name: string;
  subject_group: string;
  division: string;
  course: string;
  target: string | null;
  times: ScheduleTime[] | null;
  sort_order: number;
};

function toEntry(r: Row, slug?: string): ScheduleEntry {
  return {
    teacherSlug: slug,
    teacherName: r.teacher_name,
    subjectGroup: r.subject_group as SubjectGroup,
    division: r.division as Division,
    course: r.course,
    target: r.target ?? undefined,
    times: Array.isArray(r.times) ? r.times : [],
  };
}

/** 전체 시간표 (강사 slug 매핑 포함) */
export async function fetchSchedule(): Promise<ScheduleEntry[]> {
  const { data } = await supabase
    .from("schedule_classes")
    .select(COLS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  const rows = (data as Row[]) ?? [];

  const ids = [...new Set(rows.map((r) => r.teacher_id).filter(Boolean))] as string[];
  const slugById = new Map<string, string>();
  if (ids.length) {
    const { data: t } = await supabase
      .from("teachers")
      .select("id, slug")
      .in("id", ids);
    for (const x of (t as { id: string; slug: string }[]) ?? [])
      slugById.set(x.id, x.slug);
  }

  return rows.map((r) =>
    toEntry(r, r.teacher_id ? slugById.get(r.teacher_id) : undefined),
  );
}

/** 특정 강사(slug)의 수업들 — 강사 상세 하단용 */
export async function fetchScheduleByTeacherSlug(
  slug: string,
): Promise<ScheduleEntry[]> {
  const { data: t } = await supabase
    .from("teachers")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!t) return [];
  const { data } = await supabase
    .from("schedule_classes")
    .select(COLS)
    .eq("teacher_id", (t as { id: string }).id)
    .order("sort_order", { ascending: true });
  return ((data as Row[]) ?? []).map((r) => toEntry(r, slug));
}
