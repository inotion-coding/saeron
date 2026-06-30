import { site, type SocialLink } from "@/lib/data/site";

/**
 * SNS 브랜드 링크 (네이버 블로그·인스타그램) — 푸터·상담 페이지 공용.
 * 실제 브랜드 컬러 타일 + 로고 글리프. 데이터는 lib/data/site.ts(social).
 */
export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-3 ${className}`}>
      {site.social.map((s) => (
        <li key={s.icon}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] text-white shadow-card transition-transform duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5"
            style={
              s.icon === "instagram"
                ? {
                    background:
                      "linear-gradient(45deg, #feda75 5%, #fa7e1e 25%, #d62976 50%, #962fbf 75%, #4f5bd5 95%)",
                  }
                : { background: "#03c75a" }
            }
          >
            <SocialGlyph name={s.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function SocialGlyph({ name }: { name: SocialLink["icon"] }) {
  if (name === "instagram") {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.3" />
        <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  // 네이버 블로그
  return (
    <span className="text-[11px] font-extrabold leading-none tracking-tight">
      blog
    </span>
  );
}
