-- ============================================================
--  새론학원 관리자 — 데이터베이스 스키마 + 권한(RLS)
--  Supabase 대시보드 → SQL Editor 에 전체 붙여넣고 "Run".
--  설계 출처: DATABASE.md (단일 출처). 재실행 안전(if not exists / drop policy 후 재생성).
-- ============================================================

-- ─────────────────────────────────────────────
-- 1) 테이블
-- ─────────────────────────────────────────────

-- 1-1) 강사
create table if not exists public.teachers (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,                 -- /teachers/<slug>
  name          text not null,
  photo_path    text,                                 -- Storage 경로(없으면 기본 실루엣)
  divisions     text[] not null default '{}',         -- middle / high
  subject_group text not null,                        -- 국어·수학·영어·사회·과학
  subject       text not null default '',
  resolve       text not null default '',
  education     text[] not null default '{}',
  experience    text[] not null default '{}',
  achievements  text[] not null default '{}',
  books         text[] not null default '{}',
  sort_order    int  not null default 0,
  is_visible    boolean not null default true,
  created_at    timestamptz not null default now(),
  constraint teachers_subject_group_chk
    check (subject_group in ('국어','수학','영어','사회','과학'))
);

-- 1-2) 계정 정보 (auth.users 와 1:1)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  level      int  not null check (level in (1,2,3)),  -- 1=개발자 2=원장·실장 3=선생님
  name       text not null default '',
  teacher_id uuid references public.teachers(id) on delete set null,
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

-- 1-3) 공지
create table if not exists public.notices (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,                   -- /notices/<slug>
  title       text not null,
  content     text not null default '',
  notice_date date not null default current_date,
  images      text[] not null default '{}',           -- 포스터 Storage 경로들. [0]=대표
  is_featured boolean not null default false,          -- 메인 배너 노출
  created_at  timestamptz not null default now()
);

-- 1-4) 시간표 — 강사 단위 묶음
create table if not exists public.schedule_teachers (
  id            uuid primary key default gen_random_uuid(),
  teacher_id    uuid references public.teachers(id) on delete set null,  -- 프로필 있으면 연결
  display_name  text not null,                         -- 외부 강사 포함 표시 이름
  subject_group text not null,
  note          text,                                  -- 강사 단위 비고
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now(),
  constraint sched_teachers_subject_group_chk
    check (subject_group in ('국어','수학','영어','사회','과학'))
);

-- 1-5) 시간표 — 개별 수업 행
create table if not exists public.schedule_rows (
  id                  uuid primary key default gen_random_uuid(),
  schedule_teacher_id uuid not null references public.schedule_teachers(id) on delete cascade,
  target     text not null default '',                 -- 일반고1 / 외고1·2·3 / 2학기 대비반
  division   text not null,                             -- middle / high
  course     text,
  content    text,
  time_text  text not null default '',                  -- 요일·시간(원문 보존)
  open_date  text,                                      -- 개강일(예: 7/11)
  note       text,
  sort_order int  not null default 0,
  constraint sched_rows_division_chk check (division in ('middle','high'))
);

-- 1-6) 시간표 공통 안내
create table if not exists public.common_notices (
  id         uuid primary key default gen_random_uuid(),
  text       text not null,
  sort_order int  not null default 0
);

-- ─────────────────────────────────────────────
-- 2) 보조 함수 (내 등급 / 내 연결 강사)
--    security definer: 정책이 profiles 를 안전하게 조회(재귀 회피)
-- ─────────────────────────────────────────────
create or replace function public.current_level()
returns int language sql stable security definer set search_path = public as $$
  select level from public.profiles where id = auth.uid() and is_active
$$;

create or replace function public.current_teacher_id()
returns uuid language sql stable security definer set search_path = public as $$
  select teacher_id from public.profiles where id = auth.uid() and is_active
$$;

-- ─────────────────────────────────────────────
-- 3) RLS 활성화
-- ─────────────────────────────────────────────
alter table public.teachers          enable row level security;
alter table public.profiles          enable row level security;
alter table public.notices           enable row level security;
alter table public.schedule_teachers enable row level security;
alter table public.schedule_rows     enable row level security;
alter table public.common_notices    enable row level security;

-- ─────────────────────────────────────────────
-- 4) 정책 (테이블별 SELECT/INSERT/UPDATE/DELETE)
-- ─────────────────────────────────────────────

-- 4-1) teachers ───────────────────────────────
drop policy if exists teachers_select on public.teachers;
create policy teachers_select on public.teachers for select
  using (is_visible or public.current_level() is not null);      -- 공개(숨김 제외)·로그인은 전체

drop policy if exists teachers_insert on public.teachers;
create policy teachers_insert on public.teachers for insert
  with check (public.current_level() <= 2);

