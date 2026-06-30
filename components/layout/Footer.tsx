import Link from "next/link";
import { site } from "@/lib/data/site";
import Container from "./Container";

/**
 * 하단바 (1단계) — 사업자 정보 + 간단 메뉴 (DESIGN.md §4)
 * 사업자 정보는 lib/data/site.ts(business) 단일 출처에서 참조.
 */
export default function Footer() {
  const { business, contact } = site;
  const year = 2026; // TODO: 동적 연도 적용 검토 (서버/클라 일관성)

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* 학원 정보 */}
          <div className="max-w-md">
            <p className="text-lg font-extrabold text-primary">{site.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
          </div>

          {/* 바로가기 */}
          <nav aria-label="푸터 메뉴">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 사업자 정보 */}
        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-1 border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground sm:grid-cols-2">
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
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 font-semibold">이메일</dt>
            <dd>
              <a
                href={`mailto:${business.email}`}
                className="hover:text-foreground"
              >
                {business.email}
              </a>
            </dd>
          </div>
          <div className="flex gap-2 sm:col-span-2">
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
