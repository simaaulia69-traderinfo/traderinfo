import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { normalizeHtml } from "@/lib/utils";

const fallbackPosts: Post[] = [
  {
    id: "sample-1",
    title: "Panduan Trading Forex Pemula: 5 Kesalahan yang Harus Dihindari",
    slug: "panduan-trading-forex-pemula-5-kesalahan-yang-harus-dihindari",
    content: "<h2>Memahami risiko sebelum masuk pasar</h2><p>Trading forex bukan cara instan untuk kaya. Fokuslah pada disiplin, manajemen risiko, dan strategi yang konsisten.</p><ul><li>Jangan overtrading</li><li>Gunakan stop loss</li><li>Belajar dari jurnal trading</li></ul>",
    category: "Forex Basics",
    meta_description:
      "Pelajari 5 kesalahan umum yang sering membuat trader pemula gagal dan cara menghindarinya.",
    meta_keywords: "trading forex pemula, belajar forex, kesalahan trading",
    cover_image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    created_at: "2025-01-15T09:00:00.000Z",
    updated_at: "2025-01-15T09:00:00.000Z",
    comments: [
      {
        name: "Ananda",
        message: "Artikel ini sangat jelas dan mudah dipahami.",
        created_at: "2025-01-16T08:00:00.000Z",
      },
    ],
  },
  {
    id: "sample-2",
    title: "Strategi Risk Management yang Wajib Dipakai Trader Harian",
    slug: "strategi-risk-management-yang-wajib-dipakai-trader-harian",
    content: "<h2>Risk reward ratio</h2><p>Aturan sederhana adalah membatasi kerugian per transaksi dan menjaga konsistensi jangka panjang.</p>",
    category: "Risk Management",
    meta_description:
      "Pelajari teknik risk management yang membantu menjaga modal dan emosi agar tetap sehat saat trading.",
    meta_keywords: "risk management forex, manajemen risiko trading, trading harian",
    cover_image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    is_published: true,
    created_at: "2025-01-20T09:00:00.000Z",
    updated_at: "2025-01-20T09:00:00.000Z",
    comments: [],
  },
];

const fallbackStorePath = path.join(process.cwd(), "data", "admin-posts.json");

function normalizePost(post: Partial<Post>): Post {
  return {
    id: String(post.id ?? globalThis.crypto?.randomUUID?.() ?? Date.now().toString()),
    title: String(post.title ?? "Judul artikel"),
    slug: String(post.slug ?? "article"),
    content: normalizeHtml(String(post.content ?? "")),
    category: String(post.category ?? "Umum"),
    meta_description: String(post.meta_description ?? ""),
    meta_keywords: String(post.meta_keywords ?? ""),
    cover_image: post.cover_image ?? null,
    is_published: Boolean(post.is_published),
    created_at: String(post.created_at ?? new Date().toISOString()),
    updated_at: String(post.updated_at ?? new Date().toISOString()),
    comments: Array.isArray(post.comments) ? post.comments : [],
  };
}

async function ensureFallbackPosts() {
  try {
    const existing = await fs.readFile(fallbackStorePath, "utf8");
    const parsed = JSON.parse(existing);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return (parsed as Partial<Post>[]).map(normalizePost);
    }
  } catch {
    // ignore and fall back to defaults below
  }

  await fs.mkdir(path.dirname(fallbackStorePath), { recursive: true });
  await fs.writeFile(fallbackStorePath, JSON.stringify(fallbackPosts, null, 2), "utf8");
  return fallbackPosts;
}

export async function readFallbackPosts() {
  try {
    const raw = await fs.readFile(fallbackStorePath, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return (parsed as Partial<Post>[]).map(normalizePost);
    }
  } catch {
    return ensureFallbackPosts();
  }

  return ensureFallbackPosts();
}

export async function upsertFallbackPost(post: Partial<Post>) {
  const posts = await readFallbackPosts();
  const normalized = normalizePost(post);
  const existingIndex = posts.findIndex((item) => item.id === normalized.id || item.slug === normalized.slug);

  const nextPosts = [...posts];
  if (existingIndex >= 0) {
    nextPosts[existingIndex] = normalized;
  } else {
    nextPosts.unshift(normalized);
  }

  await fs.mkdir(path.dirname(fallbackStorePath), { recursive: true });
  await fs.writeFile(fallbackStorePath, JSON.stringify(nextPosts, null, 2), "utf8");
  return normalized;
}

export async function deleteFallbackPost(id: string) {
  const posts = await readFallbackPosts();
  const nextPosts = posts.filter((post) => post.id !== id);
  await fs.mkdir(path.dirname(fallbackStorePath), { recursive: true });
  await fs.writeFile(fallbackStorePath, JSON.stringify(nextPosts, null, 2), "utf8");
  return nextPosts;
}

export async function getPublishedPosts() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const posts = await readFallbackPosts();
    return posts.filter((post) => post.is_published);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return (await readFallbackPosts()).filter((post) => post.is_published);
  }

  return (data as Partial<Post>[]).map(normalizePost);
}

export async function getAllPosts() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return readFallbackPosts();
  }

  const supabase = createClient();
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    return readFallbackPosts();
  }

  return (data as Partial<Post>[]).map(normalizePost);
}

export async function getPostBySlug(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const posts = await readFallbackPosts();
    return posts.find((post) => post.slug === slug) ?? null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    const posts = await readFallbackPosts();
    return posts.find((post) => post.slug === slug) ?? null;
  }

  return normalizePost(data as Partial<Post>);
}

export async function getCategories() {
  const posts = await getPublishedPosts();
  return [...new Set(posts.map((post) => post.category).filter(Boolean))];
}
