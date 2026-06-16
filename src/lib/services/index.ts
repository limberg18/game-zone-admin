// Entity services — drop-in CRUD for each resource.
//
// Each method tries the backend through axios when `apiBaseUrl` is configured
// (Configuración → URL Base). Otherwise it falls back to localStorage so the
// UI keeps working with demo data.
//
// Endpoints follow REST conventions. Adjust the resource paths if your API
// uses a different naming (e.g. `/api/canchas` instead of `/canchas`).

import { apiList, apiGet, apiCreate, apiUpdate, apiDelete, useRemote } from "./_base";
import {
  store,
  uid,
  type Cancha,
  type Cliente,
  type Reserva,
  type MovimientoCaja,
  type Torneo,
  type Producto,
  type Venta,
  type Usuario,
} from "../storage";

/* ---------------- Canchas ---------------- */
export const canchasService = {
  async list(): Promise<Cancha[]> {
    if (useRemote()) return apiList<Cancha>("canchas");
    return store.getCanchas();
  },
  async get(id: string): Promise<Cancha | undefined> {
    if (useRemote()) return apiGet<Cancha>("canchas", id);
    return store.getCanchas().find((c) => c.id === id);
  },
  async create(payload: Omit<Cancha, "id">): Promise<Cancha> {
    if (useRemote()) return apiCreate<Cancha>("canchas", payload);
    const item: Cancha = { ...payload, id: uid() };
    store.setCanchas([...store.getCanchas(), item]);
    return item;
  },
  async update(id: string, payload: Partial<Cancha>): Promise<Cancha> {
    if (useRemote()) return apiUpdate<Cancha>("canchas", id, payload);
    const list = store.getCanchas().map((c) => (c.id === id ? { ...c, ...payload } : c));
    store.setCanchas(list);
    return list.find((c) => c.id === id)!;
  },
  async remove(id: string): Promise<void> {
    if (useRemote()) return apiDelete("canchas", id);
    store.setCanchas(store.getCanchas().filter((c) => c.id !== id));
  },
};

/* ---------------- Clientes ---------------- */
export const clientesService = {
  async list(): Promise<Cliente[]> {
    if (useRemote()) return apiList<Cliente>("clientes");
    return store.getClientes();
  },
  async get(id: string) {
    if (useRemote()) return apiGet<Cliente>("clientes", id);
    return store.getClientes().find((c) => c.id === id);
  },
  async create(payload: Omit<Cliente, "id">) {
    if (useRemote()) return apiCreate<Cliente>("clientes", payload);
    const item: Cliente = { ...payload, id: uid() };
    store.setClientes([...store.getClientes(), item]);
    return item;
  },
  async update(id: string, payload: Partial<Cliente>) {
    if (useRemote()) return apiUpdate<Cliente>("clientes", id, payload);
    const list = store.getClientes().map((c) => (c.id === id ? { ...c, ...payload } : c));
    store.setClientes(list);
    return list.find((c) => c.id === id)!;
  },
  async remove(id: string) {
    if (useRemote()) return apiDelete("clientes", id);
    store.setClientes(store.getClientes().filter((c) => c.id !== id));
  },
};

