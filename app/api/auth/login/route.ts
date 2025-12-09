import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await api.post("auth/login", body);

    const setCookie = apiRes.headers["set-cookie"];

    const response = NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });

    if (setCookie) {
      const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

      for (const cookieStr of cookieArray) {
        // ТИПІЗАЦІЯ BEZ ANY
        const parsed = parse(cookieStr) as Record<string, string>;

        const options: Partial<ResponseCookie> = {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: parsed.Path ?? "/",
        };

        if (parsed.Expires) {
          options.expires = new Date(parsed.Expires);
        }

        if (parsed["Max-Age"]) {
          options.maxAge = Number(parsed["Max-Age"]);
        }

        if (parsed.accessToken) {
          response.cookies.set("accessToken", parsed.accessToken, options);
        }

        if (parsed.refreshToken) {
          response.cookies.set("refreshToken", parsed.refreshToken, options);
        }
      }
    }

    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        { status: error.response?.status ?? 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
