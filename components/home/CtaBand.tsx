import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { cta } from "@/lib/data/home";

/**
 * 상담 CTA — DESIGN.md §5. 라이트 톤(paper) — 급격한 색 전환 없이 차분한 마무리.
 * 라이트 패널 위에 골드 eyebrow + 네이비 CTA 버튼.
 */
export default function CtaBand() {
  return (
    <section data-tone="paper" className="py-[clamp(4rem,3rem+5vw,7rem)]">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-background px-6 py-[clamp(3.5rem,2.5rem+4vw,6rem)] text-center shadow-card sm:px-12">
            {/* 절제된 데코 */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent-bright/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-point/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-point">
                <span className="h-px w-7 bg-point" aria-hidden="true" />
                {cta.eyebrow}
              </span>

              <h2 className="mt-4 whitespace-pre-line break-keep text-h1 font-extrabold text-foreground">
                {cta.title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lead text-muted-foreground">
                {cta.description}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href={cta.primary.href} size="lg" withArrow>
                  {cta.primary.label}
                </Button>
                <Button href={cta.secondary.href} variant="secondary" size="lg">
                  {cta.secondary.label}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
