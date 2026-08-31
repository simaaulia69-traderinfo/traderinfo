import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Disclaimer",
  description: "Risk disclaimer situs TraderInfo yang menegaskan trading forex berisiko tinggi dan konten bersifat edukasi.",
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Risk Disclaimer</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Financial Risk Disclaimer</h1>

        <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
          <p>Trading forex melibatkan risiko kehilangan modal secara signifikan. Pasar valuta asing sangat volatil dan dapat bergerak dengan cepat dalam waktu singkat. Semua keputusan trading harus dibuat dengan pemahaman penuh atas risikonya.</p>
          <p>Semua konten yang tersedia di TraderInfo disediakan untuk tujuan edukasi dan informasi umum saja. Kami tidak menjamin keuntungan, tidak menjamin keakuratan analisis, dan tidak bertindak sebagai penasihat investasi atau pialang resmi.</p>
          <p>Anda bertanggung jawab penuh atas keputusan investasi dan strategi trading yang Anda ambil. Pastikan untuk melakukan penelitian tambahan, memahami profil risiko pribadi, serta mempertimbangkan kondisi finansial Anda sebelum memutuskan untuk terlibat dalam aktivitas trading.</p>
          <p>Jika Anda belum memahami prosedur trading atau risikonya, kami sarankan untuk tidak menempatkan modal yang tidak siap Anda hilangkan.</p>
        </div>
      </article>
    </div>
  );
}
