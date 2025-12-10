import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value ?? null;
  const refreshToken = req.cookies.get("refreshToken")?.value ?? null;

  const pathname = req.nextUrl.pathname;

  // Маршрути-аутентифікації
  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  // Приватні маршрути
  const isPrivatePage =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/notes") ||
    pathname.startsWith("/notes/filter");

  // ---------------------------------------------------
  // (1) АВТОРИЗОВАНИЙ КОРИСТУВАЧ → не пускати на auth-сторінки
  // ---------------------------------------------------
  if (accessToken && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ---------------------------------------------------
  // (2) Якщо є accessToken → пропускаємо далі
  // ---------------------------------------------------
  if (accessToken) {
    return NextResponse.next();
  }

  // ---------------------------------------------------
  // (3) Якщо НЄ accessToken, але Є refreshToken → пробуємо refresh
  // ---------------------------------------------------
  if (!accessToken && refreshToken) {
    try {
      const resp = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
        method: "GET",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      // Сесія відновлена — пропускаємо
      if (resp.ok) {
        return NextResponse.next();
      }
    } catch {
      // ignore → дивимось далі
    }
  }

  // ---------------------------------------------------
  // (4) НЕавторизований юзер заходить на приватну сторінку
  // ---------------------------------------------------
  if (isPrivatePage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // ---------------------------------------------------
  // (5) Все інше — пропускаємо
  // ---------------------------------------------------
  return NextResponse.next();
}

// ВАЖЛИВО — додано всі потрібні маршрути
export const config = {
  matcher: [
    "/profile/:path*",
    "/notes/:path*",
    "/notes/filter/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
