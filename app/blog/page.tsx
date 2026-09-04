import { ArticleCard } from "@/components/article-card";
import { SectionHeading } from "@/components/section-heading";
import { getPublishedPosts } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Baca artikel terkini seputar forex, strategi trading, dan manajemen risiko.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Blog"
        title="Semua artikel terbaru"
        description="Eksplorasi panduan forex yang ditulis untuk membantu Anda mengambil keputusan yang lebih bijak di pasar."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
