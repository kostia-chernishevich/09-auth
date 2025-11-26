import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// ---- AUTH ----
export const register = async (email: string, password: string) => {
  const res = await client.post("/auth/register", { email, password });
  return res.data;
};

export const login = async (email: string, password: string) => {
  const res = await client.post("/auth/login", { email, password });
  return res.data;
};

export const logout = async () => {
  const res = await client.post("/auth/logout");
  return res.data;
};

export const checkSession = async () => {
  const res = await client.get("/auth/session");
  return res.data;
};


export const updateMe = async (payload: { username?: string }) => {
  const res = await client.patch("/users/me", payload);
  return res.data;
};
