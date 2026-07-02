import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import Reveal from "@/components/ui/Reveal";
import ScheduleView from "@/components/schedule/ScheduleView";

export const metadata: Metadata = {
  title: "수업 시간표",
  description: "중등·고등 과목별 수업 시간표를 확인하세요.",
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
        <p className="measure mx-auto mt-4 text-lead text-muted-foreground">
          부·과목을 선택하면 담당 강사와 수업 요일·시간을 한눈에 확인할 수 있습니다.
        </p>
      </Reveal>

      <div className="mt-12">
        <ScheduleView />
      </div>
    </Section>
  );
}
