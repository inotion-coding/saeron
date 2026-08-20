# PROCESS.md — 새론학원 홈페이지 개발 절차

> 입시/종합 학원 **"새론학원"** 홈페이지의 개발 절차·로드맵 문서.
> 디자인 명세는 [DESIGN.md](DESIGN.md), 작업 규칙은 [CLAUDE.md](CLAUDE.md) 참조.

---

## 1. 프로젝트 개요

- **무엇**: 입시/종합 학원 "새론학원"의 공식 소개 웹사이트
- **목적**
  - 학원 정보(교육 철학·강사·프로그램·시간표)를 명확히 전달
  - 방문자를 **상담 문의**로 유도 (핵심 전환 목표)
- **대상 사용자**: 학부모(주 결정권자), 학생
- **범위**: 정보 제공형 소개 사이트 + 상담 문의 폼 (초기엔 로그인/결제 없음)

---

## 2. 기술 스택

| 영역 | 선택 | 비고 |
|------|------|------|
| 프레임워크 | **Next.js (App Router)** | SSG 중심, 향후 확장 용이 |
| 언어 | **TypeScript** | 타입 안정성 |
| UI | **React** | Next.js 내장 |
| 스타일 | **Tailwind CSS** | 디자인 토큰을 CSS 변수 + Tailwind 테마로 연결 (DESIGN.md §2) |
| 폰트 | Pretendard (후보) | 한글 가독성 |
| 폼 전송 | **보류 → Phase 3에서 결정** | 후보: API Route+이메일 / 외부 폼 / DB. **Phase 2에선 UI·검증만** |
| 배포 | **보류 → Phase 4에서 결정** | 후보: Vercel |

---

## 3. 콘텐츠·데이터 전략 (전 단계 공통)

- **더미 우선**: 강사·프로그램·시간표 등은 **그럴듯한 더미 데이터**로 먼저 구축하고, 실제 정보 확보 시 데이터 파일만 교체한다.
- **데이터 위치**: `lib/data/*.ts`에 타입과 함께 정의 → 페이지는 데이터를 import만 한다. (콘텐츠/마크업 분리)
- **더미 표식**: 더미 값에는 주석으로 `// TODO(content): 실제 정보로 교체` 명시.
- 미확정 기본 정보(대표 연락처·주소·대상 학년 상세 등)는 `lib/data/site.ts` 한 곳에 모아 플레이스홀더로 둔다.
- **사업자 정보**(상호·대표자명·사업자등록번호·주소·전화·이메일, 해당 시 통신판매업 신고번호)도 `site.ts`에 두고 하단바(Footer)에서 참조한다. 실제 값 확보 시 이 파일만 교체.

---

## 3-1. 반응형·유동 레이아웃 요구사항 (MANDATORY, 전 단계 공통)

> 이용자는 **휴대폰·태블릿·노트북** 등 폭이 매우 다양한 기기로 접속한다. 특정 브레이크포인트에서만 맞고 그 사이 폭(예: 768~1024px의 중간값)에서 어긋나는 레이아웃은 **불합격**으로 본다.

- **유동 우선(fluid-first)**: 고정 px 폭 지양. `%`, `rem`, `min()/max()/clamp()`, `fr`(grid), `flex` 기반으로 **모든 폭에서 연속적으로** 자연스럽게 변형되게 한다.
- **브레이크포인트는 보정용**: `sm/md/lg/xl`은 큰 구조 전환(예: 1열↔다열, 가로메뉴↔햄버거)에만 쓰고, 그 사이 미세 조정은 유동 단위로 흡수한다.
- **유동 타이포·간격**: 제목/주요 간격은 `clamp()`로 뷰포트에 따라 부드럽게 스케일 (DESIGN.md §2.2, §7).
- **넘침 금지**: 가로 스크롤·텍스트 잘림·요소 겹침이 어떤 폭에서도 발생하지 않아야 한다. 긴 텍스트·표·이미지는 `min-width:0`, `overflow` 처리, 반응형 전환으로 대응.
- **컴포넌트 단위 적응**: 페이지 폭이 아닌 **부모 컨테이너 폭**에 반응해야 하는 요소(카드 그리드, 시간표)는 container query 활용을 검토.
- **검증 방식**: 정해진 브레이크포인트뿐 아니라 **320px부터 1920px까지 폭을 연속적으로 끌어보며**(DevTools responsive 드래그) 깨지는 구간이 없는지 확인한다.

