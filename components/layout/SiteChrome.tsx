"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import PageBackdrop from "./PageBackdrop";
import ScrollTheme from "@/components/ScrollTheme";

/**
 * 사이트 공통 껍데기(헤더·푸터·배경) 조건부 렌더.
 * /admin 이하(관리자 영역)는 사이트 헤더·푸터·스크롤 배경 없이 단독으로 렌더한다.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <PageBackdrop />
      <ScrollTheme />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
