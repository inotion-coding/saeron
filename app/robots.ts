import type { MetadataRoute } from "next";

/**
 * robots.txt 자동 생성 (정적 export 시 out/robots.txt 로 출력).
 * - 모든 검색로봇 전체 허용
 * - sitemap 위치 안내 → 구글/네이버가 페이지 목록을 한 번에 수집
 */
const SITE_URL = "https://saeronedu.com";

// 정적 export(output:'export')에서 robots.txt 파일로 출력되도록 강제
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
