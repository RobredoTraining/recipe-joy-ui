// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  // withCredentials: true, // solo si usas cookies o sesión
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error de red";
    return Promise.reject(new Error(msg));
  }
);
