# TraderInfo

Blog edukasi trading forex berbasis Next.js App Router, Tailwind CSS, dan Supabase.

## Status

- Production: https://traderinfo.vercel.app
- Custom domain: https://traderinfo.my.id
- GitHub: https://github.com/simaaulia69-traderinfo/traderinfo
- Branch: `main`
- Vercel project: `traderinfo`
- Admin email: `simaaulia69@gmail.com`

## Struktur penting

- `app/page.tsx`: homepage.
- `app/blog/page.tsx`: daftar artikel.
- `app/blog/[slug]/page.tsx`: detail artikel, SEO, schema, komentar, dan share icons.
- `app/admin/login/page.tsx`: login Supabase Auth.
- `app/admin/page.tsx`: dashboard artikel.
- `app/admin/editor/page.tsx`: editor artikel dan SEO fields.
- `app/api/posts/route.ts`: API CRUD, auth check, revalidation, sitemap ping.
- `components/article-editor.tsx`: rich text editor dan upload gambar inline.
- `components/ad-slot.tsx`: slot AdSense yang saat ini sengaja tidak menampilkan kotak.
- `lib/data.ts`: akses Supabase dengan fallback lokal.
- `lib/supabase.ts`: browser/server Supabase clients.
- `lib/utils.ts`: slug, tanggal, dan sanitasi HTML.
- `middleware.ts`: proteksi admin dan redirect `www`.
- `app/sitemap.ts` dan `app/robots.ts`: crawling.
- `supabase/schema.sql`: tabel, RLS, trigger, bucket, dan Storage policies.
- `data/admin-posts.json`: fallback lokal saat Supabase tidak tersedia.

## Admin dan Supabase

Login:

- Lokal: `http://localhost:3000/admin/login`
- Production: `https://traderinfo.my.id/admin/login`
- Email: `simaaulia69@gmail.com`
- Password tidak ditulis di repository; simpan di password manager.

Variabel environment:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL
ADMIN_EMAIL
NEXT_PUBLIC_GA_MEASUREMENT_ID
```

`.env.local` hanya untuk lokal dan di-ignore Git. `SUPABASE_SERVICE_ROLE_KEY` hanya boleh digunakan server/Vercel dan tidak boleh diberi prefix `NEXT_PUBLIC_`.

Setup Supabase:

1. Buka Supabase Dashboard → SQL Editor.
2. Jalankan `supabase/schema.sql`.
3. Script aman dijalankan ulang karena memakai `if not exists` dan `drop ... if exists`.
4. Pastikan kolom `meta_keywords` tersedia.
5. Pastikan bucket `article-images` public.
6. Pastikan Storage policies membatasi upload ke email admin.

## Workflow artikel

1. Login dashboard.
2. Klik `Tambah Artikel` atau `Edit`.
3. Isi judul, slug, kategori, meta description, dan meta keywords.
4. Upload cover image.
5. Letakkan kursor di isi artikel lalu klik tombol `Gambar` untuk upload gambar inline.
6. Pilih `Simpan Draft` atau `Publish`.

Artikel published masuk blog dan sitemap setelah revalidation. Meta keywords hanya metadata tambahan; kualitas konten, internal linking, heading, dan Search Console lebih penting untuk Google.

## SEO dan crawling

- Sitemap: `https://traderinfo.my.id/sitemap.xml`
- Robots: `https://traderinfo.my.id/robots.txt`
- Draft tidak dimasukkan sitemap.
- Artikel published memakai `lastModified`.
- Publish/edit menjalankan revalidasi blog dan sitemap.
- Publish mencoba melakukan ping sitemap ke Google.
- Submit `sitemap.xml` pada Google Search Console setelah domain aktif.

## GitHub

Remote:

```text
https://github.com/simaaulia69-traderinfo/traderinfo.git
```

Identitas commit:

```text
user.name: simaaulia69-traderinfo
user.email: simaaulia69@gmail.com
```

GitHub CLI credential helper sudah dikonfigurasi. Jangan menyimpan token pada URL remote, source code, atau file yang di-commit. Token yang pernah dibagikan harus segera di-revoke.

Perintah umum:

```bash
git status
git add -A
git commit -m "type: describe change"
git push origin main
```

## Vercel dan domain Rumahweb

DNS Rumahweb:

```text
@      A      76.76.21.21
www    A      76.76.21.21
```

Vercel sudah terhubung ke GitHub dan deployment production berhasil. Redirect `www.traderinfo.my.id` ke `traderinfo.my.id` diatur oleh `middleware.ts`.

Deploy manual:

```bash
npx vercel --prod
```

Environment variables harus diatur di Vercel untuk Production, dan Preview/Development bila diperlukan.

## Google Analytics 4

Integrasi GA4 tersedia di `components/google-analytics.tsx` dan hanya aktif jika `NEXT_PUBLIC_GA_MEASUREMENT_ID` diisi. Tanpa Measurement ID, script analytics tidak dirender.

Cara mendapatkan Measurement ID:

1. Buka https://analytics.google.com/ dengan akun Google yang ingin digunakan.
2. Pilih `Start measuring` atau `Admin` → `Create Property`.
3. Isi nama property, misalnya `TraderInfo`.
4. Pilih zona waktu Indonesia dan mata uang Rupiah.
5. Tambahkan data stream `Web`.
6. Masukkan `https://traderinfo.my.id` sebagai URL website.
7. Salin Measurement ID dengan format `G-XXXXXXXXXX`.
8. Tambahkan `NEXT_PUBLIC_GA_MEASUREMENT_ID` di Vercel Production Environment.
9. Redeploy project.

Validasi melalui GA4 → `Reports` → `Realtime`, lalu buka website pada tab lain. Penggunaan Google Analytics juga sudah dijelaskan pada halaman Privacy Policy.

## Keamanan

- Jangan commit `.env.local`.
- Jangan membagikan service role key, database password, atau GitHub token.
- Rotate semua credential yang pernah terekspos.
- API artikel memverifikasi session Supabase dan `ADMIN_EMAIL`.
- RLS database dan Storage policies membatasi operasi admin.
- HTML artikel disanitasi sebelum disimpan/ditampilkan.
- Password admin tidak disimpan di source code.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

Validasi build:

```bash
npm run build
```

## AdSense

Halaman About, Contact, Privacy Policy, Terms, Disclaimer, Blog, dan 404 tersedia. Placeholder iklan sengaja disembunyikan sampai publisher ID resmi tersedia. Approval AdSense tidak dapat dijamin hanya oleh kode; Google juga menilai originalitas konten, kualitas editorial, navigasi, transparansi pengelola, dan kepatuhan kebijakan.