/* ---------------- Reservas ---------------- */
export const reservasService = {
  async list(params?: { fechaDesde?: string; fechaHasta?: string; canchaId?: string }): Promise<Reserva[]> {
    if (useRemote()) {
      const { api } = await import("../api");
      const { data } = await api.get<Reserva[]>("/reservas", { params });
      return data;
    }
    let items = store.getReservas();
    if (params?.fechaDesde) items = items.filter((r) => r.fecha >= params.fechaDesde!);
    if (params?.fechaHasta) items = items.filter((r) => r.fecha <= params.fechaHasta!);
    if (params?.canchaId) items = items.filter((r) => r.canchaId === params.canchaId);
    return items;
  },
  async get(id: string) {
    if (useRemote()) return apiGet<Reserva>("reservas", id);
    return store.getReservas().find((r) => r.id === id);
  },
  async create(payload: Omit<Reserva, "id">) {
    if (useRemote()) return apiCreate<Reserva>("reservas", payload);
    const item: Reserva = { ...payload, id: uid() };
    store.setReservas([...store.getReservas(), item]);
    return item;
  },
  async update(id: string, payload: Partial<Reserva>) {
    if (useRemote()) return apiUpdate<Reserva>("reservas", id, payload);
    const list = store.getReservas().map((r) => (r.id === id ? { ...r, ...payload } : r));
    store.setReservas(list);
    return list.find((r) => r.id === id)!;
  },
  async cambiarEstado(id: string, estado: Reserva["estado"]) {
    return reservasService.update(id, { estado });
  },
  async remove(id: string) {
    if (useRemote()) return apiDelete("reservas", id);
    store.setReservas(store.getReservas().filter((r) => r.id !== id));
  },
};

/* ---------------- Caja ---------------- */
export const cajaService = {
  async list(fecha?: string): Promise<MovimientoCaja[]> {
    if (useRemote()) {
      const { api } = await import("../api");
      const { data } = await api.get<MovimientoCaja[]>("/caja", { params: { fecha } });
      return data;
    }
    const items = store.getCaja();
    return fecha ? items.filter((m) => m.fecha === fecha) : items;
  },
  async create(payload: Omit<MovimientoCaja, "id">) {
    if (useRemote()) return apiCreate<MovimientoCaja>("caja", payload);
    const item: MovimientoCaja = { ...payload, id: uid() };
    store.setCaja([item, ...store.getCaja()]);
    return item;
  },
  async remove(id: string) {
    if (useRemote()) return apiDelete("caja", id);
    store.setCaja(store.getCaja().filter((m) => m.id !== id));
  },
  async resumenDia(fecha: string) {
    if (useRemote()) {
      const { api } = await import("../api");
      const { data } = await api.get<{ total: number; porMetodo: Record<string, number> }>(
        `/caja/resumen`,
        { params: { fecha } },
      );
      return data;
    }
    const items = store.getCaja().filter((m) => m.fecha === fecha);
    const porMetodo: Record<string, number> = {};
    let total = 0;
    items.forEach((m) => {
      total += m.monto;
      porMetodo[m.metodoPago] = (porMetodo[m.metodoPago] ?? 0) + m.monto;
    });
    return { total, porMetodo };
  },
};

/* ---------------- Torneos ---------------- */
export const torneosService = {
  async list() {
    if (useRemote()) return apiList<Torneo>("torneos");
    return store.getTorneos();
  },
  async create(payload: Omit<Torneo, "id">) {
    if (useRemote()) return apiCreate<Torneo>("torneos", payload);
    const item: Torneo = { ...payload, id: uid() };
    store.setTorneos([...store.getTorneos(), item]);
    return item;
  },
  async update(id: string, payload: Partial<Torneo>) {
    if (useRemote()) return apiUpdate<Torneo>("torneos", id, payload);
    const list = store.getTorneos().map((t) => (t.id === id ? { ...t, ...payload } : t));
    store.setTorneos(list);
    return list.find((t) => t.id === id)!;
  },
  async remove(id: string) {
    if (useRemote()) return apiDelete("torneos", id);
    store.setTorneos(store.getTorneos().filter((t) => t.id !== id));
  },
};

