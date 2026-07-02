/**
 * 프로그램(과정) 데이터 — /programs(부별 탭) 및 홈 미리보기에서 공용 사용.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ✏️  과정 정보는 아래 `programs` 배열만 고치면 됩니다.             ║
 * ║      부(division)로 예비 중등부/중등부/고등부 탭에 자동 분류됩니다. ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *  - division: "prep"(예비 중등부) | "middle"(중등부) | "high"(고등부)
 *  - featured: true 면 홈 화면 미리보기 카드에 노출
 */

export type ProgramDivision = "prep" | "middle" | "high";

export type Program = {
  id: string;
  division: ProgramDivision;
  name: string; // 과정명
  target: string; // 대상 (예: 예비 중1)
  summary: string; // 한 줄 소개
  points: string[]; // 특징·포인트
  featured?: boolean; // 홈 미리보기 노출
};

/** 부(탭) 정의 — 순서대로 탭에 표시 */
export const PROGRAM_DIVISIONS: { id: ProgramDivision; label: string }[] = [
  { id: "prep", label: "예비 중등부" },
  { id: "middle", label: "중등부" },
  { id: "high", label: "고등부" },
];

// ════════════════════════════ ✏️ 여기부터 ════════════════════════════
export const programs: Program[] = [
  // ── 예비 중등부 ──────────────────────────────────────
  {
    id: "prep-naeshin-seonhaeng",
    division: "prep",
    name: "중등 내신 대비 선행 과정",
    target: "예비 중1",
    summary: "중학교 진학 전, 핵심 개념을 미리 다져 첫 내신부터 앞서갑니다.",
    points: [
      "초등 심화부터 중등 개념까지 연결하는 체계적 선행",
      "중등 내신 출제 유형을 미리 익히는 사전 대비",
      "올바른 학습 습관과 자기주도 학습력 형성",
    ],
    featured: true,
  },

  // ── 중등부 ──────────────────────────────────────────
  {
    id: "middle-naeshin",
    division: "middle",
    name: "중등 내신 대비 과정",
    target: "중1–중3",
    summary: "학교별 시험 범위와 출제 경향에 맞춰 내신 성적을 끌어올립니다.",
    points: [
      "학교별 기출·출제 경향 분석 맞춤 대비",
      "시험 전 집중 클리닉으로 취약 단원 보완",
      "수행평가·서술형까지 빈틈없는 관리",
    ],
    featured: true,
  },
  {
    id: "middle-highschool-seonhaeng",
    division: "middle",
    name: "고교 내신 대비 선행 과정",
    target: "중2–중3",
    summary: "고등 과정을 미리 학습해 고교 내신과 수능의 기초를 탄탄히 합니다.",
    points: [
      "고1 과정 핵심 개념 선행 학습",
      "중등–고등을 잇는 커리큘럼으로 부드러운 전환",
      "상위권 도약을 위한 심화 문제 훈련",
    ],
  },

  // ── 고등부 ──────────────────────────────────────────
  {
    id: "high-regular",
    division: "high",
    name: "고등 정규 과목 과정",
    target: "고1–고3",
    summary: "고교별 지필·수행평가를 체계적으로 관리하며 내신을 책임집니다.",
    points: [
      "고교별 지필·수행 일정에 맞춘 내신 집중 관리",
      "내신과 수능을 병행하는 통합 학습 설계",
      "전문 강사진의 과목별 심화 지도",
    ],
    featured: true,
  },
  {
    id: "high-suneung",
    division: "high",
    name: "수능 실전 대비 과정",
    target: "고3 · N수",
    summary: "실전 감각과 시간 관리까지, 수능 당일의 점수를 끌어올립니다.",
    points: [
      "최신 출제 경향 분석 기반 실전 문제 훈련",
      "실전 모의고사와 오답 클리닉 반복",
      "영역별 약점 진단과 1:1 피드백",
    ],
  },
];
// ════════════════════════════ ✋ 여기까지 ════════════════════════════

/** 부(division)별 과정 목록 */
export function getProgramsByDivision(division: ProgramDivision): Program[] {
  return programs.filter((p) => p.division === division);
}

/** 홈 미리보기용 추천 과정 (featured 우선, 최대 n개) */
export function getFeaturedPrograms(n = 3): Program[] {
  const featured = programs.filter((p) => p.featured);
  return (featured.length ? featured : programs).slice(0, n);
}
