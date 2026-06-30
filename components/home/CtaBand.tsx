import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { cta } from "@/lib/data/home";

/**
 * 상담 CTA 밴드 — DESIGN.md §5
 * primary 배경 풀밴드 + 절제된 데코, 전환(상담) 유도.
 */
export default function CtaBand() {
  return (
    <section className="bg-background py-[clamp(3rem,2rem+4vw,6rem)]">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-primary px-6 py-[clamp(3rem,2rem+4vw,5rem)] text-center sm:px-12">
          {/* 데코 */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-accent">
              <span className="h-px w-6 bg-accent" aria-hidden="true" />
              {cta.eyebrow}
            </span>

            <h2 className="mt-4 whitespace-pre-line text-h1 font-extrabold text-primary-foreground">
              {cta.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lead text-primary-foreground/75">
              {cta.description}
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={cta.primary.href} variant="inverse" size="lg" withArrow>
                {cta.primary.label}
              </Button>
              <Button
                href={cta.secondary.href}
                size="lg"
                className="border border-white/25 bg-transparent text-primary-foreground hover:bg-white/10"
              >
                {cta.secondary.label}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
