import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { api } from "../../api";

export async function POST() {
  const store = await cookies();

  const refreshToken = store.get("refreshToken")?.value ?? "";

  await api.post("/auth/logout", null, {
    headers: { Cookie: `refreshToken=${refreshToken}` },
  });

  const res = NextResponse.json({ ok: true });

  res.cookies.delete("accessToken");
  res.cookies.delete("refreshToken");

  return res;
}
