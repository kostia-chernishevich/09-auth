import axios from "axios";

export const api = axios.create({
  baseURL: "https://notehub-backend.goit.global/api",
  withCredentials: true,
});