drop policy if exists teachers_update on public.teachers;
create policy teachers_update on public.teachers for update
  using      (public.current_level() <= 2 or (public.current_level() = 3 and id = public.current_teacher_id()))
  with check (public.current_level() <= 2 or (public.current_level() = 3 and id = public.current_teacher_id()));

drop policy if exists teachers_delete on public.teachers;
create policy teachers_delete on public.teachers for delete
  using (public.current_level() <= 2);

-- 4-2) notices ────────────────────────────────
drop policy if exists notices_select on public.notices;
create policy notices_select on public.notices for select using (true);

drop policy if exists notices_write on public.notices;
create policy notices_write on public.notices for all
  using      (public.current_level() <= 2)
  with check (public.current_level() <= 2);

-- 4-3) schedule_teachers ──────────────────────
drop policy if exists sched_teachers_select on public.schedule_teachers;
create policy sched_teachers_select on public.schedule_teachers for select using (true);

drop policy if exists sched_teachers_insert on public.schedule_teachers;
create policy sched_teachers_insert on public.schedule_teachers for insert
  with check (public.current_level() <= 2);

drop policy if exists sched_teachers_update on public.schedule_teachers;
create policy sched_teachers_update on public.schedule_teachers for update
  using      (public.current_level() <= 2 or (public.current_level() = 3 and teacher_id = public.current_teacher_id()))
  with check (public.current_level() <= 2 or (public.current_level() = 3 and teacher_id = public.current_teacher_id()));

drop policy if exists sched_teachers_delete on public.schedule_teachers;
create policy sched_teachers_delete on public.schedule_teachers for delete
  using (public.current_level() <= 2);

-- 4-4) schedule_rows (소유는 부모 묶음의 teacher_id 기준) ──
drop policy if exists sched_rows_select on public.schedule_rows;
create policy sched_rows_select on public.schedule_rows for select using (true);

drop policy if exists sched_rows_write on public.schedule_rows;
create policy sched_rows_write on public.schedule_rows for all
  using (
    public.current_level() <= 2
    or (public.current_level() = 3 and exists (
      select 1 from public.schedule_teachers st
      where st.id = schedule_teacher_id and st.teacher_id = public.current_teacher_id()
    ))
  )
  with check (
    public.current_level() <= 2
    or (public.current_level() = 3 and exists (
      select 1 from public.schedule_teachers st
      where st.id = schedule_teacher_id and st.teacher_id = public.current_teacher_id()
    ))
  );

-- 4-5) common_notices ─────────────────────────
drop policy if exists common_notices_select on public.common_notices;
create policy common_notices_select on public.common_notices for select using (true);

drop policy if exists common_notices_write on public.common_notices;
create policy common_notices_write on public.common_notices for all
  using      (public.current_level() <= 2)
  with check (public.current_level() <= 2);

-- 4-6) profiles (읽기만 앱 허용 — 계정·등급 변경은 대시보드/Edge Function) ──
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.current_level() <= 2);
-- INSERT/UPDATE/DELETE 정책 없음(의도적): Phase A는 대시보드 수동,
-- Phase B는 Edge Function(service_role)이 RLS 우회 + 코드로 규칙 강제.

-- ─────────────────────────────────────────────
-- 5) 스토리지 버킷 (읽기 공개)
-- ─────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('teacher-photos','teacher-photos', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('notice-images','notice-images', true)
  on conflict (id) do nothing;

-- 업로드/수정/삭제는 관리자(level<=2)만. 읽기는 버킷 public 으로 공개.
-- (3급 본인 사진 업로드는 경로 기반 소유 필요 → Phase B에서 추가)
drop policy if exists storage_admin_write on storage.objects;
create policy storage_admin_write on storage.objects for insert to authenticated
  with check (bucket_id in ('teacher-photos','notice-images') and public.current_level() <= 2);

drop policy if exists storage_admin_update on storage.objects;
create policy storage_admin_update on storage.objects for update to authenticated
  using      (bucket_id in ('teacher-photos','notice-images') and public.current_level() <= 2)
  with check (bucket_id in ('teacher-photos','notice-images') and public.current_level() <= 2);

drop policy if exists storage_admin_delete on storage.objects;
create policy storage_admin_delete on storage.objects for delete to authenticated
  using (bucket_id in ('teacher-photos','notice-images') and public.current_level() <= 2);

-- ============================================================
--  끝. 다음: (a) Auth 설정에서 공개 회원가입 끄기,
--            (b) 1급 계정 1개 생성 후 profiles 행 추가(§ 아래 안내),
--            (c) 초기 데이터 시드(seed.sql, 후속).
-- ============================================================
