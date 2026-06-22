import { Bell, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Dashboard",
  "/reservas": "Calendario de Reservas",
  "/reservas/nueva": "Nueva Reserva",
  "/canchas": "Listado de Canchas",
  "/clientes": "Clientes",
  "/caja": "Caja - Ingresos",
  "/torneos": "Torneos",
  "/ventas": "Ventas",
  "/productos": "Productos",
  "/reportes": "Reporte de Ingresos",
  "/usuarios": "Usuarios",
  "/configuracion": "Configuración",
};

export function AppHeader() {
  const { pathname } = useLocation();
  const title = titles[pathname] ?? "SportCancha";
  const today = new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-xs text-muted-foreground capitalize">{today}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative h-9 w-9 rounded-md hover:bg-muted grid place-items-center" aria-label="Notificaciones">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-semibold">
            AD
          </div>
          <div className="text-sm font-medium hidden sm:block">Administrador</div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
