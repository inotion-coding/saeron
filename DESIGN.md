# DESIGN.md — 새론학원 홈페이지 디자인 시스템

> 메인 페이지를 기준으로 정립한 **고급화 디자인 시스템**. 모든 부가 페이지는 이 문서의 토큰·컴포넌트·패턴을 그대로 따른다.
> 구현 소스: 토큰은 [app/globals.css](app/globals.css), 컴포넌트는 [components/](components/). 개발 절차는 [PROCESS.md](PROCESS.md), 작업 규칙은 [CLAUDE.md](CLAUDE.md).

---

## 1. 디자인 원칙 & 비주얼 방향

### 콘셉트: "신뢰감 있는 모던 에디토리얼" (쿨 네이비 + 틸)
입시·종합 학원의 핵심 가치(**신뢰 · 전문성 · 결과**)를 절제된 고급스러움으로 표현한다.
팔레트는 **로고([public/1.png](public/1.png)) 색상에서 도출**: 네이비 `#304890` + 틸 `#60a8c0`.

1. **여백이 곧 품격** — 넉넉한 섹션 리듬과 행간으로 정보가 숨 쉬게 한다.
2. **강한 타이포 위계** — 큰 디스플레이 제목 + 골드 eyebrow 라벨 + 차분한 본문으로 시선을 유도.
3. **2-액센트 시스템** — 쿨 네이비 잉크 + 쿨 페이퍼 중립색이 기본. **골드**(`point`)는 eyebrow(라인+텍스트)·공지 라벨·CTA·**상단바 내비의 언더라인/active** 등 *포인트*로만(상시 적용 금지), **틸**(`accent`)은 본문 링크·카드 호버 테두리·구분선. 둘 다 절제.
4. **은은한 깊이** — 진한 그림자 대신 소프트 레이어드 섀도우 + 헤어라인 보더로 고급감.
5. **스크롤 무드 전환** — 스크롤에 따라 배경 톤이 paper→mist→deep로 부드럽게 전환(§9)되어 고급스러운 흐름을 만든다.
6. **의도된 모션** — hover 리프트·언더라인·화살표 이동·진입 페이드업 등 미세한 인터랙션. 과하지 않게, `prefers-reduced-motion` 존중.
7. **결과 지향 동선** — 모든 주요 섹션이 상담(전환)으로 이어진다.

> 색상은 로고 기반으로 확정했으나 여전히 토큰으로 추상화되어 있어, 조정 시 §2의 토큰 값만 교체하면 전 페이지에 반영된다.

---

## 2. 디자인 토큰 (Source of Truth: `app/globals.css` `@theme`)

**원칙: 컴포넌트는 토큰/유틸리티만 사용한다. hex 직접 사용 금지.** (Tailwind v4 CSS-first, `@theme` 기반)

### 2.1 색상 (semantic)

출처: 로고(네이비 `#304890` / 틸 `#60a8c0`). 접근성을 위해 텍스트용 액센트는 더 진한 틸을 사용한다.

| 토큰 | 값 | 의미 / 사용처 | Tailwind 유틸 |
|------|------|------|------|
| `--color-primary` | `#24356b` | 딥 로열 네이비 — CTA·강조·로고 | `bg-primary` `text-primary` |
| `--color-primary-hover` | `#1b294f` | primary hover | `hover:bg-primary-hover` |
| `--color-primary-foreground` | `#ffffff` | primary 위 텍스트 | `text-primary-foreground` |
| `--color-brand-blue` | `#304890` | 로고 블루 — 그라데이션/데코 | `bg-brand-blue` |
| `--color-accent` | `#1f7e92` | 딥 틸 — 링크·텍스트 강조·인터랙션(브랜드) | `text-accent` `bg-accent` |
| `--color-accent-bright` | `#58aecb` | 로고 틸 — 라인·점·그라데이션(장식) | `bg-accent-bright` |
| `--color-accent-foreground` | `#ffffff` | accent 위 텍스트 | `text-accent-foreground` |
| `--color-point` | `#b08a3c` | **골드 포인트** — eyebrow 라인·소량 강조(light) | `text-point` `bg-point` |
| `--color-point-bright` | `#e3b461` | 골드 — 딥(어두운) 배경 위 포인트 | `text-point-bright` `bg-point-bright` |
| `--color-background` | `#ffffff` | 표면(카드 등) | `bg-background` |
| `--color-surface` | `#f3f7fb` | 쿨 라이트 표면 | `bg-surface` |
| `--color-surface-2` | `#e8eff7` | 더 깊은 표면 | `bg-surface-2` |
| `--color-border` | `#dde6f0` | 쿨 헤어라인 | `border-border` |
| `--color-foreground` | `#16213a` | 쿨 잉크 네이비(본문) | `text-foreground` |
| `--color-muted-foreground` | `#586a86` | 보조 텍스트 | `text-muted-foreground` |
| `--color-success/warning/error` | — | 상태색(폼 검증 등) | `text-error` 등 |

