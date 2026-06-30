import type { Metadata } from "next";
import Link from "next/link";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import NoticePoster from "@/components/NoticePoster";
import NoticeArticle from "@/components/NoticeArticle";
import { getSortedNotices, getFeaturedNotices } from "@/lib/data/notices";

export const metadata: Metadata = {
  title: "공지사항",
  description: "새론학원의 소식과 안내를 확인하세요.",
};

const PER_PAGE = 5;

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const all = getSortedNotices();
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  const current = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const items = all.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const featured = getFeaturedNotices();

  return (
    <>
      <Section tone="paper">
        <SectionHeading
          align="center"
          eyebrow="NOTICE"
          title="공지사항"
          description="새론학원의 소식과 안내를 포스터로 확인하세요."
        />

        {/* 포스터 그리드 (5개씩) */}
        <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((notice) => (
            <li key={notice.id}>
              <Link href={`/notices/${notice.id}`} className="group block">
                <NoticePoster
                  notice={notice}
                  className="transition-colors group-hover:border-point"
                />
                <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-point">
                  {notice.title}
                </h3>
                <time
                  dateTime={notice.date}
                  className="mt-1 block text-xs text-muted-foreground"
                >
                  {notice.date.replaceAll("-", ".")}
                </time>
              </Link>
            </li>
          ))}
        </ul>

        {/* 페이지네이션 (페이지 번호) */}
        {totalPages > 1 && (
          <nav
            className="mt-14 flex items-center justify-center gap-1.5"
            aria-label="공지 페이지"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={n === 1 ? "/notices" : `/notices?page=${n}`}
                aria-current={n === current ? "page" : undefined}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-sm)] px-2.5 text-sm font-semibold transition-colors ${
                  n === current
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                {n}
              </Link>
            ))}
          </nav>
        )}
      </Section>

      {/* 하단: 주요 공지 — featured 3~5개의 상세 모습을 그대로 펼쳐 표시(경계선 구분) */}
      {featured.length > 0 && (
        <Section tone="mist">
          <SectionHeading
            align="center"
            eyebrow="PICK"
            title="주요 공지"
            description="메인 배너에 등록된 주요 공지를 한눈에 모아 보여드립니다."
            className="mx-auto"
          />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-border">
            {featured.map((notice) => (
              <div key={notice.id} className="py-12 first:pt-0 last:pb-0">
                <NoticeArticle notice={notice} as="h3" titleClassName="text-h2" />
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
