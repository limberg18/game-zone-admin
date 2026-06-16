import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { store, type Reserva } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  const canchas = useMemo(() => store.getCanchas(), []);
  const clientes = useMemo(() => store.getClientes(), []);
  const calRef = useRef<FullCalendar | null>(null);

  useEffect(() => { setReservas(store.getReservas()); }, []);

  const events = reservas.map((r) => {
    const cancha = canchas.find((c) => c.id === r.canchaId);
    const cliente = clientes.find((c) => c.id === r.clienteId);
    return {
      id: r.id,
      title: `${cancha?.nombre ?? "Cancha"}\n${cliente?.nombre ?? ""}`,
      start: `${r.fecha}T${r.horaInicio}:00`,
      end: `${r.fecha}T${r.horaFin}:00`,
      backgroundColor: stateColors[r.estado],
      borderColor: stateColors[r.estado],
      textColor: "#ffffff",
      extendedProps: { estado: r.estado },
    };
  });

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          {(["Confirmada", "Pendiente", "Cancelada"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: stateColors[s] }} />
              {s}
            </div>
          ))}
        </div>
        <Button asChild>
          <Link to="/reservas/nueva"><Plus className="h-4 w-4 mr-1" /> Nueva Reserva</Link>
        </Button>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 shadow-[var(--shadow-card)]">
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
          locale="es"
          buttonText={{ today: "Hoy", month: "Mes", week: "Semana", day: "Día" }}
          allDaySlot={false}
          slotMinTime="07:00:00"
          slotMaxTime="23:00:00"
          height="auto"
          events={events}
          eventClick={(info) => {
            toast.info(info.event.title.split("\n")[0], { description: `Estado: ${info.event.extendedProps.estado}` });
          }}
          dateClick={() => router.navigate({ to: "/reservas/nueva" })}
          nowIndicator
        />
      </div>
    </PageContainer>
  );
}
