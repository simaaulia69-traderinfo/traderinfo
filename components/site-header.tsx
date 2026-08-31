"use client";

import Link from "next/link";
import { ArrowRight, Menu, TrendingUp, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#071827] via-[#0d233e] to-[#d8a24b] text-sm font-black text-white shadow-lg shadow-[#0d233e]/20">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-slate-900">TraderInfo</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Forex Education</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-[#0d233e]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-[#071827] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d233e]"
          >
            Explore Articles
            <ArrowRight size={15} />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-slate-100 py-3 text-sm font-medium text-slate-700 last:border-b-0"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/blog"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#071827] px-4 py-2 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Explore Articles
              <ArrowRight size={15} />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
