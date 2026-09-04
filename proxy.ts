import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (hostname === "www.traderinfo.my.id") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "traderinfo.my.id";
    redirectUrl.protocol = "https:";
    return NextResponse.redirect(redirectUrl, 308);
  }

  const isLoginRoute = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin") && !isLoginRoute;

  const hasSupabaseConfig = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const localAdminSession = request.cookies.get("traderinfo_admin_session")?.value === "true";

  if (!isAdminRoute) {
    return response;
  }

  if (!hasSupabaseConfig && localAdminSession && process.env.NODE_ENV !== "production") {
    return response;
  }

  if (hasSupabaseConfig) {
    response.cookies.delete("traderinfo_admin_session");
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (process.env.ADMIN_EMAIL && user.email !== process.env.ADMIN_EMAIL) {
    const redirectUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
