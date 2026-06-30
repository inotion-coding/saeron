import PosterFrame from "./PosterFrame";

/**
 * 공지 상세 포스터 갤러리 — DESIGN.md §6 (공지)
 * 폭은 부모(콘텐츠/경계선) 폭에 꽉 차게. 사진 수에 따른 배치 (대표 = images[0]):
 *  - 1장: 1장만
 *  - 2장: 위아래로 동일 배치
 *  - 3장 이상: 대표를 크게 위에, 서브는 "2개가 대표 가로폭을 꽉 채우는" 크기로
 *            가로 배치하고, 3개 이상이면 옆으로 스크롤
 */
export default function NoticeGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const list = images.length > 0 ? images : [""]; // 최소 1장(플레이스홀더)
  const n = list.length;

  if (n === 1) {
    return (
      <div className="w-full">
        <PosterFrame src={list[0]} alt={alt} sizes="(max-width: 768px) 92vw, 768px" />
      </div>
    );
  }

  if (n === 2) {
    return (
      <div className="flex w-full flex-col gap-4">
        <PosterFrame src={list[0]} alt={`${alt} 1`} sizes="(max-width: 768px) 92vw, 768px" />
        <PosterFrame src={list[1]} alt={`${alt} 2`} sizes="(max-width: 768px) 92vw, 768px" />
      </div>
    );
  }

  // 3장 이상: 대표 + 서브(2개가 대표 가로폭을 꽉, 그 이상 스크롤)
  const [first, ...rest] = list;
  return (
    <div className="w-full">
      <PosterFrame
        src={first}
        alt={`${alt} 대표`}
        sizes="(max-width: 768px) 92vw, 768px"
      />
      <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
        {rest.map((src, i) => (
          <div key={i} className="w-[calc((100%_-_1rem)/2)] shrink-0 snap-start">
            <PosterFrame
              src={src}
              alt={`${alt} ${i + 2}`}
              sizes="(max-width: 768px) 45vw, 380px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
