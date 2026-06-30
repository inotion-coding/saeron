# {{PROJECT_NAME}} - Claude Configuration

> {{ONE_LINE_PROJECT_DESCRIPTION}}
<!-- 예: "JSON 설정 파일 기반 AI 패션 룩북 이미지 생성 프로젝트" -->
> 이 문서의 규칙은 Claude Code뿐 아니라 Codex CLI(및 이 프로젝트 내에서 사용하는 다른 AI 코드 도우미)에도 동일하게 적용됩니다.

---

## 🎯 Project Overview

**MANDATORY: Always verify related files and code before providing any code solutions**

<!-- 작성 가이드: 이 프로젝트가 무엇을 하는지 3~5개 항목으로. 기술 스택/언어/핵심 특징 위주 -->
- {{CORE_PURPOSE}}              <!-- 예: AI-powered fashion lookbook image generation -->
- {{TECH_OR_FORMAT}}            <!-- 예: JSON-based prompt and parameter definitions -->
- {{KEY_FEATURE_1}}            <!-- 예: Multi-language support (English/Korean) -->
- {{KEY_FEATURE_2}}            <!-- 예: Template-based layout system -->

---

## 🏗️ File Structure

<!-- 작성 가이드: 이 프로젝트의 실제 디렉토리 구조를 여기에 기록.
     초기 구성은 프로젝트 시작 시 자유롭게 작성하고, 아래 갱신 규칙을 반드시 따를 것 -->

```
{{프로젝트 구조를 여기에 기록 — 아직 비어 있다면 첫 구성 시 작성}}
```

### 📌 File Structure 갱신 규칙 (MANDATORY)

**CRITICAL: 작업 중 디렉토리/파일 구조가 변경되면 즉시 이 섹션에 반영할 것**
**APPLIES TO: Claude Code, Codex CLI, 그리고 구조를 변경하는 모든 AI 코드 도우미**

#### 갱신 트리거 (아래 작업 수행 시 자동 적용)
- 새 디렉토리 생성 / 삭제 / 이름 변경
- 새 파일 추가 / 파일 이동 / 파일 삭제
- 디렉토리 역할·용도 변경

#### 갱신 절차
1. 위 구조 블록을 **현재 실제 상태와 일치하도록** 수정
2. 변경된 항목에 한 줄 주석으로 용도 명시 (`# 설명`)
3. 변경 사유를 작업 응답에서 사용자에게 보고
4. 구조 변경이 디렉토리 삭제·이름변경을 포함하면 → DIRECTORY_DELETE_RULES 우선 적용 (사용자 동의 필수)

#### 금지 사항
- ❌ 구조를 변경하고 이 섹션을 갱신하지 않는 것
- ❌ 실제 디렉토리와 문서 기록이 불일치하는 상태로 작업 종료

---

## 🚫 Code Provision Rules

### No Speculative Code Provision
**PRINCIPLE: Provide minimal code that meets current requirements only**
- 반드시 코드 제시 시, 연관 파일 및 코드를 확인한 후 검증된 코드를 제공
- 추측이나 가정 기반의 코드 제공 금지
- 실제 프로젝트 구조와 기존 코드를 분석한 후에만 코드 제안

**Required verification process:**
- Read/Grep 도구로 프로젝트 구조 파악
- 기존 구현과 패턴 확인
- 의존성 및 통합 지점 분석

**검증 누락 금지:**
- ❌ 연관 파일을 확인하지 않고 코드 작성
- ❌ 존재 여부가 불확실한 함수·변수·import 가정
- ❌ 기존 코드 스타일·컨벤션 무시

---

## 🚨 Backup Rules (백업 규칙)

### Mandatory Backup Protocol
**CRITICAL: 파일 수정 시 반드시 백업 생성 필수**
**APPLIES TO: Claude Code, Codex CLI, 그리고 파일을 직접/간접으로 수정하는 모든 AI 코드 도우미**

