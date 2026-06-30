import { site, logoFooter } from "@/lib/data/site";
import Container from "./Container";
import Logo from "./Logo";
import SocialLinks from "@/components/SocialLinks";

/**
 * 하단바 — 사업자 정보 + SNS (DESIGN.md §4)
 * 사업자/연락 정보는 lib/data/site.ts 단일 출처에서 참조.
 */
export default function Footer() {
  const { business, contact } = site;
  const year = 2026; // TODO: 동적 연도 검토(서버/클라 일관성)

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-12">
        {/* 상단: 브랜드(좌) + SNS(우) */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Logo source={logoFooter} className="h-20 w-auto shrink-0" />
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
          </div>

          <SocialLinks className="shrink-0 sm:justify-end" />
        </div>

        {/* 사업자 정보 (순서 고정) */}
        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-1.5 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold">상호</dt>
            <dd>{business.companyName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold">대표자</dt>
            <dd>{business.owner}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold">사업자등록번호</dt>
            <dd>{business.registrationNumber}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold">주소</dt>
            <dd>{business.address}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold">전화</dt>
            <dd>
              <a href={`tel:${business.phone}`} className="hover:text-foreground">
                {business.phone}
              </a>
              {" / "}
              <a href={`tel:${business.phone2}`} className="hover:text-foreground">
                {business.phone2}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold">원장 직통</dt>
            <dd>
              <a
                href={`tel:${business.directorPhone}`}
                className="hover:text-foreground"
              >
                {business.directorPhone}
              </a>
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold">운영시간</dt>
            <dd>{contact.hours}</dd>
          </div>
        </dl>

        <p className="mt-6 text-xs text-muted-foreground">
          © {year} {business.companyName}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
