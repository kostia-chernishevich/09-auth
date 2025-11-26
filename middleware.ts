import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePage =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  // ---- якщо є accessToken → юзер вважається залогіненим ----
  if (accessToken) {
    // залогіненого не пускаємо на /sign-in /sign-up
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  }

  // ---- якщо немає accessToken, але є refreshToken → лишаємо на будь-якій сторінці ----
  // (даємо AuthProvider на клієнті шанс оновити токен)
  if (refreshToken) {
    return NextResponse.next();
  }

  // ---- якщо немає жодних токенів і це приватна сторінка → шлемо на /sign-in ----
  if (isPrivatePage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // публічні сторінки без токенів пропускаємо
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
