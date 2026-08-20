"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-3.5 text-sm text-foreground transition-colors " +
  "placeholder:text-muted-foreground hover:border-point/40 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** 비밀번호 최소 길이 — Edge Function(admin-users)·Supabase Auth 기준과 동일하게 6자. */
const MIN_LENGTH = 6;

/**
 * 내 비밀번호 변경 — 로그인한 본인이 직접(등급 무관).
 * service_role 없이 `supabase.auth.updateUser`로 처리하므로 Edge Function을 거치지 않는다.
 * 세션 탈취만으로 비밀번호가 바뀌지 않도록, 변경 전 현재 비밀번호로 재인증한다.
 */
export default function PasswordChange() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/admin/login");
        return;
      }
      if (!active) return;
      setEmail(data.session.user.email ?? "");
      setStatus("ready");
    })();
    return () => {
      active = false;
    };
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!current || !next || !confirm) {
      setError("모든 항목을 입력해 주세요.");
      return;
    }
    if (next.length < MIN_LENGTH) {
      setError(`새 비밀번호는 ${MIN_LENGTH}자 이상이어야 합니다.`);
      return;
    }
    if (next !== confirm) {
      setError("새 비밀번호가 서로 다릅니다.");
      return;
    }
    if (next === current) {
      setError("현재 비밀번호와 다른 비밀번호를 입력해 주세요.");
      return;
    }

    setBusy(true);
    try {
      // 1) 현재 비밀번호 재확인 (본인 확인)
      const { error: reauthErr } = await supabase.auth.signInWithPassword({
        email,
        password: current,
      });
      if (reauthErr) {
        setError("현재 비밀번호가 올바르지 않습니다.");
        return;
      }

      // 2) 변경
      const { error: updateErr } = await supabase.auth.updateUser({
        password: next,
      });
      if (updateErr) {
        setError("비밀번호를 변경하지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
    } catch {
      setError("요청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <p className="text-center text-sm text-muted-foreground">불러오는 중…</p>;
  }

  return (
    <div>
      <Link
        href="/admin/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← 대시보드
      </Link>
      <h1 className="mt-2 text-h2 font-bold text-foreground">내 비밀번호 변경</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        임시 비밀번호로 처음 로그인했다면 <b>반드시 본인만 아는 비밀번호로 변경</b>해
        주세요. 과목·이름(로그인 아이디)은 그대로입니다.
      </p>

      {done ? (
        <div className="mt-6 rounded-[var(--radius-lg)] border-2 border-point bg-background p-6 shadow-card">
          <p className="text-sm font-semibold text-point">
            비밀번호를 변경했습니다.
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            다음 로그인부터 새 비밀번호를 사용하세요.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/admin/dashboard" variant="primary">
              대시보드로
            </Button>
            <Button variant="ghost" onClick={() => setDone(false)}>
              다시 변경
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-card"
        >
          <div className="grid gap-5">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-semibold text-foreground"
              >
                현재 비밀번호
              </label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                className={`${fieldBase} mt-1.5 h-11`}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-semibold text-foreground"
              >
                새 비밀번호
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                className={`${fieldBase} mt-1.5 h-11`}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder={`${MIN_LENGTH}자 이상`}
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-semibold text-foreground"
              >
                새 비밀번호 확인
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                className={`${fieldBase} mt-1.5 h-11`}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-error">{error}</p>}

          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              disabled={busy}
              className="w-full"
            >
              {busy ? "변경 중…" : "비밀번호 변경"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
