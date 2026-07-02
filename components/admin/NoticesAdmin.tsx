"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
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

/** 라벨 + 입력 래퍼 (필수/보조설명) */
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground">
        {label}
        {required && <span className="ml-0.5 text-point">*</span>}
        {hint && (
          <span className="ml-1.5 font-normal text-muted-foreground">{hint}</span>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
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
  const [dragOver, setDragOver] = useState(false);
  const [origImages, setOrigImages] = useState<string[]>([]); // 편집 시작 시점의 저장된 이미지
  const [sessionUploads, setSessionUploads] = useState<string[]>([]); // 이번 편집에서 새로 올린 이미지

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
      setSessionUploads((prev) => [...prev, ...added]);
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

  /** 선택 이미지를 맨 앞(대표)으로 이동 */
  function setCover(idx: number) {
    if (!draft || idx === 0) return;
    const imgs = [...draft.images];
    const [pick] = imgs.splice(idx, 1);
    imgs.unshift(pick);
    setDraft({ ...draft, images: imgs });
  }

  /** 목록에서 공지 클릭 → 편집/보기 진입 */
  function openDraft(n: Notice) {
    setError("");
    setOrigImages(n.images ?? []);
    setSessionUploads([]);
    setDraft({
      id: n.id,
      slug: n.slug,
      title: n.title,
      content: n.content ?? "",
      notice_date: n.notice_date,
      images: n.images ?? [],
      is_featured: n.is_featured,
    });
  }

  /** 새 공지 시작 */
  function startNew() {
    setError("");
    setOrigImages([]);
    setSessionUploads([]);
    setDraft(emptyDraft());
  }

  /** 저장 없이 나가기 — 이번에 올렸지만 저장 안 된 파일은 Storage에서 제거(고아 방지) */
  async function cancelEdit() {
    const toDelete = sessionUploads.filter((p) => !origImages.includes(p));
    if (toDelete.length) {
      await supabase.storage.from(BUCKET).remove(toDelete);
    }
    setSessionUploads([]);
    setOrigImages([]);
    setDraft(null);
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
      // 저장 후 정리: 원본/이번 업로드 중 최종 목록에 없는 파일은 Storage에서 삭제(고아 방지)
      const finalSet = new Set(draft.images);
      const orphans = Array.from(
        new Set([...origImages, ...sessionUploads]),
      ).filter((p) => !finalSet.has(p));
      if (orphans.length) {
        await supabase.storage.from(BUCKET).remove(orphans);
      }
      setOrigImages([]);
      setSessionUploads([]);
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
        <button
          type="button"
          onClick={cancelEdit}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← 공지 목록
        </button>
        <h1 className="mt-2 text-h2 font-bold text-foreground">
          {draft.id ? "공지 수정" : "새 공지"}
        </h1>

        <div className="mt-7 rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-card sm:p-8">
          <div className="space-y-6">
            {/* 제목 */}
            <Field label="제목" required>
              <input
                className={`${fieldBase} h-12 text-base`}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="공지 제목을 입력하세요"
              />
            </Field>

            {/* 날짜 + 노출 토글 */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="날짜">
                <input
                  type="date"
                  className={`${fieldBase} h-11`}
                  value={draft.notice_date}
                  onChange={(e) =>
                    setDraft({ ...draft, notice_date: e.target.value })
                  }
                />
              </Field>
              <Field label="메인 배너 노출">
                <div className="flex h-11 items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={draft.is_featured}
                    onClick={() =>
                      setDraft({ ...draft, is_featured: !draft.is_featured })
                    }
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                      draft.is_featured ? "bg-point" : "bg-border"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        draft.is_featured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {draft.is_featured ? "홈 배너에 노출됨" : "노출 안 함"}
                  </span>
                </div>
              </Field>
            </div>

            {/* 본문 */}
            <Field label="본문" hint="(선택)">
              <textarea
                className={`${fieldBase} min-h-28 py-2.5 leading-relaxed resize-y`}
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                placeholder="본문 내용 (없으면 비워두세요)"
              />
            </Field>

            {/* 포스터 이미지 */}
            <div>
              <label className="block text-sm font-semibold text-foreground">
                포스터 이미지
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                첫 번째 이미지가 대표(썸네일·배너)로 쓰입니다. 이미지에 마우스를 올려 대표
                지정·삭제할 수 있어요.
              </p>

              {draft.images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {draft.images.map((path, i) => (
                    <div
                      key={path}
                      className="group relative aspect-[3/4] overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicUrl(path)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      {i === 0 ? (
                        <span className="absolute left-1.5 top-1.5 rounded bg-point px-1.5 py-0.5 text-[10px] font-bold text-white shadow">
                          대표
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setCover(i)}
                          className="absolute left-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                        >
                          대표로
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        aria-label="이미지 삭제"
                        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-sm text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 드롭존(클릭 또는 드래그&드롭 업로드) */}
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!busy) setDragOver(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  if (!busy) setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (!busy) onUpload(e.dataTransfer.files);
                }}
                className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[var(--radius-md)] border-2 border-dashed px-4 py-8 text-center transition-colors ${
                  dragOver
                    ? "border-point bg-point/5"
                    : "border-border bg-surface/40 hover:border-point/50 hover:bg-surface"
                }`}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={dragOver ? "text-point" : "text-muted-foreground"}
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                <span className="text-sm font-semibold text-foreground">
                  {busy
                    ? "업로드 중…"
                    : dragOver
                      ? "여기에 놓으세요"
                      : "클릭 또는 드래그하여 포스터 이미지 추가"}
                </span>
                <span className="text-xs text-muted-foreground">
                  여러 장 가능 · JPG·PNG
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={busy}
                  onChange={(e) => onUpload(e.target.files)}
                />
              </label>
            </div>
          </div>

          {error && <p className="mt-6 text-sm text-error">{error}</p>}

          {/* 액션 */}
          <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
            <Button variant="primary" onClick={save} disabled={busy}>
              {busy ? "저장 중…" : "저장"}
            </Button>
            <Button variant="ghost" onClick={cancelEdit} disabled={busy}>
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
        <Button variant="primary" onClick={startNew}>
          새 공지
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {notices.length === 0 ? (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          등록된 공지가 없습니다. "새 공지"로 추가하세요.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border">
          {notices.map((n) => (
            <li
              key={n.id}
              className="group flex items-center gap-3 pr-3 transition-colors hover:bg-surface"
            >
              {/* 행 클릭 → 편집/보기 진입 */}
              <button
                type="button"
                onClick={() => openDraft(n)}
                className="flex min-w-0 flex-1 items-center gap-4 py-3.5 pl-4 text-left"
              >
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
                    <p className="truncate font-semibold text-foreground transition-colors group-hover:text-point">
                      {n.title}
                    </p>
                    {n.is_featured && (
                      <span className="shrink-0 rounded-full border border-point/40 px-2 py-0.5 text-[11px] font-bold text-point">
                        메인
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {n.notice_date}
                  </p>
                </div>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0 text-muted-foreground/50 transition-colors group-hover:text-point"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => remove(n)}
                disabled={busy}
                className="shrink-0 rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-sm font-semibold text-error transition-colors hover:border-error"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
