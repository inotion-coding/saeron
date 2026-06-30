import NoticeGallery from "./NoticeGallery";
import type { Notice } from "@/lib/data/notices";

/**
 * 공지 상세 본문 (제목·날짜 — 경계선 — 포스터 갤러리 — 본문) — DESIGN.md §6
 * 상세 페이지와 "주요 공지" 펼침 표시에서 공용. as 로 제목 태그·크기 조정.
 * 헤더 아래 경계선은 콘텐츠 전체 폭(포스터·다른 경계선과 동일 폭).
 */
export default function NoticeArticle({
  notice,
  as: Tag = "h2",
  titleClassName = "text-h2",
}: {
  notice: Notice;
  as?: "h1" | "h2" | "h3";
  titleClassName?: string;
}) {
  return (
    <div>
      <header className="border-b border-border pb-6 text-center">
        <Tag className={`break-keep font-extrabold text-foreground ${titleClassName}`}>
          {notice.title}
        </Tag>
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
