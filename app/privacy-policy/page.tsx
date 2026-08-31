import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Kebijakan privasi TraderInfo mencakup data pengguna, cookies, AdSense, analitik, dan perlindungan data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Privacy Policy</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Kebijakan Privasi</h1>

        <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
          <p>TraderInfo menghargai privasi pengunjung. Informasi yang kami kumpulkan dapat digunakan untuk memahami trafik situs, meningkatkan kualitas konten, dan menyesuaikan pengalaman membaca Anda.</p>
          <p>Informasi yang umum kami kumpulkan mencakup data browser, alamat IP, halaman yang dikunjungi, serta metadata dasar seperti waktu akses. Data ini diproses untuk keperluan analitik dan keamanan situs.</p>
          <p>Kami dapat menggunakan cookies untuk menyimpan preferensi pengguna dan mendukung fungsi analitik. Beberapa pihak ketiga seperti Google AdSense dan penyedia analitik mungkin menggunakan cookies untuk menampilkan iklan atau mengukur kinerja trafik.</p>
          <p>Dengan melanjutkan penggunaan situs, Anda menyetujui penggunaan cookies sesuai dengan kebijakan ini. Anda dapat mengatur browser untuk menolak cookies, namun beberapa fitur situs mungkin tidak tersedia optimal.</p>
          <p>Jika terdapat perubahan signifikan pada kebijakan ini, kami akan memperbarui halaman ini. Penggunaan situs secara berkelanjutan menandakan persetujuan terhadap pembaruan tersebut.</p>
        </div>
      </article>
    </div>
  );
}
