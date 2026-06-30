import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { hero, stats } from "@/lib/data/home";

/**
 * 히어로 (홈 센터피스) — DESIGN.md §5
 * 타이포 중심 + 절제된 데코 그라데이션 + 신뢰 지표 스트립.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* 절제된 데코 배경 — 토큰 기반, 정적 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-linear-to-b from-surface to-background" />
        <div className="absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-20 left-[-8%] h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <Container className="py-[clamp(4rem,3rem+6vw,8rem)]">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-6 bg-accent" aria-hidden="true" />
            {hero.eyebrow}
          </span>

          <h1 className="mt-5 whitespace-pre-line text-display font-extrabold text-foreground">
            {hero.title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lead text-muted-foreground">
            {hero.description}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={hero.primary.href} size="lg" withArrow>
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary" size="lg">
              {hero.secondary.label}
            </Button>
          </div>
        </div>

        {/* 신뢰 지표 스트립 */}
        <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border shadow-card md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 bg-background px-4 py-7 text-center"
            >
              <dt className="order-2 text-sm text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="order-1 text-[clamp(1.75rem,1.3rem+1.4vw,2.5rem)] font-extrabold tracking-tight text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
