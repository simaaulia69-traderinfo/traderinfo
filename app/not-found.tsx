import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
        Halaman yang Anda cari tidak ditemukan.
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Mungkin artikel sudah dipindahkan atau URL salah. Silakan kembali ke beranda dan jelajahi konten terbaru kami.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
          Kembali ke Beranda
        </Link>
        <Link href="/blog" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
          Lihat Blog
        </Link>
      </div>
    </div>
  );
}