> 페이지 **배경**은 정적 토큰이 아니라 스크롤 톤(`--page-bg`)이 담당한다(§9).

- **불투명도 변형**은 `/` 모디파이어로: `bg-accent/10`, `text-white/75`, `border-white/10` 등.
- **색상 조정 절차**: §2.1 값만 교체 → Tailwind 테마·전 컴포넌트 자동 반영. 컴포넌트 수정 불필요.
- **골드(point) 사용처**: eyebrow(라인+텍스트, `.eyebrow`), 공지(`공지사항`) 라벨, 딥 CTA eyebrow, 상단바 내비의 **언더라인 + active 항목**. (내비 기본 텍스트는 일반 색, 상시 금색 금지) 딥 배경 위에서는 `point-bright`. 본문 링크·카드 호버 테두리·구분선은 틸(`accent`).

### 2.x 간격 (여유로운 리듬)
- 섹션 수직 패딩: `py-[clamp(4.5rem,3rem+6vw,9rem)]` (히어로/CTA는 더 큼). 섹션 헤더→콘텐츠 `mt-16`, 카드 그리드 `gap-6`. 페이지 전반을 넉넉하게 띄워 고급감을 준다.

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
- **라운드(샤프·에디토리얼)**: `--radius-sm 3`(카드·배지) / `--radius-md 5`(버튼·인풋) / `--radius-lg 6`(지표 스트립 등) / `--radius-xl 8`(CTA 패널)(px). 전반적으로 각지게 유지.
- **섀도우(소프트 레이어드)**:
  - `shadow-card` — 카드 기본 깊이
  - `shadow-hover` — hover 시 떠오름
  - `shadow-ring` — 1px 링
- **모션**: 표준 이징 `--ease-out-soft` = `cubic-bezier(.22,1,.36,1)`. 사용: `ease-[var(--ease-out-soft)]`, duration `200ms`. hover 리프트는 `-translate-y-0.5 ~ -translate-y-1`.

### 2.4 커스텀 유틸리티 (`@utility`)

- `eyebrow` — **골드** 대문자 소형 라벨(섹션 도입부). 텍스트·라인 모두 `point`. 앞에 `<span class="h-px w-7 bg-point">` 라인을 동반.
- `measure` — 본문 가독 폭 제한(60ch).

---

## 3. 레이아웃 시스템

- **컨테이너**: `--container-page = 75rem(1200px)`. 래퍼 컴포넌트 [Container](components/layout/Container.tsx) — `max-w + px-4 sm:px-6 lg:px-8`.
- **섹션 리듬**: [Section](components/layout/Section.tsx) — 수직 패딩 `py-[clamp(3rem,2rem+4vw,6rem)]`. 배경은 투명(스크롤 톤이 담당), `tone` prop으로 색 전환에 참여(§9).
- **헤더**: 풀폭(컨테이너 미적용) — 로고는 항상 화면 왼쪽 끝, 메뉴는 오른쪽 끝. sticky + backdrop blur.
- **그리드**: 카드류는 유동 `grid-cols-[repeat(auto-fit,minmax(Nrem,1fr))]` (고정 열 점프 금지, §7).

---

## 4. 컴포넌트 인벤토리 (구현 기준)

