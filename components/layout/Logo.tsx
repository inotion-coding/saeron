import Image from "next/image";
import { site, logo as defaultLogo, type LogoConfig } from "@/lib/data/site";

/**
 * 브랜드 로고 (DESIGN.md §4)
 * - source: 사용할 로고 설정(기본 = 헤더 가로형). 푸터는 logoFooter 전달.
 * - src 가 있으면 이미지, 없으면 텍스트 마크 폴백.
 * - variant="light": 어두운 배경용(이미지 흰색 실루엣, 폴백 텍스트 흰색).
 * - className: 표시 크기(기본 h-9).
 */
export default function Logo({
  source = defaultLogo,
  variant = "default",
  className = "h-9 w-auto",
}: {
  source?: LogoConfig;
  variant?: "default" | "light";
  className?: string;
}) {
  const light = variant === "light";

  if (source.src) {
    return (
      <Image
        src={source.src}
        alt={site.name}
        width={source.width}
        height={source.height}
        priority
        className={`${className} ${light ? "brightness-0 invert" : ""}`}
      />
    );
  }

  // 폴백: 텍스트 마크
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-sm font-extrabold ${
          light ? "bg-white text-primary" : "bg-primary text-primary-foreground"
        }`}
      >
        새
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        {site.name}
      </span>
    </span>
  );
}
