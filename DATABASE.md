# 새론학원 관리자 — 데이터베이스 · 권한 설계도 (DATABASE.md)

> 관리자 페이지(로그인 + 3단계 권한)의 **Supabase 스키마·RLS·스토리지** 설계를 한곳에 기록한다.
> 스키마가 커질수록 이 문서를 **단일 출처**로 유지한다. 표·규칙 변경 시 반드시 여기부터 갱신.
> 관련 배경: CLAUDE.md, 결정 이력(메모리 `admin-plan-supabase`).

**상태**: 🟢 설계 확정 (§10 결정 완료). 다음 단계 = §11 SQL 작성·실행.

---

## 0. 큰 그림

- **호스팅**: 현 GitHub Pages 정적 사이트 유지. 로그인·데이터·권한은 **Supabase**가 담당.
- **보안 원칙**: 접근 제어는 **Supabase 서버의 RLS(Row Level Security)** 가 강제 → 브라우저에서 우회 불가.
- **반영**: 즉시(승인 절차 없음). 공개 페이지가 Supabase 데이터를 읽어 바로 표시.
- **등급**: `1`=개발자(전체), `2`=원장·실장, `3`=선생님. 숫자로 저장(작을수록 상위 → 규칙에서 `level <= 2` 형태로 사용).

---

## 1. 계정 · 등급 (profiles)

Supabase 기본 `auth.users`(로그인 계정) + 우리 정보 테이블 `public.profiles`(1:1).

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK, FK→auth.users) | 로그인 계정 id |
| `level` | int (1·2·3) | 등급 |
| `name` | text | 표시 이름 |
| `teacher_id` | uuid (FK→teachers, null 가능) | "본인" 강사 연결. 3급은 필수, 1·2급도 강사면 연결 |
| `is_active` | bool (기본 true) | 비활성(로그인 차단)용 |
| `created_at` | timestamptz | 생성 시각 |

- 이메일·비밀번호는 `auth.users`가 보관(여기 저장 안 함).
- **원장/실장이 강사이기도 함**(예: 이병언·서승원) → 1·2급도 `teacher_id` 연결 가능.
- 3급의 "본인 것만" 권한은 이 `teacher_id`로 판별.

### 1-1. 로그인 방식 — (과목 + 이름 + 비밀번호)
계정은 1·2급이 추가하므로 **이메일 로그인 대신 과목·이름·비밀번호**로 로그인. (`supabase/login.sql`)
- `login_directory(email, subject, name)`: (과목,이름) → 내부 로그인 이메일 매핑. **비밀번호는 저장 안 함.** 관리자(level≤2)만 관리.
- `resolve_login_email(subject, name)`: security definer 함수(anon 실행 허용) — 목록 노출 없이 **정확 매칭 이메일 1건**만 반환.
- 로그인 흐름: 폼에서 (과목,이름)→이메일 조회 → `signInWithPassword(email, 비번)` → 성공 시 `/admin/dashboard`.
- 현재 1급(개발자)은 과목="관리자", 이름="개발자"로 매핑.

---

## 2. 강사 (teachers) — 기존 lib/data/teachers.ts 이관

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK) | 내부 식별자 |
| `slug` | text (unique) | URL용 (`/teachers/<slug>`, 예: `choi-yongsu`) |
| `name` | text | 이름 |
| `photo_path` | text (null) | Storage 사진 경로 (없으면 기본 실루엣) |
| `divisions` | text[] | `middle`/`high` (복수) |
| `subject_group` | text | `국어`·`수학`·`영어`·`사회`·`과학` (check 제약) |
| `subject` | text | 표시용 담당 과목 |
| `resolve` | text | 각오 한마디 |
| `education` | text[] | 학력 |
| `experience` | text[] | 이력 |
| `achievements` | text[] | 실적 (선택) |
| `books` | text[] | 저서 (선택) |
| `sort_order` | int | 목록 정렬 순서 |
| `is_visible` | bool (기본 true) | 삭제 없이 숨김 |

---

