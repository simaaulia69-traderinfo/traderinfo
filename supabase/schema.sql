create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null default '',
  category text not null default 'General',
  meta_description text not null default '',
  meta_keywords text not null default '',
  cover_image text,
  is_published boolean not null default false,
  comments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts add column if not exists meta_keywords text not null default '';

create index if not exists posts_slug_idx on public.posts(slug);
create index if not exists posts_published_idx on public.posts(is_published, created_at desc);

alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
on public.posts for select
using (is_published = true);

drop policy if exists "Admins can manage all posts" on public.posts;
create policy "Admins can manage all posts"
on public.posts for all
using ((auth.jwt() ->> 'email') = 'simaaulia69@gmail.com')
with check ((auth.jwt() ->> 'email') = 'simaaulia69@gmail.com');

drop policy if exists "Admins can insert posts" on public.posts;
create policy "Admins can insert posts"
on public.posts for insert
with check ((auth.jwt() ->> 'email') = 'simaaulia69@gmail.com');

drop policy if exists "Admins can update posts" on public.posts;
create policy "Admins can update posts"
on public.posts for update
using ((auth.jwt() ->> 'email') = 'simaaulia69@gmail.com')
with check ((auth.jwt() ->> 'email') = 'simaaulia69@gmail.com');

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
on public.posts for delete
using ((auth.jwt() ->> 'email') = 'simaaulia69@gmail.com');

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.posts;
create trigger set_updated_at
before update on public.posts
for each row
execute function public.handle_updated_at();

create or replace function public.create_public_post()
returns trigger as $$
begin
  if new.is_published = true then
    perform pg_notify('post_published', new.slug);
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists notify_post_publish on public.posts;
create trigger notify_post_publish
after insert or update on public.posts
for each row
when (new.is_published = true)
execute function public.create_public_post();

insert into storage.buckets (id, name, public)
values ('article-images', 'article-images', true)
on conflict (id) do update set public = true;

create table if not exists public.site_settings (
  id integer primary key default 1,
  google_analytics_id text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
to public
using (true);

insert into public.site_settings (id, google_analytics_id)
values (1, '')
on conflict (id) do nothing;

drop policy if exists "Authenticated admins can upload article images" on storage.objects;
create policy "Authenticated admins can upload article images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'article-images' and (auth.jwt() ->> 'email') = 'simaaulia69@gmail.com');

drop policy if exists "Public can read article images" on storage.objects;
create policy "Public can read article images"
on storage.objects for select
to public
using (bucket_id = 'article-images');

drop policy if exists "Authenticated admins can update article images" on storage.objects;
create policy "Authenticated admins can update article images"
on storage.objects for update
to authenticated
using (bucket_id = 'article-images' and (auth.jwt() ->> 'email') = 'simaaulia69@gmail.com')
with check (bucket_id = 'article-images' and (auth.jwt() ->> 'email') = 'simaaulia69@gmail.com');
