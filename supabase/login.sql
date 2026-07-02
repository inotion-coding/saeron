-- ============================================================
--  로그인 방식: (과목 + 선생님 이름 + 비밀번호)
--  이메일 대신 과목·이름으로 로그인. 이메일은 계정마다 내부적으로 하나 두고,
--  아래 디렉터리가 (과목,이름) → 이메일 을 매핑한다. (비밀번호는 저장 안 함 → Supabase가 검증)
--  schema.sql 실행 후, 이 파일을 SQL Editor 에 붙여넣고 Run.
-- ============================================================

-- 1) 로그인 디렉터리 (관리자만 관리)
create table if not exists public.login_directory (
  email   text primary key,          -- 로그인용 내부 이메일(계정)
  subject text not null,             -- 로그인 화면 '과목' 라벨(국어·수학·… 또는 관리자)
  name    text not null,             -- 로그인 화면 '이름'
  unique (subject, name)
);

alter table public.login_directory enable row level security;

drop policy if exists login_directory_admin on public.login_directory;
create policy login_directory_admin on public.login_directory for all
  using (public.current_level() <= 2)
  with check (public.current_level() <= 2);

-- 2) 로그인 화면 전용 조회 함수
--    (과목,이름) → 이메일 1건. security definer 라 목록 노출 없이 '정확 매칭'만 반환.
create or replace function public.resolve_login_email(p_subject text, p_name text)
returns text language sql stable security definer set search_path = public as $$
  select email from public.login_directory
  where subject = p_subject and name = p_name
  limit 1
$$;

revoke all on function public.resolve_login_email(text, text) from public;
grant execute on function public.resolve_login_email(text, text) to anon, authenticated;

-- 3) 현재 1급(개발자) 계정 로그인 매핑
--    → 로그인 화면에서 과목="관리자", 이름="개발자", 비밀번호 로 로그인
insert into public.login_directory (email, subject, name)
values ('coding.inotion@gmail.com', '관리자', '개발자')
on conflict (email) do update set subject = excluded.subject, name = excluded.name;

-- ============================================================
--  이후 계정 추가 시(관리자가): auth 사용자 생성 + profiles 행 + login_directory 행
--  (Phase B에서 앱 내 자동화 예정)
-- ============================================================
