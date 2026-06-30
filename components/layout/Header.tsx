"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/data/site";
import Logo from "./Logo";

/**
 * 상단바 — DESIGN.md §4
 * 풀폭 레이아웃: 로고는 화면 왼쪽 끝, 메뉴는 오른쪽 끝.
 * 데스크톱 가로 메뉴(밑줄 인터랙션) / 좁은 폭 햄버거. sticky + backdrop blur.
 */
const PAD = "px-4 sm:px-6 lg:px-8";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className={`flex h-16 items-center justify-between gap-4 ${PAD}`}>
        {/* 로고 — 항상 왼쪽 끝 */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label={`${site.name} 홈`}
        >
          <Logo />
        </Link>

        {/* 데스크톱 내비게이션 — 오른쪽 끝 */}
        <nav className="hidden items-center gap-7 md:flex">
          {site.nav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative py-1 text-sm font-semibold transition-colors ${
                  active
                    ? "text-point"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-point transition-all duration-200 ease-[var(--ease-out-soft)] ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

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
      </div>

      {/* 모바일 패널 */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-border bg-background transition-[max-height] duration-300 ease-[var(--ease-out-soft)] md:hidden ${
          open ? "max-h-96" : "max-h-0 border-t-0"
        }`}
      >
        <nav className={`flex flex-col gap-1 py-3 ${PAD}`}>
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`rounded-[var(--radius-sm)] px-3 py-3 text-base font-semibold ${
                isActive(item.href)
                  ? "bg-surface text-point"
                  : "text-foreground hover:bg-surface"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
