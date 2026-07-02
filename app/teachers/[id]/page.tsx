import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import TeacherDetailClient from "@/components/teachers/TeacherDetailClient";
import {
  fetchPublicTeachers,
  fetchPublicTeacherBySlug,
} from "@/lib/content/teachers";

type Params = { params: Promise<{ id: string }> };

// 빌드 시 강사 slug별 페이지(shell) 생성 (개별 주소 유지)
export async function generateStaticParams() {
  const teachers = await fetchPublicTeachers();
  return teachers.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const teacher = await fetchPublicTeacherBySlug(id);
  return { title: teacher ? `${teacher.name} 선생님` : "강사 소개" };
}

/**
 * 강사 상세 — shell은 빌드 시 생성(주소·SEO 유지), 내용은 client(TeacherDetailClient)가
 * Supabase에서 실시간 조회 → 관리자 수정이 재배포 없이 즉시 반영.
 */
export default async function TeacherDetailPage({ params }: Params) {
  const { id } = await params;
  return (
    <Section tone="paper">
      <TeacherDetailClient slug={id} />
    </Section>
  );
}
