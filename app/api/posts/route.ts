import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import { pingGoogleSitemap } from "@/lib/seo";
import { slugify } from "@/lib/utils";
import { deleteFallbackPost, readFallbackPosts, upsertFallbackPost } from "@/lib/data";
import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function createDatabaseClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
    );
  }

  return createClient();
}

async function isAdminRequest(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return false;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("cookie") ?? "";
          return cookieHeader
            .split(";")
            .map((cookie) => cookie.trim())
            .filter(Boolean)
            .map((cookie) => {
              const separator = cookie.indexOf("=");
              return {
                name: separator >= 0 ? cookie.slice(0, separator) : cookie,
                value: separator >= 0 ? decodeURIComponent(cookie.slice(separator + 1)) : "",
              };
            });
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Boolean(user && (!process.env.ADMIN_EMAIL || user.email === process.env.ADMIN_EMAIL));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");

  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ success: false, message: "Akses admin diperlukan." }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const posts = await readFallbackPosts();
    if (slug) {
      return NextResponse.json({ success: true, post: posts.find((post) => post.slug === slug) ?? null });
    }
    if (id) {
      return NextResponse.json({ success: true, post: posts.find((post) => post.id === id) ?? null });
    }
    return NextResponse.json({ success: true, posts });
  }

  const supabase = createDatabaseClient();
  let query: any = supabase.from("posts").select("*");

  if (slug) {
    query = query.eq("slug", slug).maybeSingle();
  } else if (id) {
    query = query.eq("id", id).maybeSingle();
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, posts: data ?? [], post: data ?? null });
}

export async function POST(request: Request) {
  try {
    if (!(await isAdminRequest(request))) {
      return NextResponse.json({ success: false, message: "Akses admin diperlukan." }, { status: 401 });
    }

    const body = await request.json();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://traderinfo.my.id";

    const payload = {
      id: body.id ?? undefined,
      title: String(body.title || "Untitled article"),
      slug: String(body.slug || slugify(body.title || "untitled-article")),
      category: String(body.category || "Forex Basics"),
      meta_description: String(body.meta_description || ""),
      meta_keywords: String(body.meta_keywords || ""),
      content: String(body.content || "<p>Konten belum tersedia.</p>"),
      cover_image: body.cover_image || null,
      is_published: Boolean(body.is_published),
      comments: Array.isArray(body.comments) ? body.comments : [],
      created_at: body.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const saved = await upsertFallbackPost(payload);
      revalidatePath("/blog");
      revalidatePath("/sitemap.xml");
      revalidatePath(`/blog/${saved.slug}`);
      if (saved.is_published) {
        await pingGoogleSitemap(`${siteUrl}/sitemap.xml`);
      }
      return NextResponse.json({ success: true, data: saved });
    }

    const supabase = createDatabaseClient();
    const { data, error } = await supabase
      .from("posts")
      .upsert({
        ...payload,
      }, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    revalidatePath(`/blog/${payload.slug}`);

    if (payload.is_published) {
      await pingGoogleSitemap(`${siteUrl}/sitemap.xml`);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Gagal menyimpan artikel.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ success: false, message: "Akses admin diperlukan." }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ success: false, message: "ID artikel tidak valid." }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    await deleteFallbackPost(id);
    revalidatePath("/blog");
    revalidatePath("/sitemap.xml");
    return NextResponse.json({ success: true });
  }

  const supabase = createDatabaseClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  return NextResponse.json({ success: true });
}
