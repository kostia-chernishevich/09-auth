import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  const path = request.nextUrl.pathname;

  const isAuthPage = path.startsWith("/sign-in") || path.startsWith("/sign-up");
  const isPrivatePage = path.startsWith("/profile") || path.startsWith("/notes");

  // Якщо приватна сторінка → токен потрібен
  if (!accessToken && isPrivatePage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Якщо вже авторизований → не пускаємо на sign-in / sign-up
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
