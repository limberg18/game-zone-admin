// Generic REST helpers built on the shared axios instance.
// Each entity service in `./services/*` uses these for a consistent shape.
// While `apiBaseUrl` is empty (Configuración) the helpers throw, and entity
// services fall back to localStorage automatically.

import { api } from "../api";
import { store } from "../storage";

export const useRemote = (): boolean => {
  if (typeof window === "undefined") return false;
  const url = store.getConfig().apiBaseUrl?.trim();
  return Boolean(url);
};

export async function apiList<T>(resource: string): Promise<T[]> {
  const { data } = await api.get<T[]>(`/${resource}`);
  return data;
}

export async function apiGet<T>(resource: string, id: string): Promise<T> {
  const { data } = await api.get<T>(`/${resource}/${id}`);
  return data;
}

export async function apiCreate<T>(resource: string, payload: Partial<T>): Promise<T> {
  const { data } = await api.post<T>(`/${resource}`, payload);
  return data;
}

export async function apiUpdate<T>(resource: string, id: string, payload: Partial<T>): Promise<T> {
  const { data } = await api.put<T>(`/${resource}/${id}`, payload);
  return data;
}

export async function apiDelete(resource: string, id: string): Promise<void> {
  await api.delete(`/${resource}/${id}`);
}
