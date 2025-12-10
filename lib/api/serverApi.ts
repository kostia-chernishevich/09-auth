// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { api } from "./api"; // ← Правильний імпорт!
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { AxiosResponse } from "axios";

function formatCookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

// ---------- USER ----------
export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const cookieHeader = formatCookieHeader(cookieStore);

  const res = await api.get<User>("/users/me", {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}

// використовується в middleware → має повертати AxiosResponse!
export async function checkSession(): Promise<AxiosResponse<User | null>> {
  const cookieStore = await cookies();
  const cookieHeader = formatCookieHeader(cookieStore);

  return api.get<User | null>("/auth/session", {
    headers: { Cookie: cookieHeader },
  });
}

// ---------- NOTES ----------
export async function getNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const cookieHeader = formatCookieHeader(cookieStore);

  const res = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}
