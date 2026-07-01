/**
 * 프로그램(수업) 데이터 (더미) — 홈 미리보기 및 /programs 에서 공용 사용.
 * TODO(content): 실제 과정 정보로 교체.
 */

export type Program = {
  id: string;
  name: string;
  target: string; // 대상 학년/구분
  summary: string;
  tags: string[];
  points?: string[]; // 특징/커리큘럼 상세 (프로그램 페이지 상세 블록용)
  featured?: boolean; // 홈 미리보기 노출
};

export const programs: Program[] = [
  {
    id: "middle-prep",
    name: "중등 내신 대비 선행 과정",
    target: "예비 중1",
    summary:
      "예비 중학생의 중등 내신을 대비하기 위한 개념 중심의 선행 학습을 진행합니다.",
    tags: ["개념 선행", "예비중 대비"],
    // TODO(content): 실제 커리큘럼·특징으로 교체
    points: [
      "핵심 개념 위주의 선행 학습으로 탄탄한 기초 확립",
      "중등 내신 출제 유형을 미리 익히는 사전 대비",
      "올바른 학습 습관과 자기주도 학습력 형성",
    ],
    featured: true,
  },
  {
    id: "middle-high-prep",
    name: "중등 내신 및 고교 선행 과정",
    target: "중1–중3",
    summary:
      "학교별 내신을 정밀 대비하고 고교 내신 대비를 위한 선행 학습을 진행합니다.",
    tags: ["내신 정밀", "고교 선행"],
    // TODO(content): 실제 커리큘럼·특징으로 교체
    points: [
      "학교별 시험 범위·출제 경향에 맞춘 정밀 내신 대비",
      "고교 과정으로 이어지는 체계적 선행 학습",
      "취약 단원 클리닉으로 실력 완성",
    ],
    featured: true,
  },
  {
    id: "high-subject",
    name: "고등 정규 과목 과정",
    target: "고1–고3",
    summary:
      "고교별 지필 및 수행평가를 체계적으로 관리하며 동시에 수능 대비를 위한 학습을 진행합니다.",
    tags: ["지필·수행 관리", "수능 대비"],
    // TODO(content): 실제 커리큘럼·특징으로 교체
    points: [
      "고교별 지필·수행평가 일정에 맞춘 내신 집중 관리",
      "내신과 수능을 병행하는 통합 학습 설계",
      "전문 강사진의 과목별 심화 지도",
    ],
    featured: true,
  },
];

/** 홈 미리보기용 추천 프로그램 (featured 우선, 최대 n개) */
export function getFeaturedPrograms(n = 3): Program[] {
  const featured = programs.filter((p) => p.featured);
  return (featured.length ? featured : programs).slice(0, n);
}
