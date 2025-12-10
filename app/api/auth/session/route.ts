import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const store = cookies(); 

    const accessToken = store.get("accessToken")?.value ?? null;
    const refreshToken = store.get("refreshToken")?.value ?? null;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(null, { status: 200 });
    }

    // (2) Якщо є accessToken
    if (accessToken) {
      try {
        const res = await api.get("auth/session", {
          headers: { Cookie: `accessToken=${accessToken}` },
        });
        return NextResponse.json(res.data, { status: 200 });
      } catch {}
    }

    // (3) Якщо accessToken не спрацював → refresh
    if (refreshToken) {
      try {
        const res = await api.get("auth/session", {
          headers: { Cookie: `refreshToken=${refreshToken}` },
        });

        const response = NextResponse.json(res.data, { status: 200 });

        const setCookie = res.headers["set-cookie"];
        if (setCookie) {
          for (const cookieStr of setCookie) {
            const parsed = parse(cookieStr);

            const options = {
              httpOnly: true,
              secure: true,
              sameSite: "lax" as const,
              path: parsed.Path ?? "/",
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined
            };

            if (parsed.accessToken) {
              response.cookies.set("accessToken", parsed.accessToken, options);
            }
            if (parsed.refreshToken) {
              response.cookies.set("refreshToken", parsed.refreshToken, options);
            }
          }
        }

        return response;
      } catch {}
    }

    return NextResponse.json(null, { status: 200 });

  } catch (err) {
    if (isAxiosError(err)) {
      logErrorResponse(err.response?.data);
    }
    return NextResponse.json(null, { status: 200 });
  }
}
