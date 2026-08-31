import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Hubungi TraderInfo untuk pertanyaan, kolaborasi, atau komunikasi terkait konten edukasi forex.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Contact us</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Hubungi kami</h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Jika Anda punya pertanyaan terkait artikel, kerja sama, atau kebutuhan editorial, kami siap menjawab.
          </p>
          <div className="mt-6 space-y-3 text-sm text-slate-700">
            <p>
              <span className="font-semibold text-slate-900">Email:</span> simaaulia69@gmail.com
            </p>
            <p>
              <span className="font-semibold text-slate-900">Lokasi:</span> Indonesia
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <form className="space-y-5" action="mailto:simaaulia69@gmail.com" method="post" encType="text/plain">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Nama</label>
              <input type="text" name="name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400" placeholder="Nama Anda" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input type="email" name="email" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Pesan</label>
              <textarea name="message" rows={5} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400" placeholder="Tuliskan pertanyaan Anda..." />
            </div>
            <button type="submit" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
