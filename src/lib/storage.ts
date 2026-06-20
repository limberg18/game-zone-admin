// localStorage-backed mock data store.
// Replace these read/write helpers with axios calls when the backend is ready.

export type Cancha = {
  id: string;
  nombre: string;
  tipo: string;
  precioHora: number;
  precioNocturno: number;
  estado: "Disponible" | "Ocupada" | "Mantenimiento";
  imagen?: string;
};

export type Cliente = {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  totalReservas: number;
  deuda: number;
};

export type Reserva = {
  id: string;
  canchaId: string;
  clienteId: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaFin: string;
  estado: "Confirmada" | "Pendiente" | "Cancelada";
  total: number;
  observaciones?: string;
};

export type MovimientoCaja = {
  id: string;
  fecha: string;
  concepto: string;
  cliente: string;
  metodoPago: "Efectivo" | "Yape" | "Plin" | "Transferencia";
  monto: number;
  hora: string;
};

export type Torneo = {
  id: string;
  nombre: string;
  tipo: string;
  equipos: number;
  inicio: string;
  estado: "En Curso" | "Próximo" | "Finalizado";
};

export type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
};

export type Venta = {
  id: string;
  fecha: string;
  producto: string;
  cantidad: number;
  total: number;
  metodoPago: string;
};

export type Usuario = {
  id: string;
  nombre: string;
  email: string;
  rol: "Administrador" | "Operador" | "Cajero";
  activo: boolean;
};

export type AppConfig = {
  apiBaseUrl: string;
  apiToken: string;
  nombreNegocio: string;
  moneda: string;
};

const KEYS = {
  canchas: "sc_canchas",
  clientes: "sc_clientes",
  reservas: "sc_reservas",
  caja: "sc_caja",
  torneos: "sc_torneos",
  productos: "sc_productos",
  ventas: "sc_ventas",
  usuarios: "sc_usuarios",
  config: "sc_config",
  seeded: "sc_seeded_v1",
} as const;

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const uid = () => Math.random().toString(36).slice(2, 10);

