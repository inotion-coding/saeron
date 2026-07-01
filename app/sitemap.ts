import type { MetadataRoute } from "next";
import { notices } from "@/lib/data/notices";
import { teachers } from "@/lib/data/teachers";

/**
 * sitemap.xml 자동 생성 (정적 export 시 out/sitemap.xml 로 출력).
 * 검색엔진에 "이 사이트의 전체 페이지 목록"을 알려 수집 누락을 막는다.
 * - 고정 페이지 + 공지/강사 상세 페이지를 데이터에서 자동 수집
 * - trailingSlash 설정에 맞춰 경로 끝에 / 유지
 */
const SITE_URL = "https://saeronedu.com";

// 정적 export(output:'export')에서 sitemap.xml 파일로 출력되도록 강제
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/", // 메인
    "/about/", // 학원 소개
    "/programs/", // 프로그램
    "/schedule/", // 수업 시간표
    "/teachers/", // 강사 소개
    "/notices/", // 공지
    "/contact/", // 상담 문의
  ];

  const noticePaths = notices.map((n) => `/notices/${n.id}/`);
  const teacherPaths = teachers.map((t) => `/teachers/${t.id}/`);

  const all = [...staticPaths, ...noticePaths, ...teacherPaths];

  return all.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
