"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * 전체화면 사진 뷰어 — 공지 팝업에서 사진을 한 번 더 클릭하면 열린다.
 * 화면 전체를 채우고 원본 비율 그대로(contain) 표시 → 세로로 긴 포스터도 글자가 읽힌다.
 * 닫기: 사진·배경 클릭, 닫기 버튼, Esc.  이동(여러 장): 좌우 버튼, ←/→ 키.
 *
 * 공지 팝업(NoticeList) 위에 겹치므로 z-index는 팝업(z-50)보다 높다.
 * Esc 키는 **캡처 단계에서 가로채 전파를 막는다** — 그러지 않으면 뒤의 공지 팝업까지 함께 닫힌다.
 */
export default function ImageViewer({
  images,
  index,
  alt,
  onClose,
  onChange,
}: {
  images: string[];
  /** 현재 보고 있는 사진 번호(0부터) */
  index: number;
  alt: string;
  onClose: () => void;
  onChange: (nextIndex: number) => void;
}) {
  const total = images.length;
  const hasMany = total > 1;
  // body 로 포털 → 팝업의 스크롤 영역·변형(transform) 조상에 갇히지 않고 항상 화면 전체를 덮는다
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const move = useCallback(
    (step: number) => {
      if (!hasMany) return;
      onChange((index + step + total) % total);
    },
    [hasMany, index, total, onChange],
  );

  // 키보드: Esc 닫기 / ←·→ 이동, 배경 스크롤 잠금(이전 상태 복원)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation(); // 뒤의 공지 팝업이 함께 닫히지 않도록
        onClose();
        return;
      }
      if (e.key === "ArrowLeft") move(-1);
      if (e.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey, true); // 캡처 단계
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow; // 팝업이 걸어둔 잠금은 유지
    };
  }, [move, onClose]);

  const src = images[index];
  if (!src || !mounted) return null;

  /** 버튼 클릭이 배경(닫기)으로 번지지 않도록 */
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} 전체화면`}
      onClick={onClose}
    >
      {/* 사진 — 화면 전체를 채우되 잘리지 않게 */}
      <div className="relative h-full w-full">
        <Image
          src={src}
          alt={hasMany ? `${alt} ${index + 1}` : alt}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      {/* 닫기 */}
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          onClose();
        }}
        aria-label="전체화면 닫기"
        className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-2xl text-white transition-colors hover:bg-black/70 sm:right-5 sm:top-5"
      >
        ×
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              move(-1);
            }}
            aria-label="이전 사진"
            className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 sm:left-5"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              move(1);
            }}
            aria-label="다음 사진"
            className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 sm:right-5"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm font-semibold text-white">
            {index + 1} / {total}
          </span>
        </>
      )}
    </div>,
    document.body,
  );
}
