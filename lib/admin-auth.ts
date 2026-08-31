import { createServerClient } from "@supabase/ssr";

export async function isAdminRequest(request: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return false;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("cookie") ?? "";
          return cookieHeader
            .split(";")
            .map((cookie) => cookie.trim())
            .filter(Boolean)
            .map((cookie) => {
              const separator = cookie.indexOf("=");
              return {
                name: separator >= 0 ? cookie.slice(0, separator) : cookie,
                value: separator >= 0 ? decodeURIComponent(cookie.slice(separator + 1)) : "",
              };
            });
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Boolean(user && (!process.env.ADMIN_EMAIL || user.email === process.env.ADMIN_EMAIL));
}
