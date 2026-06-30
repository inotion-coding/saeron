/**
 * 강사진 데이터 — /teachers 목록·상세에서 사용.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ✏️  강사 정보는 아래 `teachers` 배열만 고치면 됩니다.              ║
 * ║      타입·함수 영역(주석으로 표시)은 건드리지 마세요.              ║
 * ║      잘못된 값을 넣으면 에디터가 빨간 줄로 알려줍니다.             ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ── 편집 규칙 ──────────────────────────────────────────────────────
 * 1) 강사 한 명 = 중괄호 한 덩어리 `{ ... },`  → 끝의 쉼표(,)는 꼭 유지.
 * 2) 글자 값은 큰따옴표로 감쌀 것.  예) name: "홍길동"
 * 3) id 는 영문 소문자+하이픈, 강사마다 겹치지 않게. (상세 주소가 됨: /teachers/<id>)
 * 4) divisions(소속 부)는 "middle"(중등부) / "high"(고등부).
 *    한쪽만: ["high"]   /   둘 다: ["middle", "high"]
 * 5) subjectGroup(필터 분류)은 "국어" | "수학" | "영어" | "사회" | "과학" 중 하나.
 * 6) 끝에 ? 가 붙는 항목(photo·education·experience·achievements·books)은
 *    내용이 없으면 그 줄을 통째로 지워도 됩니다.
 * 7) 사진: public/teachers/ 에 이미지를 넣고  photo: "/teachers/파일명.jpg"
 *    줄을 지우면 기본 실루엣이 표시됩니다.
 *
 * ── 새 강사 추가: 아래 템플릿을 복사해 배열에 붙여넣고 값만 교체 ──────
 *    {
 *      id: "hong-gildong",
 *      name: "홍길동",
 *      photo: "/teachers/hong-gildong.jpg",
 *      divisions: ["high"],
 *      subjectGroup: "수학",
 *      subject: "수능 수학",
 *      resolve: "한 명도 포기하지 않고 끝까지 함께 가겠습니다.",
 *      education: ["○○대학교 ○○학과"],
 *      experience: ["현 새론학원 ○○ 전임"],
 *      achievements: ["○○ 다수 배출"],
 *      books: ["『○○』 집필"],
 *    },
 * ──────────────────────────────────────────────────────────────────
 */

// ─── 타입 정의 (수정하지 마세요) ──────────────────────────────────
export type Division = "middle" | "high";
export type SubjectGroup = "국어" | "수학" | "영어" | "사회" | "과학";

export type Teacher = {
  id: string;
  name: string;
  photo?: string; // 3:4 인물 사진 경로 (public 기준, 예: "/teachers/name.jpg")
  divisions: Division[]; // 소속 부 (복수 가능)
  subjectGroup: SubjectGroup; // 필터용 과목군
  subject: string; // 표시용 담당 과목 (예: "수능 국어")
  resolve: string; // 강사 각오 — 학생에게 전하는 다짐 한마디 (카드/상세 헤드라인)
  education?: string[]; // 학력
  experience?: string[]; // 출강 이력
  achievements?: string[]; // 합격/수상 실적
  books?: string[]; // 저서
};

// 필터 라벨 (보통 그대로 두세요) ───────────────────────────────────
export const DIVISIONS: { value: Division; label: string }[] = [
  { value: "middle", label: "중등부" },
  { value: "high", label: "고등부" },
];

export const SUBJECT_GROUPS: SubjectGroup[] = [
  "국어",
  "수학",
  "영어",
  "사회",
  "과학",
];

