/**
 * 공개 강사 데이터 (Supabase 읽기) — /teachers 목록·상세(client 실시간) + 빌드 시 상세 주소·사이트맵 생성.
 * DB(public.teachers)의 visible 강사만 화면용 Teacher 형태로 변환. 사진은 Storage 공개 URL.
 */
import { supabase } from "@/lib/supabaseClient";
import type { Teacher, Division, SubjectGroup } from "@/lib/data/teachers";

const BUCKET = "teacher-photos";

const COLS =
  "slug, name, photo_path, divisions, subject_group, subject, resolve, education, experience, achievements, books";

type Row = {
  slug: string;
  name: string;
  photo_path: string | null;
  divisions: Division[];
  subject_group: SubjectGroup;
  subject: string | null;
  resolve: string | null;
  education: string[] | null;
  experience: string[] | null;
  achievements: string[] | null;
  books: string[] | null;
};

/** Storage 경로 → 공개 URL (사진 없으면 undefined → 기본 실루엣) */
function photoUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function toTeacher(r: Row): Teacher {
  return {
    id: r.slug,
    name: r.name,
    photo: photoUrl(r.photo_path),
    divisions: r.divisions ?? [],
    subjectGroup: r.subject_group,
    subject: r.subject ?? "",
    resolve: r.resolve ?? "",
    education: r.education ?? undefined,
    experience: r.experience ?? undefined,
    achievements: r.achievements ?? undefined,
    books: r.books ?? undefined,
  };
}

/** 공개(visible) 강사 전체 — 정렬순 */
export async function fetchPublicTeachers(): Promise<Teacher[]> {
  const { data } = await supabase
    .from("teachers")
    .select(COLS)
    .eq("is_visible", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  return ((data as Row[]) ?? []).map(toTeacher);
}

/** slug로 강사 1명 (상세 페이지용) */
export async function fetchPublicTeacherBySlug(
  slug: string,
): Promise<Teacher | undefined> {
  const { data } = await supabase
    .from("teachers")
    .select(COLS)
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();
  return data ? toTeacher(data as Row) : undefined;
}