function seed() {
  if (!isBrowser()) return;
  if (localStorage.getItem(KEYS.seeded)) return;

  const canchas: Cancha[] = [
    { id: "c1", nombre: "Cancha 1", tipo: "Fútbol 7", precioHora: 80, precioNocturno: 100, estado: "Disponible" },
    { id: "c2", nombre: "Cancha 2", tipo: "Fútbol 7", precioHora: 80, precioNocturno: 100, estado: "Ocupada" },
    { id: "c3", nombre: "Cancha 3", tipo: "Fútbol 11", precioHora: 120, precioNocturno: 150, estado: "Disponible" },
    { id: "c4", nombre: "Cancha 4", tipo: "Vóley Playa", precioHora: 70, precioNocturno: 90, estado: "Disponible" },
    { id: "c5", nombre: "Cancha 5", tipo: "Tenis", precioHora: 60, precioNocturno: 80, estado: "Mantenimiento" },
    { id: "c6", nombre: "Cancha 6", tipo: "Básquet", precioHora: 60, precioNocturno: 80, estado: "Disponible" },
  ];

  const clientes: Cliente[] = [
    { id: "u1", nombre: "Juan Pérez", telefono: "987 654 321", email: "juan@correo.com", totalReservas: 15, deuda: 0 },
    { id: "u2", nombre: "Carlos Ruiz", telefono: "912 345 678", email: "carlos@correo.com", totalReservas: 8, deuda: 0 },
    { id: "u3", nombre: "Luis Martínez", telefono: "999 111 222", email: "luis@correo.com", totalReservas: 12, deuda: 20 },
    { id: "u4", nombre: "Dep. Águilas", telefono: "936 222 333", email: "aguilas@correo.com", totalReservas: 25, deuda: 0 },
    { id: "u5", nombre: "Las Panteras", telefono: "954 333 444", email: "panteras@correo.com", totalReservas: 10, deuda: 0 },
    { id: "u6", nombre: "Team Bulls", telefono: "923 444 555", email: "bulls@correo.com", totalReservas: 7, deuda: 0 },
  ];

  const today = new Date();
  const isoDay = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().slice(0, 10);
  };

  const reservas: Reserva[] = [
    { id: "r1", canchaId: "c1", clienteId: "u1", fecha: isoDay(0), horaInicio: "08:00", horaFin: "09:00", estado: "Confirmada", total: 80 },
    { id: "r2", canchaId: "c2", clienteId: "u2", fecha: isoDay(0), horaInicio: "09:00", horaFin: "10:00", estado: "Confirmada", total: 80 },
    { id: "r3", canchaId: "c3", clienteId: "u4", fecha: isoDay(1), horaInicio: "10:00", horaFin: "11:00", estado: "Confirmada", total: 120 },
    { id: "r4", canchaId: "c1", clienteId: "u3", fecha: isoDay(1), horaInicio: "11:00", horaFin: "12:00", estado: "Pendiente", total: 80 },
    { id: "r5", canchaId: "c4", clienteId: "u5", fecha: isoDay(2), horaInicio: "16:00", horaFin: "17:00", estado: "Confirmada", total: 70 },
    { id: "r6", canchaId: "c2", clienteId: "u6", fecha: isoDay(2), horaInicio: "13:00", horaFin: "14:00", estado: "Pendiente", total: 80 },
    { id: "r7", canchaId: "c3", clienteId: "u4", fecha: isoDay(3), horaInicio: "18:00", horaFin: "19:00", estado: "Confirmada", total: 150 },
    { id: "r8", canchaId: "c6", clienteId: "u2", fecha: isoDay(-1), horaInicio: "19:00", horaFin: "20:00", estado: "Confirmada", total: 80 },
  ];

  const caja: MovimientoCaja[] = [
    { id: "m1", fecha: isoDay(0), concepto: "Reserva Cancha 1", cliente: "Juan Pérez", metodoPago: "Efectivo", monto: 80, hora: "08:00" },
    { id: "m2", fecha: isoDay(0), concepto: "Reserva Cancha 2", cliente: "Carlos Ruiz", metodoPago: "Yape", monto: 80, hora: "09:00" },
    { id: "m3", fecha: isoDay(0), concepto: "Reserva Cancha 3", cliente: "Dep. Águilas", metodoPago: "Efectivo", monto: 120, hora: "10:00" },
    { id: "m4", fecha: isoDay(0), concepto: "Venta de Bebida", cliente: "-", metodoPago: "Efectivo", monto: 15, hora: "11:00" },
    { id: "m5", fecha: isoDay(0), concepto: "Reserva Cancha 1", cliente: "Luis Martínez", metodoPago: "Plin", monto: 80, hora: "11:00" },
    { id: "m6", fecha: isoDay(0), concepto: "Reserva Cancha 4", cliente: "Las Panteras", metodoPago: "Efectivo", monto: 70, hora: "12:00" },
  ];

  const torneos: Torneo[] = [
    { id: "t1", nombre: "Copa Verano 2024", tipo: "Fútbol 7", equipos: 12, inicio: "01/06/2024", estado: "En Curso" },
    { id: "t2", nombre: "Liga Interempresas", tipo: "Fútbol 11", equipos: 8, inicio: "15/05/2024", estado: "En Curso" },
    { id: "t3", nombre: "Torneo Relámpago", tipo: "Fútbol 7", equipos: 16, inicio: "10/06/2024", estado: "Próximo" },
    { id: "t4", nombre: "Vóley Playa Open", tipo: "Vóley Playa", equipos: 10, inicio: "20/06/2024", estado: "Próximo" },
    { id: "t5", nombre: "Torneo Nocturno", tipo: "Fútbol 7", equipos: 14, inicio: "05/07/2024", estado: "Próximo" },
  ];

  const productos: Producto[] = [
    { id: "p1", nombre: "Agua Mineral 500ml", categoria: "Bebidas", precio: 3, stock: 120 },
    { id: "p2", nombre: "Gatorade", categoria: "Bebidas", precio: 7, stock: 45 },
    { id: "p3", nombre: "Sandwich Pollo", categoria: "Comida", precio: 12, stock: 20 },
    { id: "p4", nombre: "Pelota Fútbol", categoria: "Deporte", precio: 85, stock: 8 },
    { id: "p5", nombre: "Vincha", categoria: "Accesorios", precio: 5, stock: 60 },
  ];

  const ventas: Venta[] = [
    { id: "v1", fecha: isoDay(0), producto: "Gatorade", cantidad: 2, total: 14, metodoPago: "Efectivo" },
    { id: "v2", fecha: isoDay(0), producto: "Agua Mineral 500ml", cantidad: 4, total: 12, metodoPago: "Efectivo" },
    { id: "v3", fecha: isoDay(-1), producto: "Sandwich Pollo", cantidad: 1, total: 12, metodoPago: "Yape" },
  ];

  const usuarios: Usuario[] = [
    { id: "us1", nombre: "Administrador", email: "admin@sportcancha.com", rol: "Administrador", activo: true },
    { id: "us2", nombre: "María Cajera", email: "maria@sportcancha.com", rol: "Cajero", activo: true },
    { id: "us3", nombre: "Pedro Operador", email: "pedro@sportcancha.com", rol: "Operador", activo: true },
  ];

  const config: AppConfig = {
    apiBaseUrl: "https://api.sportcancha.com",
    apiToken: "",
    nombreNegocio: "SportCancha",
    moneda: "S/",
  };

  write(KEYS.canchas, canchas);
  write(KEYS.clientes, clientes);
  write(KEYS.reservas, reservas);
  write(KEYS.caja, caja);
  write(KEYS.torneos, torneos);
  write(KEYS.productos, productos);
  write(KEYS.ventas, ventas);
  write(KEYS.usuarios, usuarios);
  write(KEYS.config, config);
  localStorage.setItem(KEYS.seeded, "1");
}

