/**
 * 강사 타입·필터 라벨 — /teachers 목록·상세, 시간표, 관리자 화면이 공유.
 * 강사 콘텐츠는 Supabase(public.teachers)에서 관리하며, 조회는 lib/content/teachers.ts 사용.
 */
export type Division = "middle" | "high";
export type SubjectGroup = "국어" | "수학" | "영어" | "사회" | "과학";

export type Teacher = {
  id: string;
  name: string;
  photo?: string; // 3:4 인물 사진 URL
  divisions: Division[]; // 소속 부 (복수 가능)
  subjectGroup: SubjectGroup; // 필터용 과목군
  subject: string; // 표시용 담당 과목 (예: "수능 국어")
  resolve: string; // 강사 각오 — 학생에게 전하는 다짐 한마디 (카드/상세 헤드라인)
  education?: string[]; // 학력
  experience?: string[]; // 출강 이력
  achievements?: string[]; // 합격/수상 실적
  books?: string[]; // 저서
};

/** 필터 라벨 */
export const DIVISIONS: { value: Division; label: string }[] = [
  { value: "middle", label: "중등부" },
  { value: "high", label: "고등부" },
];

export const SUBJECT_GROUPS: SubjectGroup[] = [
  "국어",
  "수학",
  "영어",
  "사회",
  "과학",
];
