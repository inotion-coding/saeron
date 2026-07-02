"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabaseClient";
import { DIVISIONS, SUBJECT_GROUPS } from "@/lib/data/teachers";
import { scheduleEntries as seedEntries } from "@/lib/data/schedule";

type TimeItem = { days: string; time: string };

type Row = {
  id: string;
  teacher_id: string | null;
  teacher_name: string;
  subject_group: string;
  division: "middle" | "high";
  course: string;
  target: string | null;
  times: TimeItem[] | null;
  sort_order: number;
};

type Draft = {
  id?: string;
  teacher_id: string | null;
  teacher_name: string;
  subject_group: string;
  division: "middle" | "high";
  course: string;
  target: string;
  times: TimeItem[];
  sort_order: number;
};

type TeacherOpt = { id: string; name: string; subject_group: string };

const fieldBase =
  "w-full rounded-[var(--radius-md)] border border-border bg-surface px-3 text-sm text-foreground transition-colors " +
  "placeholder:text-muted-foreground hover:border-point/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

const DAY_LIST = ["월", "화", "수", "목", "금", "토", "일"];
// 24시간제, 10분 단위 HH:MM 목록 (00:00 ~ 23:50)
const TIME_OPTIONS = Array.from({ length: 24 * 6 }, (_, i) => {
  const h = Math.floor(i / 6);
  const m = (i % 6) * 10;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

/** 시각 선택 (HH:MM 한 번에) */
function TimePick({
  value,
  onChange,
  ph,
}: {
  value: string;
  onChange: (v: string) => void;
  ph: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${fieldBase} h-10 w-24 cursor-pointer appearance-none px-2 text-center`}
    >
      <option value="">{ph}</option>
      {TIME_OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function emptyDraft(order: number): Draft {
  return {
    teacher_id: null,
    teacher_name: "",
    subject_group: "국어",
    division: "high",
    course: "",
    target: "",
    times: [{ days: "", time: "" }],
    sort_order: order,
  };
}

/**
 * 시간표 관리 — public.schedule_classes CRUD.
 * 1·2급 전체 / 3급 본인(teacher_id) 것만(RLS). 공개 페이지는 즉시 반영.
 */
export default function ScheduleAdmin() {
  const router = useRouter();
  const [level, setLevel] = useState(9);
  const [myTeacherId, setMyTeacherId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "denied">("loading");
  const [rows, setRows] = useState<Row[]>([]);
  const [teachers, setTeachers] = useState<TeacherOpt[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (lv: number, ownId: string | null) => {
    let q = supabase
      .from("schedule_classes")
      .select(
        "id, teacher_id, teacher_name, subject_group, division, course, target, times, sort_order",
      );
    if (lv >= 3) {
      q = q.eq("teacher_id", ownId ?? "00000000-0000-0000-0000-000000000000");
    }
    const [r, t] = await Promise.all([
      q.order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
      supabase.from("teachers").select("id, name, subject_group").order("sort_order"),
    ]);
    setRows((r.data as Row[]) ?? []);
    setTeachers((t.data as TeacherOpt[]) ?? []);
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

  function openEdit(r: Row) {
    setError("");
    setDraft({
      id: r.id,
      teacher_id: r.teacher_id,
      teacher_name: r.teacher_name,
      subject_group: r.subject_group,
      division: r.division,
      course: r.course,
      target: r.target ?? "",
      times:
        Array.isArray(r.times) && r.times.length
          ? r.times.map((t) => ({ days: t.days, time: t.time }))
          : [{ days: "", time: "" }],
      sort_order: r.sort_order,
    });
  }

  function startNew() {
    setError("");
    if (level === 3) {
      const mine = teachers.find((t) => t.id === myTeacherId);
      setDraft({
        ...emptyDraft(rows.length),
        teacher_id: myTeacherId,
        teacher_name: mine?.name ?? "",
        subject_group: mine?.subject_group ?? "국어",
      });
      return;
    }
    setDraft(emptyDraft(rows.length));
  }

  /** 연결 강사 선택 시 이름·과목 자동 채움 */
  function pickTeacher(id: string) {
    if (!draft) return;
    if (!id) {
      setDraft({ ...draft, teacher_id: null });
      return;
    }
    const t = teachers.find((x) => x.id === id);
    setDraft({
      ...draft,
      teacher_id: id,
      teacher_name: t?.name ?? draft.teacher_name,
      subject_group: t?.subject_group ?? draft.subject_group,
    });
  }

  function patchTime(i: number, patch: Partial<TimeItem>) {
    if (!draft) return;
    setDraft({
      ...draft,
      times: draft.times.map((t, j) => (j === i ? { ...t, ...patch } : t)),
    });
  }

  /** 요일 버튼 토글 → 가운뎃점 문자열(주간 순서 유지) */
  function toggleDay(i: number, day: string) {
    if (!draft) return;
    const cur = draft.times[i].days
      .split("·")
      .map((s) => s.trim())
      .filter(Boolean);
    const has = cur.includes(day);
    const next = DAY_LIST.filter((d) =>
      d === day ? !has : cur.includes(d),
    );
    patchTime(i, { days: next.join("·") });
  }

  /** "HH:MM~HH:MM" → 시작/종료 */
  function splitTime(time: string) {
    const [start = "", end = ""] = time.split("~");
    return { start: start.trim(), end: end.trim() };
  }
  function setTimeStart(i: number, v: string) {
    if (!draft) return;
    const { end } = splitTime(draft.times[i].time);
    patchTime(i, { time: `${v}~${end}` });
  }
  function setTimeEnd(i: number, v: string) {
    if (!draft) return;
    const { start } = splitTime(draft.times[i].time);
    patchTime(i, { time: `${start}~${v}` });
  }

  async function save() {
    if (!draft) return;
    if (!draft.teacher_name.trim()) {
      setError("강사 이름을 입력해 주세요.");
      return;
    }
    if (!draft.course.trim()) {
      setError("수업 이름을 입력해 주세요.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const times = draft.times
        .map((t) => ({ days: t.days.trim(), time: t.time.trim() }))
        .filter((t) => t.days && /^\d{2}:\d{2}~\d{2}:\d{2}$/.test(t.time));
      const payload = {
        teacher_id: draft.teacher_id,
        teacher_name: draft.teacher_name.trim(),
        subject_group: draft.subject_group,
        division: draft.division,
        course: draft.course.trim(),
        target: draft.target.trim() || null,
        times,
        sort_order: draft.sort_order,
      };
      if (draft.id) {
        const { error: e } = await supabase
          .from("schedule_classes")
          .update(payload)
          .eq("id", draft.id);
        if (e) throw e;
      } else {
        const { error: e } = await supabase
          .from("schedule_classes")
          .insert(payload);
        if (e) throw e;
      }
      setDraft(null);
      await load(level, myTeacherId);
    } catch {
      setError("저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(r: Row) {
    if (!window.confirm(`"${r.teacher_name} · ${r.course}" 수업을 삭제할까요?`)) return;
    setBusy(true);
    setError("");
    try {
      const { error: e } = await supabase
        .from("schedule_classes")
        .delete()
        .eq("id", r.id);
      if (e) throw e;
      await load(level, myTeacherId);
    } catch {
      setError("삭제에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  }

  /** 기존 예시 시간표를 Supabase로 가져오기 (비어있을 때) */
  async function migrateSeed() {
    setBusy(true);
    setError("");
    try {
      const { data: existing } = await supabase
        .from("schedule_classes")
        .select("id");
      if ((existing?.length ?? 0) > 0) {
        setError("이미 시간표가 있습니다. (가져오기는 비어있을 때만)");
        return;
      }
      const { data: tData } = await supabase.from("teachers").select("id, slug");
      const idBySlug = new Map(
        ((tData as { id: string; slug: string }[]) ?? []).map((x) => [x.slug, x.id]),
      );
      const payload = seedEntries.map((e, i) => ({
        teacher_id: e.teacherSlug ? idBySlug.get(e.teacherSlug) ?? null : null,
        teacher_name: e.teacherName,
        subject_group: e.subjectGroup,
        division: e.division,
        course: e.course,
        target: e.target ?? null,
        times: e.times,
        sort_order: i,
      }));
      const { error: e } = await supabase.from("schedule_classes").insert(payload);
      if (e) throw e;
      await load(level, myTeacherId);
    } catch {
      setError("가져오기 중 오류가 발생했습니다.");
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
          onClick={() => setDraft(null)}
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← 시간표 목록
        </button>
        <h1 className="mt-2 text-h2 font-bold text-foreground">
          {draft.id ? "수업 수정" : "새 수업"}
        </h1>

        <div className="mt-7 rounded-[var(--radius-lg)] border border-border bg-background p-6 shadow-card sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {canManageAll && (
              <Field label="연결 강사 (프로필 링크·본인권한, 선택)">
                <select
                  className={`${fieldBase} h-10 cursor-pointer appearance-none pr-9`}
                  value={draft.teacher_id ?? ""}
                  onChange={(e) => pickTeacher(e.target.value)}
                >
                  <option value="">없음 (외부 강사)</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            <Field label="강사 이름">
              <input
                className={`${fieldBase} h-10`}
                value={draft.teacher_name}
                onChange={(e) =>
                  setDraft({ ...draft, teacher_name: e.target.value })
                }
                placeholder="예: 채송아"
              />
            </Field>
            <Field label="과목">
              <select
                className={`${fieldBase} h-10 cursor-pointer appearance-none pr-9`}
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
            <Field label="부">
              <select
                className={`${fieldBase} h-10 cursor-pointer appearance-none pr-9`}
                value={draft.division}
                onChange={(e) =>
                  setDraft({
                    ...draft,
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
            <Field label="수업 이름">
              <input
                className={`${fieldBase} h-10`}
                value={draft.course}
                onChange={(e) => setDraft({ ...draft, course: e.target.value })}
                placeholder="예: 미적분"
              />
            </Field>
            <Field label="대상 (선택)">
              <input
                className={`${fieldBase} h-10`}
                value={draft.target}
                onChange={(e) => setDraft({ ...draft, target: e.target.value })}
                placeholder="예: 외고 1학년"
              />
            </Field>
          </div>

          {/* 시간 */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">요일·시간</h2>
              <button
                type="button"
                onClick={() =>
                  setDraft({ ...draft, times: [...draft.times, { days: "", time: "" }] })
                }
                className="rounded-[var(--radius-md)] border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-point/50 hover:text-foreground"
              >
                + 시간 추가
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              요일 버튼을 눌러 선택(월·수·금처럼 자동), 시간은 24시간제·10분 단위로 시작~끝 선택
            </p>
            <div className="mt-3 space-y-3">
              {draft.times.map((t, i) => {
                const selDays = t.days.split("·").map((s) => s.trim());
                const { start, end } = splitTime(t.time);
                return (
                  <div
                    key={i}
                    className="relative rounded-[var(--radius-md)] border border-border px-3 py-4"
                  >
                    {/* 삭제 (우상단) */}
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          times: draft.times.filter((_, j) => j !== i),
                        })
                      }
                      aria-label="시간 삭제"
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-error"
                    >
                      ×
                    </button>

                    {/* 요일 토글 (중앙) */}
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {DAY_LIST.map((day) => {
                        const on = selDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(i, day)}
                            aria-pressed={on}
                            className={`h-8 w-8 rounded-full text-sm font-bold transition-colors ${
                              on
                                ? "bg-point text-white"
                                : "border border-border text-muted-foreground hover:border-point/50"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>

                    {/* 시작 ~ 종료 (중앙) */}
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <TimePick
                        value={start}
                        onChange={(v) => setTimeStart(i, v)}
                        ph="시작"
                      />
                      <span className="font-semibold text-foreground">~</span>
                      <TimePick
                        value={end}
                        onChange={(v) => setTimeEnd(i, v)}
                        ph="종료"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {error && <p className="mt-6 text-sm text-error">{error}</p>}

          <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
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
          <h1 className="mt-2 text-h2 font-bold text-foreground">
            {canManageAll ? "시간표 관리" : "내 시간표"}
          </h1>
        </div>
        <Button variant="primary" onClick={startNew}>
          {canManageAll ? "새 수업" : "내 수업 추가"}
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-error">{error}</p>}

      {rows.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">등록된 수업이 없습니다.</p>
          {canManageAll && (
            <div className="mt-5">
              <Button variant="secondary" onClick={migrateSeed} disabled={busy}>
                {busy ? "가져오는 중…" : "예시 시간표 가져오기"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                (샘플 시간표를 넣어 형식을 보고 편집하실 수 있어요)
              </p>
            </div>
          )}
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-[var(--radius-lg)] border border-border">
          {rows.map((r) => (
            <li
              key={r.id}
              className="group flex items-center gap-3 pr-3 transition-colors hover:bg-surface"
            >
              <button
                type="button"
                onClick={() => openEdit(r)}
                className="flex min-w-0 flex-1 items-center gap-3 py-3.5 pl-4 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground transition-colors group-hover:text-point">
                    <span className="text-point">{r.subject_group}</span>{" "}
                    {r.teacher_name} · {r.course}
                    {r.target ? (
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        {r.target}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {DIVISIONS.find((d) => d.value === r.division)?.label} ·{" "}
                    {(r.times ?? [])
                      .map((t) => `${t.days} ${t.time}`)
                      .join(" / ") || "시간 미입력"}
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
                onClick={() => remove(r)}
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
