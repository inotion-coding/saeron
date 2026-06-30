import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import NoticeArticle from "@/components/NoticeArticle";
import { notices, getNoticeById } from "@/lib/data/notices";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return notices.map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const notice = getNoticeById(id);
  return { title: notice ? notice.title : "공지사항" };
}

export default async function NoticeDetailPage({ params }: Params) {
  const { id } = await params;
  const notice = getNoticeById(id);
  if (!notice) notFound();

  return (
    <Section tone="paper">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/notices"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          공지 목록
        </Link>

        <div className="mt-8">
          <NoticeArticle notice={notice} as="h1" titleClassName="text-h1" />
        </div>

        <div className="mt-12 flex justify-center border-t border-border pt-8">
          <Button href="/notices" variant="secondary" withArrow>
            공지 목록으로
          </Button>
        </div>
      </div>
    </Section>
  );
}
