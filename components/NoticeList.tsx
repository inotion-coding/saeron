"use client";

import { useEffect, useState } from "react";
import NoticePoster from "@/components/NoticePoster";
import NoticeArticle from "@/components/NoticeArticle";
import Reveal from "@/components/ui/Reveal";
import { fetchNotices } from "@/lib/content/notices";
import type { Notice } from "@/lib/data/notices";

const PER_PAGE = 10;

/**
 * 공지 포스터 그리드 + 페이지네이션 + 포스터 크게보기(라이트박스).
 * 데이터: Supabase(관리자 편집 즉시 반영). 포스터 클릭 → 팝업에서 포스터·본문 표시(별도 주소 없음).
 */
export default function NoticeList() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState<Notice | null>(null);

  useEffect(() => {
    fetchNotices()
      .then((n) => setNotices(n))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false));
  }, []);

  // 팝업 열렸을 때 Esc 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const totalPages = Math.max(1, Math.ceil(notices.length / PER_PAGE));
  const page = Math.min(current, totalPages);
  const items = notices.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) {
    return (
      <p className="mt-14 text-center text-muted-foreground">불러오는 중…</p>
    );
  }

  if (notices.length === 0) {
    return (
      <p className="mt-14 text-center text-muted-foreground">
        등록된 공지가 없습니다.
      </p>
    );
  }

  return (
    <>
      <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((notice, i) => (
          <Reveal as="li" key={notice.id} delay={(i % 5) * 70}>
            <button
              type="button"
              onClick={() => setSelected(notice)}
              className="group block w-full text-left"
            >
              <NoticePoster
                notice={notice}
                className="transition-colors group-hover:border-point"
              />
              <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-point">
                {notice.title}
              </h3>
              <time
                dateTime={notice.date}
                className="mt-1 block text-xs text-muted-foreground"
              >
                {notice.date.replaceAll("-", ".")}
              </time>
            </button>
          </Reveal>
        ))}
      </ul>

      {totalPages > 1 && (
        <nav
          className="mt-14 flex items-center justify-center gap-1.5"
          aria-label="공지 페이지"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCurrent(n)}
              aria-current={n === page ? "page" : undefined}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-sm)] px-2.5 text-sm font-semibold transition-colors ${
                n === page
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </nav>
      )}

      {/* 라이트박스: 포스터 크게보기 */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative my-auto w-full max-w-2xl rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-hover sm:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="닫기"
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-xl text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              ×
            </button>
            <NoticeArticle notice={selected} as="h2" titleClassName="text-h2" />
          </div>
        </div>
      )}
    </>
  );
}
