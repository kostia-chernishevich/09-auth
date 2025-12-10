// lib/api/clientApi.ts
import axios from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

const client = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// ---------- AUTH ----------

export const register = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await client.post<User>("/auth/register", payload);
  return res.data;
};

export const login = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await client.post<User>("/auth/login", payload);
  return res.data;
};

export const logout = async () => {
  await client.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const res = await client.get<User | null>("/auth/session");
  return res.data;
};

// ---------- USER UPDATE ----------

type UpdateMePayload = {
  username: string;
};

export const updateMe = async (payload: UpdateMePayload): Promise<User> => {
  const res = await client.patch<User>("/users/me", payload);
  return res.data;
};

// ---------- NOTES API ----------

type FetchNotesParams = {
  tag?: string;
  page?: number;
  limit?: number;
  search?: string;
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<{ notes: Note[]; totalPages: number }> => {
  const { tag, page = 1, limit = 12, search } = params;

  const searchParams = new URLSearchParams();

  if (tag && tag !== "all") {
    searchParams.set("tag", tag);
  }

  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  if (search) {
    searchParams.set("search", search);
  }

  const res = await client.get<Note[]>("/notes", {
    params: searchParams,
  });

  // бекенд зазвичай віддає загальну кількість у заголовку
  const total = Number(res.headers["x-total-count"] ?? res.data.length);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    notes: res.data,
    totalPages,
  };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await client.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (payload: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const res = await client.post<Note>("/notes", payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await client.delete<Note>(`/notes/${id}`);
  return res.data;
};
