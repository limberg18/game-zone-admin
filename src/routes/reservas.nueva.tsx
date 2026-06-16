import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, uid, type Reserva } from "@/lib/storage";
import { money } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/reservas/nueva")({
  head: () => ({ meta: [{ title: "Nueva Reserva — SportCancha" }] }),
  component: NuevaReserva,
});

function NuevaReserva() {
  const router = useRouter();
  const canchas = useMemo(() => store.getCanchas(), []);
  const clientes = useMemo(() => store.getClientes(), []);

  const [canchaId, setCanchaId] = useState(canchas[0]?.id ?? "");
  const [clienteId, setClienteId] = useState(clientes[0]?.id ?? "");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [horaInicio, setHoraInicio] = useState("18:00");
  const [horaFin, setHoraFin] = useState("19:00");
  const [tipo, setTipo] = useState("Fútbol 7");
  const [obs, setObs] = useState("");
  const [descuento, setDescuento] = useState(0);

  const cancha = canchas.find((c) => c.id === canchaId);
  const dur = Math.max(0, (parseInt(horaFin) || 0) - (parseInt(horaInicio) || 0));
  const subtotal = (cancha?.precioHora ?? 0) * dur;
  const total = Math.max(0, subtotal - descuento);

  const guardar = () => {
    if (!canchaId || !clienteId) return toast.error("Selecciona cancha y cliente");
    const r: Reserva = {
      id: uid(), canchaId, clienteId, fecha, horaInicio, horaFin,
      estado: "Confirmada", total, observaciones: obs,
    };
    store.setReservas([...store.getReservas(), r]);
    toast.success("Reserva creada");
    router.navigate({ to: "/reservas" });
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-card)] space-y-4">
          <h2 className="font-semibold text-lg">Información de la Reserva</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cliente *</Label>
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger><SelectValue placeholder="Buscar cliente..." /></SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cancha *</Label>
              <Select value={canchaId} onValueChange={setCanchaId}>
                <SelectTrigger><SelectValue placeholder="Seleccionar cancha" /></SelectTrigger>
                <SelectContent>
                  {canchas.map((c) => <SelectItem key={c.id} value={c.id}>{c.nombre} — {c.tipo}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fecha *</Label>
              <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
            <div>
              <Label>Tipo de Deporte</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Fútbol 7", "Fútbol 11", "Vóley Playa", "Tenis", "Básquet"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Hora Inicio *</Label>
              <Input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
            </div>
            <div>
              <Label>Hora Fin *</Label>
              <Input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Observaciones</Label>
            <Textarea value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Observaciones adicionales..." />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-card)] space-y-3 h-fit">
          <h2 className="font-semibold text-lg">Resumen</h2>
          <Row k="Cancha" v={cancha ? `${cancha.nombre} - ${cancha.tipo}` : "-"} />
          <Row k="Fecha" v={fecha} />
          <Row k="Horario" v={`${horaInicio} - ${horaFin}`} />
          <Row k="Duración" v={`${dur} hora${dur === 1 ? "" : "s"}`} />
          <Row k="Precio por hora" v={money(cancha?.precioHora ?? 0)} />
          <div className="border-t border-border my-2" />
          <Row k="Subtotal" v={money(subtotal)} />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Descuento</span>
            <Input className="w-24 h-8 text-right" type="number" value={descuento} onChange={(e) => setDescuento(Number(e.target.value) || 0)} />
          </div>
          <div className="border-t border-border my-2" />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">{money(total)}</span>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" asChild className="flex-1"><Link to="/reservas">Cancelar</Link></Button>
            <Button onClick={guardar} className="flex-1">Guardar Reserva</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
