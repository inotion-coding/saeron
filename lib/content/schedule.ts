/**
 * 공개 시간표 데이터 (Supabase 읽기) — /schedule + 강사 상세에서 사용(client).
 * schedule_teachers(강사묶음) + schedule_rows(수업행) + common_notices를
 * 화면용 TeacherSchedule 형태로 변환. teacher_id는 강사 slug로 바꿔 링크에 사용.
 */
import { supabase } from "@/lib/supabaseClient";
import type { TeacherSchedule, ScheduleRow } from "@/lib/data/schedule";
import type { Division, SubjectGroup } from "@/lib/data/teachers";

type GroupRow = {
  id: string;
  teacher_id: string | null;
  display_name: string;
  subject_group: string;
  note: string | null;
  sort_order: number;
};
type Row = {
  schedule_teacher_id: string;
  target: string;
  division: string;
  course: string | null;
  content: string | null;
  time_text: string;
  open_date: string | null;
  note: string | null;
  sort_order: number;
};

function toRow(r: {
  target: string;
  division: string;
  course: string | null;
  content: string | null;
  time_text: string;
  open_date: string | null;
  note: string | null;
}): ScheduleRow {
  return {
    target: r.target,
    division: r.division as Division,
    course: r.course ?? undefined,
    content: r.content ?? undefined,
    time: r.time_text,
    open: r.open_date ?? undefined,
    note: r.note ?? undefined,
  };
}

/** 전체 시간표 (강사묶음 + 행) */
export async function fetchSchedules(): Promise<TeacherSchedule[]> {
  const [g, r, t] = await Promise.all([
    supabase
      .from("schedule_teachers")
      .select("id, teacher_id, display_name, subject_group, note, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("schedule_rows")
      .select(
        "schedule_teacher_id, target, division, course, content, time_text, open_date, note, sort_order",
      )
      .order("sort_order", { ascending: true }),
    supabase.from("teachers").select("id, slug"),
  ]);

  const slugById = new Map(
    ((t.data as { id: string; slug: string }[]) ?? []).map((x) => [x.id, x.slug]),
  );
  const rowsByGroup = new Map<string, ScheduleRow[]>();
  for (const row of (r.data as Row[]) ?? []) {
    const arr = rowsByGroup.get(row.schedule_teacher_id) ?? [];
    arr.push(toRow(row));
    rowsByGroup.set(row.schedule_teacher_id, arr);
  }

  return ((g.data as GroupRow[]) ?? []).map((grp) => ({
    teacherId: grp.teacher_id ? slugById.get(grp.teacher_id) : undefined,
    name: grp.display_name,
    subjectGroup: grp.subject_group as SubjectGroup,
    note: grp.note ?? undefined,
    rows: rowsByGroup.get(grp.id) ?? [],
  }));
}

/** 공통 안내 문구 */
export async function fetchCommonNotices(): Promise<string[]> {
  const { data } = await supabase
    .from("common_notices")
    .select("text")
    .order("sort_order", { ascending: true });
  return ((data as { text: string }[]) ?? []).map((x) => x.text);
}

/** 강사(slug)의 시간표 1묶음 — 강사 상세 페이지용 */
export async function fetchScheduleByTeacherSlug(
  slug: string,
): Promise<TeacherSchedule | undefined> {
  const { data: t } = await supabase
    .from("teachers")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (!t) return undefined;
  const { data: g } = await supabase
    .from("schedule_teachers")
    .select("id, display_name, subject_group, note")
    .eq("teacher_id", (t as { id: string }).id)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!g) return undefined;
  const grp = g as {
    id: string;
    display_name: string;
    subject_group: string;
    note: string | null;
  };
  const { data: r } = await supabase
    .from("schedule_rows")
    .select("target, division, course, content, time_text, open_date, note")
    .eq("schedule_teacher_id", grp.id)
    .order("sort_order", { ascending: true });
  const rows = (
    (r as {
      target: string;
      division: string;
      course: string | null;
      content: string | null;
      time_text: string;
      open_date: string | null;
      note: string | null;
    }[]) ?? []
  ).map(toRow);
  return {
    teacherId: slug,
    name: grp.display_name,
    subjectGroup: grp.subject_group as SubjectGroup,
    note: grp.note ?? undefined,
    rows,
  };
}