## 3. 공지 (notices) — 기존 lib/data/notices.ts 이관

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK) | 내부 식별자 |
| `slug` | text (unique) | URL용 (`/notices/<slug>`) |
| `title` | text | 제목 |
| `content` | text | 본문(없으면 빈 문자열) |
| `notice_date` | date | 공지 날짜 |
| `images` | text[] | 포스터 Storage 경로들. `images[0]`=대표 |
| `is_featured` | bool | 메인 배너 노출 |
| `created_at` | timestamptz | 생성 시각 |

---

## 4. 시간표 (2개 테이블) — 기존 lib/data/schedule.ts 구조 반영

시간표는 "강사 단위" + 그 아래 "행"으로 되어 있어 두 테이블로 나눔. (현재 콘텐츠는 리셋 → 빈 상태로 시작해 천천히 채움)

### 4-1. schedule_teachers (강사 단위 묶음)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK) | |
| `teacher_id` | uuid (FK→teachers, null) | 프로필 있는 강사면 연결(이름 링크·본인권한 판별) |
| `display_name` | text | 표시 이름(프로필 없는 외부 강사 포함) |
| `subject_group` | text | 국어·수학·… |
| `note` | text (null) | 강사 단위 비고(예: "외고 전담") |
| `sort_order` | int | 정렬 |

### 4-2. schedule_rows (개별 수업 행)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK) | |
| `schedule_teacher_id` | uuid (FK→schedule_teachers) | 소속 묶음 |
| `target` | text | 대상(일반고1/외고1·2·3/2학기 대비반 등) |
| `division` | text | `middle`/`high` (필터용) |
| `course` | text (null) | 반/과목 구분 |
| `content` | text (null) | 내용 |
| `time_text` | text | 요일·시간(원문 보존) |
| `open_date` | text (null) | 개강일(예: "7/11") |
| `note` | text (null) | 행 비고 |
| `sort_order` | int | 정렬 |

### 4-3. common_notices (시간표 공통 안내)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK) | |
| `text` | text | 안내 문구 |
| `sort_order` | int | 정렬 |

---

## 5. 스토리지 (이미지 업로드)

| 버킷 | 공개 | 용도 |
|------|------|------|
| `teacher-photos` | 읽기 공개 | 강사 사진 |
| `notice-images` | 읽기 공개 | 공지 포스터 |

- 업로드(쓰기)는 로그인 등급 규칙 적용. 읽기는 누구나(공개 사이트 표시용).

---

## 6. 권한 규칙 (RLS) 매트릭스

보조 함수(서버): `current_level()` = 내 등급, `current_teacher_id()` = 내 연결 강사 id.

| 테이블 | 읽기(SELECT) | 추가(INSERT) | 수정(UPDATE) | 삭제(DELETE) |
|--------|------|------|------|------|
| **teachers** | 공개(숨김 제외)·로그인은 전체 | level≤2 | level≤2 **또는** level3 & 본인(id=내 teacher) | level≤2 |
| **notices** | 공개 | level≤2 | level≤2 | level≤2 |
| **schedule_teachers** | 공개 | level≤2 | level≤2 **또는** level3 & 본인 | level≤2 |
| **schedule_rows** | 공개 | level≤2 또는 level3&본인(부모 기준) | 동左 | 동左 |
| **common_notices** | 공개 | level≤2 | level≤2 | level≤2 |
| **profiles** | 본인 + level≤2는 전체 | (Edge Function) | 본인 이름만 / 등급·연결은 Edge Function | (Edge Function) |

- **계정·등급 변경은 RLS로 직접 하지 않고 Edge Function(아래 7)에서 규칙 강제** → 등급 조작·권한 상승 방지.

---

## 7. 계정 관리 — 단계적 (수동 먼저 → 나중에 Edge Function)

정적 사이트에는 **비밀키(service_role)** 를 둘 수 없다(노출 위험). 그래서 계정 생성·삭제는 서버 쪽에서 처리해야 한다. 초기에는 대시보드 수동, 이후 Edge Function으로 앱 내 관리.

