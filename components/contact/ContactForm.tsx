"use client";

import { useState, type ReactNode } from "react";
import Button from "@/components/ui/Button";

const SUBJECTS = ["국어", "수학", "영어", "사회", "과학", "기타"];

type Errors = { name?: string; phone?: string; agree?: string };

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-transparent bg-surface px-3.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground";

function inputCls(error?: string) {
  return `${fieldBase} h-11 ${
    error ? "border-error" : "hover:border-point/40"
  }`;
}

/** 라벨 + 필드 래퍼 */
function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-foreground">
        {label}
        {required && <span className="ml-0.5 text-error">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

/** 커스텀 셀렉트 (네이티브 화살표 제거 + 골드 무채 셰브론) */
function Select({
  id,
  name,
  defaultValue,
  options,
}: {
  id: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className={`${inputCls()} cursor-pointer appearance-none pr-9`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** 관심 과목 복수 선택 칩 (checkbox 기반, 선택 시 금색) */
function SubjectChip({ value }: { value: string }) {
  return (
    <label className="cursor-pointer">
      <input
        type="checkbox"
        name="subjects"
        value={value}
        className="peer sr-only"
      />
      <span className="inline-flex select-none items-center rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-point/50 peer-checked:border-point peer-checked:bg-point/10 peer-checked:font-semibold peer-checked:text-point peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        {value}
      </span>
    </label>
  );
}

/**
 * 상담 신청 폼 (client) — DESIGN.md §6 (상담)
 * 카드 컨테이너는 페이지에서 제공. 검증 실패 시 필드별 에러.
 * TODO(form): 실제 전송(이메일/DB) 미연동 — 현재는 접수 메시지만(데모).
 */
export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = (data.get("name") as string)?.trim() ?? "";
    const phone = (data.get("phone") as string)?.trim() ?? "";
    const agree = data.get("agree");

    const next: Errors = {};
    if (!name) next.name = "이름을 입력해 주세요.";
    if (!phone) next.phone = "연락처를 입력해 주세요.";
    else if (!/^[0-9+\-\s]{7,}$/.test(phone))
      next.phone = "올바른 연락처를 입력해 주세요.";
    if (!agree) next.agree = "개인정보 수집·이용에 동의해 주세요.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TODO(form): 실제 전송 연동. 현재는 접수 처리만.
    setSubmitted(true);
    form.reset();
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12.5l4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-5 text-h3 font-bold text-foreground">
          상담 신청이 접수되었습니다
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          확인 후 빠르게 연락드리겠습니다. 급하신 경우 전화(031-257-0011)로
          문의해 주세요.
        </p>
        <Button variant="secondary" className="mt-6" onClick={() => setSubmitted(false)}>
          새 상담 신청
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Field id="name" label="이름" required error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="학생 또는 학부모 성함"
          aria-invalid={!!errors.name}
          className={inputCls(errors.name)}
        />
      </Field>

      <Field id="phone" label="연락처" required error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          placeholder="010-0000-0000"
          aria-invalid={!!errors.phone}
          className={inputCls(errors.phone)}
        />
      </Field>

      <Field id="division" label="구분">
        <Select
          id="division"
          name="division"
          defaultValue="중등부"
          options={["중등부", "고등부"]}
        />
      </Field>

      <div>
        <p className="text-sm font-semibold text-foreground">
          관심 과목
          <span className="ml-1.5 text-xs font-normal text-muted-foreground">
            복수 선택 가능
          </span>
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <SubjectChip key={s} value={s} />
          ))}
        </div>
      </div>

      <Field id="message" label="문의 내용">
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="학년·현재 성적·상담 희망 시간 등을 적어 주시면 더 정확히 안내해 드립니다."
          className={`${fieldBase} resize-y py-2.5 hover:border-point/40`}
        />
      </Field>

      <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="agree"
          aria-invalid={!!errors.agree}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
        />
        <span>
          개인정보 수집·이용에 동의합니다.{" "}
          <span className="text-muted-foreground/80">
            (상담 목적 외 사용하지 않으며 상담 완료 후 파기)
          </span>
        </span>
      </label>
      {errors.agree && <p className="-mt-2 text-xs text-error">{errors.agree}</p>}

      <Button type="submit" size="lg" className="mt-1 w-full" withArrow>
        상담 신청하기
      </Button>
    </form>
  );
}
