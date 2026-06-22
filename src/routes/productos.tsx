import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { store, uid, type Producto } from "@/lib/storage";
import { money } from "@/lib/format";
import { toast } from "sonner";

export default function Productos() {
  const [items, setItems] = useState<Producto[]>([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Producto | null>(null);
  useEffect(() => { setItems(store.getProductos()); }, []);
  const persist = (n: Producto[]) => { setItems(n); store.setProductos(n); };

  const save = (p: Producto) => {
    if (edit) persist(items.map((x) => x.id === p.id ? p : x));
    else persist([...items, { ...p, id: uid() }]);
    setOpen(false); setEdit(null); toast.success("Guardado");
  };

  return (
    <PageContainer>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEdit(null); }}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-1" /> Nuevo Producto</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{edit ? "Editar Producto" : "Nuevo Producto"}</DialogTitle></DialogHeader>
            <ProductoForm edit={edit} onSave={save} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((p) => (
          <div key={p.id} className="bg-card rounded-xl border border-border p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition">
            <div className="aspect-video rounded-md bg-gradient-to-br from-primary/30 to-info/20 mb-3" />
            <div className="text-xs text-muted-foreground">{p.categoria}</div>
            <div className="font-semibold">{p.nombre}</div>
            <div className="flex items-end justify-between mt-2">
              <div className="text-xl font-bold text-primary">{money(p.precio)}</div>
              <div className={`text-xs ${p.stock < 10 ? "text-destructive" : "text-muted-foreground"}`}>Stock: {p.stock}</div>
            </div>
            <div className="flex gap-1 mt-3">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEdit(p); setOpen(true); }}><Pencil className="h-3.5 w-3.5 mr-1" />Editar</Button>
              <Button variant="ghost" size="icon" onClick={() => persist(items.filter((x) => x.id !== p.id))}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

function ProductoForm({ edit, onSave }: { edit: Producto | null; onSave: (p: Producto) => void }) {
  const [f, setF] = useState<Producto>(edit ?? { id: "", nombre: "", categoria: "Bebidas", precio: 0, stock: 0 });
  useEffect(() => { if (edit) setF(edit); }, [edit]);
  return (
    <>
      <div className="space-y-3">
        <div><Label>Nombre</Label><Input value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} /></div>
        <div><Label>Categoría</Label><Input value={f.categoria} onChange={(e) => setF({ ...f, categoria: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Precio</Label><Input type="number" value={f.precio} onChange={(e) => setF({ ...f, precio: Number(e.target.value) })} /></div>
          <div><Label>Stock</Label><Input type="number" value={f.stock} onChange={(e) => setF({ ...f, stock: Number(e.target.value) })} /></div>
        </div>
      </div>
      <DialogFooter><Button onClick={() => onSave(f)}>Guardar</Button></DialogFooter>
    </>
  );
}
