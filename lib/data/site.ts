/**
 * 사이트 전역 정보 단일 출처 (CLAUDE.md 도메인 규칙)
 * 학원·사업자 정보는 여기에만 두고 컴포넌트가 참조한다.
 * TODO(content): 모든 값은 실제 정보 확보 시 교체.
 */

export type NavItem = { href: string; label: string };

export const site = {
  name: "새론학원",
  description:
    "입시·종합 새론학원 — 학생 한 명 한 명의 성장을 함께하는 교육 파트너입니다.",

  /** 상단바·푸터 공통 내비게이션 */
  nav: [
    { href: "/about", label: "학원 소개" },
    { href: "/programs", label: "프로그램" },
    { href: "/schedule", label: "수업 시간표" },
    { href: "/teachers", label: "강사 소개" },
    { href: "/contact", label: "상담·문의" },
  ] satisfies NavItem[],

  /** 대표 연락 정보 (TODO(content): 실제 값) */
  contact: {
    phone: "02-000-0000",
    email: "contact@saeron.example",
    address: "서울특별시 ○○구 ○○로 000, 0층",
    hours: "평일 14:00–22:00 / 토 10:00–18:00 (일·공휴일 휴무)",
  },

  /** 사업자 정보 — 하단바(Footer) 표기용 (TODO(content): 실제 값) */
  business: {
    companyName: "새론학원",
    owner: "홍길동",
    registrationNumber: "000-00-00000", // 사업자등록번호
    address: "서울특별시 ○○구 ○○로 000, 0층",
    phone: "02-000-0000",
    email: "contact@saeron.example",
  },
} as const;
