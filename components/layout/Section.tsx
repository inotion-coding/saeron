import type { ReactNode } from "react";
import Container from "./Container";

/**
 * 섹션 수직 리듬 통일 (DESIGN.md §3)
 * variant: default | muted(배경 surface)
 * 유동 간격: clamp로 좁은 화면~넓은 화면 사이를 연속 보간.
 */
export default function Section({
  children,
  variant = "default",
  className = "",
  containerClassName = "",
}: {
  children: ReactNode;
  variant?: "default" | "muted";
  className?: string;
  containerClassName?: string;
}) {
  const bg = variant === "muted" ? "bg-surface" : "bg-background";
  return (
    <section
      className={`${bg} py-[clamp(3rem,2rem+4vw,6rem)] ${className}`}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
