-- ============================================================
--  수업 시간표 (새 형식) — 관리자 편집형
--  schema.sql 실행 후 사용. SQL Editor에 붙여넣고 Run.
--  (기존 schedule_teachers/schedule_rows/common_notices 는 미사용 — 남겨둬도 무방)
-- ============================================================

create table if not exists public.schedule_classes (
  id            uuid primary key default gen_random_uuid(),
  teacher_id    uuid references public.teachers(id) on delete set null, -- 링크·3급 본인권한
  teacher_name  text not null,          -- 표시 이름
  subject_group text not null,          -- 국어·수학·영어·사회·과학 (1열 + 2차 필터)
  division      text not null,          -- middle(중등) / high(고등) (1차 필터)
  course        text not null,          -- 수업 이름
  target        text,                   -- 대상 (예: 외고 1학년)
  times         jsonb not null default '[]'::jsonb, -- [{days,time}]
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now(),
  constraint sc_subject_group_chk
    check (subject_group in ('국어','수학','영어','사회','과학')),
  constraint sc_division_chk check (division in ('middle','high'))
);

alter table public.schedule_classes enable row level security;

-- 열람: 공개 / 편집: 1·2급 전체, 3급은 본인(teacher_id) 것만
drop policy if exists sc_select on public.schedule_classes;
create policy sc_select on public.schedule_classes for select using (true);

drop policy if exists sc_write on public.schedule_classes;
create policy sc_write on public.schedule_classes for all
  using (
    public.current_level() <= 2
    or (public.current_level() = 3 and teacher_id = public.current_teacher_id())
  )
  with check (
    public.current_level() <= 2
    or (public.current_level() = 3 and teacher_id = public.current_teacher_id())
  );
-- ============================================================
