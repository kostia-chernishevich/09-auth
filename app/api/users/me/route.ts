import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "../../api";

export async function GET() {
  const store = await cookies();

  const accessToken = store.get("accessToken")?.value ?? "";
  const refreshToken = store.get("refreshToken")?.value ?? "";

  const cookieHeader = [
    accessToken ? `accessToken=${accessToken}` : "",
    refreshToken ? `refreshToken=${refreshToken}` : ""
  ]
    .filter(Boolean)
    .join("; ");

  const res = await api.get("/users/me", {
    headers: { Cookie: cookieHeader },
  });

  return NextResponse.json(res.data, { status: res.status });
}
