"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/data/site";
import Container from "./Container";
import Button from "@/components/ui/Button";

/**
 * 상단바 (1단계) — DESIGN.md §4
 * 데스크톱: 가로 메뉴 / 좁은 폭: 햄버거 토글 패널
 * sticky 고정, 현재 경로 active 표시.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* 로고 */}
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-primary"
          onClick={() => setOpen(false)}
        >
          {site.name}
        </Link>

        {/* 데스크톱 내비게이션 */}
        <nav className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors hover:bg-surface ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/contact" size="md">
            상담 신청
          </Button>
        </div>

        {/* 모바일 햄버거 */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] text-foreground hover:bg-surface md:hidden"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 bg-current transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-6 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-6 bg-current transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </Container>

      {/* 모바일 패널 */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-border bg-background transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-96" : "max-h-0 border-t-0"
        }`}
      >
        <Container className="flex flex-col gap-1 py-3">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-[var(--radius-sm)] px-3 py-3 text-base font-medium ${
                isActive(item.href)
                  ? "bg-surface text-primary"
                  : "text-foreground hover:bg-surface"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Button href="/contact" className="mt-2 w-full">
            상담 신청
          </Button>
        </Container>
      </div>
    </header>
  );
}
