import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Syarat dan ketentuan penggunaan situs TraderInfo untuk konten edukasi forex dan layanan publikasi artikel.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Terms of Service</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Syarat dan Ketentuan</h1>

        <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
          <p>Dengan mengakses atau menggunakan TraderInfo, Anda menyetujui seluruh syarat dan ketentuan yang berlaku di situs ini. Konten yang kami sajikan terutama bersifat edukatif daninformasi umum, bukan nasehat finansial atau rekomendasi investasi.</p>
          <p>Penggunaan situs ini bertujuan untuk mendukung pembelajaran dan pemahaman terkait pasar forex secara umum. Dilarang menggunakan situs ini untuk kegiatan yang melanggar hukum, menyebarkan konten menyesatkan, atau merugikan pihak lain.</p>
          <p>Kami berhak memperbarui, mengubah, atau menghentikan sebagian layanan tanpa pemberitahuan sebelumnya. Pembaruan syarat dan ketentuan akan diumumkan melalui halaman ini.</p>
          <p>Konten dan logo TraderInfo dilindungi oleh hak cipta dan tidak boleh digunakan tanpa izin tertulis, kecuali untuk keperluan referensi non-komersial yang ditetapkan dengan jelas.</p>
        </div>
      </article>
    </div>
  );
}
