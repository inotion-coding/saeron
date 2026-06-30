"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 스크롤 색상 전환 컨트롤러 (DESIGN.md §9)
 * 화면 세로 중앙선을 지나는 `[data-tone]` 섹션을 감지해
 * 그 tone 을 <html data-tone> 으로 올린다. → globals.css 의 --page-bg 보간.
 *
 * rootMargin "-50% 0 -50% 0" 으로 뷰포트 중앙선과 교차하는 요소만 intersecting.
 * 렌더 출력 없음(부수효과 전용). 라우트 변경 시 재관찰.
 */
export default function ScrollTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-tone]")
    );
    if (sections.length === 0) return;

    const setTone = (tone: string | undefined) => {
      if (tone && root.dataset.tone !== tone) root.dataset.tone = tone;
    };

    // 초기 톤: 첫 섹션
    setTone(sections[0].dataset.tone);

    const observer = new IntersectionObserver(
      (entries) => {
        // 중앙선과 교차 중인 섹션 중 가장 마지막(아래쪽) 것을 채택
        const active = entries
          .filter((e) => e.isIntersecting)
          .map((e) => e.target as HTMLElement);
        if (active.length > 0) {
          setTone(active[active.length - 1].dataset.tone);
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
