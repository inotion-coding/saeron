import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "상담·문의",
  description:
    "학년·목표·현재 성적을 알려주시면 맞춤 학습 방향을 제안해 드립니다.",
};

const MAP_QUERY = "경기도 수원시 영통구 센트럴타운로 94";
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  MAP_QUERY
)}&output=embed`;

/** 금색 마커 + 제목 (박스 없는 섹션 헤드) */
function BlockHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-4 w-1 rounded-full bg-point" aria-hidden="true" />
      <h2 className="text-h3 font-bold text-foreground">{children}</h2>
    </div>
  );
}

/** 정보 항목 라벨 — 금색 소문자 캡스 */
function InfoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.08em] text-point">
      {children}
    </p>
  );
}

export default function ContactPage() {
  const { business, contact } = site;

  return (
    <Section tone="paper">
      <Reveal className="text-center">
        <span className="eyebrow justify-center">
          <span className="h-px w-7 bg-point" aria-hidden="true" />
          CONTACT
        </span>
        <h1 className="mt-4 text-h1 font-bold text-foreground">상담·문의</h1>
        <p className="measure mx-auto mt-4 text-lead text-muted-foreground">
          학년·목표·현재 성적을 알려주시면 맞춤 학습 방향을 제안해 드립니다.
        </p>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* 상담 폼 (박스 없음) */}
        <Reveal>
          <BlockHeading>상담 신청</BlockHeading>
          <p className="mt-2 text-sm text-muted-foreground">
            아래 정보를 남겨 주시면 확인 후 연락드립니다.
          </p>
          <div className="mt-7">
            <ContactForm />
          </div>
        </Reveal>

        {/* 연락 · 오시는 길 · SNS (박스 없음, 금색 헤어라인 구분) */}
        <Reveal delay={120}>
          <BlockHeading>연락처 · 오시는 길</BlockHeading>
          <div className="mt-6 divide-y divide-point/15">
            <div className="pb-6">
              <InfoLabel>전화 문의</InfoLabel>
              <div className="mt-3 space-y-1.5">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <a
                    href={`tel:${business.phone}`}
                    className="text-base font-medium text-foreground transition-colors hover:text-point"
                  >
                    {business.phone}
                  </a>
                  <span className="text-point/40" aria-hidden="true">
                    |
                  </span>
                  <a
                    href={`tel:${business.phone2}`}
                    className="text-base font-medium text-foreground transition-colors hover:text-point"
                  >
                    {business.phone2}
                  </a>
                </p>
                <p className="text-sm text-muted-foreground">
                  원장 직통{" "}
                  <a
                    href={`tel:${business.directorPhone}`}
                    className="font-semibold text-foreground transition-colors hover:text-point"
                  >
                    {business.directorPhone}
                  </a>
                </p>
              </div>
            </div>

            <div className="py-6">
              <InfoLabel>운영시간</InfoLabel>
              <p className="mt-3 text-base font-medium text-foreground">
                {contact.hours}
              </p>
            </div>

            <div className="py-6">
              <InfoLabel>오시는 길</InfoLabel>
              <p className="mt-3 text-base font-medium leading-relaxed text-foreground">
                {business.address}
              </p>
              <div className="mt-4 overflow-hidden rounded-[var(--radius-md)] border border-point/20">
                <iframe
                  title="새론학원 위치"
                  src={MAP_SRC}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block aspect-[4/3] w-full"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