---

## 4. 개발 단계 (로드맵)

각 단계의 ☐ 항목이 곧 실행 작업 단위다. **Phase 0은 1단계 진입 전 준비(스캐폴딩)**이고, 사용자가 정의한 1~5단계는 아래와 같다. 강사 소개는 별도 단계(6)로 추가한다.

> **현황(2026-08-20)**: 2단계(학원 소개)를 제외한 전 단계 구현·배포 완료.
> 콘텐츠는 대부분 코드 더미에서 **Supabase(관리자 편집)** 로 이관됐다(공지·강사·시간표·상담).
> 남은 것: 학원 소개 페이지, 접근성·Lighthouse 점검, 최종 QA. (자세한 배경은 DATABASE.md 진행 로그)

### Phase 0 — 프로젝트 스캐폴딩 (준비) — ✅ 완료
- ☑ `npx create-next-app@latest`로 초기화 (App Router, TypeScript, Tailwind, ESLint, `src/` 미사용, import alias `@/*`)
- ☑ 불필요한 보일러플레이트 정리 (기본 `page.tsx`·예제 스타일 제거)
- ☑ 폴더 구조 생성 (§5)
- ☑ 디자인 토큰 연결 — **Tailwind v4라 `tailwind.config.ts` 없이 `app/globals.css`의 `@theme`에 정의**
- ☑ 폰트 설정 (Pretendard)
- ☑ 루트 메타데이터 기본값 (`app/layout.tsx`의 `metadata`)
- ☑ `lib/data/site.ts` 생성 — 실제 사업자 정보·연락처 반영 완료(단일 출처)
- **완료 기준**: 빈 페이지가 토큰·폰트가 적용된 채로 `npm run dev`에서 렌더

### 1단계 — 메인 페이지 골격 (상단바 + 공지 + 하단바) — ✅ 완료
> 메인 페이지의 **공통 골격**만 구현. 메인 본문(히어로·미리보기 섹션)은 각 페이지 완성 후 별도로 채운다.
- ☑ `components/layout/Container.tsx` (최대폭+좌우패딩 래퍼)
- ☑ `components/layout/Section.tsx` (수직 리듬 통일, default/muted 변형)
- ☑ `components/ui/Button.tsx` (primary/secondary/ghost/inverse, hover·focus·disabled)
- ☑ **상단바** `components/layout/Header.tsx` + 내비게이션 (데스크톱 가로 / 모바일 햄버거)
- ☑ **기본 공지 영역** `components/NoticeBar.tsx` — 데이터는 **Supabase featured 공지**(더미에서 이관)
- ☑ **하단바(사업자 정보)** `components/layout/Footer.tsx` — 사업자·학원 등록번호·연락처, `site.ts` 참조
- ☑ `app/layout.tsx`에 Header/Footer 배치(SiteChrome로 /admin 제외), `app/page.tsx` 구성
- **완료 기준**: 메인 페이지에서 상단바·공지·하단바가 반응형으로 동작, 모바일 메뉴 토글 작동, 사업자 정보 표시

### 2단계 — 학원 소개 — ⛔ 미구현 (유일한 미완료 단계)
- ☐ `app/about/page.tsx` — 교육 철학·미션, 학원 강점, (연혁/시설 플레이스홀더)
- ⚠️ 현재 `app/about/`은 `.gitkeep`만 있는 빈 디렉토리다. 없는 주소를 검색엔진이 수집하지 않도록
  **`app/sitemap.ts`에서 `/about/`을 주석 처리해 뒀다(2026-08-20)** → 페이지를 만들면 그 줄을 되살릴 것.
- **완료 기준**: §7 체크리스트 통과

