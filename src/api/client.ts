// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  // withCredentials: true, // solo si usas cookies o sesión
});

api.interceptors.request.use((config) => {
  console.log("➡️", config.method?.toUpperCase(), `${config.baseURL}${config.url}`);
  return config;
});
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("⛔", err.message, err.config?.method?.toUpperCase(), `${err.config?.baseURL}${err.config?.url}`);
    // Muy útil: Axios “Network Error” no tiene response. Comprueba si hay response:
    if (err.response) {
      console.log("📦 response", err.response.status, err.response.data);
    } else if (err.request) {
      console.log("📮 request sent but blocked/no response");
    }
    return Promise.reject(err);
  }
);
