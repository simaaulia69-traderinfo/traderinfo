import Link from "next/link";
import { TrendingUp } from "lucide-react";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/disclaimer", label: "Risk Disclaimer" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#071827] text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#071827] via-[#0d233e] to-[#d8a24b] text-white shadow-lg shadow-[#0d233e]/20">
                <TrendingUp size={18} />
              </div>
              <div>
                <div className="text-lg font-black text-white">TraderInfo</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Informasi pasar</div>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-300">
              Platform edukasi forex yang fokus pada analisis, manajemen risiko, dan disiplin trading.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">
              Navigasi
            </h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-[#f5d9a2]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">
              Risk Disclaimer
            </h3>
            <p className="text-sm leading-6 text-slate-300">
              Trading forex melibatkan risiko tinggi. Konten di situs ini bersifat edukasi dan tidak menjamin keuntungan.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} TraderInfo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