### 3단계 — 프로그램 — ✅ 완료
- ☑ `app/programs/page.tsx` + `components/programs/ProgramList.tsx` + `components/ProgramCard.tsx` + `lib/data/programs.ts`
- ☑ **부별 탭**(예비중등부·중등부·고등부) + 과정 카드 그리드(유동, §3-1) + 상담 CTA
- **완료 기준**: §7 체크리스트 통과

### 4단계 — 수업 시간표 — ✅ 완료 (설계 변경)
- ☑ `app/schedule/page.tsx` + `components/schedule/ScheduleView.tsx` (계획의 `ScheduleTable` 대신)
- ☑ 요일×시간 표 대신 **부·과목 필터 + 강사별 그룹(수업·요일·시간)** 으로 구성 — 좁은 폭 대응
- ☑ 콘텐츠는 Supabase `schedule_classes`(관리자 `/admin/schedule`에서 편집 → 즉시 반영)
- **완료 기준**: §7 체크리스트 통과

### 5단계 — 상담/문의 — ✅ 완료 (전송까지 연동)
- ☑ `app/contact/page.tsx` + `components/contact/ContactForm.tsx`
- ☑ 폼 필드·클라이언트 검증·에러 상태
- ☑ 연락처·운영시간·오시는 길 영역
- ☑ 제출 핸들러 **연동 완료** — Supabase `inquiries` 저장 → 관리자 `/admin/inquiries`에서 확인·처리
  (계획상 "마무리 단계"였으나 5단계에서 함께 처리됨)
- **완료 기준**: §7 체크리스트 통과

### 6단계 — 강사 소개 — ✅ 완료
- ☑ `app/teachers/page.tsx` + `components/teachers/`(TeacherDirectory·TeacherCard·TeacherDetailClient)
- ☑ 강사 카드 그리드(사진·담당과목·이력) + 부·과목 필터, 개별 상세 주소 `/teachers/[id]/`
- ☑ 콘텐츠는 Supabase — 관리자 수정이 **재배포 없이 즉시 반영**(단, 새 강사 *추가* 시엔 상세 주소 생성을 위해 재배포 필요)
- **완료 기준**: §7 체크리스트 통과

### 마무리 단계 — 메인 본문 + 폼 전송 + 최적화 — 🔸 일부 남음
- ☑ **메인 본문 채우기**: 히어로·강점·프로그램 미리보기·CTA (`components/home/`)
- ☑ 상담 폼 전송 로직 연결(5단계에서 완료)
- ☑ SEO: 페이지별 `metadata`, OG, `app/sitemap.ts`, `app/robots.ts`, 구글·네이버 소유확인
- ☐ 접근성 점검(색 대비·포커스·라벨·alt, DESIGN.md §6)
- ☐ Lighthouse 성능/접근성 점검 (접근성 90+ 목표)

### 배포 단계 — 🔸 운영 중 (QA 남음)
- ☑ 배포 플랫폼 확정 — 정적 export → **깃허브 페이지**(GitHub Actions `deploy.yml`, `main` push 시 자동)
- ☑ 환경변수 — 빌드 시 `NEXT_PUBLIC_SUPABASE_URL/_ANON_KEY` 주입
- ☑ 도메인 연결 — **saeronedu.com** (커스텀 도메인 루트 서빙, `basePath` 비움)
- ☐ 최종 QA(크로스 브라우저·모바일 실기기)
- **완료 기준**: 운영 URL에서 전 페이지 정상 동작

---

## 5. 디렉토리 구조 (예정)

> ⚠️ 아래는 **초기 계획안**이다. 실제 구조는 그동안 늘어난 파일까지 반영해
> **CLAUDE.md의 `File Structure` 섹션이 단일 출처**로 관리한다(변경 시 그쪽을 갱신할 것).

