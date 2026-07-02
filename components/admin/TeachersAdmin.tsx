"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import {
  teachers as seedTeachers,
  DIVISIONS,
  SUBJECT_GROUPS,
  type Division,
} from "@/lib/data/teachers";

const BUCKET = "teacher-photos";

type TeacherRow = {
  id: string;
  slug: string;
  name: string;
  photo_path: string | null;
  divisions: Division[];
  subject_group: string;
  subject: string;
  resolve: string;
  education: string[];
  experience: string[];
  achievements: string[];
  books: string[];
  sort_order: number;
  is_visible: boolean;
};

type Draft = {
  id?: string;
  slug?: string;
  name: string;
  photo_path: string | null;
  divisions: Division[];
  subject_group: string;
  subject: string;
  resolve: string;
  education: string[];
  experience: string[];
  achievements: string[];
  books: string[];
  sort_order: number;
  is_visible: boolean;
};

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-3.5 text-sm text-foreground transition-colors " +
  "placeholder:text-muted-foreground hover:border-point/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function publicUrl(path: string) {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function emptyDraft(order: number): Draft {
  return {
    name: "",
    photo_path: null,
    divisions: [],
    subject_group: "국어",
    subject: "",
    resolve: "",
    education: [],
    experience: [],
    achievements: [],
    books: [],
    sort_order: order,
    is_visible: true,
  };
}

/** 라벨 래퍼 */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground">
        {label}
        {hint && (
          <span className="ml-1.5 font-normal text-muted-foreground">{hint}</span>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/** 여러 줄(문자열 배열) 편집 — 학력·이력·실적·저서 */
function ArrayField({
  label,
  hint,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={`${fieldBase} h-10`}
              value={v}
              placeholder={placeholder}
              onChange={(e) =>
                onChange(values.map((x, j) => (j === i ? e.target.value : x)))
              }
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, j) => j !== i))}
              aria-label="줄 삭제"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border text-muted-foreground transition-colors hover:border-error hover:text-error"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="rounded-[var(--radius-md)] border border-dashed border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-point/50 hover:text-foreground"
        >
          + 줄 추가
        </button>
      </div>
    </Field>
  );
}

/**
 * 강사 프로필 관리 — 목록/편집 + 사진 업로드.
 * 권한: 1·2급 전체 / 3급 본인만(RLS가 서버에서 강제). 데이터: public.teachers, 사진: Storage 'teacher-photos'.
 */
