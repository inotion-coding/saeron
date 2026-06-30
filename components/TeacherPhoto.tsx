import Image from "next/image";
import type { Teacher } from "@/lib/data/teachers";

/**
 * 강사 인물 사진 (3:4, 균일 무채색 톤) — DESIGN.md §6 (강사)
 * photo 미지정 시 인물 실루엣 플레이스홀더.
 */
export default function TeacherPhoto({
  teacher,
  sizes = "(max-width: 640px) 50vw, 280px",
  className = "",
  imgClassName = "",
}: {
  teacher: Teacher;
  sizes?: string;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden bg-surface-2 ${className}`}
    >
      {teacher.photo ? (
        <Image
          src={teacher.photo}
          alt={teacher.name}
          fill
          sizes={sizes}
          className={`object-cover ${imgClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/45">
          <svg
            width="46"
            height="46"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8.5" r="3.6" />
            <path d="M5.5 20.5c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
          </svg>
        </div>
      )}
    </div>
  );
}
