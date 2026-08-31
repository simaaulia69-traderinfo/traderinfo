import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const fallbackImages: Record<string, string> = {
  "Forex Basics": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  "Risk Management": "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
  "Analisis Teknikal": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
  "Psikologi Trading": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
  "News & Market": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
};

export function ArticleCard({ post }: { post: Post }) {
  const cover = post.cover_image || fallbackImages[post.category] || fallbackImages["Forex Basics"];

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#dfeaf5] via-[#edf3fb] to-[#fef3c7]">
        <img src={cover} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/20 to-transparent" />
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.12em] text-slate-500">
          <span className="rounded-full bg-[#071827] px-2.5 py-1 font-semibold text-[#f5d9a2]">
            {post.category}
          </span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        <h3 className="text-xl font-bold leading-snug text-slate-900">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.meta_description}</p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0d233e] transition group-hover:text-[#d8a24b]"
        >
          Baca selengkapnya <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
