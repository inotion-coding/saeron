import { type Division, type SubjectGroup } from "./teachers";

/**
 * 새론학원 2026 수업 시간표 — /schedule + 강사 상세(/teachers/[id]) 하단에서 사용.
 * 강사 중심 구조(원본 표 그대로). 강사명은 teacherId가 있으면 강사 상세로 링크.
 *
 * 대상 표기:
 *  - 일반고1 = 광교/유신/이의/창현고 1학년
 *  - 외고1·2·3 = 수원외고 학년
 *  - 2학기 대비반 = 2026학년도 2학기 대비(중등)
 * 시간 표기는 원본 표기를 보존(예: "토 7:00~10:00", "월~금 10:00~1:00 / 클리닉 2:00~4:00").
 */

export type ScheduleRow = {
  target: string; // 대상 (일반고1 / 외고1 / 외고2 / 외고3 / 2학기 대비반)
  division: Division; // 필터·표시용 (high=일반고·외고, middle=2학기 대비반)
  course?: string; // 반/과목/구분 (예: "공통수학2 (방학전)", "정규 2반 확률과통계")
  content?: string; // 내용 (예: "중세 국어+문학", "수능특강 독서")
  time: string; // 요일·시간 (원문 보존)
  open?: string; // 개강일 (예: "7/11")
  note?: string; // 비고 (공동 지도 등)
};

export type TeacherSchedule = {
  teacherId?: string; // lib/data/teachers.ts의 id (있으면 이름 링크)
  name: string; // 강사명 (프로필 없는 강사 포함)
  subjectGroup: SubjectGroup;
  note?: string; // 강사 단위 비고 (예: "외고 전담", "과외식 1:1")
  rows: ScheduleRow[];
};

/** 대상 정렬 우선순위 */
export const TARGET_ORDER = [
  "일반고1",
  "외고1",
  "외고2",
  "외고3",
  "2학기 대비반",
];

