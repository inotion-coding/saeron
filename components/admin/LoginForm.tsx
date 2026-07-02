"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";

/** 로그인 '과목' 선택지 — 강사는 담당 과목, 관리자(개발자·원장·실장 등)는 '관리자' */
const SUBJECTS = ["국어", "수학", "영어", "사회", "과학", "관리자"];

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-3.5 text-sm text-foreground transition-colors " +
  "placeholder:text-muted-foreground hover:border-point/40 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * 관리자 로그인 폼 — (과목 + 이름 + 비밀번호).
 * (과목,이름) → 이메일은 Supabase 함수 resolve_login_email 로 조회 후 비밀번호 로그인.
 * 성공 시 /admin/dashboard 로 이동.
 */
export default function LoginForm() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!subject || !name.trim() || !password) {
      setError("과목·이름·비밀번호를 모두 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      // 1) (과목,이름) → 로그인 이메일 조회
      const { data: email, error: rpcErr } = await supabase.rpc(
        "resolve_login_email",
        { p_subject: subject, p_name: name.trim() },
      );
      if (rpcErr) throw rpcErr;
      if (!email) {
        setError("등록되지 않은 과목·이름입니다. 관리자에게 문의하세요.");
        return;
      }

      // 2) 비밀번호 로그인
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: email as string,
        password,
      });
      if (signErr) {
        setError("비밀번호가 올바르지 않습니다.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 text-left">
      {/* 과목 */}
      <div>
        <label htmlFor="subject" className="block text-sm font-semibold text-foreground">
          과목
        </label>
        <div className="mt-1.5">
          <select
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`${fieldBase} h-11 cursor-pointer appearance-none pr-9`}
          >
            <option value="" disabled>
              과목 선택
            </option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 이름 */}
      <div className="mt-4">
        <label htmlFor="name" className="block text-sm font-semibold text-foreground">
          이름
        </label>
        <div className="mt-1.5">
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="username"
            placeholder="선생님 이름"
            className={`${fieldBase} h-11`}
          />
        </div>
      </div>

      {/* 비밀번호 */}
      <div className="mt-4">
        <label htmlFor="password" className="block text-sm font-semibold text-foreground">
          비밀번호
        </label>
        <div className="mt-1.5">
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="비밀번호"
            className={`${fieldBase} h-11`}
          />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      <Button
        type="submit"
        variant="primary"
        className="mt-6 w-full"
        disabled={loading}
      >
        {loading ? "로그인 중…" : "로그인"}
      </Button>

      <Link
        href="/"
        className="mt-5 block text-center text-sm font-semibold text-muted-foreground underline-offset-2 transition-colors hover:text-point hover:underline"
      >
        ← 홈으로
      </Link>
    </form>
  );
}
