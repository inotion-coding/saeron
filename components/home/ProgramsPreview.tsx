import Section from "@/components/layout/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import ProgramCard from "@/components/ProgramCard";
import Reveal from "@/components/ui/Reveal";
import { getFeaturedPrograms } from "@/lib/data/programs";

/**
 * 프로그램 미리보기 섹션 — DESIGN.md §5. 톤 paper.
 */
export default function ProgramsPreview() {
  const featured = getFeaturedPrograms(3);

  return (
    <Section tone="paper">
      <Reveal>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="PROGRAMS"
            title="학년·목표별 맞춤 프로그램"
            description="현재 위치에서 목표까지, 단계에 맞는 과정을 제안합니다."
          />
          <div className="shrink-0">
            <Button href="/programs" variant="secondary" withArrow>
              전체 프로그램 보기
            </Button>
          </div>
        </div>
      </Reveal>

      <ul className="mt-12 grid grid-cols-[repeat(auto-fit,minmax(17rem,1fr))] gap-5">
        {featured.map((program, i) => (
          <Reveal as="li" key={program.id} delay={i * 90} className="flex">
            <ProgramCard program={program} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
