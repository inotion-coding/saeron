"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";

const BUCKET = "notice-images";

type Notice = {
  id: string;
  slug: string;
  title: string;
  content: string;
  notice_date: string;
  images: string[];
  is_featured: boolean;
};

type Draft = {
  id?: string;
  slug?: string;
  title: string;
  content: string;
  notice_date: string;
  images: string[];
  is_featured: boolean;
};

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground transition-colors " +
  "placeholder:text-muted-foreground hover:border-point/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function publicUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function emptyDraft(): Draft {
  return {
    title: "",
    content: "",
    notice_date: todayStr(),
    images: [],
    is_featured: false,
  };
}


/**
 * 공지 관리 (level ≤ 2) — 목록 / 추가 / 수정 / 삭제 + 포스터 업로드.
 * 데이터: public.notices (Supabase), 이미지: Storage 'notice-images'.
 */
export default function NoticesAdmin() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "ready" | "denied">("loading");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null); // null=목록, 값=편집
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadNotices = useCallback(async () => {
    const { data } = await supabase
      .from("notices")
      .select("id, slug, title, content, notice_date, images, is_featured")
      .order("notice_date", { ascending: false })
      .order("created_at", { ascending: false });
    setNotices((data as Notice[]) ?? []);
  }, []);

  // 세션·등급 확인
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
      if (!prof || (prof as { level: number }).level > 2) {
        setStatus("denied");
        return;
      }
      await loadNotices();
      if (active) setStatus("ready");
    })();
    return () => {
      active = false;
    };
  }, [router, loadNotices]);

  async function onUpload(files: FileList | null) {
    if (!files || !draft) return;
    setBusy(true);
    setError("");
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        added.push(path);
      }
      setDraft({ ...draft, images: [...draft.images, ...added] });
    } catch {
      setError("이미지 업로드에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  function removeImage(idx: number) {
    if (!draft) return;
    setDraft({ ...draft, images: draft.images.filter((_, i) => i !== idx) });
  }

  async function save() {
    if (!draft) return;
    if (!draft.title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const payload = {
        title: draft.title.trim(),
        content: draft.content,
        notice_date: draft.notice_date || todayStr(),
        images: draft.images,
        is_featured: draft.is_featured,
      };
      if (draft.id) {
        const { error: e } = await supabase
          .from("notices")
          .update(payload)
          .eq("id", draft.id);
        if (e) throw e;
      } else {
        const slug = `${payload.notice_date}-${Math.random().toString(36).slice(2, 6)}`;
        const { error: e } = await supabase
          .from("notices")
          .insert({ ...payload, slug });
        if (e) throw e;
      }
      setDraft(null);
      await loadNotices();
    } catch {
      setError("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(n: Notice) {
    if (!window.confirm(`"${n.title}" 공지를 삭제할까요?`)) return;
    setBusy(true);
    setError("");
    try {
      const { error: e } = await supabase.from("notices").delete().eq("id", n.id);
      if (e) throw e;
      if (n.images?.length) {
        await supabase.storage.from(BUCKET).remove(n.images);
      }
      await loadNotices();
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
          공지 관리 권한이 없습니다. (2급 이상 필요)
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

  // ── 편집 화면 ──────────────────────────────
  if (draft) {
    return (
      <div>
        <h1 className="text-h2 font-bold text-foreground">
          {draft.id ? "공지 수정" : "새 공지"}
        </h1>

        <div className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-foreground">제목</label>
            <input
              className={`${fieldBase} mt-1.5`}
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="공지 제목"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-[200px_1fr] sm:items-center">
            <div>
              <label className="block text-sm font-semibold text-foreground">날짜</label>
              <input
                type="date"
                className={`${fieldBase} mt-1.5`}
                value={draft.notice_date}
                onChange={(e) => setDraft({ ...draft, notice_date: e.target.value })}
              />
            </div>
            <label className="mt-1.5 inline-flex cursor-pointer items-center gap-2 sm:mt-7">
              <input
                type="checkbox"
                checked={draft.is_featured}
                onChange={(e) => setDraft({ ...draft, is_featured: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-point)]"
              />
              <span className="text-sm text-foreground">메인 배너에 노출</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground">
              본문 <span className="font-normal text-muted-foreground">(선택)</span>
            </label>
            <textarea
              className={`${fieldBase} mt-1.5 min-h-28 resize-y`}
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              placeholder="본문 내용 (없으면 비워두세요)"
            />
          </div>

          {/* 포스터 이미지 */}
          <div>
            <label className="block text-sm font-semibold text-foreground">
              포스터 이미지 <span className="font-normal text-muted-foreground">(첫 번째가 대표)</span>
            </label>
            {draft.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-3">
                {draft.images.map((path, i) => (
                  <div
                    key={path}
                    className="relative h-28 w-24 overflow-hidden rounded-[var(--radius-sm)] border border-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicUrl(path)}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-point px-1.5 py-0.5 text-[10px] font-bold text-white">
                        대표
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
                      aria-label="이미지 삭제"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-foreground hover:border-point/50">
              이미지 추가
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onUpload(e.target.files)}
              />
            </label>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button variant="primary" onClick={save} disabled={busy}>
              {busy ? "저장 중…" : "저장"}
            </Button>
            <Button variant="ghost" onClick={() => setDraft(null)} disabled={busy}>
              취소
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── 목록 화면 ──────────────────────────────
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
          <h1 className="mt-2 text-h2 font-bold text-foreground">공지 관리</h1>
        </div>
        <Button variant="primary" onClick={() => setDraft(emptyDraft())}>
          새 공지
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {notices.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          등록된 공지가 없습니다. "새 공지"로 추가하세요.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border border-y border-border">
          {notices.map((n) => (
            <li key={n.id} className="flex items-center gap-4 py-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface">
                {n.images?.[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={publicUrl(n.images[0])}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-foreground">{n.title}</p>
                  {n.is_featured && (
                    <span className="shrink-0 rounded-full border border-point/40 px-2 py-0.5 text-[11px] font-bold text-point">
                      메인
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{n.notice_date}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDraft({
                      id: n.id,
                      slug: n.slug,
                      title: n.title,
                      content: n.content ?? "",
                      notice_date: n.notice_date,
                      images: n.images ?? [],
                      is_featured: n.is_featured,
                    })
                  }
                  className="rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-sm font-semibold text-foreground hover:border-point/50"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => remove(n)}
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
