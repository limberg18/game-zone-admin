import { Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { Toaster } from "@/components/ui/sonner";

import Dashboard from "@/routes/index";
import Reservas from "@/routes/reservas";
import ReservaNueva from "@/routes/reservas.nueva";
import Canchas from "@/routes/canchas";
import Clientes from "@/routes/clientes";
import Caja from "@/routes/caja";
import Torneos from "@/routes/torneos";
import Ventas from "@/routes/ventas";
import Productos from "@/routes/productos";
import Reportes from "@/routes/reportes";
import Usuarios from "@/routes/usuarios";
import Configuracion from "@/routes/configuracion";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted-foreground">La página que buscas no existe.</p>
        <a href="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Ir al inicio
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="min-h-screen flex bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reservas" element={<Reservas />} />
              <Route path="/reservas/nueva" element={<ReservaNueva />} />
              <Route path="/canchas" element={<Canchas />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/caja" element={<Caja />} />
              <Route path="/torneos" element={<Torneos />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </>
  );
}
