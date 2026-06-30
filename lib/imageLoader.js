/**
 * next/image 커스텀 로더 — 정적 export + 프로젝트 사이트(basePath) 대응.
 * next/image는 basePath를 이미지 src에 자동으로 붙이지 않으므로, 여기서 직접 붙인다.
 * dev: NEXT_PUBLIC_BASE_PATH="" → 경로 그대로 / 빌드: "/saeron" → 접두.
 * 외부(http) URL은 그대로 둔다.
 */
export default function imageLoader({ src }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (/^https?:\/\//.test(src)) return src;
  return `${base}${src}`;
}
