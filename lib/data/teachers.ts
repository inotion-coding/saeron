/**
 * 강사진 데이터 (더미) — /teachers 디렉토리·상세에서 사용.
 * 1차 필터: 부(중등부/고등부), 2차 필터: 과목(전체/국어/수학/영어/탐구).
 * 사진은 3:4 인물(균일 무채색 톤). photo 미지정 시 플레이스홀더.
 * TODO(content): 실제 강사 정보/사진으로 교체.
 */

export type Division = "middle" | "high";
export type SubjectGroup = "국어" | "수학" | "영어" | "탐구";

export type Teacher = {
  id: string;
  name: string;
  photo?: string; // 3:4 인물 사진 경로
  divisions: Division[]; // 소속 부 (복수 가능)
  subjectGroup: SubjectGroup; // 필터용 과목군
  subject: string; // 표시용 담당 과목 (예: "수능 국어")
  career: string; // 카드 표면 핵심 경력 1줄
  education?: string[]; // 학력
  experience?: string[]; // 출강 이력
  achievements?: string[]; // 합격/수상 실적
  books?: string[]; // 저서
};

export const DIVISIONS: { value: Division; label: string }[] = [
  { value: "middle", label: "중등부" },
  { value: "high", label: "고등부" },
];

export const SUBJECT_GROUPS: SubjectGroup[] = ["국어", "수학", "영어", "탐구"];

export const teachers: Teacher[] = [
  {
    id: "kim-dohyun",
    name: "김도현",
    divisions: ["high"],
    subjectGroup: "국어",
    subject: "수능 국어",
    career: "메가스터디 출강 · 15년차",
    education: ["고려대학교 국어국문학과"],
    experience: ["전 메가스터디 국어 강사", "현 새론학원 고등 국어 전임"],
    achievements: ["수능 국어 1등급 다수 배출"],
    books: ["『국어 독서 전략』 집필"],
  },
  {
    id: "lee-seojun",
    name: "이서준",
    divisions: ["high"],
    subjectGroup: "수학",
    subject: "미적분 · 수능 수학",
    career: "서울대 수학 · 12년차",
    education: ["서울대학교 수리과학부"],
    experience: ["현 새론학원 고등 수학 전임"],
    achievements: ["2025 수능 수학 만점자 11명", "정시 의대 합격 지도"],
    books: ["『미적분 핵심 유형』 저"],
  },
  {
    id: "park-jiwoo",
    name: "박지우",
    divisions: ["high"],
    subjectGroup: "영어",
    subject: "영어 독해",
    career: "EBS 연계 · 10년차",
    education: ["연세대학교 영어영문학과"],
    experience: ["현 새론학원 고등 영어 전임"],
    achievements: ["수능 영어 1등급 향상 사례 다수"],
  },
  {
    id: "choi-yerin",
    name: "최예린",
    divisions: ["high"],
    subjectGroup: "탐구",
    subject: "생활과 윤리 · 사회문화",
    career: "사회탐구 전임 · 9년차",
    education: ["서울대학교 윤리교육과"],
    experience: ["현 새론학원 사회탐구 전임"],
    achievements: ["사탐 1등급 다수 배출"],
  },
  {
    id: "jung-woosung",
    name: "정우성",
    divisions: ["high", "middle"],
    subjectGroup: "수학",
    subject: "수능 수학 · 중등 심화",
    career: "대치 출강 · 14년차",
    education: ["KAIST 수리과학과"],
    experience: ["전 대치 수학 강사", "현 새론학원 수학 전임"],
    achievements: ["중·고 상위권 도약 지도"],
  },
  {
    id: "han-soyeon",
    name: "한소연",
    divisions: ["middle"],
    subjectGroup: "국어",
    subject: "중등 국어 · 독서",
    career: "중등 국어 전임 · 8년차",
    education: ["이화여자대학교 국어교육과"],
    experience: ["현 새론학원 중등 국어 전임"],
    achievements: ["중등 내신 만점 다수"],
  },
  {
    id: "oh-minjae",
    name: "오민재",
    divisions: ["middle"],
    subjectGroup: "수학",
    subject: "중등 수학",
    career: "중등 수학 전임 · 11년차",
    education: ["한양대학교 수학과"],
    experience: ["현 새론학원 중등 수학 전임"],
    achievements: ["고교 선행 우수 지도"],
  },
  {
    id: "yoon-jihoon",
    name: "윤지훈",
    divisions: ["middle"],
    subjectGroup: "영어",
    subject: "중등 영어",
    career: "중등 영어 전임 · 7년차",
    education: ["성균관대학교 영어교육과"],
    experience: ["현 새론학원 중등 영어 전임"],
    achievements: ["중등 내신·서술형 대비"],
  },
  {
    id: "kang-haneul",
    name: "강하늘",
    divisions: ["middle"],
    subjectGroup: "탐구",
    subject: "중등 과학",
    career: "중등 과학 전임 · 6년차",
    education: ["서울시립대학교 환경공학과"],
    experience: ["현 새론학원 중등 과학 전임"],
    achievements: ["과학 내신 향상 지도"],
  },
];

export function getTeachers(): Teacher[] {
  return teachers;
}

export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find((t) => t.id === id);
}
