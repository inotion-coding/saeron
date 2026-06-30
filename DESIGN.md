# DESIGN.md — 새론학원 홈페이지 디자인 시스템

> 메인 페이지를 기준으로 정립한 **고급화 디자인 시스템**. 모든 부가 페이지는 이 문서의 토큰·컴포넌트·패턴을 그대로 따른다.
> 구현 소스: 토큰은 [app/globals.css](app/globals.css), 컴포넌트는 [components/](components/). 개발 절차는 [PROCESS.md](PROCESS.md), 작업 규칙은 [CLAUDE.md](CLAUDE.md).

---

## 1. 디자인 원칙 & 비주얼 방향

### 콘셉트: "신뢰감 있는 모던 에디토리얼"
입시·종합 학원의 핵심 가치(**신뢰 · 전문성 · 결과**)를 절제된 고급스러움으로 표현한다.

1. **여백이 곧 품격** — 넉넉한 섹션 리듬과 행간으로 정보가 숨 쉬게 한다.
2. **강한 타이포 위계** — 큰 디스플레이 제목 + 골드 eyebrow 라벨 + 차분한 본문으로 시선을 유도.
3. **절제된 색** — 딥 네이비 잉크 + 웜 페이퍼 중립색을 기본으로, 골드 액센트는 "포인트"로만 소량.
4. **은은한 깊이** — 진한 그림자 대신 소프트 레이어드 섀도우 + 헤어라인 보더로 고급감.
5. **의도된 모션** — hover 리프트·언더라인·화살표 이동 등 미세한 인터랙션. 과하지 않게, `prefers-reduced-motion` 존중.
6. **결과 지향 동선** — 모든 주요 섹션이 상담(전환)으로 이어진다.

> ⚠️ **색상은 프로비저널(provisional)**: 현재 팔레트는 최종 브랜드 컬러 확정 전 임시값이다. 확정 시 §2의 토큰 값만 교체하면 전 페이지에 반영된다.

---

## 2. 디자인 토큰 (Source of Truth: `app/globals.css` `@theme`)

**원칙: 컴포넌트는 토큰/유틸리티만 사용한다. hex 직접 사용 금지.** (Tailwind v4 CSS-first, `@theme` 기반)

### 2.1 색상 (semantic)

| 토큰 | 값(provisional) | 의미 / 사용처 | Tailwind 유틸 |
|------|------|------|------|
| `--color-primary` | `#1e2a44` | 딥 네이비 잉크 — CTA·강조·로고·브랜드 | `bg-primary` `text-primary` |
| `--color-primary-hover` | `#16203a` | primary hover | `hover:bg-primary-hover` |
| `--color-primary-foreground` | `#ffffff` | primary 위 텍스트 | `text-primary-foreground` |
| `--color-accent` | `#b4884b` | 절제된 골드 — eyebrow·포인트 라인·배지 | `text-accent` `bg-accent` |
| `--color-accent-foreground` | `#ffffff` | accent 위 텍스트 | `text-accent-foreground` |
| `--color-secondary` | `#2e3c5d` | 보조 네이비(드물게) | `bg-secondary` |
| `--color-background` | `#ffffff` | 페이지 배경 | `bg-background` |
| `--color-surface` | `#f7f6f3` | 웜 페이퍼 — 교차 섹션 배경 | `bg-surface` |
| `--color-surface-2` | `#efece5` | 더 깊은 페이퍼 — 공지 리본 등 | `bg-surface-2` |
| `--color-border` | `#e6e3dc` | 웜 헤어라인 | `border-border` |
| `--color-foreground` | `#1a2233` | 본문 잉크 | `text-foreground` |
| `--color-muted-foreground` | `#5c6678` | 보조 텍스트 | `text-muted-foreground` |
| `--color-success/warning/error` | — | 상태색(폼 검증 등) | `text-error` 등 |

- **불투명도 변형**은 `/` 모디파이어로: `bg-primary/8`, `text-primary-foreground/75`, `border-accent/20` 등.
- **색상 확정 절차**: §2.1 값만 교체 → Tailwind 테마·전 컴포넌트 자동 반영. 컴포넌트 수정 불필요.

### 2.2 타이포그래피

- **폰트**: `Pretendard` (CDN, 폴백 system-ui). 토큰 `--font-sans`.
- **유동 스케일** — 모두 `clamp()`로 폭에 따라 연속 보간. Tailwind 유틸로 노출(`text-display` 등).

| 유틸 | 크기(min→max) | line-height | tracking | 용도 |
|------|------|------|------|------|
| `text-display` | 2.5 → 4.25rem | 1.08 | -0.02em | 히어로 대제목 |
| `text-h1` | 2.0 → 3.25rem | 1.12 | -0.02em | 페이지/밴드 제목 |
| `text-h2` | 1.5 → 2.25rem | 1.2 | -0.015em | 섹션 제목 |
| `text-h3` | 1.2 → 1.5rem | 1.3 | -0.01em | 카드/소제목 |
| `text-lead` | 1.05 → 1.3rem | 1.6 | — | 리드 문단 |
| (기본 본문) | 1rem | 1.6 | — | `text-sm`/기본 |

