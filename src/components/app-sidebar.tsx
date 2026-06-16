import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  MapPin,
  Users,
  Wallet,
  Trophy,
  ShoppingCart,
  Package,
  BarChart3,
  UserCog,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/reservas", label: "Reservas", icon: CalendarDays },
  { to: "/canchas", label: "Canchas", icon: MapPin },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/caja", label: "Caja", icon: Wallet },
  { to: "/torneos", label: "Torneos", icon: Trophy },
  { to: "/ventas", label: "Ventas", icon: ShoppingCart },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/reportes", label: "Reportes", icon: BarChart3 },
  { to: "/usuarios", label: "Usuarios", icon: UserCog },
  { to: "/configuracion", label: "Configuración", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground grid place-items-center font-bold">
          S
        </div>
        <div className="leading-tight">
          <div className="font-semibold text-sm">SportCancha</div>
          <div className="text-[10px] opacity-60">Premium</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-sidebar-accent grid place-items-center text-xs font-semibold">
          AD
        </div>
        <div className="leading-tight text-xs">
          <div className="font-medium">Administrador</div>
          <div className="opacity-60">admin@sportcancha</div>
        </div>
      </div>
    </aside>
  );
}
