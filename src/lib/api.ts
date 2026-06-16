import axios from "axios";
import { store } from "./storage";

// Axios instance — baseURL and token are read from localStorage (Configuración)
const cfg = typeof window !== "undefined" ? store.getConfig() : { apiBaseUrl: "", apiToken: "" };

export const api = axios.create({
  baseURL: cfg.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const c = store.getConfig();
    config.baseURL = c.apiBaseUrl;
    if (c.apiToken) {
      config.headers.Authorization = `Bearer ${c.apiToken}`;
    }
  }
  return config;
});

export function refreshApiConfig() {
  const c = store.getConfig();
  api.defaults.baseURL = c.apiBaseUrl;
}
