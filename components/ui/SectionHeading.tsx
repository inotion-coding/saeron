import type { ReactNode } from "react";

/**
 * 섹션 공통 헤더 (DESIGN.md §4) — eyebrow(골드) + 제목 + 설명.
 * align: 좌측(기본)/중앙. onDark: 딥 배경용(텍스트 흰색, eyebrow 밝은 골드).
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onDark = false,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <div
      className={`flex flex-col gap-3 ${
        isCenter ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-[0.08em] ${
            onDark ? "text-point-bright" : "text-point"
          }`}
        >
          <span
            className={`h-px w-7 ${onDark ? "bg-point-bright" : "bg-point"}`}
            aria-hidden="true"
          />
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-h2 font-extrabold ${
          onDark ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`text-lead measure ${isCenter ? "mx-auto" : ""} ${
            onDark ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
