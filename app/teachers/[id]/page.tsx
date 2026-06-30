import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import TeacherPhoto from "@/components/TeacherPhoto";
import { teachers, getTeacherById } from "@/lib/data/teachers";

type Params = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return teachers.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const teacher = getTeacherById(id);
  return { title: teacher ? `${teacher.name} 선생님` : "강사 소개" };
}

export default async function TeacherDetailPage({ params }: Params) {
  const { id } = await params;
  const teacher = getTeacherById(id);
  if (!teacher) notFound();

  const sections = [
    { label: "학력", items: teacher.education },
    { label: "출강 이력", items: teacher.experience },
    { label: "합격 · 수상 실적", items: teacher.achievements },
    { label: "저서", items: teacher.books },
  ].filter((s) => s.items && s.items.length > 0);

  return (
    <Section tone="paper">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/teachers"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          강사 목록
        </Link>

        <Reveal
          as="div"
          className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,17rem)_1fr] sm:gap-10"
        >
          <div>
            <TeacherPhoto
              teacher={teacher}
              sizes="(max-width: 640px) 90vw, 272px"
              className="rounded-[var(--radius-sm)] border border-border"
            />
          </div>

          <div>
            <span className="inline-flex rounded-[var(--radius-sm)] border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {teacher.subject}
            </span>
            <h1 className="mt-3 font-serif text-display font-bold text-foreground">
              {teacher.name}
            </h1>
            <p className="mt-2 text-lead text-muted-foreground">
              {teacher.career}
            </p>

            <dl className="mt-8 space-y-6">
              {sections.map((s) => (
                <div key={s.label} className="border-t border-border pt-5">
                  <dt className="text-sm font-bold uppercase tracking-[0.06em] text-point">
                    {s.label}
                  </dt>
                  <dd className="mt-2">
                    <ul className="space-y-1 text-base leading-relaxed text-foreground/90">
                      {s.items!.map((it, i) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <div className="mt-12 flex border-t border-border pt-8">
          <Button href="/teachers" variant="secondary" withArrow>
            강사 목록으로
          </Button>
        </div>
      </div>
    </Section>
  );
}
