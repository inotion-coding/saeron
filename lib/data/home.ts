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
  icon: "compass" | "users" | "badge" | "report";
};

export const strengths: Strength[] = [
  {
    id: "curriculum",
    title: "데이터 기반 학습 설계",
    desc: "학생별 취약점에 맞춘 커리큘럼.",
    icon: "compass",
  },
  {
    id: "care",
    title: "1:1 밀착 학습 관리",
    desc: "담임 멘토의 일상 학습 점검.",
    icon: "users",
  },
  {
    id: "teachers",
    title: "검증된 전임 강사진",
    desc: "과목별 전임의 책임 지도.",
    icon: "badge",
  },
  {
    id: "report",
    title: "정기 학부모 리포트",
    desc: "성적·태도의 투명한 공유.",
    icon: "report",
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