<!-- 작성 가이드: 백업이 특히 중요한 파일/디렉토리가 있으면 아래에 명시. 없으면 "모든 수정 대상 파일" 유지 -->
**백업 필수 대상**: {{CRITICAL_FILES_OR_DIRS}}   <!-- 예: 설정 파일 전체, /config/*.json. 미지정 시 모든 수정 파일 -->

#### 백업 파일 명명 규칙
```bash
# 표준 백업 형식 (백업 이유 포함)
{원본파일명}_bak_{백업이유}_{YYYYMMDD}_{HHMMSS}.{확장자}

# 예시
config_bak_structure_update_20251218_143000.json

# 백업 이유 키워드
- structure_update / field_add / refactoring / bug_fix / feature_add
```

#### 백업 생성 절차
```bash
TODAY=$(date '+%Y%m%d')
TIMESTAMP=$(date '+%H%M%S')
cp 원본파일.ext 원본파일_bak_백업이유_${TODAY}_${TIMESTAMP}.ext
ls -la 원본파일_bak_백업이유_${TODAY}_${TIMESTAMP}.ext   # 검증
```

#### 백업 안전 장치
- **백업 실패 시 수정 중단**: 백업이 성공하지 않으면 원본 수정 금지
- **타임스탬프 기반 고유성**: 동일 파일의 여러 백업 버전 보장
- **무결성 검증**: 백업 생성 후 크기·존재 확인 필수

#### 금지 사항
```bash
# ❌ 잘못된 백업
cp file.ext file.backup     # 형식 불일치
cp file.ext file.bak        # 날짜 없음
mv file.ext file_backup.ext # 원본 이동

# ✅ 올바른 백업
cp file.ext file_bak_structure_update_$(date '+%Y%m%d_%H%M%S').ext
```

---

## 🎯 조건부 규칙 시스템 (Conditional Rules System)

### 📋 규칙 카테고리

#### 🔴 CRITICAL 규칙 (항상 활성화)

##### 1. CLEANUP_RULES.md - 백업 파일 정리 규칙
**⚠️ 백업 파일은 절대 삭제(`rm`) 금지! 반드시 `_bak/` 디렉토리로 이동만 허용!**
```yaml
auto_activation:
  keywords: ["정리", "cleanup", "백업", "backup", "백업 정리"]
  critical_rule: true
  mandatory_behavior:
    - mkdir -p _bak
    - mv *_bak_* _bak/
    - NEVER use rm command for backup files
```

##### 2. DIRECTORY_DELETE_RULES.md - 디렉토리 삭제/이름 변경 규칙
**⚠️ 사용자 동의 없는 디렉토리 삭제/이름 변경 절대 금지!**
```yaml
auto_activation:
  keywords: ["디렉토리 삭제", "폴더 삭제", "rm -rf", "구조 변경"]
  critical_rule: true
  mandatory_behavior:
    - Ask user for confirmation before any directory delete/rename
    - Create backup before execution
    - Never auto-execute directory operations
```

<!-- ▼▼▼ 프로젝트 고유 CRITICAL 규칙이 있으면 아래 틀을 복사해 추가 ▼▼▼ -->
<!--
##### N. {{CUSTOM_RULE_NAME}}.md - {{규칙 목적}}
**⚠️ {{한 줄 핵심 경고}}**
```yaml
auto_activation:
  keywords: [{{트리거 키워드들}}]
  critical_rule: true
  mandatory_behavior:
    - {{필수 동작 1}}
    - {{필수 동작 2}}
```
예시(다국어 프로젝트): PROMPT_SYNC_RULES — 영문 변경 시 한국어 동기화, 플레이스홀더 보존
-->

#### 일반 규칙

##### 3. COMMENT_RULES.md - 주석 작성 규칙
```yaml
auto_activation:
  keywords: ["주석", "comment", "JSDoc", "코멘트", "문서화"]
  file_patterns: {{대상 확장자}}   # 예: ["*.js", "*.ts", "*.py"]
```

##### 4. VERSION_RULES.md - 버전 생성 규칙
```yaml
auto_activation:
  keywords: ["버전 생성", "create version", "새 버전"]
  action: "파일을 {filename}_v_{version}.{ext} 형식으로 draft/ 디렉토리에 저장"
```

### 규칙 활성화 방법

#### 명시적 활성화 (사용자 요청)
```bash
"comment rule에 따라서 주석을 제공해"   → COMMENT_RULES.md 활성화
"백업 파일들을 정리하자"               → CLEANUP_RULES.md 활성화
"디렉토리 삭제해"                     → DIRECTORY_DELETE_RULES.md 활성화
"파일명 버전을 생성해"                 → VERSION_RULES.md 활성화
{{프로젝트 고유 트리거 문구}}          → {{CUSTOM_RULE}}.md 활성화
```

#### 자동 감지 활성화 (키워드 기반)
```yaml
auto_activation:
  CLEANUP_RULES:
    keywords: ["정리", "cleanup", "백업", "backup"]
    critical_rule: "⚠️ 백업 파일은 절대 삭제 금지! _bak/ 디렉토리로 이동만 허용!"

  DIRECTORY_DELETE_RULES:
    keywords: ["디렉토리 삭제", "폴더 삭제", "rm -rf", "구조 변경"]
    critical_rule: "⚠️ 사용자 동의 없는 삭제/이름 변경 절대 금지!"

  COMMENT_RULES:
    keywords: ["주석", "comment", "JSDoc", "문서화"]
    files: {{대상 확장자}}   # 예: ["*.js", "*.py"]

  VERSION_RULES:
    keywords: ["버전 생성", "create version", "새 버전"]
    action: "파일을 {filename}_v_{version}.{ext} 형식으로 draft/ 디렉토리에 저장"

  # ▼ 프로젝트 고유 규칙 추가 시 위 형식 복사
  # {{CUSTOM_RULE}}:
  #   keywords: [{{트리거 키워드}}]
  #   critical_rule / action: "{{동작}}"
```

### 규칙 위치
```
.claude/rules/
├── CLEANUP_RULES.md          # 🔴 백업 파일 정리 규칙 (CRITICAL)
├── DIRECTORY_DELETE_RULES.md # 🔴 디렉토리 안전 규칙 (CRITICAL)
├── COMMENT_RULES.md          # 주석 작성 규칙
├── VERSION_RULES.md          # 버전 생성 및 draft 관리 규칙
├── {{CUSTOM_RULE}}.md        # 🔴 프로젝트 고유 규칙 (선택)
└── RULES_INDEX.md            # 규칙 인덱스 및 관리
```

---

## 📝 Domain Concepts

<!-- 작성 가이드: 이 프로젝트의 핵심 도메인 워크플로우와 불변 규칙을 정의.
     AI가 작업 시 반드시 지켜야 할 도메인 고유 제약을 여기에 명문화할 것 -->

### Workflow

<!-- 작성 가이드: 입력 → 처리 → 출력 흐름을 단계별로. 각 단계의 입력원과 산출물을 명확히 -->
1. {{STEP_1}}   <!-- 예: Image 1 (Model) → 포즈/외모 추출 -->
2. {{STEP_2}}   <!-- 예: Image 2 (Looksheet) → 흰 배경에서 패션 아이템 추출 -->
3. {{STEP_3}}   <!-- 예: Image 3 (Template) → 레이아웃 구조 적용 -->
4. {{STEP_N}}

### Critical Rules (도메인 불변 규칙)

<!-- 작성 가이드: 절대 위반하면 안 되는 도메인 제약. "무엇을 보존하고 무엇을 생성 금지하는가" 중심 -->
- {{INVARIANT_1}}   <!-- 예: Image 1의 모델 포즈/외모는 완벽히 보존 -->
- {{INVARIANT_2}}   <!-- 예: Image 1에 보이는 아이템만 출력에 포함 -->
- {{INVARIANT_3}}   <!-- 예: 아이템은 생성이 아니라 Image 2에서 추출 -->
- {{INVARIANT_4}}   <!-- 예: 레이아웃은 Image 3 템플릿 구조를 따름 -->

---

## 📋 Git Commit Standards

### Commit Message Format
**MANDATORY: Claude 서명 없는 깔끔한 커밋 메시지 사용**

```bash
# ✅ 올바른 형식
git commit -m "feat: 기능 추가 및 개선 사항

## 주요 변경 사항
- 구체적인 변경 내용
- 추가된 기능 / 수정된 버그

## 기술적 세부사항
- 사용된 기술 / 구현 방식"

# ❌ 금지 (AI 서명 포함)
git commit -m "...
🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Commit Guidelines
- **Clear Description**: 변경사항 명확히 설명
- **Technical Details**: 구현 방식·기술 세부사항 포함
- **No AI Signatures**: AI 생성 표시 제거 필수

---

## 🔴 최종 확인 체크리스트

#### File Structure 변경 시
- [ ] ✅ 구조 변경을 CLAUDE.md `File Structure` 섹션에 즉시 반영
- [ ] ✅ 변경 항목에 용도 주석 추가
- [ ] ✅ 문서-실제 디렉토리 일치 확인

#### 백업 / 파일 수정 시
- [ ] ✅ 수정 전 백업 생성 (`{원본}_bak_{이유}_{날짜}_{시간}.{ext}`)
- [ ] ✅ 백업 검증(존재·크기) 완료
- [ ] ⚠️ 백업 실패 시 수정 중단

#### 백업 파일 정리 시
- [ ] ✅ `_bak` 디렉토리 생성 (`mkdir -p _bak`)
- [ ] ⚠️ **`rm` 미사용 확인** — `mv`로 `_bak/` 이동만
- [ ] ✅ 정리 결과 보고

#### 디렉토리 작업 시
- [ ] ✅ 작업 내용 사용자에게 설명 + 명시적 승인
- [ ] ✅ 백업 생성 후 실행, 결과 보고

#### 코드 제공 시
- [ ] ✅ Read/Grep로 연관 파일 확인 후 검증된 코드 제공
- [ ] ❌ 추측/가정 기반 코드 금지

<!-- ▼ 프로젝트 고유 규칙 체크 항목이 있으면 아래에 추가 -->
#### {{CUSTOM_RULE}} 적용 시
- [ ] ✅ {{고유 규칙 체크 항목}}

---

**Last Updated**: {{YYYY-MM-DD}}
**Version**: {{VERSION}}
**Maintainer**: {{TEAM_OR_OWNER}}

**⚠️ CRITICAL RULES 요약:**
- 백업 파일 삭제 절대 금지 (`rm` 금지, `mv _bak/` 필수)
- 사용자 동의 없는 디렉토리 삭제/이름변경 절대 금지
- 코드 제공 전 연관 파일 검증 필수
- File Structure 변경 시 문서 즉시 동기화
- {{프로젝트 고유 CRITICAL 규칙}}
