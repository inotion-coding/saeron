import type { ReactNode } from "react";

/**
 * 섹션 공통 헤더 (DESIGN.md §4) — eyebrow(골드 라벨) + 제목 + 설명.
 * align: 좌측 정렬(기본) / 중앙 정렬.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
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
        <span className="eyebrow">
          <span className="h-px w-7 bg-point" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-h2 font-extrabold text-foreground">{title}</h2>
      {description && (
        <p className={`text-lead text-muted-foreground ${isCenter ? "mx-auto" : ""} measure`}>
          {description}
        </p>
      )}
    </div>
  );
}
