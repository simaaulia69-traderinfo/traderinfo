export async function pingGoogleSitemap(url: string) {
  try {
    await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`, {
      method: "GET",
      cache: "no-store",
    });
  } catch {
    // Ignore ping failures so the app remains resilient.
  }
}

export function buildArticleSchema(post: {
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  meta_keywords?: string;
  cover_image?: string | null;
  category: string;
  created_at: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description,
    keywords: post.meta_keywords
      ?.split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
    image: post.cover_image || "https://traderinfo.my.id/og-default.jpg",
    author: {
      "@type": "Organization",
      name: "TraderInfo",
    },
    publisher: {
      "@type": "Organization",
      name: "TraderInfo",
      logo: {
        "@type": "ImageObject",
        url: "https://traderinfo.my.id/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://traderinfo.my.id/blog/${post.slug}`,
    },
    datePublished: post.created_at,
    articleSection: post.category,
    articleBody: post.content.replace(/<[^>]+>/g, " "),
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TraderInfo",
    url: "https://traderinfo.my.id",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://traderinfo.my.id/blog?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}
