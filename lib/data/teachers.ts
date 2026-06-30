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
 * 5) subjectGroup(필터 분류)은 "국어" | "수학" | "영어" | "탐구" 중 하나.
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
 *      career: "○○ 출강 · 10년차",
 *      education: ["○○대학교 ○○학과"],
 *      experience: ["현 새론학원 ○○ 전임"],
 *      achievements: ["○○ 다수 배출"],
 *      books: ["『○○』 집필"],
 *    },
 * ──────────────────────────────────────────────────────────────────
 */

// ─── 타입 정의 (수정하지 마세요) ──────────────────────────────────
export type Division = "middle" | "high";
export type SubjectGroup = "국어" | "수학" | "영어" | "탐구";

export type Teacher = {
  id: string;
  name: string;
  photo?: string; // 3:4 인물 사진 경로 (public 기준, 예: "/teachers/name.jpg")
  divisions: Division[]; // 소속 부 (복수 가능)
  subjectGroup: SubjectGroup; // 필터용 과목군
  subject: string; // 표시용 담당 과목 (예: "수능 국어")
  career: string; // 카드 표면 핵심 경력 1줄
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

export const SUBJECT_GROUPS: SubjectGroup[] = ["국어", "수학", "영어", "탐구"];

// ════════════════════════════ ✏️ 여기부터 ════════════════════════════
// 강사 정보를 여기에 추가하세요. (현재 비어 있음)
export const teachers: Teacher[] = [];
// ════════════════════════════ ✋ 여기까지 ════════════════════════════

// ─── 조회 함수 (수정하지 마세요) ──────────────────────────────────
export function getTeachers(): Teacher[] {
  return teachers;
}

export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find((t) => t.id === id);
}
