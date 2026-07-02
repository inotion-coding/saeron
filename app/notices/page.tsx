import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import NoticeList from "@/components/NoticeList";

export const metadata: Metadata = {
  title: "공지사항",
  description: "새론학원의 소식과 안내를 확인하세요.",
};

export default function NoticesPage() {
  return (
    <Section tone="paper">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="NOTICE"
          title="공지사항"
          description="새론학원의 소식과 안내를 포스터로 확인하세요. 포스터를 누르면 크게 볼 수 있습니다."
        />
      </Reveal>

      {/* 포스터 그리드 + 페이지네이션 + 크게보기 (client, Supabase 조회) */}
      <NoticeList />
    </Section>
  );
}
