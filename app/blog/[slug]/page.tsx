import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Mail, MessageSquareShare, Share2, ThumbsUp, BadgeCheck } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { SchemaJsonLd } from "@/components/schema-jsonld";
import { buildArticleSchema } from "@/lib/seo";
import { getPostBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

const shareLinks = [
  {
    href: "https://www.facebook.com/sharer/sharer.php?u=https://traderinfo.my.id",
    icon: BadgeCheck,
  },
  {
    href: "https://twitter.com/intent/tweet?url=https://traderinfo.my.id&text=Reading%20this%20article",
    icon: Share2,
  },
  {
    href: "https://www.linkedin.com/sharing/share-offsite/?url=https://traderinfo.my.id",
    icon: ThumbsUp,
  },
  {
    href: "mailto:?subject=Artikel%20TraderInfo&body=https://traderinfo.my.id",
    icon: Mail,
  },
];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Artikel tidak ditemukan",
    };
  }

  return {
    title: post.title,
    description: post.meta_description,
    keywords: post.meta_keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    alternates: {
      canonical: `https://traderinfo.my.id/blog/${post.slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const shareUrl = `https://traderinfo.my.id/blog/${post.slug}`;

  return (
    <>
      <SchemaJsonLd data={buildArticleSchema(post)} />
      <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{post.category}</span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-6 lg:p-8">
          <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <MessageSquareShare size={14} />
              Artikel edukasi forex
            </span>
            <span>Ditulis untuk trader Indonesia</span>
          </div>

          {post.cover_image ? (
            <div className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-sm">
              <Image src={post.cover_image} alt={post.title} width={1600} height={900} sizes="(max-width: 768px) 100vw, 960px" className="h-[260px] w-full object-cover sm:h-[420px]" />
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="prose-content">
              <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <AdSlot variant="in-article" />
              </div>
              <div
                className="space-y-4 text-base leading-8 text-slate-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-10 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <h2 className="mb-4 text-2xl font-black text-slate-900">Bagikan artikel</h2>
                <div className="flex flex-wrap gap-3">
                  {shareLinks.map(({ href, icon: Icon }, index) => (
                    <a
                      key={`${href}-${index}`}
                      href={href.replace("https://traderinfo.my.id", shareUrl)}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Share article"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                    >
                      <Icon size={16} />
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="mb-4 text-2xl font-black text-slate-900">Komentar pembaca</h2>
                {post.comments.length > 0 ? (
                  <div className="space-y-4">
                    {post.comments.map((comment, index) => (
                      <div key={`${comment.name}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <strong className="text-sm font-semibold text-slate-900">{comment.name}</strong>
                          <span className="text-xs text-slate-500">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-sm leading-6 text-slate-600">{comment.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Belum ada komentar untuk artikel ini.</p>
                )}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Disclaimer</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Trading forex berisiko tinggi. Konten ini bersifat edukasi dan bukan rekomendasi investasi.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <AdSlot variant="sidebar" className="h-60" />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Navigasi</h3>
                <div className="mt-3 space-y-2">
                  <Link href="/blog" className="block text-sm text-slate-700 hover:text-slate-900">
                    Semua artikel
                  </Link>
                  <Link href="/about" className="block text-sm text-slate-700 hover:text-slate-900">
                    About us
                  </Link>
                  <Link href="/contact" className="block text-sm text-slate-700 hover:text-slate-900">
                    Hubungi kami
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
