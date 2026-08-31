import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ success: false, message: "Akses admin diperlukan." }, { status: 401 });
  }

  const body = await request.json();
  const googleAnalyticsId = String(body.googleAnalyticsId || "").trim();

  if (googleAnalyticsId && !/^G-[A-Z0-9]+$/i.test(googleAnalyticsId)) {
    return NextResponse.json(
      { success: false, message: "Measurement ID harus berformat G-XXXXXXXXXX." },
      { status: 400 }
    );
  }

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
  );

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    google_analytics_id: googleAnalyticsId,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  revalidatePath("/");
  return NextResponse.json({ success: true, googleAnalyticsId });
}
