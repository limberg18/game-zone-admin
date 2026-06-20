import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import { Plus, LayoutGrid, MapPin } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { store, type Reserva, type Cancha } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reservas")({
  head: () => ({ meta: [{ title: "Reservas — SportCancha" }] }),
  component: Reservas,
});

const stateColors: Record<Reserva["estado"], string> = {
  Confirmada: "oklch(0.62 0.18 150)",
  Pendiente: "oklch(0.78 0.16 75)",
  Cancelada: "oklch(0.6 0.22 25)",
};

function Reservas() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const canchas = useMemo<Cancha[]>(() => store.getCanchas(), []);
  const clientes = useMemo(() => store.getClientes(), []);
  const [selected, setSelected] = useState<string>("all"); // "all" | canchaId
  const calRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    setReservas(store.getReservas());
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = (canchaId: string) =>
    reservas.filter((r) => r.canchaId === canchaId && r.fecha === today).length;

  const filtered = selected === "all" ? reservas : reservas.filter((r) => r.canchaId === selected);

  const resources = canchas.map((c) => ({ id: c.id, title: c.nombre, extendedProps: { tipo: c.tipo } }));
  const events = filtered.map((r) => {
    const cancha = canchas.find((c) => c.id === r.canchaId);
    const cliente = clientes.find((c) => c.id === r.clienteId);
    return {
      id: r.id,
      resourceId: r.canchaId,
      title: `${cliente?.nombre ?? "Cliente"} — ${cancha?.tipo ?? ""}`,
      start: `${r.fecha}T${r.horaInicio}:00`,
      end: `${r.fecha}T${r.horaFin}:00`,
      backgroundColor: stateColors[r.estado],
      borderColor: stateColors[r.estado],
      textColor: "#ffffff",
      extendedProps: { estado: r.estado },
    };
  });

  const isAll = selected === "all";
  const selectedCancha = canchas.find((c) => c.id === selected);

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          {(["Confirmada", "Pendiente", "Cancelada"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: stateColors[s] }} />
              {s}
            </div>
          ))}
        </div>
        <Button asChild>
          <Link to="/reservas/nueva">
            <Plus className="h-4 w-4 mr-1" /> Nueva Reserva
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar de canchas */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-primary" /> Canchas
              </h3>
            </div>
            <nav className="p-2 space-y-1 max-h-[640px] overflow-y-auto">
              <button
                onClick={() => setSelected("all")}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors",
                  isAll ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                <span className="font-medium">Todas las canchas</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full", isAll ? "bg-primary-foreground/20" : "bg-muted-foreground/10")}>
                  {reservas.filter((r) => r.fecha === today).length}
                </span>
              </button>
              {canchas.map((c) => {
                const active = selected === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-medium truncate">{c.nombre}</span>
                      </div>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full shrink-0", active ? "bg-primary-foreground/20" : "bg-muted-foreground/10")}>
                        {todayCount(c.id)}
                      </span>
                    </div>
                    <div className={cn("text-xs mt-0.5 ml-5.5", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {c.tipo}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Calendar */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-card rounded-xl border border-border p-4 shadow-[var(--shadow-card)]">
            {!isAll && selectedCancha && (
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">{selectedCancha.nombre}</h2>
                  <p className="text-xs text-muted-foreground">{selectedCancha.tipo}</p>
                </div>
              </div>
            )}
            <FullCalendar
              key={selected}
              ref={calRef}
              schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
              plugins={[dayGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
              initialView={isAll ? "resourceTimeGridDay" : "resourceTimeGridWeek"}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: isAll ? "resourceTimeGridDay,dayGridMonth" : "resourceTimeGridDay,resourceTimeGridWeek,dayGridMonth",
              }}
              views={{
                resourceTimeGridDay: { buttonText: "Día" },
                resourceTimeGridWeek: { buttonText: "Semana", type: "resourceTimeGrid", duration: { days: 7 } },
              }}
              locale="es"
              buttonText={{ today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
              allDaySlot={false}
              slotMinTime="07:00:00"
              slotMaxTime="23:00:00"
              height="auto"
              resources={isAll ? resources : resources.filter((r) => r.id === selected)}
              resourceAreaHeaderContent="Cancha"
              events={events}
              eventClick={(info) => {
                toast.info(info.event.title, { description: `Estado: ${info.event.extendedProps.estado}` });
              }}
              dateClick={() => router.navigate({ to: "/reservas/nueva" })}
              nowIndicator
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
