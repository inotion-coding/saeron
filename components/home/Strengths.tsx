import Section from "@/components/layout/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { strengths, type Strength } from "@/lib/data/home";

/**
 * 강점(WHY 새론) — DESIGN.md §5. 톤 deep.
 * 각진 흰 카드, 카드당 1개 개념·간결한 설명, 넉넉한 여백(클린 카드 원칙).
 * hover 시 골드 2px 테두리.
 */
export default function Strengths() {
  return (
    <Section tone="deep">
      <Reveal>
        <SectionHeading
          eyebrow="WHY 새론"
          title="결과로 증명하는 학습 시스템"
          description="설계 · 강사 · 환경, 세 가지가 맞물려 학생의 성장을 끝까지 책임집니다."
          onDark
        />
      </Reveal>

      <ul className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6">
        {strengths.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 90}>
            <div className="flex h-full flex-col rounded-[var(--radius-sm)] border-2 border-border bg-background p-8 shadow-card transition-colors duration-200 ease-[var(--ease-out-soft)] hover:border-point">
              <div className="mb-9 flex items-start gap-4">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent/10 text-accent">
                  <Icon name={item.icon} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-h3 font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
              <Button
                href={item.href}
                variant="secondary"
                className="mt-auto w-full"
                withArrow
              >
                바로가기
              </Button>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

function Icon({ name }: { name: Strength["icon"] }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "data":
      // 분석 차트 (축 + 상승 추세선)
      return (
        <svg {...common}>
          <path d="M4 4v16h16" />
          <path d="M7 14l3-3 3 2 4-5" />
        </svg>
      );
    case "teacher":
      // 검증 메달/배지
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="5" />
          <path d="M8.5 12.5L7 21l5-3 5 3-1.5-8.5" />
        </svg>
      );
    case "studyroom":
      // 자습 데스크 램프
      return (
        <svg {...common}>
          <path d="M9 3h6l2 6H7z" />
          <path d="M12 9v9" />
          <path d="M8 21h8" />
        </svg>
      );
  }
}
