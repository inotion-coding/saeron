import NoticeBar from "@/components/NoticeBar";
import Hero from "@/components/home/Hero";
import Strengths from "@/components/home/Strengths";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import CtaBand from "@/components/home/CtaBand";

/**
 * 메인 페이지 — 부가 페이지의 기준이 되는 센터피스 (DESIGN.md §5)
 * 공지 리본 → 히어로(+지표) → 강점 → 프로그램 미리보기 → 상담 CTA
 */
export default function HomePage() {
  return (
    <>
      <NoticeBar />
      <Hero />
      <Strengths />
      <ProgramsPreview />
      <CtaBand />
    </>
  );
}
