-- ============================================================
--  강사(3급)가 본인 시간표를 직접 생성할 수 있도록 RLS 보강
--  (기존 schema.sql의 sched_teachers_insert 정책 교체)
--  SQL Editor에 붙여넣고 Run.
-- ============================================================

drop policy if exists sched_teachers_insert on public.schedule_teachers;
create policy sched_teachers_insert on public.schedule_teachers for insert
  with check (
    public.current_level() <= 2
    or (public.current_level() = 3 and teacher_id = public.current_teacher_id())
  );

-- 참고: 수정/삭제는 기존 정책 유지
--  - 수정: level≤2 또는 (3급 & 본인)  → 본인 시간표 수정 가능
--  - 삭제(묶음 전체): level≤2 만        → 선생님은 행을 비우는 식으로 관리
--  - 수업행(schedule_rows): 3급 & 본인 묶음이면 추가/수정/삭제 가능(기존 정책)
-- ============================================================
