import { useMemo } from "react";
import { PageContainer, StatCard } from "@/components/page-container";
import { store } from "@/lib/storage";
import { money } from "@/lib/format";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Calendar, TrendingUp, BarChart3, Trophy } from "lucide-react";

const COLORS = ["var(--color-primary)", "var(--color-info)", "var(--color-warning)", "var(--color-chart-4)"];

export default function Reportes() {
  const caja = store.getCaja();
  const total = caja.reduce((s, m) => s + m.monto, 0);

  const byMethod = useMemo(() => {
    const acc: Record<string, number> = {};
    caja.forEach((m) => { acc[m.metodoPago] = (acc[m.metodoPago] ?? 0) + m.monto; });
    return Object.entries(acc).map(([name, value]) => ({ name, value }));
  }, [caja]);

  const byDay = useMemo(() => {
    const acc: Record<string, number> = {};
    caja.forEach((m) => { acc[m.fecha] = (acc[m.fecha] ?? 0) + m.monto; });
    return Object.entries(acc).sort().map(([day, ingresos]) => ({ day: day.slice(5), ingresos }));
  }, [caja]);

  return (
    <PageContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Ingresos" value={money(total)} icon={<TrendingUp className="h-5 w-5" />} tone="primary" />
        <StatCard label="Total Reservas" value={String(store.getReservas().length)} icon={<Calendar className="h-5 w-5" />} tone="info" />
        <StatCard label="Promedio por Día" value={money(byDay.length ? total / byDay.length : 0)} icon={<BarChart3 className="h-5 w-5" />} tone="warning" />
        <StatCard label="Cancha Más Rentable" value="Cancha 3" icon={<Trophy className="h-5 w-5" />} tone="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold mb-4">Ingresos por Día</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" fontSize={11} tickLine={false} />
              <YAxis fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Bar dataKey="ingresos" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 shadow-[var(--shadow-card)]">
          <h2 className="font-semibold mb-4">Ingresos por Método</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byMethod} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {byMethod.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageContainer>
  );
}
