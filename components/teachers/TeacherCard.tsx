import Link from "next/link";
import type { Teacher } from "@/lib/data/teachers";
import TeacherPhoto from "@/components/TeacherPhoto";

/**
 * 강사 카드 — DESIGN.md §6 (강사)
 * 사진 중심의 미니멀 카드(핵심만): 사진(3:4) · 과목 · 이름 · 강사 각오 1줄.
 * hover 시 사진 살짝 줌 + 하단 "프로필 보기"만 은은히. 상세 이력은 상세 페이지에서.
 * (팀 카드 베스트프랙티스: 적을수록 좋다 — 얼굴 위 정보 과적 지양)
 */
export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <Link
      href={`/teachers/${teacher.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-sm)] border border-border bg-background shadow-card transition-[border-color,box-shadow] duration-200 ease-[var(--ease-out-soft)] hover:border-point hover:shadow-hover"
    >
      <div className="relative overflow-hidden">
        <TeacherPhoto
          teacher={teacher}
          imgClassName="transition-transform duration-[600ms] ease-[var(--ease-out-soft)] group-hover:scale-105"
        />
        {/* hover: 프로필 보기 (얼굴을 가리지 않는 하단 그라데이션 스트립) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-linear-to-t from-black/60 via-black/15 to-transparent px-4 pb-3 pt-10 opacity-0 transition-opacity duration-300 ease-[var(--ease-out-soft)] group-hover:opacity-100">
          <span className="text-sm font-semibold text-white">프로필 보기</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="text-white"
          >
            <path
              d="M3 8h9M8.5 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold text-muted-foreground">
          {teacher.subject}
        </p>
        <h3 className="mt-1.5 text-h3 font-bold text-foreground">
          {teacher.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
          {teacher.resolve}
        </p>
      </div>
    </Link>
  );
}
