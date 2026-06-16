import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PageContainer, StatCard } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, uid, type Venta } from "@/lib/storage";
import { money } from "@/lib/format";
import { ShoppingCart, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ventas")({
  head: () => ({ meta: [{ title: "Ventas — SportCancha" }] }),
  component: Ventas,
});

function Ventas() {
  const [items, setItems] = useState<Venta[]>([]);
  const [open, setOpen] = useState(false);
  const productos = store.getProductos();
  useEffect(() => { setItems(store.getVentas()); }, []);
  const persist = (n: Venta[]) => { setItems(n); store.setVentas(n); };

  const total = items.reduce((s, v) => s + v.total, 0);
  const cantidad = items.reduce((s, v) => s + v.cantidad, 0);

  return (
    <PageContainer>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Ventas" value={money(total)} icon={<TrendingUp className="h-5 w-5" />} tone="primary" />
        <StatCard label="Productos Vendidos" value={String(cantidad)} icon={<ShoppingCart className="h-5 w-5" />} tone="info" />
        <StatCard label="Transacciones" value={String(items.length)} icon={<ShoppingCart className="h-5 w-5" />} tone="success" />
      </div>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Nueva Venta</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nueva Venta</DialogTitle></DialogHeader>
            <NuevaVentaForm onSave={(v) => { persist([{ ...v, id: uid() }, ...items]); setOpen(false); toast.success("Venta registrada"); }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Cantidad</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Método</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((v) => (
              <tr key={v.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">{v.fecha}</td>
                <td className="px-4 py-3 font-medium">{v.producto}</td>
                <td className="px-4 py-3">{v.cantidad}</td>
                <td className="px-4 py-3 text-primary font-semibold">{money(v.total)}</td>
                <td className="px-4 py-3">{v.metodoPago}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => persist(items.filter((x) => x.id !== v.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );

  function NuevaVentaForm({ onSave }: { onSave: (v: Venta) => void }) {
    const [productoId, setProductoId] = useState(productos[0]?.id ?? "");
    const [cantidad, setCantidad] = useState(1);
    const [metodo, setMetodo] = useState("Efectivo");
    const prod = productos.find((p) => p.id === productoId);
    const subtotal = (prod?.precio ?? 0) * cantidad;
    return (
      <>
        <div className="space-y-3">
          <div><Label>Producto</Label>
            <Select value={productoId} onValueChange={setProductoId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{productos.map((p) => <SelectItem key={p.id} value={p.id}>{p.nombre} — {money(p.precio)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Cantidad</Label><Input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))} /></div>
            <div><Label>Método</Label>
              <Select value={metodo} onValueChange={setMetodo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Efectivo", "Yape", "Plin", "Transferencia"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-right text-sm">Total: <span className="font-bold text-primary">{money(subtotal)}</span></div>
        </div>
        <DialogFooter>
          <Button onClick={() => onSave({
            id: "", fecha: new Date().toISOString().slice(0, 10),
            producto: prod?.nombre ?? "", cantidad, total: subtotal, metodoPago: metodo,
          })}>Guardar</Button>
        </DialogFooter>
      </>
    );
  }
}
