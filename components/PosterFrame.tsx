import Image from "next/image";

/**
 * 포스터 프레임 (A4 세로 210:297) — DESIGN.md §4
 * src 가 있으면 이미지, 없으면 회색 플레이스홀더. 공지 썸네일·갤러리 공용.
 */
export default function PosterFrame({
  src,
  alt,
  sizes = "(max-width: 640px) 90vw, 240px",
  className = "",
}: {
  src?: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[210/297] w-full overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface-2 ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
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
