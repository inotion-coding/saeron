"use client";

import { useState } from "react";
import Link from "next/link";
import NoticePoster from "@/components/NoticePoster";
import Reveal from "@/components/ui/Reveal";
import type { Notice } from "@/lib/data/notices";

const PER_PAGE = 5;

/**
 * 공지 포스터 그리드 + 페이지네이션 (client).
 * 정적 사이트(export)에서 서버 searchParams를 못 쓰므로 클라이언트 상태로 페이지 전환.
 */
export default function NoticeList({ notices }: { notices: Notice[] }) {
  const [current, setCurrent] = useState(1);
  const totalPages = Math.max(1, Math.ceil(notices.length / PER_PAGE));
  const page = Math.min(current, totalPages);
  const items = notices.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // 등록된 공지가 없을 때: 빈 그리드 대신 안내 문구 표시
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
            <Link href={`/notices/${notice.id}`} className="group block">
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
            </Link>
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
    </>
  );
}
