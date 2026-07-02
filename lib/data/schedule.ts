/**
 * 수업 시간표 데이터 (코드 관리) — /schedule 탭 및 강사 상세 하단에서 사용.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ✏️  시간표는 아래 `scheduleEntries` 배열만 고치면 됩니다.        ║
 * ║      한 항목 = 강사 1명의 수업 1개. 같은 강사·같은 수업이       ║
 * ║      요일만 다르면 times 에 줄만 추가하세요.                     ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ── 표시 규칙 ─────────────────────────────────────────────────────
 *  · 1열 강사   = "(과목) (이름)"  (teacherSlug 있으면 이름이 강사 페이지 링크)
 *  · 2열 수업   = course (+ target: 대상/반)
 *  · 3열 시간   = times[] (요일 가운뎃점 · 시간 12시간제). 여러 개면 줄 나눔.
 *  · 필터       = division(고등/중등) + subjectGroup(5과목)
 */
import type { Division, SubjectGroup } from "./teachers";

export type ScheduleTime = {
  days: string; // 요일 (가운뎃점): 예 "월·수·금", "화·목", "토"
  time: string; // 시간 (12시간제): 예 "7:00~10:00"
};

export type ScheduleEntry = {
  teacherSlug?: string; // lib/data/teachers 의 id(slug) — 있으면 이름이 링크
  teacherName: string; // 강사 이름
  subjectGroup: SubjectGroup; // 과목 (1열 라벨 + 2차 필터)
  division: Division; // 부 (1차 필터: middle=중등, high=고등)
  course: string; // 수업 이름 (예: 미적분, 화작, 생명과학)
  target?: string; // 대상/반 (2열, 수업 옆) — 없으면 생략
  times: ScheduleTime[]; // 3열 시간(여러 개면 회색 얇은 선으로 구분)
};

// ════════════════════════════ ✏️ 여기부터 (예시 — 실제 시간표로 교체) ════════════════════════════
export const scheduleEntries: ScheduleEntry[] = [
  {
    teacherSlug: "chae-songa",
    teacherName: "채송아",
    subjectGroup: "국어",
    division: "high",
    course: "화작",
    target: "외고 2학년",
    times: [
      { days: "월·수·금", time: "07:00~10:00" },
      { days: "토", time: "01:00~04:00" },
    ],
  },
  {
    teacherSlug: "chae-songa",
    teacherName: "채송아",
    subjectGroup: "국어",
    division: "high",
    course: "독서",
    target: "외고 1학년",
    times: [{ days: "화·목", time: "05:00~08:00" }],
  },
  {
    teacherSlug: "lee-byeongeon",
    teacherName: "이병언",
    subjectGroup: "수학",
    division: "high",
    course: "미적분",
    target: "일반고 1학년",
    times: [
      { days: "월·수·금", time: "07:00~10:00" },
      { days: "토", time: "02:00~06:00" },
    ],
  },
  {
    teacherSlug: "lee-byeongeon",
    teacherName: "이병언",
    subjectGroup: "수학",
    division: "high",
    course: "확률과통계",
    target: "외고 3학년",
    times: [{ days: "일", time: "01:00~04:00" }],
  },
  {
    teacherSlug: "ho-jaeyu",
    teacherName: "호재유",
    subjectGroup: "영어",
    division: "high",
    course: "영어 독해",
    target: "일반고 1학년",
    times: [{ days: "화·목", time: "07:00~10:00" }],
  },
  {
    teacherSlug: "han-junho",
    teacherName: "한준호",
    subjectGroup: "사회",
    division: "high",
    course: "사회문화",
    target: "외고 3학년",
    times: [{ days: "토", time: "04:00~07:00" }],
  },
  {
    teacherSlug: "kim-yunsik",
    teacherName: "김윤식",
    subjectGroup: "과학",
    division: "high",
    course: "생명과학",
    target: "외고 2학년",
    times: [{ days: "토", time: "07:00~10:00" }],
  },
  {
    teacherSlug: "seo-seungwon",
    teacherName: "서승원",
    subjectGroup: "수학",
    division: "middle",
    course: "공통수학1",
    target: "중등 3학년",
    times: [{ days: "월·수·금", time: "05:00~07:30" }],
  },
];
// ════════════════════════════ ✋ 여기까지 ════════════════════════════

/** 필터(부·과목)에 맞는 시간표 */
export function getSchedule(
  division: Division,
  subject: SubjectGroup | "전체",
): ScheduleEntry[] {
  return scheduleEntries.filter(
    (e) =>
      e.division === division &&
      (subject === "전체" || e.subjectGroup === subject),
  );
}

/** 특정 강사(slug)의 수업들 — 강사 상세 하단용 */
export function getScheduleByTeacherSlug(slug: string): ScheduleEntry[] {
  return scheduleEntries.filter((e) => e.teacherSlug === slug);
}