export default function TeachersAdmin() {
  const router = useRouter();
  const [level, setLevel] = useState<number>(9);
  const [myTeacherId, setMyTeacherId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied">("loading");
  const [rows, setRows] = useState<TeacherRow[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [origPhoto, setOrigPhoto] = useState<string | null>(null);
  const [sessionPhotos, setSessionPhotos] = useState<string[]>([]);

  const load = useCallback(async (lv: number, ownId: string | null) => {
    let query = supabase
      .from("teachers")
      .select(
        "id, slug, name, photo_path, divisions, subject_group, subject, resolve, education, experience, achievements, books, sort_order, is_visible",
      );
    // 3급(선생님)은 본인 프로필만
    if (lv >= 3) {
      query = query.eq("id", ownId ?? "00000000-0000-0000-0000-000000000000");
    }
    const { data } = await query
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    setRows((data as TeacherRow[]) ?? []);
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
        .select("level, teacher_id")
        .eq("id", s.session.user.id)
        .single();
      if (!active) return;
      const p = prof as { level: number; teacher_id: string | null } | null;
      const lv = p?.level ?? 9;
      const tid = p?.teacher_id ?? null;
      setLevel(lv);
      setMyTeacherId(tid);
      if (lv > 3) {
        setStatus("denied");
        return;
      }
      await load(lv, tid);
      if (active) setStatus("ready");
    })();
    return () => {
      active = false;
    };
  }, [router, load]);

  const canManageAll = level <= 2;

  async function onUploadPhoto(files: FileList | null) {
    if (!files || !files[0] || !draft) return;
    setBusy(true);
    setError("");
    try {
      const file = files[0];
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;
      setSessionPhotos((prev) => [...prev, path]);
      setDraft({ ...draft, photo_path: path });
    } catch {
      setError("사진 업로드에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  function toggleDivision(d: Division) {
    if (!draft) return;
    const has = draft.divisions.includes(d);
    setDraft({
      ...draft,
      divisions: has
        ? draft.divisions.filter((x) => x !== d)
        : [...draft.divisions, d],
    });
  }

  function openEdit(t: TeacherRow) {
    setError("");
    setOrigPhoto(t.photo_path);
    setSessionPhotos([]);
    setDraft({
      id: t.id,
      slug: t.slug,
      name: t.name,
      photo_path: t.photo_path,
      divisions: t.divisions ?? [],
      subject_group: t.subject_group,
      subject: t.subject ?? "",
      resolve: t.resolve ?? "",
      education: t.education ?? [],
      experience: t.experience ?? [],
      achievements: t.achievements ?? [],
      books: t.books ?? [],
      sort_order: t.sort_order ?? 0,
      is_visible: t.is_visible,
    });
  }

  function startNew() {
    setError("");
    setOrigPhoto(null);
    setSessionPhotos([]);
    setDraft(emptyDraft(rows.length));
  }

  /** 저장 안 하고 나가기 — 이번에 올린(미저장) 사진 정리 */
  async function cancelEdit() {
    const toDelete = sessionPhotos.filter((p) => p !== origPhoto);
    if (toDelete.length) await supabase.storage.from(BUCKET).remove(toDelete);
    setSessionPhotos([]);
    setOrigPhoto(null);
    setDraft(null);
  }

  async function save() {
    if (!draft) return;
    if (!draft.name.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }
    if (draft.divisions.length === 0) {
      setError("소속 부(중등부/고등부)를 하나 이상 선택해 주세요.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);
      const payload = {
        name: draft.name.trim(),
        photo_path: draft.photo_path,
        divisions: draft.divisions,
        subject_group: draft.subject_group,
        subject: draft.subject.trim(),
        resolve: draft.resolve,
        education: clean(draft.education),
        experience: clean(draft.experience),
        achievements: clean(draft.achievements),
        books: clean(draft.books),
        sort_order: draft.sort_order,
        is_visible: draft.is_visible,
      };
      if (draft.id) {
        const { error: e } = await supabase
          .from("teachers")
          .update(payload)
          .eq("id", draft.id);
        if (e) throw e;
      } else {
        const slug = `t-${Math.random().toString(36).slice(2, 8)}`;
        const { error: e } = await supabase
          .from("teachers")
          .insert({ ...payload, slug });
        if (e) throw e;
      }
      // 사진 정리: 원본/이번 업로드 중 최종 사진이 아닌 것 삭제
      const candidates = [origPhoto, ...sessionPhotos].filter(
        (p): p is string => !!p,
      );
      const orphans = Array.from(new Set(candidates)).filter(
        (p) => p !== draft.photo_path,
      );
      if (orphans.length) await supabase.storage.from(BUCKET).remove(orphans);
      setOrigPhoto(null);
      setSessionPhotos([]);
      setDraft(null);
      await load(level, myTeacherId);
    } catch {
      setError("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(t: TeacherRow) {
    if (!window.confirm(`"${t.name}" 강사를 삭제할까요?`)) return;
    setBusy(true);
    setError("");
    try {
      const { error: e } = await supabase.from("teachers").delete().eq("id", t.id);
      if (e) throw e;
      if (t.photo_path) await supabase.storage.from(BUCKET).remove([t.photo_path]);
      await load(level, myTeacherId);
    } catch {
      setError("삭제에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  /** 기존 코드(lib/data/teachers) 12명 → Supabase 이전 (사진 포함) */
  async function migrateSeed() {
    setBusy(true);
    setError("");
    try {
      const { data: existing } = await supabase.from("teachers").select("slug");
      const have = new Set(((existing as { slug: string }[]) ?? []).map((r) => r.slug));
      let added = 0;
      for (let i = 0; i < seedTeachers.length; i++) {
        const t = seedTeachers[i];
        if (have.has(t.id)) continue;
        let photoPath: string | null = null;
        if (t.photo) {
          const res = await fetch(t.photo);
          if (res.ok) {
            const blob = await res.blob();
            const ext = t.photo.split(".").pop() || "jpg";
            const path = `${crypto.randomUUID()}.${ext}`;
            const { error: upErr } = await supabase.storage
              .from(BUCKET)
              .upload(path, blob, { contentType: blob.type });
            if (upErr) throw upErr;
            photoPath = path;
          }
        }
        const { error: insErr } = await supabase.from("teachers").insert({
          slug: t.id,
          name: t.name,
          photo_path: photoPath,
          divisions: t.divisions,
          subject_group: t.subjectGroup,
          subject: t.subject,
          resolve: t.resolve,
          education: t.education ?? [],
          experience: t.experience ?? [],
          achievements: t.achievements ?? [],
          books: t.books ?? [],
          sort_order: i,
          is_visible: true,
        });
        if (insErr) throw insErr;
        added += 1;
      }
      await load(level, myTeacherId);
      if (added === 0) setError("이미 모두 가져와 있습니다.");
    } catch {
      setError("가져오기 중 오류가 발생했습니다. 다시 시도해 주세요.");
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
        <p className="text-sm text-muted-foreground">접근 권한이 없습니다.</p>
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
          ← 강사 목록
        </button>
        <h1 className="mt-2 text-h2 font-bold text-foreground">
          {draft.id ? "강사 프로필 수정" : "새 강사"}
        </h1>

        <div className="mt-7 rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-card sm:p-8">
          <div className="space-y-6">
            {/* 사진 + 기본 */}
            <div className="grid gap-6 sm:grid-cols-[9rem_1fr]">
              {/* 사진 */}
              <div>
                <label className="block text-sm font-semibold text-foreground">
                  사진
                </label>
                <label
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (!busy) setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (!busy) onUploadPhoto(e.dataTransfer.files);
                  }}
                  className={`mt-1.5 relative flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[var(--radius-sm)] border-2 border-dashed text-center transition-colors ${
                    dragOver
                      ? "border-point bg-point/5"
                      : "border-border bg-surface/40 hover:border-point/50"
                  }`}
                >
                  {draft.photo_path ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicUrl(draft.photo_path)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-black/55 py-1 text-[11px] font-semibold text-white">
                        {busy ? "업로드 중…" : "클릭/드롭하여 교체"}
                      </span>
                    </>
                  ) : (
                    <span className="px-2 text-xs text-muted-foreground">
                      {busy ? "업로드 중…" : "클릭 또는 드래그하여 사진 추가"}
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={busy}
                    onChange={(e) => onUploadPhoto(e.target.files)}
                  />
                </label>
                {draft.photo_path && (
                  <button
                    type="button"
                    onClick={() => setDraft({ ...draft, photo_path: null })}
                    className="mt-2 w-full text-xs font-semibold text-error hover:underline"
                  >
                    사진 제거
                  </button>
                )}
              </div>

              {/* 이름·과목군·과목·부 */}
              <div className="space-y-5">
                <Field label="이름">
                  <input
                    className={`${fieldBase} h-11`}
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="강사 이름"
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="과목군">
                    <select
                      className={`${fieldBase} h-11 cursor-pointer appearance-none pr-9`}
                      value={draft.subject_group}
                      onChange={(e) =>
                        setDraft({ ...draft, subject_group: e.target.value })
                      }
                    >
                      {SUBJECT_GROUPS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="담당 과목" hint="(표시용)">
                    <input
                      className={`${fieldBase} h-11`}
                      value={draft.subject}
                      onChange={(e) =>
                        setDraft({ ...draft, subject: e.target.value })
                      }
                      placeholder="예: 고등 국어 전과정"
                    />
                  </Field>
                </div>
                <Field label="소속 부">
                  <div className="flex gap-2.5">
                    {DIVISIONS.map((d) => {
                      const on = draft.divisions.includes(d.value);
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => toggleDivision(d.value)}
                          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                            on
                              ? "border-point bg-point/10 text-point"
                              : "border-border text-muted-foreground hover:border-point/50"
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>
            </div>

            {/* 각오 */}
            <Field label="각오 한마디">
              <textarea
                className={`${fieldBase} min-h-20 py-2.5 leading-relaxed resize-y`}
                value={draft.resolve}
                onChange={(e) => setDraft({ ...draft, resolve: e.target.value })}
                placeholder="학생에게 전하는 다짐 한마디"
              />
            </Field>

            <ArrayField
              label="학력"
              values={draft.education}
              onChange={(v) => setDraft({ ...draft, education: v })}
              placeholder="예: ○○대학교 ○○학과 졸업"
            />
            <ArrayField
              label="이력"
              values={draft.experience}
              onChange={(v) => setDraft({ ...draft, experience: v })}
              placeholder="예: 현 새론학원 ○○ 강사"
            />
            <ArrayField
              label="실적"
              hint="(선택)"
              values={draft.achievements}
              onChange={(v) => setDraft({ ...draft, achievements: v })}
              placeholder="예: ○○ 다수 배출"
            />
            <ArrayField
              label="저서"
              hint="(선택)"
              values={draft.books}
              onChange={(v) => setDraft({ ...draft, books: v })}
              placeholder="예: 『○○』 집필"
            />

            {/* 노출 토글 */}
            <Field label="공개 노출">
              <div className="flex h-11 items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={draft.is_visible}
                  onClick={() =>
                    setDraft({ ...draft, is_visible: !draft.is_visible })
                  }
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                    draft.is_visible ? "bg-point" : "bg-border"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      draft.is_visible ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-muted-foreground">
                  {draft.is_visible ? "강사 페이지에 노출됨" : "숨김"}
                </span>
              </div>
            </Field>
          </div>

          {error && <p className="mt-6 text-sm text-error">{error}</p>}

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
          <h1 className="mt-2 text-h2 font-bold text-foreground">
            {canManageAll ? "강사 프로필 관리" : "내 프로필"}
          </h1>
        </div>
        {canManageAll && (
          <Button variant="primary" onClick={startNew}>
            새 강사
          </Button>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {rows.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {canManageAll
              ? "등록된 강사가 없습니다."
              : "연결된 강사 프로필이 없습니다. 관리자에게 문의하세요."}
          </p>
          {canManageAll && (
            <div className="mt-5">
              <Button variant="secondary" onClick={migrateSeed} disabled={busy}>
                {busy ? "가져오는 중…" : "기존 강사 12명 가져오기"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                (현재 강사 12명을 사진과 함께 Supabase로 옮깁니다)
              </p>
            </div>
          )}
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border">
          {rows.map((t) => (
            <li
              key={t.id}
              className="group flex items-center gap-3 pr-3 transition-colors hover:bg-surface"
            >
              <button
                type="button"
                onClick={() => openEdit(t)}
                className="flex min-w-0 flex-1 items-center gap-4 py-3.5 pl-4 text-left"
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface">
                  {t.photo_path && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={publicUrl(t.photo_path)}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-foreground transition-colors group-hover:text-point">
                      {t.name}
                    </p>
                    {!t.is_visible && (
                      <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        숨김
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {t.subject_group} · {t.subject}
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
              {canManageAll && (
                <button
                  type="button"
                  onClick={() => remove(t)}
                  disabled={busy}
                  className="shrink-0 rounded-[var(--radius-md)] border border-border px-3 py-1.5 text-sm font-semibold text-error transition-colors hover:border-error"
                >
                  삭제
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