- **Phase A (현재)**: 공개 회원가입 **끔**. 초기 계정(1급·필요한 2급)은 **Supabase 대시보드에서 수동 생성** + `profiles` 행 수동 입력. 로그인부터 빠르게 확인.
  - 비밀번호 재설정: **상위 등급(1·2급)이 임시 비번을 설정**해 전달(대시보드 Auth). 이메일 발송 불필요.
- **Phase B (후속)**: Edge Function으로 앱 내 계정 관리.
  - `admin-create-user`: 호출자 level≤2 확인 → 계정+profiles 생성. **2급은 3급만** 생성(코드 강제).
  - `admin-update-user`: 등급·활성/비활성·연결 강사 변경(권한 검사).
  - `admin-set-password`: 상위가 임시 비번 설정.

---

## 8. 공개 페이지 데이터 읽기

정적 사이트 + 즉시 반영 → 공개 페이지는 **브라우저에서 Supabase를 직접 읽어** 표시(공지·강사·시간표). 마케팅용 고정 텍스트(홈/소개)는 그대로 코드 유지.
- 참고(트레이드오프): 클라이언트 로딩이라 초기 HTML에 콘텐츠가 없어 **검색엔진 노출(SEO)** 이 약해질 수 있음 → 필요 시 후속 최적화(사전 렌더/재빌드) 검토.

---

## 9. 마이그레이션(초기 데이터 시드)

- **강사**: 현 `teachers.ts` 12명 → `teachers` 시드(slug·순서 보존, 사진은 Storage 업로드 후 경로 연결).
- **공지**: 현 `notices.ts` → `notices` 시드(이미지 Storage 이관).
- **시간표**: 리셋 상태 → 빈 채로 시작(추후 입력).
- **계정**: 초기 1급(개발자) 1개 + 필요한 2급 시드.

---

## 10. 결정 완료 (2026-07-02)

1. **계정 만들기(초기)**: ✅ **수동(대시보드) 먼저** → 후속 Edge Function으로 앱 내 관리 추가. (§7)
2. **비밀번호 재설정**: ✅ **상위 등급이 임시 비번 설정**(이메일 불필요).
3. **강사 숨김 토글(is_visible)**: ✅ 사용.
4. **공통 안내(common_notices)**: ✅ 관리 대상 포함.
5. **1·2급 강사 연결**: ✅ `teacher_id` 연결(원장·실장이 강사이기도 함).

→ 확정. 다음: **§11 SQL 작성·실행.**

---

## 11. 진행 로그 (변경 이력)