export function ensureSeed() {
  seed();
}

// Auto-seed on first import in the browser so any route can read data synchronously.
if (isBrowser()) seed();

export const store = {
  getCanchas: () => read<Cancha[]>(KEYS.canchas, []),
  setCanchas: (v: Cancha[]) => write(KEYS.canchas, v),

  getClientes: () => read<Cliente[]>(KEYS.clientes, []),
  setClientes: (v: Cliente[]) => write(KEYS.clientes, v),

  getReservas: () => read<Reserva[]>(KEYS.reservas, []),
  setReservas: (v: Reserva[]) => write(KEYS.reservas, v),

  getCaja: () => read<MovimientoCaja[]>(KEYS.caja, []),
  setCaja: (v: MovimientoCaja[]) => write(KEYS.caja, v),

  getTorneos: () => read<Torneo[]>(KEYS.torneos, []),
  setTorneos: (v: Torneo[]) => write(KEYS.torneos, v),

  getProductos: () => read<Producto[]>(KEYS.productos, []),
  setProductos: (v: Producto[]) => write(KEYS.productos, v),

  getVentas: () => read<Venta[]>(KEYS.ventas, []),
  setVentas: (v: Venta[]) => write(KEYS.ventas, v),

  getUsuarios: () => read<Usuario[]>(KEYS.usuarios, []),
  setUsuarios: (v: Usuario[]) => write(KEYS.usuarios, v),

  getConfig: (): AppConfig =>
    read<AppConfig>(KEYS.config, {
      apiBaseUrl: "https://api.sportcancha.com",
      apiToken: "",
      nombreNegocio: "SportCancha",
      moneda: "S/",
    }),
  setConfig: (v: AppConfig) => write(KEYS.config, v),
};
