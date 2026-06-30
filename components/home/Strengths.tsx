import Section from "@/components/layout/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { strengths, type Strength } from "@/lib/data/home";

/**
 * 강점(Why 새론) 섹션 — DESIGN.md §5. 톤 mist.
 * 아이콘 카드 그리드(유동 auto-fit), hover 리프트 + 진입 스태거.
 */
export default function Strengths() {
  return (
    <Section tone="mist">
      <Reveal>
        <SectionHeading
          eyebrow="WHY 새론"
          title="결과로 증명하는 학습 시스템"
          description="새론학원은 설계 · 관리 · 검증의 선순환으로 학생의 성장을 끝까지 책임집니다."
        />
      </Reveal>

      <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-5">
        {strengths.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 90}>
            <div className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-background p-7 shadow-card transition-[transform,box-shadow] duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-hover">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-5 text-h3 font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function Icon({ name }: { name: Strength["icon"] }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5z" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M16 4.5a3 3 0 010 6M21 20c0-2.5-1.3-4.7-3.3-5.6" />
        </svg>
      );
    case "badge":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="5" />
          <path d="M8.5 13.5L7 22l5-3 5 3-1.5-8.5" />
        </svg>
      );
    case "report":
      return (
        <svg {...common}>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </svg>
      );
  }
}
