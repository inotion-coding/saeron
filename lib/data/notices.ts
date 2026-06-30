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
  {
    id: "2026-spring-enroll",
    title: "2026학년도 봄학기 신입생 모집 안내",
    date: "2026-02-20",
    featured: true,
    images: ["/notices/2026-spring-enroll.jpg"],
    content:
      "2026학년도 봄학기 신입생을 모집합니다. 자세한 내용은 포스터를 확인하시고, 문의는 상담을 통해 안내해 드립니다.",
  },
  {
    id: "level-test",
    title: "신규 레벨테스트 일정 안내",
    date: "2026-02-12",
    featured: true,
    images: ["/notices/level-test.jpg"],
    content: "신규 등록 전 레벨테스트를 매주 토요일 오전에 진행합니다.",
  },
  {
    id: "suneung-final",
    title: "2026 수능 대비 파이널 특강 개설",
    date: "2026-02-05",
    featured: true,
    images: [
      "/notices/suneung-final-1.jpg",
      "/notices/suneung-final-2.jpg",
      "/notices/suneung-final-3.jpg",
    ],
    content: "수능을 앞둔 고3·N수생을 위한 파이널 특강을 개설합니다.",
  },
  {
    id: "winter-intensive",
    title: "겨울방학 특강 시간표 안내",
    date: "2026-01-28",
    featured: true,
    images: [
      "/notices/winter-intensive-1.jpg",
      "/notices/winter-intensive-2.jpg",
    ],
    content: "겨울방학 특강 시간표를 안내드립니다. 포스터를 참고해 주세요.",
  },
  {
    id: "parent-counsel-week",
    title: "학부모 상담 주간 운영 안내",
    date: "2026-01-20",
    images: ["/notices/parent-counsel-week.jpg"],
    content: "학부모 상담 주간을 운영합니다. 사전 예약 후 방문해 주세요.",
  },
  {
    id: "studyroom-rules",
    title: "자습실 이용 수칙 안내",
    date: "2026-01-15",
    images: ["/notices/studyroom-rules.jpg"],
    content: "쾌적한 학습 환경을 위한 자습실 이용 수칙을 안내드립니다.",
  },
  {
    id: "lunar-holiday",
    title: "설 연휴 휴원 안내",
    date: "2026-01-10",
    images: ["/notices/lunar-holiday.jpg"],
    content: "설 연휴 기간 동안 휴원합니다. 자세한 일정은 본문을 확인해 주세요.",
  },
  {
    id: "march-mock-exam",
    title: "3월 정기 모의고사 시행 안내",
    date: "2026-01-05",
    images: ["/notices/march-mock-exam.jpg"],
    content: "3월 정기 모의고사 시행 일정을 안내드립니다.",
  },
  {
    id: "new-semester-books",
    title: "신학기 교재 배부 안내",
    date: "2025-12-28",
    images: ["/notices/new-semester-books.jpg"],
    content: "신학기 교재 배부 일정을 안내드립니다.",
  },
  {
    id: "award-ceremony",
    title: "우수 학생 시상식 안내",
    date: "2025-12-20",
    images: ["/notices/award-ceremony.jpg"],
    content: "우수 학생 시상식을 진행합니다.",
  },
  {
    id: "shuttle-route",
    title: "학원 차량 운행 노선 안내",
    date: "2025-12-12",
    images: ["/notices/shuttle-route.jpg"],
    content: "학원 차량 운행 노선을 안내드립니다.",
  },
  {
    id: "facility-maintenance",
    title: "시설 점검에 따른 임시 휴원 안내",
    date: "2025-12-05",
    images: ["/notices/facility-maintenance.jpg"],
    content: "시설 점검을 위해 임시 휴원합니다.",
  },
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
