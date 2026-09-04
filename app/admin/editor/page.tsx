"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { ArticleEditor } from "@/components/article-editor";
import { slugify } from "@/lib/utils";

const defaultCategory = "Forex Basics";

function AdminEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [content, setContent] = useState("<h2>Mulai menulis artikel Anda</h2><p>Gunakan editor untuk menulis konten...</p>");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    async function loadExistingPost() {
      if (!slugParam) return;

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const response = await fetch(`/api/posts?slug=${encodeURIComponent(slugParam)}`);
        const result = await response.json();
        const data = result.post;
        if (!data) return;
        setTitle(data.title ?? "");
        setSlug(data.slug ?? "");
        setCategory(data.category ?? defaultCategory);
        setMetaDescription(data.meta_description ?? "");
        setMetaKeywords(data.meta_keywords ?? "");
        setContent(data.content ?? "");
        setCoverImage(data.cover_image ?? null);
        setIsPublishing(Boolean(data.is_published));
        return;
      }

      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase.from("posts").select("*").eq("slug", slugParam).maybeSingle();
      if (!data) return;
      setTitle(data.title ?? "");
      setSlug(data.slug ?? "");
      setCategory(data.category ?? defaultCategory);
      setMetaDescription(data.meta_description ?? "");
      setMetaKeywords(data.meta_keywords ?? "");
      setContent(data.content ?? "");
      setCoverImage(data.cover_image ?? null);
      setIsPublishing(Boolean(data.is_published));
    }

    loadExistingPost();
  }, [slugParam]);

  const slugPreview = useMemo(() => slug || slugify(title), [slug, title]);

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setStatusMessage("Mode preview lokal aktif. Upload gambar ke Supabase Storage akan tersedia setelah env Supabase diisi.");
      setCoverImage(file ? URL.createObjectURL(file) : null);
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("article-images").upload(fileName, file, {
      upsert: true,
    });

    if (error) {
      setStatusMessage("Gagal upload gambar: " + error.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("article-images").getPublicUrl(data.path);
    setCoverImage(publicUrlData.publicUrl);
    setStatusMessage("Gambar sampul berhasil diunggah.");
  };

  const handleContentImageUpload = async (file: File) => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return URL.createObjectURL(file);
    }

    const supabase = createBrowserSupabaseClient();
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
    const fileName = `content/${Date.now()}-${safeName}`;
    const { data, error } = await supabase.storage.from("article-images").upload(fileName, file, {
      upsert: false,
    });

    if (error) {
      setStatusMessage("Gagal upload gambar di dalam artikel: " + error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage.from("article-images").getPublicUrl(data.path);
    setStatusMessage("Gambar berhasil ditambahkan ke artikel.");
    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (event: React.FormEvent, publish: boolean) => {
    event.preventDefault();
    setSaving(true);
    setStatusMessage("");

    const payload = {
      title,
      slug: slugPreview,
      category,
      meta_description: metaDescription,
      meta_keywords: metaKeywords,
      content,
      cover_image: coverImage,
      is_published: publish,
      comments: [],
    };

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setStatusMessage(result.message || "Gagal menyimpan artikel.");
      return;
    }

    setStatusMessage(publish ? "Artikel berhasil dipublikasikan." : "Artikel berhasil disimpan sebagai draft.");
    router.push("/admin");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Editor</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">Buat & edit artikel</h1>
        </div>
      </div>

      <form className="space-y-6" onSubmit={(event) => handleSubmit(event, isPublishing)}>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Judul</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
              placeholder="Judul artikel"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
            <input
              value={slugPreview}
              onChange={(event) => setSlug(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
              placeholder="contoh: strategi-risk-management"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Kategori</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option>Forex Basics</option>
              <option>Risk Management</option>
              <option>Analisis Teknikal</option>
              <option>Psikologi Trading</option>
              <option>News & Market</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Meta Description</label>
            <input
              value={metaDescription}
              onChange={(event) => setMetaDescription(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
              placeholder="Ringkasan SEO singkat"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Meta Keywords</label>
            <input
              value={metaKeywords}
              onChange={(event) => setMetaKeywords(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
              placeholder="forex pemula, risk management, trading edukasi"
            />
            <p className="mt-1 text-xs text-slate-500">Pisahkan dengan koma. Gunakan sebagai metadata tambahan, bukan pengganti konten berkualitas.</p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Upload Gambar Sampul</label>
          <input type="file" accept="image/*" onChange={handleCoverUpload} className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm" />
          {coverImage ? <Image src={coverImage} alt="Cover preview" width={1200} height={480} unoptimized className="mt-4 h-48 w-full rounded-2xl object-cover" /> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Konten artikel</label>
          <ArticleEditor value={content} onChange={setContent} onImageUpload={handleContentImageUpload} />
        </div>

        {statusMessage ? <p className="text-sm text-slate-600">{statusMessage}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={(event) => handleSubmit(event, false)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
            disabled={saving}
          >
            {saving ? "Menyimpan..." : "Simpan Draft"}
          </button>
          <button
            type="button"
            onClick={(event) => handleSubmit(event, true)}
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            disabled={saving}
          >
            {saving ? "Memproses..." : "Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminEditorPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-8 text-slate-500">Loading editor...</div>}>
      <AdminEditorContent />
    </Suspense>
  );
}
