import Image from "next/image";
import { site, logo as defaultLogo, type LogoConfig } from "@/lib/data/site";

/**
 * 브랜드 로고 (DESIGN.md §4)
 * - source: 사용할 로고 설정(기본 = 헤더 가로형). 푸터는 logoFooter 전달.
 * - className: 표시 크기(기본 h-9).
 */
export default function Logo({
  source = defaultLogo,
  className = "h-9 w-auto",
}: {
  source?: LogoConfig;
  className?: string;
}) {
  return (
    <Image
      src={source.src}
      alt={site.name}
      width={source.width}
      height={source.height}
      priority
      className={className}
    />
  );
}
