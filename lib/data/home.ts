/**
 * 메인(홈) 페이지 콘텐츠 (더미) — UI에 하드코딩 금지, 여기서 주입.
 * TODO(content): 실제 카피·수치로 교체. 수치는 검증된 값만 노출할 것.
 */

export const hero = {
  eyebrow: "입시·종합 새론학원",
  title: "날마다 새로운 생각과 도전으로 신세계를 창조하라",
  description: "수원외고 · 유신고 · 이의고 · 창현고 · 광교고 전담 학원",
  primary: { label: "상담 신청하기", href: "/contact" },
  secondary: { label: "프로그램 살펴보기", href: "/programs" },
};

export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: "20년+", label: "축적된 입시 노하우" },
  { value: "1:8", label: "소수정예 관리 비율" },
  { value: "350+", label: "누적 합격 사례" },
  { value: "92%", label: "재원생 성적 향상" },
];

export type Strength = {
  id: string;
  title: string;
  desc: string;
  icon: "data" | "teacher" | "studyroom";
  href: string; // 바로가기 링크 (TODO(content): 실제 페이지 연결)
};

export const strengths: Strength[] = [
  {
    id: "data",
    title: "데이터 기반 학습 설계",
    desc: "축적된 데이터로 맞춤 커리큘럼 구성",
    icon: "data",
    href: "/programs",
  },
  {
    id: "teachers",
    title: "검증된 전문 강사진",
    desc: "과목별 경력직 전문 강사의 책임 지도",
    icon: "teacher",
    href: "/teachers",
  },
  {
    id: "studyroom",
    title: "쾌적한 자습실",
    desc: "강좌 2개 이상 수강 시 자습실 자리 제공",
    icon: "studyroom",
    href: "/contact",
  },
];

export const cta = {
  eyebrow: "지금 시작하세요",
  title: "우리 아이에게 맞는\n학습 전략, 상담으로 시작됩니다",
  description:
    "학년·목표·현재 성적을 바탕으로 맞춤 학습 방향을 제안해 드립니다. 부담 없이 문의하세요.",
  primary: { label: "무료 상담 신청", href: "/contact" },
  secondary: { label: "수업 시간표 보기", href: "/schedule" },
};
