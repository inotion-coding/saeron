"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 진입 모션 (DESIGN.md §9)
 * 뷰포트(중앙 영역)에 들어올 때마다 페이드업으로 등장하고, 벗어나면 다시 숨겨
 * 위·아래로 반복 스크롤해도 매번 자연스럽게 재생된다.
 * prefers-reduced-motion 또는 IntersectionObserver 미지원 시 항상 표시(정적).
 * delay(ms)로 스태거 가능. as 로 렌더 태그 변경(기본 div).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // 중앙 영역에 들어오면 보이고, 벗어나면 숨김 → 재진입 시 재생
        setVisible(entries[0].isIntersecting);
      },
      { threshold: 0, rootMargin: "-12% 0px -12% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
