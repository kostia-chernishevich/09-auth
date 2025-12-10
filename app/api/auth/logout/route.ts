// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";

export async function POST() {
  try {
    await api.post("auth/logout");

    const response = NextResponse.json({ success: true }, { status: 200 });

    response.cookies.set("accessToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("refreshToken", "", { maxAge: 0, path: "/" });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 200 }
    );
  }
}
