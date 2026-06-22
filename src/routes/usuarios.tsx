import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { store, uid, type Usuario } from "@/lib/storage";
import { toast } from "sonner";

export default function Usuarios() {
  const [items, setItems] = useState<Usuario[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Usuario | null>(null);
  useEffect(() => { setItems(store.getUsuarios()); }, []);
  const persist = (n: Usuario[]) => { setItems(n); store.setUsuarios(n); };

  const save = (u: Usuario) => {
    if (edit) persist(items.map((x) => x.id === u.id ? u : x));
    else persist([...items, { ...u, id: uid() }]);
    setOpen(false); setEdit(null); toast.success("Guardado");
  };

  return (
    <PageContainer>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEdit(null); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Nuevo Usuario</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{edit ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle></DialogHeader>
            <UsuarioForm edit={edit} onSave={save} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((u) => (
              <tr key={u.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-semibold">
                    {u.nombre.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  {u.nombre}
                </td>
                <td className="px-4 py-3 text-info">{u.email}</td>
                <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full bg-secondary">{u.rol}</span></td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.activo ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                    {u.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEdit(u); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => persist(items.filter((x) => x.id !== u.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}

function UsuarioForm({ edit, onSave }: { edit: Usuario | null; onSave: (u: Usuario) => void }) {
  const [f, setF] = useState<Usuario>(edit ?? { id: "", nombre: "", email: "", rol: "Operador", activo: true });
  useEffect(() => { if (edit) setF(edit); }, [edit]);
  return (
    <>
      <div className="space-y-3">
        <div><Label>Nombre</Label><Input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></div>
        <div><Label>Email</Label><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div><Label>Rol</Label>
          <Select value={f.rol} onValueChange={(v) => setF({ ...f, rol: v as Usuario["rol"] })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{["Administrador", "Operador", "Cajero"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between"><Label>Usuario activo</Label><Switch checked={f.activo} onCheckedChange={(v) => setF({ ...f, activo: v })} /></div>
      </div>
      <DialogFooter><Button onClick={() => onSave(f)}>Guardar</Button></DialogFooter>
    </>
  );
}
