// app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = cookies();
  const accessToken = store.get("accessToken")?.value ?? null;
  const refreshToken = store.get("refreshToken")?.value ?? null;

  // 1) Немає жодного токена
  if (!accessToken && !refreshToken) {
    return NextResponse.json({ success: false }, { status: 200 });
  }

  // 2) Є accessToken → пробуємо
  if (accessToken) {
    try {
      await api.get("auth/session", {
        headers: { Cookie: `accessToken=${accessToken}` },
      });
      return NextResponse.json({ success: true }, { status: 200 });
    } catch {}
  }

  // 3) Є refreshToken → оновлюємо
  if (refreshToken) {
    try {
      const res = await api.get("auth/session", {
        headers: { Cookie: `refreshToken=${refreshToken}` },
      });

      const response = NextResponse.json({ success: true }, { status: 200 });

      // встановлюємо оновлені кукі
      const setCookie = res.headers["set-cookie"];
      if (setCookie) {
        const arr = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of arr) {
          const parsed = parse(cookieStr);

          const opts = {
            httpOnly: true,
            secure: true,
            sameSite: "lax" as const,
            path: parsed.Path ?? "/",
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
          };

          if (parsed.accessToken) {
            response.cookies.set("accessToken", parsed.accessToken, opts);
          }
          if (parsed.refreshToken) {
            response.cookies.set("refreshToken", parsed.refreshToken, opts);
          }
        }
      }

      return response;
    } catch {}
  }

  return NextResponse.json({ success: false }, { status: 200 });
}
