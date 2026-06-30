import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { hero, stats } from "@/lib/data/home";

/**
 * 히어로 (홈 센터피스) — DESIGN.md §5
 * 배경은 PageBackdrop(paper). 브랜드(네이비/틸) 데코 + 신뢰 지표 스트립.
 */
export default function Hero() {
  return (
    <section
      id="about"
      data-tone="paper"
      className="relative scroll-mt-20 overflow-hidden"
    >
      {/* 브랜드 데코 — 토큰 기반, 정적 (backdrop 위, 콘텐츠 아래) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-brand-blue/8 blur-3xl" />
        <div className="absolute top-24 left-[-8%] h-80 w-80 rounded-full bg-accent-bright/12 blur-3xl" />
        <div className="absolute bottom-0 right-[8%] h-72 w-72 rounded-full bg-point/8 blur-3xl" />
      </div>

      <Container className="relative z-10 py-[clamp(5.5rem,3.5rem+8vw,11rem)]">
        <Reveal className="mx-auto max-w-4xl text-center">
          <span className="eyebrow justify-center">
            <span className="h-px w-7 bg-point" aria-hidden="true" />
            {hero.eyebrow}
          </span>

          <h1 className="mt-6 text-balance break-keep text-display font-extrabold text-foreground">
            {hero.title}
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lead text-muted-foreground">
            {hero.description}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={hero.primary.href} size="lg" withArrow>
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary" size="lg">
              {hero.secondary.label}
            </Button>
          </div>
        </Reveal>

        {/* 신뢰 지표 — 박스 없이 골드 얇은 선으로만 구분 */}
        <Reveal delay={150}>
          <dl className="mx-auto mt-20 grid max-w-4xl grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-1 px-4 py-4 text-center border-point ${
                  i % 2 === 1 ? "border-l" : ""
                } ${i >= 2 ? "border-t" : ""} md:border-t-0 ${
                  i === 0 ? "md:border-l-0" : "md:border-l"
                }`}
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
        </Reveal>
      </Container>
    </section>
  );
}
