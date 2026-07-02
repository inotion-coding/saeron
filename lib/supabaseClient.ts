/**
 * Supabase 클라이언트 — 브라우저에서 로그인·데이터 접근에 사용.
 * 연결 키는 .env.local(NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY)에서 주입.
 * anon 키는 공개용이며, 실제 접근 제어는 Supabase 서버의 RLS 정책이 담당한다.
 */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 키 미설정 시 원인을 바로 알 수 있도록 명확히 알림 (빌드/개발 중 확인용)
  throw new Error(
    "Supabase 키가 없습니다. .env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 채우고 dev 서버를 재시작하세요.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