- 제목은 `font-extrabold`, 본문/보조는 `text-muted-foreground`.
- 본문 가독 폭은 `measure` 유틸(`max-width: 60ch`).

### 2.3 간격 · 라운드 · 섀도우 · 모션

- **간격**: Tailwind 기본 4px 스케일. 섹션 수직 패딩은 유동 `py-[clamp(...)]` (§3).
- **라운드**: `--radius-sm 8` / `--radius-md 12` / `--radius-lg 20` / `--radius-xl 28`(px). 사용: `rounded-[var(--radius-lg)]`.
- **섀도우(소프트 레이어드)**:
  - `shadow-card` — 카드 기본 깊이
  - `shadow-hover` — hover 시 떠오름
  - `shadow-ring` — 1px 링
- **모션**: 표준 이징 `--ease-out-soft` = `cubic-bezier(.22,1,.36,1)`. 사용: `ease-[var(--ease-out-soft)]`, duration `200ms`. hover 리프트는 `-translate-y-0.5 ~ -translate-y-1`.

### 2.4 커스텀 유틸리티 (`@utility`)

- `eyebrow` — 골드 대문자 소형 라벨(섹션 도입부). 보통 앞에 `<span class="h-px w-6 bg-accent">` 라인을 동반.
- `measure` — 본문 가독 폭 제한(60ch).

---

## 3. 레이아웃 시스템

- **컨테이너**: `--container-page = 75rem(1200px)`. 래퍼 컴포넌트 [Container](components/layout/Container.tsx) — `max-w + px-4 sm:px-6 lg:px-8`.
- **섹션 리듬**: [Section](components/layout/Section.tsx) — 수직 패딩 `py-[clamp(3rem,2rem+4vw,6rem)]`, `variant="muted"`로 `bg-surface` 교차.
- **헤더**: 풀폭(컨테이너 미적용) — 로고는 항상 화면 왼쪽 끝, 메뉴는 오른쪽 끝. sticky + backdrop blur.
- **그리드**: 카드류는 유동 `grid-cols-[repeat(auto-fit,minmax(Nrem,1fr))]` (고정 열 점프 금지, §7).

---

## 4. 컴포넌트 인벤토리 (구현 기준)

| 컴포넌트 | 파일 | 변형 / 핵심 |
|------|------|------|
| `Button` | [ui/Button.tsx](components/ui/Button.tsx) | `primary` / `secondary` / `ghost` / `inverse`(어두운 배경용), size `md`/`lg`, `withArrow`. href→Link. hover 리프트, 화살표 이동, 포커스 링, 터치 44px+ |
| `Badge` | [ui/Badge.tsx](components/ui/Badge.tsx) | `neutral` / `accent` / `primary`. 과목·대상·태그 |
| `SectionHeading` | [ui/SectionHeading.tsx](components/ui/SectionHeading.tsx) | eyebrow + 제목 + 설명, `align` left/center |
| `Container` / `Section` | [layout/](components/layout/) | 최대폭 래퍼 / 섹션 리듬 |
| `Header` | [layout/Header.tsx](components/layout/Header.tsx) | 풀폭, 로고 마크+워드마크, 데스크톱 언더라인 내비, 모바일 햄버거, active 표시 |
| `Footer` | [layout/Footer.tsx](components/layout/Footer.tsx) | 로고, 바로가기, **사업자 정보**(site.ts), 카피라이트 |
| `NoticeBar` | [NoticeBar.tsx](components/NoticeBar.tsx) | 헤더 아래 **슬림 공지 리본**, 자동 롤링 슬라이드, 점 인디케이터, 닫기, reduced-motion |
| `ProgramCard` | [ProgramCard.tsx](components/ProgramCard.tsx) | 대상 배지·제목·요약·태그·화살표, hover 리프트. 홈/`/programs` 공용 |
| `Hero` | [home/Hero.tsx](components/home/Hero.tsx) | eyebrow+디스플레이 제목+리드+CTA 2종 + 신뢰 지표 스트립, 절제된 데코 그라데이션 |
| `Strengths` | [home/Strengths.tsx](components/home/Strengths.tsx) | 아이콘 카드 그리드(유동), hover 리프트 + 아이콘 반전 |
| `ProgramsPreview` | [home/ProgramsPreview.tsx](components/home/ProgramsPreview.tsx) | 헤더 + 추천 ProgramCard 그리드 + 전체보기 |
| `CtaBand` | [home/CtaBand.tsx](components/home/CtaBand.tsx) | primary 풀밴드, 데코 블롭, inverse 버튼, 상담 유도 |

**상태 규약**: 모든 인터랙티브 요소는 hover/focus-visible/disabled를 정의한다. 클릭형 카드는 `group` + 화살표 `group-hover:translate-x-0.5`, 카드 컨테이너는 `hover:-translate-y-1 hover:shadow-hover`.

---

## 5. 메인 페이지 블루프린트 (부가 페이지의 기준)

구성 순서 ([app/page.tsx](app/page.tsx)):

