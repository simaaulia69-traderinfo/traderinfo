export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  meta_description: string;
  meta_keywords: string;
  cover_image: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  comments: CommentItem[];
};

export type CommentItem = {
  name: string;
  message: string;
  created_at: string;
};

export type PostDraft = {
  title: string;
  slug: string;
  content: string;
  category: string;
  meta_description: string;
  meta_keywords: string;
  cover_image: string | null;
  is_published: boolean;
};
