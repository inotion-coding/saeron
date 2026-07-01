import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { programs } from "@/lib/data/programs";

/** 하단 CTA 링크 — hover 시 금색 밑줄 바 등장 (사이트 공통 주효과) */
function CtaLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-point"
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-200 ease-[var(--ease-out-soft)] group-hover:translate-x-0.5">
        →
      </span>
      <span
        aria-hidden="true"
        className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-point transition-all duration-200 ease-[var(--ease-out-soft)] group-hover:w-[calc(100%-1.1rem)]"
      />
    </Link>
  );
}

/**
 * 프로그램 상세 블록 목록 — /programs.
 * 박스 없이 금색 헤어라인으로 구분, 반응형 2컬럼(좌: 정체성 / 우: 상세).
 * 콘텐츠는 lib/data/programs.ts에서 주입.
 */
export default function ProgramList() {
  return (
    <div className="mx-auto max-w-4xl">
      {programs.map((p, i) => (
        <Reveal
          as="div"
          key={p.id}
          delay={(i % 3) * 80}
          className="border-t border-point/20 py-12 first:border-t-0 first:pt-0"
        >
          <div className="grid gap-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-10">
            {/* 좌: 마커 + 과정명 + 대상 배지 */}
            <div>
              <div className="flex items-start gap-3">
                <span
                  className="mt-1.5 h-4 w-1 shrink-0 rounded-full bg-point"
                  aria-hidden="true"
                />
                <h2 className="text-h3 font-bold text-foreground">{p.name}</h2>
              </div>
              <span className="mt-3 ml-4 inline-flex rounded-full border border-point/45 px-2.5 py-0.5 text-xs font-bold tracking-[0.02em] text-point">
                {p.target}
              </span>
            </div>

            {/* 우: 요약 + 특징 + 태그 + CTA */}
            <div>
              <p className="text-base leading-relaxed text-muted-foreground">
                {p.summary}
              </p>

              {p.points && p.points.length > 0 && (
                <ul className="mt-5 space-y-2">
                  {p.points.map((pt, j) => (
                    <li
                      key={j}
                      className="flex gap-2.5 text-sm leading-relaxed text-foreground/90"
                    >
                      <span
                        className="mt-0.5 shrink-0 font-bold text-point"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                      <span className="break-keep">{pt}</span>
                    </li>
                  ))}
                </ul>
              )}

              {p.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-point/30 bg-point/5 px-2.5 py-0.5 text-xs font-medium text-point"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                <CtaLink href="/schedule">수업 시간표 보기</CtaLink>
                <CtaLink href="/contact">상담 신청</CtaLink>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
