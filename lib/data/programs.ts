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
  featured?: boolean; // 홈 미리보기 노출
};

export const programs: Program[] = [
  {
    id: "middle-comprehensive",
    name: "중등 내신·심화 과정",
    target: "중1–중3",
    summary:
      "학교별 내신을 정밀 대비하고 상위권 도약을 위한 심화 사고력까지 함께 다집니다.",
    tags: ["내신 대비", "개념 심화", "주간 테스트"],
    featured: true,
  },
  {
    id: "high-subject",
    name: "고등 정규 과목 과정",
    target: "고1–고3",
    summary:
      "국어·영어·수학 핵심 과목을 학년별 로드맵에 따라 체계적으로 관리합니다.",
    tags: ["수능 연계", "과목별 전임", "오답 클리닉"],
    featured: true,
  },
  {
    id: "exam-intensive",
    name: "수능·모의고사 집중반",
    target: "고3·N수",
    summary:
      "실전 모의고사와 약점 분석을 반복해 시험 운영 능력과 점수를 끌어올립니다.",
    tags: ["실전 모의", "약점 분석", "파이널"],
    featured: true,
  },
  {
    id: "personal-care",
    name: "1:1 맞춤 관리반",
    target: "전 학년",
    summary:
      "학습 공백이 큰 학생을 위해 개인별 진도와 과제를 설계하는 밀착 관리 과정입니다.",
    tags: ["개인 맞춤", "진도 설계", "밀착 케어"],
  },
];

/** 홈 미리보기용 추천 프로그램 (featured 우선, 최대 n개) */
export function getFeaturedPrograms(n = 3): Program[] {
  const featured = programs.filter((p) => p.featured);
  return (featured.length ? featured : programs).slice(0, n);
}
