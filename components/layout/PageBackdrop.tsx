/**
 * 페이지 배경 레이어 (DESIGN.md §9)
 * fixed 풀뷰포트. --page-bg(스크롤 톤)에 따라 배경색을 부드럽게 보간한다.
 * 실제 색/전환은 globals.css 의 .page-backdrop 에 정의.
 */
export default function PageBackdrop() {
  return <div aria-hidden="true" className="page-backdrop" />;
}
