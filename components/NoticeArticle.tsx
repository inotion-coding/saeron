import NoticeGallery from "./NoticeGallery";
import type { Notice } from "@/lib/data/notices";

/**
 * 공지 상세 본문 (제목·날짜 — 경계선 — 포스터 갤러리 — 본문) — DESIGN.md §6
 * 공지 목록 팝업(NoticeList)에서 사용.
 * 헤더 아래 경계선은 콘텐츠 전체 폭(포스터·다른 경계선과 동일 폭).
 */
export default function NoticeArticle({ notice }: { notice: Notice }) {
  return (
    <div>
      <header className="border-b border-border pb-6 text-center">
        <h2 className="break-keep text-h2 font-extrabold text-foreground">
          {notice.title}
        </h2>
        <time
          dateTime={notice.date}
          className="mt-2 block text-sm text-muted-foreground"
        >
          {notice.date.replaceAll("-", ".")}
        </time>
      </header>

      <div className="mt-8">
        <NoticeGallery images={notice.images ?? []} alt={notice.title} />
      </div>

      {notice.content && (
        <p className="mx-auto mt-8 max-w-xl whitespace-pre-line text-center text-base leading-relaxed text-muted-foreground">
          {notice.content}
        </p>
      )}
    </div>
  );
}
