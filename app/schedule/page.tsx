import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "수업 시간표",
  description: "새론학원 수업 시간표 안내.",
};

export default function SchedulePage() {
  return (
    <Section tone="paper">
      <Reveal className="text-center">
        <span className="eyebrow justify-center">
          <span className="h-px w-7 bg-point" aria-hidden="true" />
          SCHEDULE
        </span>
        <h1 className="mt-4 text-h1 font-bold text-foreground">수업 시간표</h1>
      </Reveal>

      {/* 시간표는 새로 구성 예정 — 준비 중 */}
      <Reveal className="mx-auto mt-12 max-w-3xl text-center">
        <p className="text-muted-foreground">수업 시간표는 준비 중입니다.</p>
      </Reveal>
    </Section>
  );
}
