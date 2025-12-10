import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    
    const store = cookies() as unknown as ReadonlyRequestCookies;

    const accessToken = store.get("accessToken")?.value ?? null;
    const refreshToken = store.get("refreshToken")?.value ?? null;

    if (!accessToken && !refreshToken) {
      return NextResponse.json(null, { status: 200 });
    }

    if (accessToken) {
      try {
        const res = await api.get("auth/session", {
          headers: { Cookie: `accessToken=${accessToken}` },
        });
        return NextResponse.json(res.data, { status: 200 });
      } catch {}
    }

    if (refreshToken) {
      try {
        const res = await api.get("auth/session", {
          headers: { Cookie: `refreshToken=${refreshToken}` },
        });

        const response = NextResponse.json(res.data, { status: 200 });

        const setCookie = res.headers["set-cookie"];
        if (setCookie) {
          const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const options: any = {
              httpOnly: true,
              secure: true,
              sameSite: "lax",
              path: parsed.Path ?? "/",
            };

            if (parsed.Expires) options.expires = new Date(parsed.Expires);
            if (parsed["Max-Age"]) options.maxAge = Number(parsed["Max-Age"]);

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
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
    } else {
      logErrorResponse({ message: (error as Error).message });
    }
    return NextResponse.json(null, { status: 200 });
  }
}
