import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import Reveal from "@/components/ui/Reveal";
import ProgramList from "@/components/programs/ProgramList";

export const metadata: Metadata = {
  title: "프로그램",
  description:
    "학년·목표에 맞춘 새론학원의 정규 과정을 안내합니다. 중등 선행부터 고등 내신·수능 대비까지.",
};

export default function ProgramsPage() {
  return (
    <Section tone="paper">
      <Reveal className="text-center">
        <span className="eyebrow justify-center">
          <span className="h-px w-7 bg-point" aria-hidden="true" />
          PROGRAMS
        </span>
        <h1 className="mt-4 text-h1 font-bold text-foreground">프로그램</h1>
        <p className="measure mx-auto mt-4 text-lead text-muted-foreground">
          현재 위치에서 목표까지, 학년·과정별 맞춤 학습을 설계합니다.
        </p>
      </Reveal>

      <div className="mt-14">
        <ProgramList />
      </div>
    </Section>
  );
}
