import { useEffect, useState } from "react";
import { PageContainer } from "@/components/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { store, type AppConfig, type Cancha } from "@/lib/storage";
import { money } from "@/lib/format";
import { refreshApiConfig } from "@/lib/api";
import { toast } from "sonner";
import { Plug, Save, Database } from "lucide-react";

export default function Configuracion() {
  const [cfg, setCfg] = useState<AppConfig>({ apiBaseUrl: "", apiToken: "", nombreNegocio: "", moneda: "S/" });
  const [tarifas, setTarifas] = useState<Cancha[]>([]);

  useEffect(() => {
    setCfg(store.getConfig());
    setTarifas(store.getCanchas());
  }, []);

  const saveCfg = () => { store.setConfig(cfg); refreshApiConfig(); toast.success("Configuración guardada"); };
  const saveTarifas = () => { store.setCanchas(tarifas); toast.success("Tarifas actualizadas"); };
  const resetData = () => {
    if (!confirm("¿Reiniciar todos los datos a los valores por defecto?")) return;
    Object.keys(localStorage).filter((k) => k.startsWith("sc_")).forEach((k) => localStorage.removeItem(k));
    location.reload();
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-card)] space-y-4">
          <div className="flex items-center gap-2"><Plug className="h-5 w-5 text-primary" /><h2 className="font-semibold">Conexión API (axios)</h2></div>
          <p className="text-xs text-muted-foreground">Estos valores se guardan en localStorage y se usan automáticamente en cada request.</p>
          <div><Label>URL Base</Label><Input value={cfg.apiBaseUrl} onChange={(e) => setCfg({ ...cfg, apiBaseUrl: e.target.value })} placeholder="https://api.midominio.com" /></div>
          <div><Label>Token de Autenticación</Label><Input value={cfg.apiToken} onChange={(e) => setCfg({ ...cfg, apiToken: e.target.value })} placeholder="Bearer token..." /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Nombre del Negocio</Label><Input value={cfg.nombreNegocio} onChange={(e) => setCfg({ ...cfg, nombreNegocio: e.target.value })} /></div>
            <div><Label>Moneda</Label><Input value={cfg.moneda} onChange={(e) => setCfg({ ...cfg, moneda: e.target.value })} /></div>
          </div>
          <Button onClick={saveCfg}><Save className="h-4 w-4 mr-1" /> Guardar Configuración</Button>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-[var(--shadow-card)] space-y-3">
          <div className="flex items-center gap-2"><Database className="h-5 w-5 text-info" /><h2 className="font-semibold">Datos de Demo</h2></div>
          <p className="text-sm text-muted-foreground">Restablece todos los datos (canchas, clientes, reservas, caja, etc.) a la información de demostración inicial.</p>
          <Button variant="outline" onClick={resetData}>Reiniciar datos demo</Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-[var(--shadow-card)] overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Tarifas por Cancha</h2>
          <Button size="sm" onClick={saveTarifas}><Save className="h-4 w-4 mr-1" /> Guardar tarifas</Button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Cancha</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Tarifa por Hora</th>
              <th className="px-4 py-3 font-medium">Tarifa Nocturna</th>
              <th className="px-4 py-3 font-medium">Vista</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tarifas.map((c, i) => (
              <tr key={c.id}>
                <td className="px-4 py-2 font-medium">{c.nombre}</td>
                <td className="px-4 py-2">{c.tipo}</td>
                <td className="px-4 py-2"><Input type="number" value={c.precioHora} onChange={(e) => { const n = [...tarifas]; n[i] = { ...c, precioHora: Number(e.target.value) }; setTarifas(n); }} className="w-28 h-8" /></td>
                <td className="px-4 py-2"><Input type="number" value={c.precioNocturno} onChange={(e) => { const n = [...tarifas]; n[i] = { ...c, precioNocturno: Number(e.target.value) }; setTarifas(n); }} className="w-28 h-8" /></td>
                <td className="px-4 py-2 text-muted-foreground">{money(c.precioHora)} / {money(c.precioNocturno)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
}
