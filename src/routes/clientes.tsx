import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { store, uid, type Cliente } from "@/lib/storage";
import { money } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Clientes — SportCancha" }] }),
  component: Clientes,
});

function Clientes() {
  const [items, setItems] = useState<Cliente[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Cliente | null>(null);

  useEffect(() => { setItems(store.getClientes()); }, []);
  const persist = (n: Cliente[]) => { setItems(n); store.setClientes(n); };

  const filtered = useMemo(
    () => items.filter((c) => c.nombre.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );

  const save = (c: Cliente) => {
    if (edit) persist(items.map((x) => x.id === c.id ? c : x));
    else persist([...items, { ...c, id: uid() }]);
    toast.success(edit ? "Cliente actualizado" : "Cliente creado");
    setOpen(false); setEdit(null);
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full sm:w-80">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input placeholder="Buscar cliente..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEdit(null); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Nuevo Cliente</Button></DialogTrigger>
          <ClienteDialog edit={edit} onSave={save} />
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Teléfono</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Total Reservas</th>
              <th className="px-4 py-3 font-medium">Deuda</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{c.nombre}</td>
                <td className="px-4 py-3">{c.telefono}</td>
                <td className="px-4 py-3 text-info">{c.email}</td>
                <td className="px-4 py-3">{c.totalReservas}</td>
                <td className={`px-4 py-3 ${c.deuda > 0 ? "text-destructive font-medium" : ""}`}>{money(c.deuda)}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEdit(c); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { persist(items.filter((x) => x.id !== c.id)); toast.success("Eliminado"); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}

function ClienteDialog({ edit, onSave }: { edit: Cliente | null; onSave: (c: Cliente) => void }) {
  const [f, setF] = useState<Cliente>(edit ?? { id: "", nombre: "", telefono: "", email: "", totalReservas: 0, deuda: 0 });
  useEffect(() => { if (edit) setF(edit); }, [edit]);
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{edit ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Nombre</Label><Input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></div>
        <div><Label>Teléfono</Label><Input value={f.telefono} onChange={(e) => setF({ ...f, telefono: e.target.value })} /></div>
        <div><Label>Email</Label><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Reservas</Label><Input type="number" value={f.totalReservas} onChange={(e) => setF({ ...f, totalReservas: Number(e.target.value) })} /></div>
          <div><Label>Deuda</Label><Input type="number" value={f.deuda} onChange={(e) => setF({ ...f, deuda: Number(e.target.value) })} /></div>
        </div>
      </div>
      <DialogFooter><Button onClick={() => onSave(f)}>Guardar</Button></DialogFooter>
    </DialogContent>
  );
}
