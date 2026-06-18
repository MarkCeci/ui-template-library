"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const primaryNav = [
  { href: "/", label: "首页" },
  { href: "/styles", label: "风格广场" },
  { href: "/style-capture", label: "风格捕捉" },
  { href: "/design-guide", label: "设计维护" },
  { href: "/developer", label: "开发者" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/92 backdrop-blur">
        <div className="h-0.5 bg-[linear-gradient(90deg,#eef2ff_0%,#7c3aed_42%,#bfdbfe_72%,#f8fafc_100%)]" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-36 shrink-0 items-center px-1">
              <Image
                src="/logo.svg"
                alt="公司 Logo"
                width={132}
                height={28}
                priority
                className="object-contain"
              />
            </span>
            <span className="hidden min-w-0 border-l border-slate-200 pl-3 sm:block">
              <span className="block truncate text-sm font-semibold text-slate-950">
                美央内部视觉风格库
              </span>
              <span className="block truncate text-xs font-medium text-slate-500">
                Enterprise UI Style Library
              </span>
            </span>
          </Link>

          <nav className="hidden items-center rounded-lg border border-slate-200 bg-slate-50 p-1 lg:flex">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-white text-violet-800 shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <nav className="flex max-w-full gap-2 overflow-x-auto border-t border-slate-100 bg-white px-4 py-2 lg:hidden">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${
                  active ? "bg-violet-50 text-violet-800" : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
