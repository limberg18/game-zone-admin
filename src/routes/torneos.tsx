import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, uid, type Torneo } from "@/lib/storage";
import { toast } from "sonner";

const estadoColor: Record<Torneo["estado"], string> = {
  "En Curso": "bg-success/15 text-success",
  "Próximo": "bg-info/15 text-info",
  "Finalizado": "bg-muted text-muted-foreground",
};

export default function Torneos() {
  const [items, setItems] = useState<Torneo[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Torneo | null>(null);

  useEffect(() => { setItems(store.getTorneos()); }, []);
  const persist = (n: Torneo[]) => { setItems(n); store.setTorneos(n); };

  const save = (t: Torneo) => {
    if (edit) persist(items.map((x) => x.id === t.id ? t : x));
    else persist([...items, { ...t, id: uid() }]);
    setOpen(false); setEdit(null); toast.success("Guardado");
  };

  return (
    <PageContainer>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEdit(null); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Nuevo Torneo</Button></DialogTrigger>
          <TorneoDialog edit={edit} onSave={save} />
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Torneo</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Equipos</th>
              <th className="px-4 py-3 font-medium">Inicio</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((t) => (
              <tr key={t.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{t.nombre}</td>
                <td className="px-4 py-3">{t.tipo}</td>
                <td className="px-4 py-3">{t.equipos}</td>
                <td className="px-4 py-3">{t.inicio}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full ${estadoColor[t.estado]}`}>{t.estado}</span></td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEdit(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => { persist(items.filter((x) => x.id !== t.id)); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}

function TorneoDialog({ edit, onSave }: { edit: Torneo | null; onSave: (t: Torneo) => void }) {
  const [f, setF] = useState<Torneo>(edit ?? { id: "", nombre: "", tipo: "Fútbol 7", equipos: 8, inicio: "", estado: "Próximo" });
  useEffect(() => { if (edit) setF(edit); }, [edit]);
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{edit ? "Editar Torneo" : "Nuevo Torneo"}</DialogTitle></DialogHeader>
      <div className="space-y-3">
        <div><Label>Nombre</Label><Input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Tipo</Label>
            <Select value={f.tipo} onValueChange={(v) => setF({ ...f, tipo: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Fútbol 7", "Fútbol 11", "Vóley Playa", "Tenis", "Básquet"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label>Equipos</Label><Input type="number" value={f.equipos} onChange={(e) => setF({ ...f, equipos: Number(e.target.value) })} /></div>
          <div><Label>Inicio</Label><Input placeholder="DD/MM/AAAA" value={f.inicio} onChange={(e) => setF({ ...f, inicio: e.target.value })} /></div>
          <div><Label>Estado</Label>
            <Select value={f.estado} onValueChange={(v) => setF({ ...f, estado: v as Torneo["estado"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["En Curso", "Próximo", "Finalizado"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter><Button onClick={() => onSave(f)}>Guardar</Button></DialogFooter>
    </DialogContent>
  );
}
