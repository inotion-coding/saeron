import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import NoticeArticle from "@/components/NoticeArticle";
import { notices, getNoticeById } from "@/lib/data/notices";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  const params = notices.map((n) => ({ id: n.id }));
  // 정적 export는 동적 경로에 최소 1개 파라미터를 요구한다.
  // 공지가 0개여도 빌드가 실패하지 않도록 플레이스홀더 반환(해당 경로는 notFound 처리).
  return params.length > 0 ? params : [{ id: "_none" }];
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

        <Reveal className="mt-8">
          <NoticeArticle notice={notice} as="h1" titleClassName="text-h1" />
        </Reveal>

        <div className="mt-12 flex justify-center border-t border-border pt-8">
          <Button href="/notices" variant="secondary" withArrow>
            공지 목록으로
          </Button>
        </div>
      </div>
    </Section>
  );
}
