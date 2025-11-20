import { api } from "./api";

export const register = async (email: string, password: string) => {
  const { data } = await api.post("/api/auth/register", { email, password });
  return data;
};

export const login = async (email: string, password: string) => {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/api/auth/logout");
  return data;
};

export const checkSession = async () => {
  const { data } = await api.get("/api/auth/session");
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/api/users/me");
  return data;
};

export const updateMe = async (username: string) => {
  const { data } = await api.patch("/api/users/me", { username });
  return data;
};
