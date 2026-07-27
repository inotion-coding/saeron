"use client";

import Image from "next/image";
import { useState } from "react";

/** A4 세로 프레임 비율(210:297) — 썸네일 기본값 */
const FRAME_RATIO = 210 / 297;

/**
 * 포스터 프레임 — DESIGN.md §4
 * src 가 있으면 이미지, 없으면 회색 플레이스홀더. 공지 썸네일·갤러리 공용.
 *
 * 가로(landscape) 사진이 세로로 잘리는 문제 대응 — 로드 시 원본 비율을 읽어:
 *  - fit="frame"(기본, 썸네일): A4 프레임 유지. 프레임보다 넓은 사진은 `object-contain`으로
 *    잘리지 않게 전체를 보여주고, 세로 사진은 기존대로 `object-cover`.
 *  - fit="natural"(상세·팝업): 컨테이너 자체를 원본 비율로 맞춰 잘림 없이 전체 표시.
 *    maxHeight 지정 시 그 높이를 넘지 않도록 가로폭을 제한(중앙 정렬).
 */
export default function PosterFrame({
  src,
  alt,
  sizes = "(max-width: 640px) 90vw, 240px",
  className = "",
  fit = "frame",
  maxHeight,
  onRatio,
}: {
  src?: string;
  alt: string;
  sizes?: string;
  className?: string;
  /** frame: A4 프레임 고정(썸네일) / natural: 원본 비율 그대로(상세·팝업) */
  fit?: "frame" | "natural";
  /** natural 모드 최대 높이(CSS 길이, 예: "70vh") */
  maxHeight?: string;
  /** 원본 비율(가로/세로) 통지 — 목록에서 가로 사진 배치를 바꿀 때 사용 */
  onRatio?: (ratio: number) => void;
}) {
  // 원본 가로/세로 비율 (로드 전에는 null → A4 프레임으로 자리 확보)
  const [ratio, setRatio] = useState<number | null>(null);

  const isNatural = fit === "natural";
  const boxRatio = isNatural && ratio ? ratio : FRAME_RATIO;
  // 프레임 모드에서 프레임보다 넓은 사진은 잘리지 않도록 contain
  const isWide = ratio !== null && ratio > FRAME_RATIO;
  const objectFit = isNatural || isWide ? "object-contain" : "object-cover";

  return (
    <div
      className={`relative mx-auto w-full overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface-2 ${className}`}
      style={{
        aspectRatio: boxRatio,
        maxWidth:
          isNatural && maxHeight
            ? `calc(${maxHeight} * ${boxRatio})`
            : undefined,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={objectFit}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              const r = img.naturalWidth / img.naturalHeight;
              setRatio(r);
              onRatio?.(r);
            }
          }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-muted-foreground">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="opacity-60"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
          <span className="text-xs">포스터 준비 중</span>
        </div>
      )}
    </div>
  );
}
