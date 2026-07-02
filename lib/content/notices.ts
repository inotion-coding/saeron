/**
 * 공개 공지 데이터 (Supabase 읽기) — 홈 배너·/notices 목록에서 사용(client).
 * DB(public.notices) 행을 화면용 Notice 형태로 변환. 이미지는 Storage 공개 URL로.
 * 관리자 편집이 즉시 반영되도록 빌드타임이 아닌 런타임(클라이언트)에서 조회.
 */
import { supabase } from "@/lib/supabaseClient";
import type { Notice } from "@/lib/data/notices";

const BUCKET = "notice-images";

/** Storage 경로 → 공개 URL (이미 절대/루트 경로면 그대로) */
function toImageUrl(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith("/")) return path;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

type Row = {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  notice_date: string;
  images: string[] | null;
  is_featured: boolean;
};

function toNotice(r: Row): Notice {
  return {
    id: r.slug || r.id,
    title: r.title,
    date: r.notice_date,
    content: r.content ?? "",
    images: (r.images ?? []).map(toImageUrl),
    featured: r.is_featured,
  };
}

/** 전체 공지 (최신순) */
export async function fetchNotices(): Promise<Notice[]> {
  const { data, error } = await supabase
    .from("notices")
    .select("id, slug, title, content, notice_date, images, is_featured")
    .order("notice_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return [];
  return ((data as Row[]) ?? []).map(toNotice);
}

/** 메인 배너용 featured 공지 (최신순, 최대 n개) */
export async function fetchFeaturedNotices(n = 5): Promise<Notice[]> {
  const all = await fetchNotices();
  return all.filter((x) => x.featured).slice(0, n);
}
