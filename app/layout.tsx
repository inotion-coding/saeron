import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/data/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageBackdrop from "@/components/layout/PageBackdrop";
import ScrollTheme from "@/components/ScrollTheme";

/** 서비스 정식 주소(커스텀 도메인). 검색엔진이 절대경로를 만들 기준값. */
const SITE_URL = "https://saeronedu.com";

/**
 * 검색엔진 소유확인(verification) 코드.
 * - 구글 서치콘솔 / 네이버 서치어드바이저에서 "HTML 태그" 방식으로 받은 content 값을 붙여넣는다.
 * - 값이 비어 있으면 해당 태그를 출력하지 않는다(빈 태그 방지).
 * TODO(seo): 등록 후 발급받은 코드로 교체.
 */
const VERIFY = {
  google: "6Nbo6WdqRBE8mKLuY1n3w4dzpsFJ2NmqHcws6ucm1s8", // 구글 서치콘솔 소유확인
  naver: "", // 예) "abcd1234..." (네이버 서치어드바이저 HTML 태그 content)
};

/** 메인 검색 노출용 핵심 키워드(지역·업종 중심) */
const KEYWORDS = [
  "새론학원",
  "광교 학원",
  "영통 학원",
  "수원 입시학원",
  "광교 입시학원",
  "센트럴타운 학원",
  "이의동 학원",
  "고등 입시 종합학원",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} | 광교·영통 입시 종합학원`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: KEYWORDS,
  alternates: { canonical: "/" },
  applicationName: site.name,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: site.name,
    title: `${site.name} | 광교·영통 입시 종합학원`,
    description: site.description,
    images: [{ url: "/logo.png", width: 750, height: 181, alt: site.name }],
  },
  twitter: {
    card: "summary",
    title: `${site.name} | 광교·영통 입시 종합학원`,
    description: site.description,
    images: ["/logo.png"],
  },
  verification: {
    ...(VERIFY.google ? { google: VERIFY.google } : {}),
    ...(VERIFY.naver
      ? { other: { "naver-site-verification": VERIFY.naver } }
      : {}),
  },
};

/**
 * 지역 비즈니스 구조화 데이터(JSON-LD).
 * 구글이 학원 이름·주소·전화·SNS를 인식해 지역/지식패널 노출에 활용한다.
 */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  url: SITE_URL,
  description: site.description,
  telephone: site.contact.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.address,
    addressLocality: "수원시 영통구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* Pretendard 웹폰트 (CDN) — 추후 next/font 셀프호스팅으로 교체 검토 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.min.css"
        />
        {/* 지역 비즈니스 구조화 데이터(JSON-LD) — 구글 지역/지식패널 노출용 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <PageBackdrop />
        <ScrollTheme />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
