// lib/api/serverApi.ts
import axios from "axios";
import type { User } from "@/types/user";

const serverClient = axios.create({
  baseURL: process.env.API_URL,
  withCredentials: true,
});

// Функція ходить в наш API route: /api/users/me
export async function getMe(): Promise<User> {
  const res = await serverClient.get("/users/me");
  return res.data;
}

// Функція для middleware
export async function checkSession(): Promise<boolean> {
  try {
    const res = await serverClient.get("/auth/session");
    return res.status === 200;
  } catch {
    return false;
  }
}
