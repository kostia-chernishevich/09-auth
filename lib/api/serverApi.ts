// lib/api/serverApi.ts
import { cookies } from "next/headers";
import type { User } from "@/types/user";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// збираємо всі куки в один рядок "name=value; name2=value2"
const buildCookieHeader = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  if (!allCookies.length) return "";

  return allCookies
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
};

// ---- GET ME (server) ----
export const getMe = async (): Promise<User> => {
  const Cookie = await buildCookieHeader();

  // ВАЖЛИВО: використовуємо new URL, а не "/api/users/me"
  const url = new URL("/api/users/me", baseURL);

  const res = await fetch(url, {
    method: "GET",
    headers: Cookie ? { Cookie } : {},
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("getMe failed:", res.status, text);
    throw new Error(`Failed to fetch user. Status: ${res.status}`);
  }

  const data = (await res.json()) as User;
  return data;
};
