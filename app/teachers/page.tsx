import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import Reveal from "@/components/ui/Reveal";
import TeacherDirectory from "@/components/teachers/TeacherDirectory";

export const metadata: Metadata = {
  title: "강사 소개",
  description: "신뢰로 증명하는 새론학원 전임 강사진을 소개합니다.",
};

export default function TeachersPage() {
  return (
    <>
      <Section tone="paper">
        <Reveal className="text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-7 bg-point" aria-hidden="true" />
            TEACHERS
          </span>
          <h1 className="mt-4 text-h1 font-bold text-foreground">
            강사 소개
          </h1>
          <p className="measure mx-auto mt-4 text-lead text-muted-foreground">
            검증된 전임 강사진이 학생 한 명 한 명을 책임집니다.
          </p>
        </Reveal>

        <div className="mt-12">
          <TeacherDirectory />
        </div>
      </Section>
    </>
  );
}
