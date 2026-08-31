import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { SchemaJsonLd } from "@/components/schema-jsonld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildWebsiteSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://traderinfo.my.id"),
  title: {
    default: "TraderInfo | Forex Education & Trading Insights",
    template: "%s | TraderInfo",
  },
  description:
    "TraderInfo adalah blog edukasi forex yang membahas strategi, analisis, dan manajemen risiko untuk trader Indonesia.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://traderinfo.my.id",
    siteName: "TraderInfo",
    title: "TraderInfo | Forex Education & Trading Insights",
    description:
      "Panduan praktis trading forex, strategi, dan risk management untuk trader pemula dan berpengalaman.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TraderInfo",
    description: "Eksplorasi artikel edukasi forex yang disusun untuk trader Indonesia.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <SchemaJsonLd data={buildWebsiteSchema()} />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
