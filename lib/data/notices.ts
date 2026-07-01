/**
 * 공지 데이터 (더미) — 메인 배너 슬라이드, /notices(목록·상세)에서 사용.
 * 공지는 제목 + 포스터(이미지) 중심. images[0]=대표사진(목록·배너 썸네일).
 * 현재 이미지는 예시(placeholder, public/notices/*.jpg) — 실제 포스터로 교체.
 * TODO(content): 실제 공지/포스터로 교체. date는 ISO(YYYY-MM-DD).
 */

export type Notice = {
  id: string;
  title: string;
  date: string;
  content: string;
  images?: string[]; // 포스터 경로들. images[0]=대표사진. 미지정 시 플레이스홀더
  featured?: boolean; // 메인 배너 슬라이드 + 공지 하단 연결 슬롯 노출
};

export const notices: Notice[] = [
  // TODO(content): 실제 공지를 여기에 추가한다. (임시 더미 공지는 전부 삭제됨)
  // 예시 형식:
  // {
  //   id: "고유-id",              // URL 경로가 됨 (영문/숫자/하이픈)
  //   title: "공지 제목",
  //   date: "2026-07-01",          // YYYY-MM-DD
  //   featured: true,              // 메인 배너 슬라이드에 노출하려면 true
  //   images: ["/notices/파일명.jpg"], // 포스터 이미지(첫 번째가 대표사진)
  //   content: "본문 내용",
  // },
];

/** 전체 공지 (최신순) */
export function getSortedNotices(): Notice[] {
  return [...notices].sort((a, b) => b.date.localeCompare(a.date));
}

/** 메인 배너·하단 연결 슬롯용 featured 공지 (최신순, 최대 5개) */
export function getFeaturedNotices(): Notice[] {
  return getSortedNotices()
    .filter((n) => n.featured)
    .slice(0, 5);
}

/** id로 공지 조회 (상세 페이지용) */
export function getNoticeById(id: string): Notice | undefined {
  return notices.find((n) => n.id === id);
}
