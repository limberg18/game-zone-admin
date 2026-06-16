import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, DollarSign, MapPin, Users, TrendingUp } from "lucide-react";
import { PageContainer, StatCard } from "@/components/page-container";
import { store, type Reserva, type Cancha, type Cliente } from "@/lib/storage";
import { money, formatDate } from "@/lib/format";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SportCancha" },
      { name: "description", content: "Resumen de reservas, ingresos y actividad de tus canchas deportivas." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    setReservas(store.getReservas());
    setCanchas(store.getCanchas());
    setClientes(store.getClientes());
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const reservasHoy = reservas.filter((r) => r.fecha === today);
  const ingresosHoy = store.getCaja().filter((m) => m.fecha === today).reduce((s, m) => s + m.monto, 0);
  const canchasDisp = canchas.filter((c) => c.estado === "Disponible").length;

  const proxima = reservas.slice().sort((a, b) => (a.fecha + a.horaInicio).localeCompare(b.fecha + b.horaInicio)).slice(0, 6);

  // Mock ingresos del mes
  const chart = Array.from({ length: 12 }, (_, i) => {
    const day = i * 3 + 1;
    return { day: `${day}`, ingresos: 800 + Math.round(Math.sin(i / 2) * 400) + i * 120 };
  });

  return (
    <PageContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Reservas Hoy" value={String(reservasHoy.length)} delta="+ 12% vs ayer" icon={<CalendarDays className="h-5 w-5" />} tone="primary" />
        <StatCard label="Ingresos Hoy" value={money(ingresosHoy)} delta="+ 10% vs ayer" icon={<DollarSign className="h-5 w-5" />} tone="success" />
        <StatCard label="Canchas Disponibles" value={`${canchasDisp}`} delta={`de ${canchas.length} canchas`} icon={<MapPin className="h-5 w-5" />} tone="info" />
        <StatCard label="Clientes Activos" value={String(clientes.length * 26)} delta="+ 8% vs mes pasado" icon={<Users className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Próximas Reservas</h2>
            <Link to="/reservas" className="text-xs text-primary hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-border">
            {proxima.map((r) => {
              const cancha = canchas.find((c) => c.id === r.canchaId);
              const cliente = clientes.find((c) => c.id === r.clienteId);
              return (
                <div key={r.id} className="grid grid-cols-12 py-3 text-sm items-center gap-2">
                  <div className="col-span-3 text-muted-foreground">{r.horaInicio} - {r.horaFin}</div>
                  <div className="col-span-4 font-medium">{cancha?.nombre} <span className="text-muted-foreground font-normal">· {cancha?.tipo}</span></div>
                  <div className="col-span-3">{cliente?.nombre}</div>
                  <div className="col-span-2 text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      r.estado === "Confirmada" ? "bg-success/15 text-success"
                      : r.estado === "Pendiente" ? "bg-warning/20 text-warning-foreground"
                      : "bg-destructive/15 text-destructive"
                    }`}>{r.estado}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-semibold">Ingresos del Mes</h2>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="text-2xl font-bold">{money(18750)}</div>
          <div className="text-xs text-success mb-3">+ 15% vs mes pasado</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chart}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={10} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="ingresos" stroke="var(--color-primary)" strokeWidth={2} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">Última sincronización: {formatDate(today)}</div>
      <span className="hidden">{LineChart && Line ? "" : ""}</span>
    </PageContainer>
  );
}
