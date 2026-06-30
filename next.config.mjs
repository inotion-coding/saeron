/**
 * 정적 사이트(static export) 설정 — 깃허브 페이지 등 정적 호스팅 배포용.
 * `next build` 시 out/ 폴더에 순수 HTML/CSS/JS 생성.
 * - output: 'export'  → 서버 없이 파일만으로 동작
 * - images.unoptimized → 정적 호스팅은 이미지 최적화 서버가 없으므로 원본 서빙(사진은 사전 압축됨)
 * - trailingSlash     → 라우트별 index.html 생성(Pages 경로 안정)
 * (도메인 연결 전 user.github.io/<repo> 로 미리 볼 경우 basePath 필요 — 저장소명 확정 후 추가)
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
