import { createClient } from "@/lib/supabase";

export async function getSiteSettings() {
  const fallback = {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return fallback;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("google_analytics_id")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  return {
    googleAnalyticsId: data.google_analytics_id || "",
  };
}
