"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Inquiry = {
  id: string;
  name: string;
  phone: string;
  division: string | null;
  subjects: string[];
  message: string | null;
  is_handled: boolean;
  created_at: string;
};

function fmtDate(iso: string) {
  // YYYY-MM-DD HH:MM (로컬 표기 없이 ISO 앞부분 사용 — 빌드/타임존 안전)
  const d = iso.replace("T", " ");
  return d.slice(0, 16);
}

/**
 * 상담 신청 관리 — 1·2급만. 공개 폼(inquiries) 제출 열람 + 처리표시 + 삭제.
 */
export default function InquiriesAdmin() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "denied">("loading");
  const [items, setItems] = useState<Inquiry[]>([]);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("inquiries")
      .select("id, name, phone, division, subjects, message, is_handled, created_at")
      .order("created_at", { ascending: false });
    setItems((data as Inquiry[]) ?? []);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) {
        router.replace("/admin/login");
        return;
      }
      const { data: prof } = await supabase
        .from("profiles")
        .select("level")
        .eq("id", s.session.user.id)
        .single();
      if (!active) return;
      const lv = (prof as { level: number } | null)?.level ?? 9;
      if (lv > 2) {
        setStatus("denied");
        return;
      }
      await load();
      if (active) setStatus("ready");
    })();
    return () => {
      active = false;
    };
  }, [router, load]);

  async function toggleHandled(it: Inquiry) {
    setBusy(true);
    setError("");
    try {
      const { error: e } = await supabase
        .from("inquiries")
        .update({ is_handled: !it.is_handled })
        .eq("id", it.id);
      if (e) throw e;
      await load();
    } catch {
      setError("변경에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(it: Inquiry) {
    if (!window.confirm(`"${it.name}" 상담 신청을 삭제할까요?`)) return;
    setBusy(true);
    setError("");
    try {
      const { error: e } = await supabase.from("inquiries").delete().eq("id", it.id);
      if (e) throw e;
      await load();
    } catch {
      setError("삭제에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") {
    return <p className="text-center text-sm text-muted-foreground">불러오는 중…</p>;
  }
  if (status === "denied") {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          상담 신청은 2급 이상만 볼 수 있습니다.
        </p>
        <Link
          href="/admin/dashboard"
          className="mt-4 inline-block text-sm font-semibold text-point hover:underline"
        >
          ← 대시보드
        </Link>
      </div>
    );
  }

  const openCount = items.filter((i) => !i.is_handled).length;
  const shown = onlyOpen ? items.filter((i) => !i.is_handled) : items;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← 대시보드
          </Link>
          <h1 className="mt-2 text-h2 font-bold text-foreground">
            상담 신청
            {openCount > 0 && (
              <span className="ml-2 rounded-full bg-point px-2 py-0.5 text-sm font-bold text-white align-middle">
                미처리 {openCount}
              </span>
            )}
          </h1>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={onlyOpen}
            onChange={(e) => setOnlyOpen(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-point)]"
          />
          미처리만 보기
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {shown.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          {items.length === 0 ? "접수된 상담 신청이 없습니다." : "미처리 상담이 없습니다."}
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {shown.map((it) => (
            <li
              key={it.id}
              className={`rounded-[var(--radius-lg)] border p-5 shadow-card transition-colors ${
                it.is_handled
                  ? "border-border bg-surface/40 opacity-75"
                  : "border-point/40 bg-background"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-h3 font-bold text-foreground">{it.name}</p>
                    {it.division && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {it.division}
                      </span>
                    )}
                    {it.is_handled ? (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        처리완료
                      </span>
                    ) : (
                      <span className="rounded-full bg-point/10 px-2 py-0.5 text-[11px] font-bold text-point">
                        미처리
                      </span>
                    )}
                  </div>
                  <a
                    href={`tel:${it.phone}`}
                    className="mt-1 inline-block text-sm font-semibold text-accent hover:underline"
                  >
                    {it.phone}
                  </a>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {fmtDate(it.created_at)}
                </p>
              </div>

              {it.subjects?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {it.subjects.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-point/30 bg-point/5 px-2 py-0.5 text-xs text-point"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {it.message && (
                <p className="mt-3 whitespace-pre-line rounded-[var(--radius-md)] bg-surface px-3.5 py-3 text-sm leading-relaxed text-foreground/90">
                  {it.message}
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleHandled(it)}
                  disabled={busy}
                  className="rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-sm font-semibold text-foreground hover:border-point/50"
                >
                  {it.is_handled ? "미처리로" : "처리완료로"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(it)}
                  disabled={busy}
                  className="rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-sm font-semibold text-error hover:border-error"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
