import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { store, uid, type Cancha } from "@/lib/storage";
import { money } from "@/lib/format";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/canchas")({
  head: () => ({ meta: [{ title: "Canchas — SportCancha" }] }),
  component: Canchas,
});

const estados: Cancha["estado"][] = ["Disponible", "Ocupada", "Mantenimiento"];
const estadoColor: Record<Cancha["estado"], string> = {
  Disponible: "bg-success/15 text-success",
  Ocupada: "bg-destructive/15 text-destructive",
  Mantenimiento: "bg-warning/20 text-warning-foreground",
};

function Canchas() {
  const [items, setItems] = useState<Cancha[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Cancha | null>(null);

  useEffect(() => { setItems(store.getCanchas()); }, []);

  const persist = (next: Cancha[]) => { setItems(next); store.setCanchas(next); };

  const save = (data: Cancha) => {
    if (edit) persist(items.map((c) => (c.id === data.id ? data : c)));
    else persist([...items, { ...data, id: uid() }]);
    toast.success(edit ? "Cancha actualizada" : "Cancha creada");
    setOpen(false); setEdit(null);
  };

  return (
    <PageContainer>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEdit(null); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-1" /> Nueva Cancha</Button>
          </DialogTrigger>
          <CanchaDialog onSave={save} edit={edit} />
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Cancha</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Precio por Hora</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-9 rounded-md bg-gradient-to-br from-primary/40 to-primary/10" />
                    {c.nombre}
                  </div>
                </td>
                <td className="px-4 py-3">{c.tipo}</td>
                <td className="px-4 py-3">{money(c.precioHora)}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${estadoColor[c.estado]}`}>{c.estado}</span></td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEdit(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { persist(items.filter((x) => x.id !== c.id)); toast.success("Eliminada"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}

function CanchaDialog({ onSave, edit }: { onSave: (c: Cancha) => void; edit: Cancha | null }) {
  const [form, setForm] = useState<Cancha>(
    edit ?? { id: "", nombre: "", tipo: "Fútbol 7", precioHora: 80, precioNocturno: 100, estado: "Disponible" },
  );
  useEffect(() => { if (edit) setForm(edit); }, [edit]);

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{edit ? "Editar Cancha" : "Nueva Cancha"}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Nombre</Label><Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
        <div><Label>Tipo</Label>
          <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Fútbol 7", "Fútbol 11", "Vóley Playa", "Tenis", "Básquet"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Precio Hora</Label><Input type="number" value={form.precioHora} onChange={(e) => setForm({ ...form, precioHora: Number(e.target.value) })} /></div>
          <div><Label>Precio Nocturno</Label><Input type="number" value={form.precioNocturno} onChange={(e) => setForm({ ...form, precioNocturno: Number(e.target.value) })} /></div>
        </div>
        <div><Label>Estado</Label>
          <Select value={form.estado} onValueChange={(v) => setForm({ ...form, estado: v as Cancha["estado"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{estados.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter><Button onClick={() => onSave(form)}>Guardar</Button></DialogFooter>
    </DialogContent>
  );
}
