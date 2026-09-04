import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck, BrainCircuit, Sparkles } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { ArticleCard } from "@/components/article-card";
import { SectionHeading } from "@/components/section-heading";
import { getCategories, getPublishedPosts } from "@/lib/data";

export const revalidate = 60;

const featureCards = [
  {
    title: "Market insight",
    description: "Analisis tren dan setup yang relevan.",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Risk control",
    description: "Disiplin dalam limit rugi dan money management.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Mindset trading",
    description: "Psikologi dan evaluasi kerja yang lebih sehat.",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80",
  },
];

const categoryCards = [
  {
    name: "Forex Basics",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Risk Management",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Analisis Teknikal",
    image:
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Psikologi Trading",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
  },
];

export default async function HomePage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()]);
  const featured = posts.slice(0, 3);
  const visibleCategories = categories.length ? categories : categoryCards.map((item) => item.name);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[32px] border border-[#dfeaf5] bg-gradient-to-br from-[#071827] via-[#0d233e] to-[#12335a] px-4 py-8 shadow-[0_30px_60px_rgba(7,24,39,0.18)] sm:px-6 lg:px-8 lg:py-10">
        <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#d8a24b]/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#f5d9a2]/10 blur-3xl" />

        <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d8a24b]/30 bg-[#d8a24b]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f5d9a2]">
              <Sparkles size={12} />
              Forex education & analysis
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              Belajar trading forex dengan pendekatan yang lebih disiplin dan aman.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              TraderInfo membantu Anda memahami strategi, manajemen risiko, dan psikologi trading agar keputusan Anda lebih konsisten.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#d8a24b] px-5 py-3 text-sm font-semibold text-[#071827] transition hover:bg-[#f5d9a2]"
              >
                Baca Artikel
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Tentang Kami
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/8 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.18)] backdrop-blur-sm">
            <AdSlot variant="header" className="mb-5" />
            <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
              {featureCards.map((card) => (
                <div key={card.title} className="overflow-hidden rounded-2xl border border-[#d8a24b]/20 bg-slate-900/40">
                  <div className="h-24 overflow-hidden">
                    <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    {card.title === "Market insight" ? (
                      <TrendingUp className="mb-3 text-[#f5d9a2]" size={24} />
                    ) : card.title === "Risk control" ? (
                      <ShieldCheck className="mb-3 text-[#f5d9a2]" size={24} />
                    ) : (
                      <BrainCircuit className="mb-3 text-[#f5d9a2]" size={24} />
                    )}
                    <p className="text-sm font-semibold text-white">{card.title}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <AdSlot variant="header" className="h-24 md:h-28" />
      </section>

      <section className="py-8">
        <SectionHeading
          eyebrow="Kategori"
          title="Tema yang paling relevan untuk trader"
          description="Konten kami fokus pada edukasi trading, manajemen risiko, dan perkembangan pasar yang dapat dipahami dengan cepat."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleCategories.map((category, idx) => {
            const categoryMeta = categoryCards.find((item) => item.name === category) ?? categoryCards[idx % categoryCards.length];
            return (
              <div key={category} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
                <div className="h-32 overflow-hidden">
                  <img src={categoryMeta.image} alt={category} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Kategori</p>
                  <h3 className="mt-3 text-xl font-bold text-slate-900">{category}</h3>
                  <Link href="/blog" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0d233e]">
                    Lihat artikel <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-8">
        <SectionHeading
          eyebrow="Artikel terbaru"
          title="Panduan trading yang siap dibaca"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