export const schedules: TeacherSchedule[] = [
  // ── 국어 ──────────────────────────────────────────────
  {
    name: "성영석",
    subjectGroup: "국어",
    rows: [
      { target: "일반고1", division: "high", course: "광교고", content: "중세 국어+문학", time: "토 7:00~10:00", open: "7/11" },
    ],
  },
  {
    name: "최용수",
    subjectGroup: "국어",
    rows: [
      { target: "일반고1", division: "high", course: "유신고", content: "중세 국어+문학", time: "토 4:00~7:00", open: "7/11" },
    ],
  },
  {
    teacherId: "chae-songa",
    name: "채송아",
    subjectGroup: "국어",
    note: "외고 전담",
    rows: [
      { target: "외고3", division: "high", course: "2반", content: "수능완성 5회 마무리", time: "일 10:00~1:00", open: "7/12" },
      { target: "외고2", division: "high", course: "1반", content: "수능특강 독서", time: "토 1:00~4:00", open: "7/11" },
      { target: "외고2", division: "high", course: "2반", content: "수능특강 독서", time: "일 1:00~4:00", open: "7/12" },
      { target: "외고1", division: "high", course: "1반", content: "중세 국어+문학", time: "일 4:00~7:00", open: "7/12" },
      { target: "외고1", division: "high", course: "2반", content: "중세 국어+문학", time: "토 4:00~7:00", open: "7/11" },
      { target: "외고1", division: "high", course: "3반", content: "중세 국어+문학", time: "금 7:30~10:00", open: "7/10" },
    ],
  },

  // ── 수학 ──────────────────────────────────────────────
  {
    teacherId: "seo-seungwon",
    name: "서승원",
    subjectGroup: "수학",
    note: "2학기 대비반",
    rows: [
      { target: "2학기 대비반", division: "middle", course: "공통수학1", time: "월·수·금 05:00~07:30" },
      { target: "2학기 대비반", division: "middle", course: "공통수학2", time: "월·수·금 08:00~10:00" },
      { target: "2학기 대비반", division: "middle", course: "중3-2", time: "화·목 05:00~07:00" },
      { target: "2학기 대비반", division: "middle", course: "공통수학1", time: "화·목 08:00~10:00 · 토 11:00~13:00" },
    ],
  },
  {
    teacherId: "oh-jiyoung",
    name: "오지영",
    subjectGroup: "수학",
    note: "2학기 대비반",
    rows: [
      { target: "2학기 대비반", division: "middle", course: "중3-2", time: "화·목·토 05:30~07:00" },
    ],
  },
  {
    name: "강덕현",
    subjectGroup: "수학",
    rows: [
      { target: "2학기 대비반", division: "middle", course: "공통수학1·2", time: "월·수·금", note: "서승원T 공동 지도" },
      { target: "외고2", division: "high", course: "방학후 정규반", time: "이병언T 표 참조", note: "이병언T·추선엽T 공동 지도" },
    ],
  },
  {
    teacherId: "lee-byeongeon",
    name: "이병언",
    subjectGroup: "수학",
    rows: [
      { target: "일반고1", division: "high", course: "공통수학2 (방학전)", time: "월·수·금 7:00~10:00", open: "7/6" },
      { target: "일반고1", division: "high", course: "공통수학2 (방학후)", time: "월·화·수·목·금 10:00~1:00 / 클리닉 2:00~4:00", open: "7/23", note: "10명 마감" },
      { target: "일반고1", division: "high", course: "공통수학2 (방학후)", time: "토·일 2:00~6:00", open: "7/18" },
      { target: "외고3", division: "high", course: "정규 2반 확률과통계", time: "일 1:00~4:00", open: "7/12" },
      { target: "외고2", division: "high", course: "1반 미적분1 (방학전)", time: "금 5:00~7:30 · 일 1:00~4:00", open: "7/10" },
      { target: "외고2", division: "high", course: "2반 미적분1 (방학전)", time: "토 7:00~10:00 · 일 1:30~4:30", open: "7/11" },
      { target: "외고2", division: "high", course: "정규 1·2반 미적분1 (방학후)", time: "정규1: 월~금 2:00~5:00 · 클리닉 10:00~1:00 / 정규2: 토·일 2:00~6:00 · 클리닉 10:00~1:00", open: "7/20", note: "추선엽T·강덕현T 공동" },
      { target: "외고1", division: "high", course: "1반 공통수학2 (방학전)", time: "금 5:00~7:30 · 일 1:00~4:00", open: "7/10" },
      { target: "외고1", division: "high", course: "2반 공통수학2 (방학전)", time: "토 7:00~10:00 · 일 1:30~4:30", open: "7/11" },
      { target: "외고1", division: "high", course: "1반 공통수학2 (방학후)", time: "월~금 10:00~1:00 / 클리닉 2:00~4:00", open: "7/20", note: "10명 마감" },
      { target: "외고1", division: "high", course: "2반 공통수학2 (방학후)", time: "토·일 2:00~6:00", open: "7/18" },
    ],
  },
  {
    name: "추선엽",
    subjectGroup: "수학",
    note: "외고2 방학후 정규반은 이병언T와 공동",
    rows: [
      { target: "일반고1", division: "high", course: "공통수학2", time: "토 4:00~8:00", open: "7/11" },
      { target: "외고2", division: "high", course: "3반 미적분1", time: "토 4:00~8:00", open: "7/11" },
      { target: "외고1", division: "high", course: "3반 공통수학2", time: "토 4:00~8:00", open: "7/11" },
    ],
  },
  {
    teacherId: "jo-heeju",
    name: "조희주",
    subjectGroup: "수학",
    note: "과외식 1:1 · 시간 선택 가능",
    rows: [
      { target: "일반고1", division: "high", course: "전담 공통수학2 (방학전)", time: "금 4:00~7:00 / 7:00~10:00 · 일 1:00~4:00 / 4:00~8:00", open: "7/10" },
      { target: "일반고1", division: "high", course: "기존+특강 (방학후)", time: "월·수 10:00~1:00", open: "7/27" },
      { target: "외고3", division: "high", course: "정규1반 미적분 / 수능대비 1:1", time: "일 9:00~1:00", open: "7/12" },
      { target: "외고2", division: "high", course: "전담 미적분1 (방학전)", time: "금 4:00~7:00 / 7:00~10:00 · 일 1:00~4:00 / 4:00~8:00 · 일 9:00~13:00", open: "7/10" },
      { target: "외고2", division: "high", course: "기존+특강 (방학후)", time: "월·수 1:00~4:00", open: "7/20" },
      { target: "외고1", division: "high", course: "전담 공통수학2 (방학전)", time: "금 4:00~7:00 / 7:00~10:00 · 일 1:00~4:00 / 4:00~8:00", open: "7/10" },
      { target: "외고1", division: "high", course: "기존+특강 (방학후)", time: "월·수 10:00~1:00", open: "7/20" },
    ],
  },

  // ── 영어 ──────────────────────────────────────────────
  {
    teacherId: "lee-gimun",
    name: "이기문",
    subjectGroup: "영어",
    rows: [
      { target: "일반고1", division: "high", course: "광교고", time: "목 7:00~10:00 · 토 1:00~4:00", open: "7/9" },
    ],
  },
  {
    name: "민관홍",
    subjectGroup: "영어",
    note: "현 외고 대표강사",
    rows: [
      { target: "외고3", division: "high", course: "정규 1반", time: "일 10:00~1:00", open: "7/12" },
      { target: "외고2", division: "high", course: "정규 1반", time: "일 4:30~7:30", open: "8/2" },
      { target: "외고1", division: "high", course: "1반", content: "심화/공통영어 완벽대비", time: "일 1:00~4:00", open: "8/2" },
    ],
  },

  // ── 사회 ──────────────────────────────────────────────
  {
    teacherId: "han-junho",
    name: "한준호",
    subjectGroup: "사회",
    note: "사탐 대표강사 · 수원외고 1·2·3학년 대표강사 · 내신·수능 1인자",
    rows: [
      { target: "일반고1", division: "high", course: "통합사회", time: "토 1:00~4:00", open: "7/11" },
      { target: "외고3", division: "high", course: "사회문화", time: "토 7:00~10:00", open: "7/11" },
      { target: "외고3", division: "high", course: "윤리와사상", time: "토 4:00~7:00", open: "7/11" },
      { target: "외고2", division: "high", course: "현대사회와 윤리", time: "토 4:00~7:00", open: "7/11" },
      { target: "외고2", division: "high", course: "경제", time: "토 7:00~10:00", open: "7/11" },
      { target: "외고1", division: "high", course: "통합사회", time: "토 1:00~4:00", open: "7/11" },
    ],
  },

  // ── 과학 ──────────────────────────────────────────────
  {
    teacherId: "kim-yunsik",
    name: "김윤식",
    subjectGroup: "과학",
    note: "내신과 수능 책임자",
    rows: [
      { target: "일반고1", division: "high", course: "통합과학 1반", time: "토 4:00~7:00", open: "7/11" },
      { target: "외고3", division: "high", course: "생명", time: "토 7:00~10:00", open: "7/11" },
      { target: "외고2", division: "high", course: "생명", time: "토 7:00~10:00", open: "7/11" },
      { target: "외고1", division: "high", course: "통합과학 1반", time: "토 4:00~7:00", open: "7/11" },
    ],
  },
  {
    name: "이천수",
    subjectGroup: "과학",
    note: "내신과 수능 1인자",
    rows: [
      { target: "일반고1", division: "high", course: "통합과학 2반", time: "토 4:00~7:00", open: "7/11" },
      { target: "외고3", division: "high", course: "화학", time: "토 7:00~10:00", open: "7/11" },
      { target: "외고2", division: "high", course: "화학", time: "토 7:00~10:00", open: "7/11" },
      { target: "외고1", division: "high", course: "통합과학 2반", time: "토 4:00~7:00", open: "7/11" },
    ],
  },
];

/** 공통 안내 */
export const COMMON_NOTICES = [
  "10to10 자기주도 학습 20명 선착순 모집 (철저한 관리, 준비된 학습)",
  "2강좌 이상 수강 시 자기주도 학습실 제공 (선착순 15자리)",
  "차량 제공 (금일, 학교 ↔ 학원)",
  "식사 준비 (대행)",
  "외고3: 부족한 과목은 내신 1등급 선배 지도가 필요한 학생에 한해 클리닉 시간 이용 가능",
];

/** 강사 id로 시간표 조회 (강사 상세 페이지용) */
export function getScheduleByTeacherId(id: string): TeacherSchedule | undefined {
  return schedules.find((s) => s.teacherId === id);
}
