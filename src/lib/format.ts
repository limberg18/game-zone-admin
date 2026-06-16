import { store } from "./storage";

export const money = (n: number) => {
  const m = typeof window !== "undefined" ? store.getConfig().moneda : "S/";
  return `${m} ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (iso: string) => {
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return iso;
  }
};
