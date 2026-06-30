/**
 * 공지 데이터 (더미) — 메인 NoticeBar 및 향후 공지 목록에서 사용.
 * TODO(content): 실제 공지로 교체. date는 ISO(YYYY-MM-DD).
 */

export type Notice = {
  id: string;
  title: string;
  date: string;
  href?: string;
  pinned?: boolean;
};

export const notices: Notice[] = [
  {
    id: "2026-spring-enroll",
    title: "2026학년도 봄학기 신입생 모집 안내",
    date: "2026-02-20",
    href: "/contact",
    pinned: true,
  },
  {
    id: "level-test",
    title: "신규 레벨테스트 일정 안내 (매주 토요일)",
    date: "2026-02-10",
    href: "/contact",
  },
  {
    id: "schedule-update",
    title: "수업 시간표 일부 변경 공지",
    date: "2026-01-30",
    href: "/schedule",
  },
];

/** 노출 순서대로 정렬된 공지 목록 (고정 우선, 그다음 최신순) */
export function getSortedNotices(): Notice[] {
  return [...notices].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.date.localeCompare(a.date);
  });
}

/** 가장 위에 노출할 공지(고정 우선, 없으면 최신순 첫 항목) */
export function getLatestNotice(): Notice | undefined {
  return getSortedNotices()[0];
}
