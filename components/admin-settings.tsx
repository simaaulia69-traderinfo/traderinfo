"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export function AdminSettings() {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((response) => response.json())
      .then((data) => setGoogleAnalyticsId(data.googleAnalyticsId ?? ""))
      .catch(() => setStatus("Pengaturan gagal dimuat."));
  }, []);

  const saveSettings = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const supabase = createBrowserSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ googleAnalyticsId }),
    });
    const result = await response.json();
    setSaving(false);
    setStatus(response.ok ? "Google Analytics berhasil disimpan." : result.message || "Gagal menyimpan pengaturan.");
  };

  return (
    <form onSubmit={saveSettings} className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pengaturan situs</p>
      <h2 className="mt-2 text-xl font-black text-slate-900">Google Analytics 4</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Masukkan Measurement ID, misalnya G-XXXXXXXXXX. Perubahan aktif tanpa deploy ulang.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          value={googleAnalyticsId}
          onChange={(event) => setGoogleAnalyticsId(event.target.value)}
          placeholder="G-XXXXXXXXXX"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-slate-400"
          aria-label="Google Analytics Measurement ID"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan ID"}
        </button>
      </div>
      {status ? <p className="mt-3 text-sm text-slate-600">{status}</p> : null}
    </form>
  );
}
