-- ============================================================
--  상담 신청(문의) — 공개 폼 제출 저장 + 관리자 열람
--  SQL Editor에 붙여넣고 Run. (schema.sql의 current_level() 함수 필요)
-- ============================================================

create table if not exists public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  division   text,                       -- 중등부/고등부
  subjects   text[] not null default '{}', -- 관심 과목(복수)
  message    text,
  is_handled boolean not null default false, -- 처리 완료 여부
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

-- 제출: 누구나(공개 상담 폼). 개인정보라 읽기는 막음(아래 관리자만).
drop policy if exists inquiries_insert on public.inquiries;
create policy inquiries_insert on public.inquiries for insert with check (true);

-- 열람·수정(처리표시)·삭제: 관리자(1·2급)만
drop policy if exists inquiries_select on public.inquiries;
create policy inquiries_select on public.inquiries for select
  using (public.current_level() <= 2);

drop policy if exists inquiries_update on public.inquiries;
create policy inquiries_update on public.inquiries for update
  using (public.current_level() <= 2) with check (public.current_level() <= 2);

drop policy if exists inquiries_delete on public.inquiries;
create policy inquiries_delete on public.inquiries for delete
  using (public.current_level() <= 2);
-- ============================================================
