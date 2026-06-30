/**
 * 사이트 전역 정보 단일 출처 (CLAUDE.md 도메인 규칙)
 * 학원·사업자 정보는 여기에만 두고 컴포넌트가 참조한다.
 * TODO(content): 모든 값은 실제 정보 확보 시 교체.
 */

export type NavItem = { href: string; label: string };

export type SocialLink = {
  label: string;
  href: string;
  icon: "blog" | "instagram";
};

/**
 * 로고 이미지 설정.
 * - src=null 이면 텍스트 마크(폴백)로 표시된다.
 * - 로고를 넣으려면: 이미지 파일을 `public/` 에 두고(예: public/logo.svg)
 *   src 를 "/logo.svg" 로 지정한 뒤 width/height 를 실제 비율에 맞게 조정.
 *   (Header/Footer 의 <Logo /> 가 자동으로 이미지로 전환된다.)
 */
export type LogoConfig = { src: string | null; width: number; height: number };

/** 헤더용 가로형 로고 (public/1.png 여백 제거본) */
export const logo: LogoConfig = {
  src: "/logo.png",
  width: 750,
  height: 181,
};

/** 푸터용 세로형(스택) 로고 (public/2.png 여백 제거본) */
export const logoFooter: LogoConfig = {
  src: "/logo-stacked.png",
  width: 884,
  height: 753,
};

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

  /** SNS 링크 — 푸터 아이콘 (TODO(content): 실제 URL로 교체) */
  social: [
    { label: "네이버 블로그", href: "https://blog.naver.com/", icon: "blog" },
    { label: "인스타그램", href: "https://www.instagram.com/", icon: "instagram" },
  ] satisfies SocialLink[],

  /** 대표 연락 정보 */
  contact: {
    phone: "031-257-0011",
    phone2: "031-257-0033",
    directorPhone: "010-3270-2523", // 원장 직통
    address: "경기도 수원시 영통구 센트럴타운로 94, 2층(이의동, 앤에스코어빌딩)",
    hours: "추후 안내", // TODO(content): 운영시간 확정 시 교체
  },

  /** 사업자 정보 — 하단바(Footer) 표기용 */
  business: {
    companyName: "(주)새론학원",
    owner: "이병언",
    registrationNumber: "770-88-00617",
    address: "경기도 수원시 영통구 센트럴타운로 94, 2층(이의동, 앤에스코어빌딩)",
    phone: "031-257-0011",
    phone2: "031-257-0033",
    directorPhone: "010-3270-2523",
  },
} as const;
