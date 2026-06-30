import PosterFrame from "./PosterFrame";
import type { Notice } from "@/lib/data/notices";

/**
 * 공지 대표 썸네일 (목록·하단 슬라이드용). 대표 = images[0].
 */
export default function NoticePoster({
  notice,
  className = "",
}: {
  notice: Notice;
  className?: string;
}) {
  return (
    <PosterFrame src={notice.images?.[0]} alt={notice.title} className={className} />
  );
}
