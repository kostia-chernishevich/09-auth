// lib/api/clientApi.ts
import { api } from "./api";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// ---------- AUTH ----------

export const register = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await api.post<User>("/auth/register", payload);
  return res.data;
};

export const login = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await api.post<User>("/auth/login", payload);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const res = await api.get<User | null>("/auth/session");
  return res.data;
};

// ---------- USER UPDATE ----------

type UpdateMePayload = {
  username: string;
};

export const updateMe = async (payload: UpdateMePayload): Promise<User> => {
  const res = await api.patch<User>("/users/me", payload);
  return res.data;
};

// ---------- NOTES ----------

type FetchNotesParams = {
  tag?: string;
  page?: number;
  limit?: number;
  search?: string;
};

export const fetchNotes = async ({
  tag,
  page = 1,
  limit = 12,
  search,
}: FetchNotesParams) => {
  const params = new URLSearchParams();

  if (tag && tag !== "all") params.set("tag", tag);
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const res = await api.get<Note[]>("/notes", { params });

  const total = Number(res.headers["x-total-count"] ?? res.data.length);
  const totalPages = Math.ceil(total / limit);

  return { notes: res.data, totalPages };
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (payload: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};
