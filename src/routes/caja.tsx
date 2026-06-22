import { useEffect, useMemo, useState } from "react";
import { Plus, Banknote, Smartphone, CreditCard, ArrowRightLeft } from "lucide-react";
import { PageContainer, StatCard } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { store, uid, type MovimientoCaja } from "@/lib/storage";
import { money } from "@/lib/format";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Caja() {
  const [items, setItems] = useState<MovimientoCaja[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => { setItems(store.getCaja()); }, []);
  const persist = (n: MovimientoCaja[]) => { setItems(n); store.setCaja(n); };

  const today = new Date().toISOString().slice(0, 10);
  const todays = items.filter((m) => m.fecha === today);
  const totals = useMemo(() => {
    const sum = (k: MovimientoCaja["metodoPago"]) => todays.filter((m) => m.metodoPago === k).reduce((s, m) => s + m.monto, 0);
    return {
      total: todays.reduce((s, m) => s + m.monto, 0),
      Efectivo: sum("Efectivo"), Yape: sum("Yape") + sum("Plin"), Transferencia: sum("Transferencia"),
    };
  }, [todays]);

  const save = (m: MovimientoCaja) => { persist([{ ...m, id: uid() }, ...items]); toast.success("Ingreso registrado"); setOpen(false); };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Ingresos del Día" value={money(totals.total)} icon={<Banknote className="h-5 w-5" />} tone="primary" />
        <StatCard label="Efectivo" value={money(totals.Efectivo)} icon={<Banknote className="h-5 w-5" />} tone="success" />
        <StatCard label="Yape / Plin" value={money(totals.Yape)} icon={<Smartphone className="h-5 w-5" />} tone="info" />
        <StatCard label="Transferencia" value={money(totals.Transferencia)} icon={<ArrowRightLeft className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Nuevo Ingreso</Button></DialogTrigger>
          <MovDialog onSave={save} />
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Concepto</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Método de Pago</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((m) => (
              <tr key={m.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{m.concepto}</td>
                <td className="px-4 py-3">{m.cliente}</td>
                <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-muted-foreground" />{m.metodoPago}</span></td>
                <td className="px-4 py-3 font-semibold text-primary">{money(m.monto)}</td>
                <td className="px-4 py-3 text-muted-foreground">{m.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}

function MovDialog({ onSave }: { onSave: (m: MovimientoCaja) => void }) {
  const [f, setF] = useState<MovimientoCaja>({
    id: "", fecha: new Date().toISOString().slice(0, 10),
    concepto: "", cliente: "-", metodoPago: "Efectivo", monto: 0,
    hora: new Date().toTimeString().slice(0, 5),
  });
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Nuevo Ingreso</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Concepto</Label><Input value={f.concepto} onChange={(e) => setF({ ...f, concepto: e.target.value })} /></div>
        <div><Label>Cliente</Label><Input value={f.cliente} onChange={(e) => setF({ ...f, cliente: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Método</Label>
            <Select value={f.metodoPago} onValueChange={(v) => setF({ ...f, metodoPago: v as MovimientoCaja["metodoPago"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Efectivo", "Yape", "Plin", "Transferencia"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Monto</Label><Input type="number" value={f.monto} onChange={(e) => setF({ ...f, monto: Number(e.target.value) })} /></div>
        </div>
      </div>
      <DialogFooter><Button onClick={() => onSave(f)}>Guardar</Button></DialogFooter>
    </DialogContent>
  );
}
