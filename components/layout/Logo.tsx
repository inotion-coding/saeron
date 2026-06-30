import Image from "next/image";
import { site, logo } from "@/lib/data/site";

/**
 * 브랜드 로고 (DESIGN.md §4)
 * - lib/data/site.ts 의 `logo.src` 가 설정되면 해당 이미지를 렌더.
 * - 미설정(null)이면 텍스트 마크(네이비 사각 + 워드마크)로 폴백.
 * Header/Footer 에서 공용 사용.
 */
export default function Logo() {
  if (logo.src) {
    return (
      <Image
        src={logo.src}
        alt={site.name}
        width={logo.width}
        height={logo.height}
        priority
        className="h-9 w-auto"
      />
    );
  }

  // 폴백: 텍스트 마크
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-primary text-sm font-extrabold text-primary-foreground">
        새
      </span>
      <span className="text-lg font-extrabold tracking-tight text-foreground">
        {site.name}
      </span>
    </span>
  );
}
