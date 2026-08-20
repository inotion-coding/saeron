"use client";

import { useEffect, useState, type ReactNode } from "react";
import PosterFrame from "./PosterFrame";
import ImageViewer from "./ImageViewer";

/** 상세 포스터 최대 높이 — 세로로 긴 포스터가 화면을 넘지 않도록 */
const MAX_H = "72vh";

/**
 * 공지 상세 포스터 갤러리 — DESIGN.md §6 (공지)
 * 폭은 부모(콘텐츠/경계선) 폭에 꽉 차게. 사진 수·**모양(가로/세로)** 에 따른 배치:
 *  - 1장: 1장만 원본 비율 그대로
 *  - 2장: 위아래로 동일 배치
 *  - 3장 이상: 대표(images[0])는 위에 크게, 나머지는
 *      · **가로 사진 → 대표와 같은 폭으로 한 줄씩** (작은 썸네일 줄에 밀어 넣지 않음)
 *      · 세로 사진 → 2개가 대표 폭을 꽉 채우는 크기로 가로 배치(3개 이상이면 옆으로 스크롤)
 *    (세로 사진이 1장만 남으면 그 1장도 대표와 같은 폭으로 표시)
 *
 * 가로/세로 판별: 원본 이미지를 미리 읽어 비율(가로/세로 > 1 = 가로)을 구한다.
 * 목록 썸네일에서 이미 받아온 URL이라 브라우저 캐시로 즉시 처리된다.
 *
 * 사진을 클릭하면 **전체화면 뷰어(ImageViewer)** 로 확대된다.
 * (공지 팝업 안에서 사진을 한 번 더 클릭 → 화면 꽉 채워 보기)
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
  const key = list.join("|");

  // src → 원본 비율(가로/세로). 측정 전에는 세로로 간주.
  const [ratios, setRatios] = useState<Record<string, number>>({});
  // 전체화면으로 보고 있는 사진 번호(0부터). null = 닫힘
  const [viewer, setViewer] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    key
      .split("|")
      .filter(Boolean)
      .forEach((src) => {
        const img = new window.Image();
        img.onload = () => {
          if (!alive || !img.naturalWidth || !img.naturalHeight) return;
          const r = img.naturalWidth / img.naturalHeight;
          setRatios((prev) => (prev[src] === r ? prev : { ...prev, [src]: r }));
        };
        img.src = src;
      });
    return () => {
      alive = false;
    };
  }, [key]);

  /** 사진 감싸개 — 클릭하면 전체화면. 플레이스홀더(빈 src)는 그대로 둔다. */
  const zoomable = (src: string, label: string, i: number, child: ReactNode) =>
    src ? (
      <button
        key={label}
        type="button"
        onClick={() => setViewer(i)}
        aria-label={`${label} 전체화면으로 보기`}
        className="block w-full cursor-zoom-in"
      >
        {child}
      </button>
    ) : (
      <div key={label} className="w-full">
        {child}
      </div>
    );

  /** 대표와 같은 폭으로 원본 비율 그대로 표시 */
  const full = (src: string, label: string, i: number) =>
    zoomable(
      src,
      label,
      i,
      <PosterFrame
        src={src}
        alt={label}
        fit="natural"
        maxHeight={MAX_H}
        sizes="(max-width: 768px) 92vw, 768px"
      />,
    );

  let content: ReactNode;

  if (n === 1) {
    content = <div className="w-full">{full(list[0], alt, 0)}</div>;
  } else if (n === 2) {
    content = (
      <div className="flex w-full flex-col gap-4">
        {full(list[0], `${alt} 1`, 0)}
        {full(list[1], `${alt} 2`, 1)}
      </div>
    );
  } else {
    // 3장 이상: 서브를 순서대로 훑으며 가로 사진은 한 줄 통째로, 세로 사진은 모아서 썸네일 줄로
    const [first, ...rest] = list;
    type Block =
      | { type: "full"; src: string; index: number }
      | { type: "row"; items: { src: string; index: number }[] };
    const blocks: Block[] = [];

    rest.forEach((src, i) => {
      const index = i + 2; // 사람이 읽는 순번(대표=1)
      const isWide = (ratios[src] ?? 0) > 1;
      const last = blocks[blocks.length - 1];
      if (isWide) {
        blocks.push({ type: "full", src, index });
      } else if (last?.type === "row") {
        last.items.push({ src, index });
      } else {
        blocks.push({ type: "row", items: [{ src, index }] });
      }
    });

    content = (
      <div className="flex w-full flex-col gap-4">
        {full(first, `${alt} 대표`, 0)}

        {blocks.map((block, bi) =>
          block.type === "full" ? (
            full(block.src, `${alt} ${block.index}`, block.index - 1)
          ) : block.items.length === 1 ? (
            // 세로 사진이 1장만 남으면 작은 썸네일 대신 대표와 같은 폭으로
            full(
              block.items[0].src,
              `${alt} ${block.items[0].index}`,
              block.items[0].index - 1,
            )
          ) : (
            <div
              key={`row-${bi}`}
              className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
            >
              {block.items.map(({ src, index }) => (
                <div
                  key={index}
                  className="w-[calc((100%_-_1rem)/2)] shrink-0 snap-start"
                >
                  {zoomable(
                    src,
                    `${alt} ${index}`,
                    index - 1,
                    <PosterFrame
                      src={src}
                      alt={`${alt} ${index}`}
                      sizes="(max-width: 768px) 45vw, 380px"
                    />,
                  )}
                </div>
              ))}
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <>
      {content}
      {images.length > 0 && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          사진을 클릭하면 전체화면으로 볼 수 있습니다.
        </p>
      )}
      {viewer !== null && images.length > 0 && (
        <ImageViewer
          images={images}
          index={viewer}
          alt={alt}
          onClose={() => setViewer(null)}
          onChange={setViewer}
        />
      )}
    </>
  );
}