| 컴포넌트 | 파일 | 변형 / 핵심 |
|------|------|------|
| `Button` | [ui/Button.tsx](components/ui/Button.tsx) | `primary` / `secondary` / `ghost` / `inverse`(어두운 배경용), size `md`/`lg`, `withArrow`. href→Link. hover 리프트, 화살표 이동, 포커스 링, 터치 44px+ |
| `Badge` | [ui/Badge.tsx](components/ui/Badge.tsx) | `neutral` / `accent` / `primary`. 과목·대상·태그 |
| `SectionHeading` | [ui/SectionHeading.tsx](components/ui/SectionHeading.tsx) | eyebrow + 제목 + 설명, `align` left/center |
| `Container` / `Section` | [layout/](components/layout/) | 최대폭 래퍼 / 섹션 리듬(투명 배경 + `tone`) |
| `Logo` | [layout/Logo.tsx](components/layout/Logo.tsx) | `site.logo.src` 이미지 또는 텍스트 마크 폴백. Header/Footer 공용 |
| `PageBackdrop` | [layout/PageBackdrop.tsx](components/layout/PageBackdrop.tsx) | fixed 풀뷰포트 배경, `--page-bg` 보간(§9) |
| `ScrollTheme` | [ScrollTheme.tsx](components/ScrollTheme.tsx) | 중앙 교차 섹션 `data-tone`→`<html>` 반영(IntersectionObserver, §9) |
| `Reveal` | [ui/Reveal.tsx](components/ui/Reveal.tsx) | 진입 페이드업(once), `delay` 스태거, reduced-motion 시 즉시 표시 |
| `Header` | [layout/Header.tsx](components/layout/Header.tsx) | 풀폭, 로고, 내비(기본 일반색 / active·언더라인 골드), 모바일 햄버거 |
| `Footer` | [layout/Footer.tsx](components/layout/Footer.tsx) | 로고, 바로가기, **사업자 정보**(site.ts), 카피라이트 |
| `NoticeBar` | [NoticeBar.tsx](components/NoticeBar.tsx) | 헤더 아래 공지 배너, **최신 1건 정적 노출**(슬라이드 없음), 닫기 |
| `ProgramCard` | [ProgramCard.tsx](components/ProgramCard.tsx) | 각진 박스. 대상 라벨·과정명·한 줄 요약·화살표(태그 미표시), hover 골드 테두리. 홈/`/programs` 공용 |
| `Hero` | [home/Hero.tsx](components/home/Hero.tsx) | tone paper. eyebrow+디스플레이 제목+리드+CTA 2종 + 신뢰 지표, 브랜드 데코, Reveal |
| `Strengths` | [home/Strengths.tsx](components/home/Strengths.tsx) | tone mist. 각진 아이콘 카드 그리드(유동), hover 골드 테두리, Reveal 스태거 |
| `ProgramsPreview` | [home/ProgramsPreview.tsx](components/home/ProgramsPreview.tsx) | tone paper. 헤더 + 추천 ProgramCard 그리드 + 전체보기 |
| `CtaBand` | [home/CtaBand.tsx](components/home/CtaBand.tsx) | tone deep. 딥 네이비 위 글래스 패널, inverse 버튼, 상담 유도 |

**카드 디자인 규약 (각진 에디토리얼)**:
- **모서리**: 카드는 `rounded-[var(--radius-sm)]`(3px)로 **각지게**. 과한 둥근 모서리 금지(전문성 저하).
- **호버**: 위로 뜨는 모션(`-translate-y`) 사용 금지. 대신 **골드 포인트 얇은 테두리**(`border-border` → `hover:border-point`, `transition-colors`). 정적 `shadow-card`로만 은은한 깊이.
- **콘텐츠 최소화**: 카드당 핵심 정보만(라벨·제목·한 줄 요약·진입 화살표). 태그 나열·장문 설명 지양.
- 화살표 등 미세 이동(`group-hover:translate-x-0.5`)은 허용.

**기타 상태 규약**: 모든 인터랙티브 요소는 hover/focus-visible/disabled 정의. 버튼은 CTA 특성상 미세 리프트 허용(카드는 금지).

---

## 5. 메인 페이지 블루프린트 (부가 페이지의 기준)

구성 순서 ([app/page.tsx](app/page.tsx)):

