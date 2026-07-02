"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { DIVISIONS, SUBJECT_GROUPS } from "@/lib/data/teachers";
import { schedules as seedSchedules, COMMON_NOTICES as seedCommon } from "@/lib/data/schedule";

type RowDraft = {
  id?: string;
  target: string;
  division: "middle" | "high";
  course: string;
  content: string;
  time_text: string;
  open_date: string;
  note: string;
};

type GroupRow = {
  id: string;
  teacher_id: string | null;
  display_name: string;
  subject_group: string;
  note: string | null;
  sort_order: number;
};

type GroupDraft = {
  id?: string;
  teacher_id: string | null;
  display_name: string;
  subject_group: string;
  note: string;
  sort_order: number;
  rows: RowDraft[];
};

type TeacherOpt = { id: string; name: string };
type CommonNotice = { id: string; text: string; sort_order: number };

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-foreground transition-colors " +
  "placeholder:text-muted-foreground hover:border-point/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function emptyRow(): RowDraft {
  return {
    target: "",
    division: "high",
    course: "",
    content: "",
    time_text: "",
    open_date: "",
    note: "",
  };
}

function emptyGroup(order: number): GroupDraft {
  return {
    teacher_id: null,
    display_name: "",
    subject_group: "국어",
    note: "",
    sort_order: order,
    rows: [emptyRow()],
  };
}

/**
 * 시간표 관리 — 강사묶음(schedule_teachers) + 수업행(schedule_rows) + 공통안내(common_notices).
 * 권한: 1·2급 전체 / 3급 본인(RLS). 데이터는 Supabase.
 */