- 2026-07-02: 초안 작성(스키마·RLS·스토리지·Edge Function·마이그레이션·오픈이슈 정리). 키 연결(1단계) 완료 상태.
- 2026-07-02: §10 결정 완료(계정 수동먼저·임시비번·숨김토글·공통안내 포함·1·2급 강사연결). 설계 확정 → SQL 작성 단계.
- 2026-07-02: `supabase/schema.sql` 작성(테이블 6 + 보조함수 + RLS + 스토리지 버킷/정책). 실행 대기 → 이후 Auth 회원가입 끄기·1급 계정 생성·seed.sql.
- 2026-07-02: schema.sql 실행 완료 + 1급 계정 생성/등급 부여. 접속 게이트(`/admin`)·SiteChrome 구현.
- 2026-07-02: 로그인 방식 확정(과목+이름+비번). `supabase/login.sql`(login_directory + resolve_login_email + 개발자 매핑), 로그인 폼·대시보드(`/admin/login`·`/admin/dashboard`) 구현. login.sql 실행 → 로그인 동작 확인.
- 2026-07-02: 공지 관리(`/admin/notices`, NoticesAdmin) 구현 — notices CRUD + Storage(notice-images) 포스터 업로드(level≤2). 대시보드에 메뉴 추가.
- 2026-07-02: 공지 공개 연결 완료 — 홈 배너(NoticeBar)·/notices(NoticeList)가 Supabase 클라 조회로 즉시 반영. 상세는 **포스터 크게보기 라이트박스**(개별 주소 제거: `/notices/[id]` 삭제, sitemap 반영). `lib/content/notices.ts` 조회 모듈, `lib/data/notices.ts`는 타입만. 기존 공지 3건은 관리자에서 재등록 예정.
- 2026-07-02: 강사 관리(`/admin/teachers`, TeachersAdmin) + 기존 12명 이전 완료. 공개 `/teachers` 목록·상세를 Supabase로 연결(**개별 주소 유지** — `lib/content/teachers.ts` 서버/빌드 조회, generateStaticParams·sitemap도 Supabase). dev는 요청마다 최신, 정적 export는 **빌드 시점** 반영(재배포 필요). ⚠️ **배포 전 GitHub Actions 빌드에 NEXT_PUBLIC_SUPABASE_URL/ANON_KEY 주입 필요**(빌드 때 강사 페이지가 Supabase를 읽으므로).
- 2026-07-02: 시간표 관리(`/admin/schedule`, ScheduleAdmin) — 강사묶음+수업행+공통안내 CRUD + 기존 데이터 가져오기. (공개 `/schedule` 연결은 후속)
- 2026-07-02: 계정 관리(Phase B) — `supabase/accounts.sql`(login_directory.user_id 연결·삭제연쇄) + Edge Function `admin-users`(create/delete/setPassword, 호출자 1·2급 검증·2급은 3급만) + `/admin/accounts`(AccountsAdmin). **배포 필요: accounts.sql 실행 + Edge Function 배포(verify_jwt off 권장, 코드가 자체 인증).** → 배포 완료(CLI, --no-verify-jwt) + 강사 전원 계정(비번 saeronedu) 생성.
- 2026-07-02: 상담 신청 — `supabase/inquiries.sql`(inquiries 테이블; INSERT 공개·SELECT/UPDATE/DELETE 1·2급). 공개 상담 폼(ContactForm)이 Supabase에 저장, `/admin/inquiries`(InquiriesAdmin)에서 1·2급 열람·처리·삭제. **inquiries.sql 실행 필요.**
- 2026-07-02: 시간표 공개 연결 — `lib/content/schedule.ts` + ScheduleView(Supabase client 조회, 즉시반영) + 강사상세 TeacherScheduleSection. teacher_id→slug로 강사 링크. 3급 본인 편집: TeachersAdmin/ScheduleAdmin이 3급이면 본인 강사/시간표만 로드(연결강사 select 숨김), 대시보드에 "내 프로필/내 시간표" 메뉴. RLS가 본인만 수정 강제.
- 2026-07-02: 배포 완료(GitHub Actions deploy.yml에 NEXT_PUBLIC_SUPABASE_URL/ANON_KEY 주입, saeronedu.com 라이브). 강사 페이지는 빌드시 생성→수정 반영엔 재배포 필요.
- 2026-07-02: 3급 본인 시간표 **직접 생성** 허용 — `supabase/schedule-self.sql`(sched_teachers_insert에 3급&본인 추가) + ScheduleAdmin에서 3급도 "내 시간표 만들기"(teacher_id 본인 고정, 이름·과목 자동채움). **schedule-self.sql 실행 필요.**
- 2026-07-02: **시간표 재구성 위해 현행 제거** — 잘못된 초기 데이터로 문제 발생. 데이터 비움(`supabase/schedule-clear.sql`, **테이블·RLS는 유지**) + 시간표 코드 삭제(ScheduleAdmin/ScheduleView/ScheduleRowList/TeacherScheduleSection/lib/content·data schedule.ts, /admin/schedule 라우트). /schedule은 준비중 placeholder, 강사상세 시간표섹션·대시보드 시간표메뉴 제거. UI·구성 새로 만들 예정(git 이력에 복구 가능).
- 2026-07-02: 강사 공개 페이지 **즉시반영 전환** — 빌드타임 렌더였던 강사 목록/상세를 **client 실시간 조회**로(TeacherDirectory 자체fetch, TeacherDetailClient). 개별 주소는 유지(빌드시 shell 생성). → 관리자 강사 수정이 **재배포 없이 즉시** 라이브 반영. (기존엔 강사만 재배포 필요했던 문제 해소. 단 완전히 새 강사 추가는 shell 생성 위해 재배포 필요.)
