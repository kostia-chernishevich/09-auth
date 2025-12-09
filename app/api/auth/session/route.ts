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

  const res = await api.get("/auth/session", {
    headers: { Cookie: cookieHeader },
  });

  const response = NextResponse.json(res.data, { status: res.status });

  const setCookie = res.headers["set-cookie"];
  if (setCookie) {
    setCookie.forEach((cookieStr: string) => {
      const [pair] = cookieStr.split(";");
      const [name, value] = pair.split("=");

      response.cookies.set(name.trim(), value.trim());
    });
  }

  return response;
}
