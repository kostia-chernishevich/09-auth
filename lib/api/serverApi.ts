
import { cookies } from "next/headers";
import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import type { AxiosResponse } from "axios";

function formatCookieHeader(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}


export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const cookieHeader = formatCookieHeader(cookieStore);

  const res = await api.get<User>("/users/me", {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}


export async function checkSession(): Promise<AxiosResponse<User | null>> {
  const cookieStore = await cookies();
  const cookieHeader = formatCookieHeader(cookieStore);

  return api.get<User | null>("/auth/session", {
    headers: { Cookie: cookieHeader },
  });
}


export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const cookieHeader = formatCookieHeader(cookieStore);

  const res = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });

  return res.data;
}
type FetchNotesParams = {
  tag?: string;
  page: number;
  limit: number;
  search: string;
};

export async function fetchNotes(
  params: FetchNotesParams
): Promise<Note[]> {
  const cookieStore = await cookies();
  const cookieHeader = formatCookieHeader(cookieStore);

  const res = await api.get<Note[]>("/notes", {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });

  return res.data;
}
