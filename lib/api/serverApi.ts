import { cookies } from "next/headers";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

const buildCookieHeader = () => {
  const cookieStore =  cookies();
  const allCookies = cookieStore.getAll() as RequestCookie[];

  return allCookies
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
};

// ==============================
// GET SESSION
// ==============================
export const checkSession = async () => {
  const cookieHeader = buildCookieHeader();

  const res = await fetch("/api/auth/session", {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!res.ok) return null;

  return await res.json();
};

// ==============================
// GET ME
// ==============================
export const getMe = async () => {
  const cookieHeader = buildCookieHeader();

  const res = await fetch("/api/users/me", {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!res.ok) return null;

  return await res.json();
};

// ==============================
// FETCH NOTES
// ==============================
export const fetchNotes = async () => {
  const cookieHeader = buildCookieHeader();

  const res = await fetch("/api/notes", {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!res.ok) return [];

  return await res.json();
};

// ==============================
// FETCH NOTE BY ID
// ==============================
export const fetchNoteById = async (id: string) => {
  const cookieHeader = buildCookieHeader();

  const res = await fetch(`/api/notes/${id}`, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (!res.ok) return null;

  return await res.json();
};
