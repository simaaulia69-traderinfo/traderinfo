import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Pelajari latar belakang TraderInfo dan kompetensi tim di bidang edukasi trading forex.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">About us</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
          TraderInfo hadir untuk membangun literasi trading yang sehat dan berkelanjutan.
        </h1>
        <p className="mt-6 text-base leading-8 text-slate-600">
          Kami adalah platform edukasi yang fokus pada pasar forex, analisis teknikal, manajemen risiko, serta disiplin psikologi trading. Tujuan kami adalah membantu pembaca memahami bahwa trading bukan sekadar mencari sinyal, melainkan membangun keputusan berdasarkan proses yang terukur dan konsisten.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-900">E-E-A-T</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Konten kami disusun dengan pendekatan edukatif, pengalaman praktis, dan pemahaman pasar yang relevan.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-900">Risk Awareness</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Kami menekankan pentingnya risk management agar pembaca tidak terjebak pola overtrading.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-900">Praktik yang sehat</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Kami membahas trading sebagai aktivitas berisiko tinggi yang memerlukan pendidikan, evaluasi, dan disiplin.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
