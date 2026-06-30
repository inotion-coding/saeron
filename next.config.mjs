/**
 * 정적 사이트(static export) 설정 — 깃허브 페이지 등 정적 호스팅 배포용.
 * `next build` 시 out/ 폴더에 순수 HTML/CSS/JS 생성.
 * - output: 'export'  → 서버 없이 파일만으로 동작
 * - images.unoptimized → 정적 호스팅은 이미지 최적화 서버가 없으므로 원본 서빙(사진은 사전 압축됨)
 * - trailingSlash     → 라우트별 index.html 생성(Pages 경로 안정)
 * - basePath          → 프로젝트 사이트 하위 경로 대응용. 커스텀 도메인(saeronedu.com)을
 *                       루트로 연결했으므로 비움(""). github.io/saeron 임시주소만 쓸 땐 "/saeron".
 *
 * @type {import('next').NextConfig}
 */
const REPO_BASE = ""; // 커스텀 도메인 루트 서빙 → basePath 없음
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProd ? REPO_BASE : "",
  // basePath는 이미지 src에 자동 적용되지 않음 → 커스텀 로더로 직접 접두(아래 env 사용)
  env: { NEXT_PUBLIC_BASE_PATH: isProd ? REPO_BASE : "" },
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.js",
  },
  trailingSlash: true,
};

export default nextConfig;