// ════════════════════════════ ✏️ 여기부터 ════════════════════════════
export const teachers: Teacher[] = [
  {
    id: "lee-byeongeon",
    name: "이병언",
    photo: "/teachers/lee-byeongeon.jpg",
    divisions: ["high"],
    subjectGroup: "수학",
    subject: "고등 수학 전과정",
    resolve: "점수가 나올 때까지 야구빠따로 치겠습니다.",
    education: ["경희대학교 졸업"],
    experience: [
      "전 메가스터디 수학 강사",
      "현 새론학원 수학 강사",
      "현 새론학원 원장",
    ],
  },
  {
    id: "seo-seungwon",
    name: "서승원",
    photo: "/teachers/seo-seungwon.jpg",
    divisions: ["middle"],
    subjectGroup: "수학",
    subject: "중등 수학 전과정",
    resolve:
      "시험의 결과가 다른 이유는 '개념'에 있습니다.\n실전에서 흔들리지 않도록 '개념'부터 바로잡습니다.",
    education: ["경희대학교 졸업"],
    experience: [
      "전 영통 웰쓰리 학원(백산학원) 수학 강사",
      "전 영통 웰쓰리 학원(백산학원) 부원장",
      "현 광교 새론학원 수학 강사",
      "현 광교 새론학원 팀장",
    ],
  },
  {
    id: "oh-jiyoung",
    name: "오지영",
    photo: "/teachers/oh-jiyoung.jpg",
    divisions: ["middle"],
    subjectGroup: "수학",
    subject: "중등 수학 전과정",
    resolve: "클리닉과 정규 수업으로 중등 내신 수학을 완벽하게 대비하겠습니다.",
    education: ["경희대학교 졸업"],
    experience: [
      "전 수지 매직 수학학원 수학 강사",
      "전 영통 열린생각 수학학원 수학 강사",
      "현 광교 새론학원 수학 강사",
    ],
  },
  {
    id: "jo-heeju",
    name: "조희주",
    photo: "/teachers/jo-heeju.jpg",
    divisions: ["high"],
    subjectGroup: "수학",
    subject: "고등 수학 전과정",
    resolve: "강의실에서 받는 과외 같은 수학으로, 성적을 바꾸겠습니다.",
    education: ["경희대학교 졸업"],
    experience: [
      "현 강남 대치 일비 수학학원 원장",
      "현 광교 새론학원 수학 강사",
    ],
  },
  {
    id: "chae-songa",
    name: "채송아",
    photo: "/teachers/chae-songa.jpg",
    divisions: ["high"],
    subjectGroup: "국어",
    subject: "고등 국어 전과정",
    resolve:
      "수원외국어고등학교 10년차 국어 강사로 학년별 최다 수강자 보유 강사입니다.",
    education: ["국어교육학 석사 학위 취득"],
    experience: [
      "전 최강국어논술 전문학원 강사",
      "전 안산동산고등학교 전담 국어 강사",
      "현 새론학원 국어 강사",
      "현 10년차 수원외국어고등학교 국어 전담 강사",
    ],
  },
  {
    id: "han-junho",
    name: "한준호",
    photo: "/teachers/han-junho.jpg",
    divisions: ["high"],
    subjectGroup: "사회",
    subject: "통합사회 / 현대사회와 윤리 / 경제 / 생활과 윤리",
    resolve: "시험에 나오는 것만 콕콕! 고효율 테마학습",
    education: ["연세대학교 졸업"],
    experience: [
      "현 이강학원 (일산, 영통, 수지)",
      "현 광교 새론학원",
      "전 이투스 사회탐구영역 대표강사",
      "전 비타에듀 사회탐구영역 대표강사",
      "전 서울학원 원장",
      "전 종로 사회탐구영역 대표강사",
      "전 메가스터디 사회탐구영역 대표강사",
      "전 위너스터디 사회탐구영역",
      "전 유웨이 중앙교육 모의고사 검토위원",
    ],
  },
  {
    id: "ho-jaeyu",
    name: "호재유",
    photo: "/teachers/ho-jaeyu.jpg",
    divisions: ["high"],
    subjectGroup: "영어",
    subject: "고등 영어 전과정",
    resolve: "올곧게 그리고 효율적으로",
    education: ["한국외국어대학교 졸업"],
    experience: [
      "전 대치이강프리미엄학원 대표강사",
      "전 이강학원",
      "전 메가스터디",
      "현 명인학원 강사",
      "현 서울아카데미학원 강사",
      "현 광교 새론학원 영어 강사",
    ],
  },
  {
    id: "kim-yunsik",
    name: "김윤식",
    divisions: ["high"],
    subjectGroup: "과학",
    subject: "통합과학 / 생명과학",
    resolve: "단순 암기를 벗어나 올바른 추론 능력을 길러, 확실한 1등급을 만듭니다.",
    education: ["KAIST 이학 석사 학위 취득"],
    experience: [
      "전 대성학원 과학 강사",
      "전 반포 베스터디 학원 생명과학 강사",
      "현 반포 아카데미 생명과학 강사",
      "현 대치 FMA 수학학원 생명과학 강사",
      "현 광교 새론학원 통합과학 강사",
      "현 광교 새론학원 생명과학 강사",
    ],
  },
  {
    id: "kim-gidong",
    name: "김기동",
    divisions: ["middle"],
    subjectGroup: "영어",
    subject: "중등 영어 전과정",
    resolve: "입시와 어학원을 경험하며 내린 결론을 모두 전수합니다.",
    experience: [
      "전 대치 토마토 어학원 강사",
      "전 분당 EMI 부원장",
      "전 영통 써미트 학원 원장",
      "현 광교 새론학원 영어 강사",
    ],
  },
  {
    id: "lee-gimun",
    name: "이기문",
    divisions: ["high"],
    subjectGroup: "영어",
    subject: "고등 영어 전과정",
    resolve: "영어 공부의 시작과 끝",
    experience: [
      "전 강남 코리아헤럴드 어학원 대표 강사",
      "전 영재사관학원 평촌본원 부원장 역임",
      "현 엔터스타이학원 중-고등 영어 대표 강사",
      "현 (주)백발백중 모의고사 변형문제 출제위원",
    ],
  },
];
// ════════════════════════════ ✋ 여기까지 ════════════════════════════

// ─── 조회 함수 (수정하지 마세요) ──────────────────────────────────
export function getTeachers(): Teacher[] {
  return teachers;
}

export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find((t) => t.id === id);
}
