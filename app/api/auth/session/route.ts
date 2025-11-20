import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // 1) Якщо токена немає → сесії немає
    if (!accessToken && !refreshToken) {
      return NextResponse.json(null, { status: 200 });
    }

    // 2) Якщо еccessToken є → просто повертаємо session user
    try {
      const { data } = await api.get("auth/session");
      return NextResponse.json(data, { status: 200 });
    } catch {
      /* ігноруємо, йдемо перевіряти refreshToken */
    }

    // 3) Якщо accessToken нема, але refreshToken є → пробуємо refresh
    try {
      const { data } = await api.get("auth/session");
      return NextResponse.json(data, { status: 200 });
    } catch {}

    // 4) Інакше — сесії немає
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(null, { status: 200 });
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(null, { status: 200 });
  }
}
