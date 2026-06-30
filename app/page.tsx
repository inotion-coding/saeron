import NoticeBar from "@/components/NoticeBar";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import { site } from "@/lib/data/site";

/**
 * 메인 페이지 (1단계) — 골격: 상단의 공지(NoticeBar) + 임시 본문 자리표시.
 * 히어로·강점·미리보기 등 본문은 마무리 단계에서 채운다 (PROCESS.md).
 */
export default function HomePage() {
  return (
    <>
      <NoticeBar />

      {/* 임시 히어로 자리표시 — 마무리 단계에서 실제 콘텐츠로 교체 */}
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-primary">{site.name}</p>
          <h1 className="mt-3 text-[clamp(1.9rem,1.2rem+3vw,3rem)] font-extrabold leading-tight text-foreground">
            학생의 성장을 함께하는
            <br className="hidden sm:block" /> 입시·종합 학원
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {site.description}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              상담 신청하기
            </Button>
            <Button href="/programs" variant="secondary" size="lg">
              프로그램 보기
            </Button>
          </div>
        </div>
      </Section>

      {/* 본문 섹션 자리표시 (개발용 안내) */}
      <Section variant="muted">
        <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-background p-8 text-center">
          <p className="text-sm font-semibold text-muted-foreground">
            🚧 1단계: 메인 골격(상단바 · 공지 · 하단바) 완료
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            학원 강점 요약 · 프로그램/강사 미리보기 등 메인 본문은 마무리
            단계에서 채워집니다.
          </p>
        </div>
      </Section>
    </>
  );
}