export default function ScheduleAdmin() {
  const router = useRouter();
  const [level, setLevel] = useState(9);
  const [status, setStatus] = useState<"loading" | "ready" | "denied">("loading");
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherOpt[]>([]);
  const [common, setCommon] = useState<CommonNotice[]>([]);
  const [draft, setDraft] = useState<GroupDraft | null>(null);
  const [commonDraft, setCommonDraft] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [g, t, c] = await Promise.all([
      supabase
        .from("schedule_teachers")
        .select("id, teacher_id, display_name, subject_group, note, sort_order")
        .order("sort_order", { ascending: true }),
      supabase.from("teachers").select("id, name").order("sort_order"),
      supabase.from("common_notices").select("id, text, sort_order").order("sort_order"),
    ]);
    setGroups((g.data as GroupRow[]) ?? []);
    setTeachers((t.data as TeacherOpt[]) ?? []);
    setCommon((c.data as CommonNotice[]) ?? []);
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
      setLevel(lv);
      if (lv > 3) {
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

  const canManageAll = level <= 2;

  async function openGroup(g: GroupRow) {
    setError("");
    const { data } = await supabase
      .from("schedule_rows")
      .select("id, target, division, course, content, time_text, open_date, note")
      .eq("schedule_teacher_id", g.id)
      .order("sort_order", { ascending: true });
    const rows: RowDraft[] = ((data as RowDraft[]) ?? []).map((r) => ({
      id: r.id,
      target: r.target ?? "",
      division: r.division,
      course: r.course ?? "",
      content: r.content ?? "",
      time_text: r.time_text ?? "",
      open_date: r.open_date ?? "",
      note: r.note ?? "",
    }));
    setDraft({
      id: g.id,
      teacher_id: g.teacher_id,
      display_name: g.display_name,
      subject_group: g.subject_group,
      note: g.note ?? "",
      sort_order: g.sort_order,
      rows: rows.length ? rows : [emptyRow()],
    });
  }

  function startNewGroup() {
    setError("");
    setDraft(emptyGroup(groups.length));
  }

  function patchRow(i: number, patch: Partial<RowDraft>) {
    if (!draft) return;
    setDraft({
      ...draft,
      rows: draft.rows.map((r, j) => (j === i ? { ...r, ...patch } : r)),
    });
  }

  async function saveGroup() {
    if (!draft) return;
    if (!draft.display_name.trim()) {
      setError("강사 이름을 입력해 주세요.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const groupPayload = {
        teacher_id: draft.teacher_id,
        display_name: draft.display_name.trim(),
        subject_group: draft.subject_group,
        note: draft.note.trim() || null,
        sort_order: draft.sort_order,
      };
      let groupId = draft.id;
      if (groupId) {
        const { error: e } = await supabase
          .from("schedule_teachers")
          .update(groupPayload)
          .eq("id", groupId);
        if (e) throw e;
      } else {
        const { data, error: e } = await supabase
          .from("schedule_teachers")
          .insert(groupPayload)
          .select("id")
          .single();
        if (e) throw e;
        groupId = (data as { id: string }).id;
      }
      // 행 교체: 기존 삭제 후 재삽입(참조 없음)
      await supabase.from("schedule_rows").delete().eq("schedule_teacher_id", groupId);
      const rowsPayload = draft.rows
        .filter((r) => r.target.trim() || r.time_text.trim() || r.course.trim())
        .map((r, i) => ({
          schedule_teacher_id: groupId,
          target: r.target.trim(),
          division: r.division,
          course: r.course.trim() || null,
          content: r.content.trim() || null,
          time_text: r.time_text.trim(),
          open_date: r.open_date.trim() || null,
          note: r.note.trim() || null,
          sort_order: i,
        }));
      if (rowsPayload.length) {
        const { error: e } = await supabase.from("schedule_rows").insert(rowsPayload);
        if (e) throw e;
      }
      setDraft(null);
      await load();
    } catch {
      setError("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function removeGroup(g: GroupRow) {
    if (!window.confirm(`"${g.display_name}" 시간표를 삭제할까요?`)) return;
    setBusy(true);
    setError("");
    try {
      const { error: e } = await supabase
        .from("schedule_teachers")
        .delete()
        .eq("id", g.id);
      if (e) throw e;
      await load();
    } catch {
      setError("삭제에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function saveCommon() {
    if (!commonDraft) return;
    setBusy(true);
    setError("");
    try {
      await supabase.from("common_notices").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      const payload = commonDraft
        .map((t) => t.trim())
        .filter(Boolean)
        .map((text, i) => ({ text, sort_order: i }));
      if (payload.length) {
        const { error: e } = await supabase.from("common_notices").insert(payload);
        if (e) throw e;
      }
      setCommonDraft(null);
      await load();
    } catch {
      setError("공통 안내 저장에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  async function migrateSeed() {
    setBusy(true);
    setError("");
    try {
      const { data: existing } = await supabase.from("schedule_teachers").select("id");
      if ((existing?.length ?? 0) > 0) {
        setError("이미 시간표가 있습니다. (가져오기는 비어있을 때만)");
        return;
      }
      // 강사 slug → id 매핑
      const { data: tData } = await supabase.from("teachers").select("id, slug");
      const slugToId = new Map(
        ((tData as { id: string; slug: string }[]) ?? []).map((r) => [r.slug, r.id]),
      );
      for (let i = 0; i < seedSchedules.length; i++) {
        const s = seedSchedules[i];
        const { data: gData, error: gErr } = await supabase
          .from("schedule_teachers")
          .insert({
            teacher_id: s.teacherId ? slugToId.get(s.teacherId) ?? null : null,
            display_name: s.name,
            subject_group: s.subjectGroup,
            note: s.note ?? null,
            sort_order: i,
          })
          .select("id")
          .single();
        if (gErr) throw gErr;
        const gid = (gData as { id: string }).id;
        const rows = s.rows.map((r, j) => ({
          schedule_teacher_id: gid,
          target: r.target,
          division: r.division,
          course: r.course ?? null,
          content: r.content ?? null,
          time_text: r.time,
          open_date: r.open ?? null,
          note: r.note ?? null,
          sort_order: j,
        }));
        if (rows.length) {
          const { error: rErr } = await supabase.from("schedule_rows").insert(rows);
          if (rErr) throw rErr;
        }
      }
      // 공통 안내
      const commonPayload = seedCommon.map((text, i) => ({ text, sort_order: i }));
      if (commonPayload.length) {
        await supabase.from("common_notices").insert(commonPayload);
      }
      await load();
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

  // ── 강사묶음 편집 ──────────────────────────────
  if (draft) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setDraft(null)}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← 시간표 목록
        </button>
        <h1 className="mt-2 text-h2 font-bold text-foreground">
          {draft.id ? "시간표 수정" : "새 시간표"}
        </h1>

        <div className="mt-7 rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-card sm:p-8">
          {/* 강사 정보 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="강사 이름 (표시용)">
              <input
                className={`${fieldBase} h-10`}
                value={draft.display_name}
                onChange={(e) => setDraft({ ...draft, display_name: e.target.value })}
                placeholder="예: 채송아"
              />
            </Field>
            <Field label="과목군">
              <select
                className={`${fieldBase} h-10 cursor-pointer appearance-none pr-9`}
                value={draft.subject_group}
                onChange={(e) => setDraft({ ...draft, subject_group: e.target.value })}
              >
                {SUBJECT_GROUPS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="연결 강사 (프로필 링크·본인권한, 선택)">
              <select
                className={`${fieldBase} h-10 cursor-pointer appearance-none pr-9`}
                value={draft.teacher_id ?? ""}
                onChange={(e) =>
                  setDraft({ ...draft, teacher_id: e.target.value || null })
                }
              >
                <option value="">없음 (외부 강사)</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="강사 비고 (선택)">
              <input
                className={`${fieldBase} h-10`}
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                placeholder="예: 외고 전담"
              />
            </Field>
          </div>

          {/* 수업 행 */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 font-bold text-foreground">수업 목록</h2>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, rows: [...draft.rows, emptyRow()] })}
                className="rounded-[var(--radius-md)] border border-dashed border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-point/50 hover:text-foreground"
              >
                + 수업 추가
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {draft.rows.map((r, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius-md)] border border-border bg-surface/40 p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="대상">
                      <input
                        className={`${fieldBase} h-9`}
                        value={r.target}
                        onChange={(e) => patchRow(i, { target: e.target.value })}
                        placeholder="예: 외고2 / 일반고1"
                      />
                    </Field>
                    <Field label="부">
                      <select
                        className={`${fieldBase} h-9 cursor-pointer appearance-none pr-9`}
                        value={r.division}
                        onChange={(e) =>
                          patchRow(i, {
                            division: e.target.value as "middle" | "high",
                          })
                        }
                      >
                        {DIVISIONS.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="반/과목 (선택)">
                      <input
                        className={`${fieldBase} h-9`}
                        value={r.course}
                        onChange={(e) => patchRow(i, { course: e.target.value })}
                        placeholder="예: 1반 미적분1"
                      />
                    </Field>
                    <Field label="내용 (선택)">
                      <input
                        className={`${fieldBase} h-9`}
                        value={r.content}
                        onChange={(e) => patchRow(i, { content: e.target.value })}
                        placeholder="예: 수능특강 독서"
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="요일·시간">
                        <input
                          className={`${fieldBase} h-9`}
                          value={r.time_text}
                          onChange={(e) => patchRow(i, { time_text: e.target.value })}
                          placeholder="예: 토 4:00~7:00"
                        />
                      </Field>
                    </div>
                    <Field label="개강일 (선택)">
                      <input
                        className={`${fieldBase} h-9`}
                        value={r.open_date}
                        onChange={(e) => patchRow(i, { open_date: e.target.value })}
                        placeholder="예: 7/11"
                      />
                    </Field>
                    <Field label="비고 (선택)">
                      <input
                        className={`${fieldBase} h-9`}
                        value={r.note}
                        onChange={(e) => patchRow(i, { note: e.target.value })}
                        placeholder="예: 10명 마감"
                      />
                    </Field>
                  </div>
                  <div className="mt-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          rows: draft.rows.filter((_, j) => j !== i),
                        })
                      }
                      className="text-xs font-semibold text-error hover:underline"
                    >
                      이 수업 삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="mt-6 text-sm text-error">{error}</p>}

          <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
            <Button variant="primary" onClick={saveGroup} disabled={busy}>
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
          <h1 className="mt-2 text-h2 font-bold text-foreground">시간표 관리</h1>
        </div>
        {canManageAll && (
          <Button variant="primary" onClick={startNewGroup}>
            새 시간표
          </Button>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {groups.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">등록된 시간표가 없습니다.</p>
          {canManageAll && (
            <div className="mt-5">
              <Button variant="secondary" onClick={migrateSeed} disabled={busy}>
                {busy ? "가져오는 중…" : "기존 시간표 가져오기"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                (현재 2026 시간표 데이터를 Supabase로 옮깁니다)
              </p>
            </div>
          )}
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border">
          {groups.map((g) => (
            <li
              key={g.id}
              className="group flex items-center gap-3 pr-3 transition-colors hover:bg-surface"
            >
              <button
                type="button"
                onClick={() => openGroup(g)}
                className="flex min-w-0 flex-1 items-center gap-4 py-3.5 pl-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground transition-colors group-hover:text-point">
                    {g.display_name}
                    {g.note ? (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        · {g.note}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {g.subject_group}
                    {g.teacher_id ? " · 프로필 연결됨" : ""}
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
                  onClick={() => removeGroup(g)}
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

      {/* 공통 안내 */}
      {canManageAll && (
        <div className="mt-12 rounded-[var(--radius-lg)] border border-border bg-surface/40 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 font-bold text-foreground">공통 안내</h2>
            {commonDraft === null ? (
              <button
                type="button"
                onClick={() => setCommonDraft(common.map((c) => c.text))}
                className="text-sm font-semibold text-point hover:underline"
              >
                편집
              </button>
            ) : null}
          </div>

          {commonDraft === null ? (
            common.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                등록된 공통 안내가 없습니다.
              </p>
            ) : (
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {common.map((c) => (
                  <li key={c.id} className="flex gap-2">
                    <span className="text-point">·</span>
                    <span>{c.text}</span>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <div className="mt-4 space-y-2">
              {commonDraft.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className={`${fieldBase} h-9`}
                    value={t}
                    onChange={(e) =>
                      setCommonDraft(
                        commonDraft.map((x, j) => (j === i ? e.target.value : x)),
                      )
                    }
                    placeholder="안내 문구"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCommonDraft(commonDraft.filter((_, j) => j !== i))
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border text-muted-foreground hover:border-error hover:text-error"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCommonDraft([...commonDraft, ""])}
                className="rounded-[var(--radius-md)] border border-dashed border-border px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:border-point/50 hover:text-foreground"
              >
                + 줄 추가
              </button>
              <div className="flex gap-3 pt-2">
                <Button variant="primary" onClick={saveCommon} disabled={busy}>
                  {busy ? "저장 중…" : "저장"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setCommonDraft(null)}
                  disabled={busy}
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
