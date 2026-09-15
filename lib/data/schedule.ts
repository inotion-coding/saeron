/**
 * 시간표 타입·요일 포맷 — /schedule 탭, 강사 상세 하단이 공유.
 * 시간표 콘텐츠는 Supabase(public.schedule_classes)에서 관리하며, 조회는 lib/content/schedule.ts 사용.
 */
import type { Division, SubjectGroup } from "./teachers";

export type ScheduleTime = {
  days: string; // 요일 (가운뎃점): 예 "월·수·금", "화·목", "토"
  time: string; // 시간: 예 "19:00~22:00"
};

export type ScheduleEntry = {
  teacherSlug?: string; // 강사 slug — 있으면 이름이 강사 페이지 링크
  teacherName: string; // 강사 이름
  subjectGroup: SubjectGroup; // 과목 (라벨 + 2차 필터)
  division: Division; // 부 (1차 필터: middle=중등, high=고등)
  course: string; // 수업 이름 (예: 미적분, 화작, 생명과학)
  target?: string; // 대상/반 — 없으면 생략
  times: ScheduleTime[]; // 시간(여러 개면 줄 나눔)
};

/** 요일 표시: 하루면 전체 이름("토"→"토요일"), 여러 요일이면 그대로("월·수·금") */
const DAY_FULL: Record<string, string> = {
  월: "월요일",
  화: "화요일",
  수: "수요일",
  목: "목요일",
  금: "금요일",
  토: "토요일",
  일: "일요일",
};
export function formatScheduleDays(days: string): string {
  const d = days.trim();
  return DAY_FULL[d] ?? days;
}
