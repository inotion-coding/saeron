/**
 * 공지 타입 정의.
 * 공지 콘텐츠는 이제 Supabase(public.notices)에서 관리하며, 조회는 lib/content/notices.ts 사용.
 * 이 파일은 화면 컴포넌트가 공유하는 Notice 형태(타입)만 제공한다.
 */
export type Notice = {
  id: string; // 화면 key용 식별자(slug 우선)
  title: string;
  date: string; // YYYY-MM-DD
  content: string;
  images?: string[]; // 포스터 이미지 URL들. images[0]=대표
  featured?: boolean; // 메인 배너 노출
};
