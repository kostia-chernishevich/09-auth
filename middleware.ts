import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value ?? null;
  const refreshToken = req.cookies.get("refreshToken")?.value ?? null;

  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPrivatePage = pathname.startsWith("/profile");

  // Якщо є accessToken → пропускаємо
  if (accessToken) return NextResponse.next();

  // Якщо accessToken нема, але є refreshToken → пробуємо оновити
  if (!accessToken && refreshToken) {
    try {
      const sessionReq = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
        method: "GET",
        headers: { Cookie: `refreshToken=${refreshToken}` },
      });

      if (sessionReq.ok) {
        return NextResponse.next();
      }
    } catch {}
  }

  // Якщо користувач НЕ авторизований
  if (isPrivatePage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/login", "/register"],
};