```
[ Header (sticky, 풀폭) ]
[ NoticeBar — 슬림 공지 리본 (자동 롤링) ]
[ Hero — eyebrow · 디스플레이 제목 · 리드 · CTA(상담/프로그램) · 신뢰 지표 4종 ]
[ Strengths(muted) — WHY 새론, 강점 4 카드 ]
[ ProgramsPreview — 추천 프로그램 3 + 전체보기 ]
[ CtaBand — 네이비 밴드, 무료 상담 유도 ]
[ Footer — 사업자 정보 ]
```

**리듬 규칙**: `background` 섹션과 `surface`(muted) 섹션을 번갈아 배치해 깊이감. CTA 밴드는 네이비로 강한 마무리.

---

## 6. 부가 페이지 제작 레시피 (일관성 유지)

모든 하위 페이지는 동일 골격을 따른다:

1. **서브 히어로**: `Section` 안에 `SectionHeading`(align 자유) 또는 간소화된 히어로. eyebrow로 페이지 정체성 표기.
2. **본문**: 카드/리스트/표는 §4 컴포넌트 재사용. 새 카드가 필요하면 ProgramCard 패턴(보더+`shadow-card`+hover 리프트)을 복제.
3. **데이터**: 콘텐츠는 반드시 `lib/data/*`에서 주입 (하드코딩 금지).
4. **마무리 CTA**: 페이지 끝에 `CtaBand` 또는 동등한 상담 유도 섹션.
5. **간격/타이포/색**: 본 문서 토큰·유틸만 사용.

페이지별 적용 메모:
- **학원 소개(/about)**: 서브 히어로 → 교육 철학(리드+측면 포인트) → 강점 상세(Strengths 재사용/확장) → 연혁/시설 → CtaBand.
- **프로그램(/programs)**: 서브 히어로 → 대상/학년 그룹별 `ProgramCard` 그리드 → CtaBand.
- **시간표(/schedule)**: 서브 히어로 → 시간표 테이블(넓은 폭 가로 테이블 / 좁은 폭 가로 스크롤·요일 카드) → 안내.
- **강사 소개(/teachers)**: 서브 히어로 → `TeacherCard` 그리드(ProgramCard와 동일 카드 언어) → CtaBand.
- **상담·문의(/contact)**: 서브 히어로 → 2열(폼 | 연락처·운영시간·약도) → 좁은 폭 1열. 폼 입력은 `border-border`·포커스 링·에러는 `text-error`+`aria-invalid`.

---

## 7. 반응형 동작 (유동 우선)

> 휴대폰·태블릿·노트북 등 임의 폭(예: 860px)에서도 픽셀 단위로 깔끔해야 한다 (PROCESS.md §3-1). 브레이크포인트 사이가 어긋나면 불합격.

### 구현 가이드
- **고정 px 폭 지양** — `%`, `rem`, `clamp()`, grid `repeat(auto-fit,minmax(...,1fr))`, flex로 연속 변형.
- **유동 타이포·간격** — 제목은 `text-display/h1/h2`(clamp), 섹션 패딩은 `py-[clamp(...)]`.
- **카드 그리드** — `auto-fit/minmax`로 폭에 따라 열 수 자동(고정 1/2/3열 점프 금지).
- **넘침 방지** — flex/grid 자식 `min-w-0`, 긴 텍스트 `truncate`/`line-clamp`, 이미지 `max-w-100%`. 가로 스크롤 0.
- **검증** — DevTools 320px→1920px 폭을 연속 드래그하며 깨짐·겹침·가로 스크롤 없는지 확인.

### 컴포넌트별
- **헤더**: 데스크톱 가로 언더라인 메뉴 → `md` 미만 햄버거 슬라이드 패널.
- **공지 리본**: 슬림 1행, 날짜·점 인디케이터는 `sm` 이상만 노출.
- **히어로 지표**: 2열 → `md` 4열.
- **카드 그리드(강점/프로그램)**: `auto-fit/minmax`로 1→다열 연속.
- **CTA/2열 레이아웃**: 넓은 폭 가로 → 좁은 폭 세로 적층.

---

## 8. 접근성 (a11y)

- **색 대비**: 본문 텍스트 WCAG AA(4.5:1) 이상. 색상 확정 시 재검증.
- **포커스**: `:focus-visible` 전역 링(globals.css). `outline:none`만 두지 않음.
- **시맨틱**: `header/nav/main/section/footer`, 제목 레벨 순서 준수(페이지당 h1 1회 권장).
- **모션**: `prefers-reduced-motion: reduce` 시 전역 트랜지션/애니메이션·자동 슬라이드 비활성.
- **이미지/아이콘**: 의미 이미지 `alt`, 장식 아이콘 `aria-hidden`.
- **폼**: 모든 입력 `label` 연결, 에러 텍스트 + `aria-invalid`.
- **터치 타깃**: 최소 44×44px (`h-11`).
- **캐러셀**: 비활성 슬라이드 `tabIndex=-1` + `aria-hidden`, `aria-live="polite"`.

---

**Last Updated**: 2026-06-30
**Maintainer**: 새론학원 (inotion-coding)
