import type { ReactNode } from "react";
import Container from "./Container";

/**
 * 섹션 수직 리듬 (DESIGN.md §3). 배경은 PageBackdrop(스크롤 톤)이 담당하므로 투명.
 * `tone` 을 주면 data-tone 으로 스크롤 색 전환에 참여한다 (DESIGN.md §9).
 */
export default function Section({
  children,
  tone,
  id,
  className = "",
  containerClassName = "",
}: {
  children: ReactNode;
  tone?: "paper" | "mist" | "deep";
  id?: string;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={`py-[clamp(4.5rem,3rem+6vw,9rem)] ${className}`}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
