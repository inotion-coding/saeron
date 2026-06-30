import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import { cta } from "@/lib/data/home";

/**
 * 상담 CTA — DESIGN.md §5. 라이트 톤(paper), 박스 없이 열린 형태로 깔끔하게.
 * 페이지 배경 위에 중앙 정렬된 카피 + 상담 버튼.
 */
export default function CtaBand() {
  return (
    <section data-tone="paper" className="py-[clamp(4.5rem,3.5rem+5vw,8rem)]">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center">
              <span className="h-px w-7 bg-point" aria-hidden="true" />
              {cta.eyebrow}
            </span>

            <h2 className="mt-5 whitespace-pre-line break-keep text-h1 font-extrabold text-foreground">
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
        </Reveal>
      </Container>
    </section>
  );
}
