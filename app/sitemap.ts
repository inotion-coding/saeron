import type { MetadataRoute } from "next";
import { fetchPublicTeachers } from "@/lib/content/teachers";

/**
 * sitemap.xml 자동 생성 (정적 export 시 out/sitemap.xml 로 출력).
 * 검색엔진에 "이 사이트의 전체 페이지 목록"을 알려 수집 누락을 막는다.
 * - 고정 페이지 + 공지/강사 상세 페이지를 데이터에서 자동 수집
 * - trailingSlash 설정에 맞춰 경로 끝에 / 유지
 */
const SITE_URL = "https://saeronedu.com";

// 정적 export(output:'export')에서 sitemap.xml 파일로 출력되도록 강제
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "/", // 메인
    // "/about/",  ← 학원 소개는 아직 페이지가 없다(app/about 비어 있음).
    //               없는 주소를 사이트맵에 넣으면 검색엔진이 404를 계속 수집하므로,
    //               페이지를 만든 뒤에 이 줄을 되살릴 것.
    "/programs/", // 프로그램
    "/schedule/", // 수업 시간표
    "/teachers/", // 강사 소개
    "/notices/", // 공지
    "/contact/", // 상담 문의
  ];

  // 공지 상세는 개별 주소 없이 라이트박스로 표시 → 사이트맵엔 /notices/ 만.
  // 강사 상세는 개별 주소 유지 → Supabase(공개 강사)에서 수집.
  const teachers = await fetchPublicTeachers();
  const teacherPaths = teachers.map((t) => `/teachers/${t.id}/`);

  const all = [...staticPaths, ...teacherPaths];

  return all.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