/* ---------------- Productos ---------------- */
export const productosService = {
  async list() {
    if (useRemote()) return apiList<Producto>("productos");
    return store.getProductos();
  },
  async create(payload: Omit<Producto, "id">) {
    if (useRemote()) return apiCreate<Producto>("productos", payload);
    const item: Producto = { ...payload, id: uid() };
    store.setProductos([...store.getProductos(), item]);
    return item;
  },
  async update(id: string, payload: Partial<Producto>) {
    if (useRemote()) return apiUpdate<Producto>("productos", id, payload);
    const list = store.getProductos().map((p) => (p.id === id ? { ...p, ...payload } : p));
    store.setProductos(list);
    return list.find((p) => p.id === id)!;
  },
  async ajustarStock(id: string, delta: number) {
    if (useRemote()) {
      const { api } = await import("../api");
      const { data } = await api.post<Producto>(`/productos/${id}/stock`, { delta });
      return data;
    }
    const prod = store.getProductos().find((p) => p.id === id);
    if (!prod) throw new Error("Producto no encontrado");
    return productosService.update(id, { stock: prod.stock + delta });
  },
  async remove(id: string) {
    if (useRemote()) return apiDelete("productos", id);
    store.setProductos(store.getProductos().filter((p) => p.id !== id));
  },
};

/* ---------------- Ventas ---------------- */
export const ventasService = {
  async list() {
    if (useRemote()) return apiList<Venta>("ventas");
    return store.getVentas();
  },
  async create(payload: Omit<Venta, "id">) {
    if (useRemote()) return apiCreate<Venta>("ventas", payload);
    const item: Venta = { ...payload, id: uid() };
    store.setVentas([item, ...store.getVentas()]);
    return item;
  },
  async remove(id: string) {
    if (useRemote()) return apiDelete("ventas", id);
    store.setVentas(store.getVentas().filter((v) => v.id !== id));
  },
};

/* ---------------- Usuarios ---------------- */
export const usuariosService = {
  async list() {
    if (useRemote()) return apiList<Usuario>("usuarios");
    return store.getUsuarios();
  },
  async create(payload: Omit<Usuario, "id">) {
    if (useRemote()) return apiCreate<Usuario>("usuarios", payload);
    const item: Usuario = { ...payload, id: uid() };
    store.setUsuarios([...store.getUsuarios(), item]);
    return item;
  },
  async update(id: string, payload: Partial<Usuario>) {
    if (useRemote()) return apiUpdate<Usuario>("usuarios", id, payload);
    const list = store.getUsuarios().map((u) => (u.id === id ? { ...u, ...payload } : u));
    store.setUsuarios(list);
    return list.find((u) => u.id === id)!;
  },
  async remove(id: string) {
    if (useRemote()) return apiDelete("usuarios", id);
    store.setUsuarios(store.getUsuarios().filter((u) => u.id !== id));
  },
};

/* ---------------- Auth (opcional, listo para enchufar) ---------------- */
export const authService = {
  async login(email: string, password: string): Promise<{ token: string; user: Usuario }> {
    if (!useRemote()) throw new Error("Configura la URL del backend en Configuración");
    const { api } = await import("../api");
    const { data } = await api.post<{ token: string; user: Usuario }>("/auth/login", { email, password });
    store.setConfig({ ...store.getConfig(), apiToken: data.token });
    return data;
  },
  async logout() {
    if (useRemote()) {
      const { api } = await import("../api");
      try { await api.post("/auth/logout"); } catch { /* ignore */ }
    }
    store.setConfig({ ...store.getConfig(), apiToken: "" });
  },
};

/* ---------------- Dashboard agregados ---------------- */
export const dashboardService = {
  async metricas() {
    if (useRemote()) {
      const { api } = await import("../api");
      const { data } = await api.get<{
        reservasHoy: number; ingresosHoy: number;
        canchasDisponibles: number; clientesActivos: number;
      }>("/dashboard/metricas");
      return data;
    }
    const today = new Date().toISOString().slice(0, 10);
    return {
      reservasHoy: store.getReservas().filter((r) => r.fecha === today).length,
      ingresosHoy: store.getCaja().filter((m) => m.fecha === today).reduce((s, m) => s + m.monto, 0),
      canchasDisponibles: store.getCanchas().filter((c) => c.estado === "Disponible").length,
      clientesActivos: store.getClientes().length,
    };
  },
};
