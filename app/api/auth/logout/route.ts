import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST() {
  try {
    const cookieStore = cookies();

    const accessToken = (await cookieStore).get("accessToken")?.value;
    const refreshToken = (await cookieStore).get("refreshToken")?.value;

    // Готуємо Cookie header правильно
    const cookieHeader =
      accessToken && refreshToken
        ? `accessToken=${accessToken}; refreshToken=${refreshToken}`
        : "";

    // Запит на вихід до реального бекенду
    await api.post(
      "auth/logout",
      null,
      cookieHeader
        ? {
            headers: { Cookie: cookieHeader },
          }
        : undefined
    );

    // Видаляємо кукі
    (await
      // Видаляємо кукі
      cookieStore).delete("accessToken");
    (await cookieStore).delete("refreshToken");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
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
