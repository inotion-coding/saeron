import PosterFrame from "./PosterFrame";
import type { Notice } from "@/lib/data/notices";

/**
 * 공지 대표 썸네일 (목록·하단 슬라이드용). 대표 = images[0].
 * fit/onRatio 는 PosterFrame 으로 그대로 전달 —
 * 목록에서 가로 사진을 감지해 2칸 배치로 바꾸는 데 사용한다(NoticeList).
 */
export default function NoticePoster({
  notice,
  className = "",
  fit,
  sizes,
  onRatio,
}: {
  notice: Notice;
  className?: string;
  fit?: "frame" | "natural";
  sizes?: string;
  onRatio?: (ratio: number) => void;
}) {
  return (
    <PosterFrame
      src={notice.images?.[0]}
      alt={notice.title}
      className={className}
      fit={fit}
      sizes={sizes}
      onRatio={onRatio}
    />
  );
}
