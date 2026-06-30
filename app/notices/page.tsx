import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import NoticeList from "@/components/NoticeList";
import NoticeArticle from "@/components/NoticeArticle";
import { getSortedNotices, getFeaturedNotices } from "@/lib/data/notices";

export const metadata: Metadata = {
  title: "공지사항",
  description: "새론학원의 소식과 안내를 확인하세요.",
};

export default function NoticesPage() {
  const all = getSortedNotices();
  const featured = getFeaturedNotices();

  return (
    <>
      <Section tone="paper">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="NOTICE"
            title="공지사항"
            description="새론학원의 소식과 안내를 포스터로 확인하세요."
          />
        </Reveal>

        {/* 포스터 그리드 + 페이지네이션 (client) */}
        <NoticeList notices={all} />
      </Section>

      {/* 하단: 주요 공지 — featured 3~5개의 상세 모습을 그대로 펼쳐 표시(경계선 구분) */}
      {featured.length > 0 && (
        <Section tone="mist">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="PICK"
              title="주요 공지"
              description="메인 배너에 등록된 주요 공지를 한눈에 모아 보여드립니다."
              className="mx-auto"
            />
          </Reveal>
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-border">
            {featured.map((notice, i) => (
              <Reveal
                as="div"
                key={notice.id}
                delay={(i % 3) * 80}
                className="py-12 first:pt-0 last:pb-0"
              >
                <NoticeArticle notice={notice} as="h3" titleClassName="text-h2" />
              </Reveal>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
