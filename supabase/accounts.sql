-- ============================================================
--  계정 관리(Phase B) 준비 — login_directory ↔ 계정 연결
--  login.sql 이후 실행. 계정 삭제 시 매핑도 자동 정리되도록 user_id 연결.
-- ============================================================

-- login_directory에 계정(user_id) 연결 + 계정 삭제 시 연쇄 삭제
alter table public.login_directory
  add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 기존(개발자) 매핑 backfill: 이메일로 계정 찾아 user_id 채움
update public.login_directory ld
set user_id = u.id
from auth.users u
where u.email = ld.email and ld.user_id is null;

-- 참고: profiles.id 도 auth.users(id) on delete cascade 이므로,
--       계정(auth user) 삭제 시 profiles·login_directory 행이 함께 정리됨.
-- ============================================================