```
.
├── app/                  # 라우트 (App Router)
│   ├── layout.tsx        # 루트 레이아웃 (Header/Footer)
│   ├── globals.css       # 디자인 토큰 CSS 변수 (DESIGN.md §2)
│   ├── page.tsx          # 홈
│   ├── about/page.tsx    # 학원 소개
│   ├── teachers/page.tsx # 강사 소개
│   ├── programs/page.tsx # 프로그램(수업)
│   ├── schedule/page.tsx # 시간표
│   └── contact/page.tsx  # 상담 문의
├── components/
│   ├── layout/           # Container, Section, Header(상단바), Footer(하단바·사업자정보)
│   ├── ui/               # Button, Badge 등 공용 UI
│   ├── NoticeBar.tsx     # 메인 기본 공지 영역
│   ├── TeacherCard.tsx
│   ├── ProgramCard.tsx
│   ├── ScheduleTable.tsx
│   └── ContactForm.tsx
├── lib/
│   └── data/             # site.ts(학원·사업자정보), notices.ts, teachers.ts, programs.ts, schedule.ts (더미)
├── public/               # 이미지·정적 자산
├── tailwind.config.ts
├── CLAUDE.md
├── PROCESS.md
└── DESIGN.md
```

> **⚠️ 구조 변경 시**: CLAUDE.md "File Structure 갱신 규칙(MANDATORY)"에 따라 디렉토리/파일 추가·삭제·이름변경 시 즉시 CLAUDE.md File Structure 섹션에 반영하고 사용자에게 보고한다.

---

## 6. 작업 컨벤션

- **컴포넌트**: PascalCase 파일·함수명(`TeacherCard.tsx`), 한 파일 한 컴포넌트
- **라우트 폴더**: 소문자 케밥(`about`, `teachers`)
- **스타일**: Tailwind 유틸리티 우선, 반복 조합은 컴포넌트로 추출. **색상 hex 직접 사용 금지 → 토큰/시맨틱 클래스** (DESIGN.md §2)
- **데이터**: UI에 콘텐츠 하드코딩 금지 → `lib/data`에서 import
- **커밋 메시지**: CLAUDE.md "Git Commit Standards" 준수 (`type: 요약` + 본문, **AI 서명 금지**)
- **백업/디렉토리 삭제**: CLAUDE.md Backup Rules / DIRECTORY_DELETE_RULES 준수 (백업 파일 `rm` 금지, 디렉토리 삭제·이름변경은 사용자 동의 필수)
- **코드 작성 전**: 연관 파일을 Read/Grep로 확인한 뒤 검증된 코드만 작성 (추측 금지)

---

## 7. 페이지 완료 체크리스트

각 페이지는 아래를 모두 충족해야 "완료"로 본다.

- ☐ 디자인 토큰/컴포넌트 규칙(DESIGN.md) 준수
- ☐ 반응형 동작 확인 (모바일·태블릿·데스크톱)
- ☐ **유동 레이아웃 검증**: 320~1920px 폭을 연속적으로 끌어 깨지는 구간·가로 스크롤·겹침 없음 (§3-1)
- ☐ 접근성: 시맨틱 마크업, 포커스 표시, 이미지 alt, 폼 라벨
- ☐ 콘텐츠는 `lib/data` 더미에서 주입 (하드코딩 X)
- ☐ 상담 CTA로의 동선 존재(해당 시)
- ☐ 구조 변경이 있었다면 CLAUDE.md File Structure 동기화

---

## 8. 보류 항목 (결정 대기)

| 항목 | 상태 | 결과 |
|------|------|------|
| 상담 폼 전송 방식 | ✅ 결정 | Supabase `inquiries` 저장 → 관리자 `/admin/inquiries` |
| 배포 플랫폼 | ✅ 결정 | 정적 export → 깃허브 페이지 + saeronedu.com |
| 실제 콘텐츠(공지·강사·시간표) | ✅ 이관 | Supabase에서 관리자가 직접 편집(코드 더미 아님) |
| 프로그램 콘텐츠 | 🔸 코드 관리 | `lib/data/programs.ts` (관리자 편집 대상 아님) |
| 대표 연락처·주소·**사업자 정보** | ✅ 확보 | `lib/data/site.ts` 반영 완료 |
| 메인 히어로 카피·수치 | ⛔ 더미 | `lib/data/home.ts` — 검증된 값만 노출할 것 |

---

**Last Updated**: 2026-08-20 (로드맵 현황·보류 항목 실제 상태로 갱신)
**Maintainer**: 새론학원 (inotion-coding)
