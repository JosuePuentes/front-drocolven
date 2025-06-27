import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavbarV from "../components/navbars/NavbarV";
import Navbar from "@/pages/client/Navbar";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";

const moduleTitles: Record<string, string> = {
  "/mispedidos": "Mis Pedidos",
  "/catalogo": "Catálogo",
  "/reclamos": "Reclamos",
  "/pagos": "Pagos",
  "/cuentasxpagar": "Cuentas x Pagar",
  "/facturas": "Facturas",
  "/informacion": "Información",
  "/soporte": "Soporte",
  "/perfil": "Perfil",
  "/comprar": "Carrito de Compras",
  "/": "Inicio"
};

const ClientInfoBar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const path = Object.keys(moduleTitles).find((p) => location.pathname.startsWith(p)) || "/";
  const title = moduleTitles[path];

  return (
    <div
      className="w-full flex flex-row sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 px-2 sm:px-4 py-2 sm:py-3 bg-white border-b border-gray-200 shadow-sm z-40 lg:pl-64 sticky items-middle pl-16 h-16 top-0"
    >
      <span className="flex items-center text-base sm:text-lg md:text-xl font-semibold text-gray-900 tracking-tight truncate max-w-[90vw] sm:max-w-xs md:max-w-md ">
        {title}
      </span>
      {user?.rif && (
        <div className="flex items-center gap-1 sm:gap-2 bg-gray-50 rounded-full px-3 sm:px-4 py-0.5 sm:py-1 shadow-sm border border-gray-200 max-w-full overflow-x-auto">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-600">RIF:</span>
          <span className="font-semibold text-blue-700 text-xs sm:text-sm truncate max-w-[60vw] sm:max-w-xs">{user.rif}</span>
        </div>
      )}
    </div>
  );
};

const ClientLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading guard: prevent rendering navbars or outlet until auth state is resolved
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600 font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isAuthenticated && (
        <div className="fixed top-0 w-screen z-50">
          <Navbar />
        </div>
      )}
      <div className="bg-gray-100 min-h-screen">
        {isAuthenticated && <ClientInfoBar />}
        <Outlet />
      </div>
      {isAuthenticated && (
        <div className="fixed left-0 top-0 h-screen z-50">
          <NavbarV />
        </div>
      )}
    </>
  );
};

export default ClientLayout;
