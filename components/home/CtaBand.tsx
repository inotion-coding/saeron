import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { cta } from "@/lib/data/home";

/**
 * 상담 CTA — DESIGN.md §5. 톤 deep.
 * 스크롤이 이 구간에 닿으면 PageBackdrop 이 딥 네이비로 전환되고,
 * 콘텐츠는 그 위에 글래스 패널로 떠 있는 형태. 상담(전환) 유도.
 */
export default function CtaBand() {
  return (
    <section data-tone="deep" className="py-[clamp(5.5rem,4rem+6vw,9rem)]">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-white/5 px-6 py-[clamp(3.5rem,2.5rem+4vw,6rem)] text-center backdrop-blur-sm sm:px-12">
            {/* 데코 */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-point-bright/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-brand-blue/30 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-point-bright">
                <span className="h-px w-7 bg-point-bright" aria-hidden="true" />
                {cta.eyebrow}
              </span>

              <h2 className="mt-4 whitespace-pre-line text-h1 font-extrabold text-white">
                {cta.title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lead text-white/75">
                {cta.description}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href={cta.primary.href} variant="inverse" size="lg" withArrow>
                  {cta.primary.label}
                </Button>
                <Button
                  href={cta.secondary.href}
                  size="lg"
                  className="border border-white/25 bg-transparent text-white hover:bg-white/10"
                >
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