```
[ Header (sticky, 풀폭) ]
[ NoticeBar (tone paper) — 최신 공지 1건 ]
[ Hero (tone paper) — eyebrow · 디스플레이 제목 · 리드 · CTA · 신뢰 지표 4종 ]
[ Strengths (tone mist) — WHY 새론, 강점 4 카드 ]
[ ProgramsPreview (tone paper) — 추천 프로그램 3 + 전체보기 ]
[ CtaBand (tone deep) — 딥 네이비 전환 + 글래스 패널, 무료 상담 유도 ]
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
- **공지 배너**: 최신 1건, 제목 2줄 클램프(유동 크기).
- **히어로 지표**: 2열 → `md` 4열.
- **카드 그리드(강점/프로그램)**: `auto-fit/minmax`로 1→다열 연속.
- **CTA/2열 레이아웃**: 넓은 폭 가로 → 좁은 폭 세로 적층.

---

## 8. 접근성 (a11y)

- **색 대비**: 본문 텍스트 WCAG AA(4.5:1) 이상. 색상 확정 시 재검증.
- **포커스**: `:focus-visible` 전역 링(globals.css). `outline:none`만 두지 않음.
- **시맨틱**: `header/nav/main/section/footer`, 제목 레벨 순서 준수(페이지당 h1 1회 권장).
- **모션**: `prefers-reduced-motion: reduce` 시 전역 트랜지션/애니메이션·스크롤 색 전환·Reveal 비활성(즉시 표시).
- **이미지/아이콘**: 의미 이미지 `alt`, 장식 아이콘 `aria-hidden`.
- **폼**: 모든 입력 `label` 연결, 에러 텍스트 + `aria-invalid`.
- **터치 타깃**: 최소 44×44px (`h-11`).
- **딥 톤 위 대비**: `deep` 톤 섹션의 텍스트는 흰색/`accent-bright`로 WCAG AA 확보.

---

## 9. 스크롤 색상 전환 & 진입 모션

### 스크롤 색상 전환 (scroll-driven section theming)
스크롤에 따라 페이지 배경 톤이 **자연스럽고 고급스럽게** 전환된다. (레퍼런스: Apple 제품 페이지·Stripe·Linear)

**동작 구조**
1. 각 섹션에 `data-tone`(`paper` | `mist` | `deep`) 부여. (`Section`은 `tone` prop, 커스텀 섹션은 직접 속성)
2. [ScrollTheme](components/ScrollTheme.tsx): `IntersectionObserver`(`rootMargin: "-50% 0 -50% 0"`)로 **뷰포트 세로 중앙선**을 지나는 섹션을 감지 → 그 tone을 `<html data-tone>`에 반영.
3. [PageBackdrop](components/layout/PageBackdrop.tsx): `fixed` 풀뷰포트 레이어가 `--page-bg`를 **700ms** 이징(`--ease-out-soft`)으로 보간.

**톤 값** (globals.css `:root[data-tone="…"]`)
| tone | `--page-bg` | 용도 |
|------|------|------|
| `paper` | `#fbfcfe` | 기본(공지·히어로·프로그램) |
| `mist` | `#eef4fa` | 연한 블루 틴트(강점) |
| `deep` | `#1a2944` | 딥 네이비(상담 CTA) |

**규칙**
- 섹션 배경은 **투명**, 카드/표면만 불투명(`bg-background`)으로 띄운다.
- `deep` 톤 섹션의 콘텐츠는 흰색 텍스트 + `accent-bright`. 글래스 패널(`bg-white/5 border-white/10`)로 띄움.
- 새 섹션을 추가하면 흐름이 끊기지 않게 인접 톤을 고려해 `data-tone` 지정.

### 진입 모션 (Reveal)
- [Reveal](components/ui/Reveal.tsx): 뷰포트 진입 시 한 번 페이드업(`opacity`+`translateY(18px)`, 700ms). `delay`로 카드 스태거.
- `prefers-reduced-motion: reduce` 또는 IntersectionObserver 미지원 시 **즉시 표시**.
- 적용: 히어로 텍스트·지표, 강점/프로그램 카드(스태거), CTA.

---

**Last Updated**: 2026-06-30
**Maintainer**: 새론학원 (inotion-coding)
