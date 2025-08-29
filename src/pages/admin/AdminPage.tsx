import { BookA, SquareChartGantt, User, LayoutDashboard, PackageCheck,BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import HasModule from "../../components/auth/HasModule";
import { useAdminAuth } from "../../context/AuthAdminContext";

// If CardModule is not a Shadcn Card, we'll redefine it to use Shadcn's Card structure
// Otherwise, ensure CardModule accepts props that map to Shadcn Card props
interface CardModuleProps {
  bottomText: string;
  topText?: string; // Made optional as it's often empty
  onClick: () => void;
  logo: React.ReactNode;
  description?: string; // Optional description for more context
}

const CardModule: React.FC<CardModuleProps> = ({ bottomText, topText, onClick, logo, description }) => {
  return (
    <Card
      className="w-full sm:w-[280px] h-[180px] flex flex-col items-center justify-center text-center p-6
                 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-100
                 cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300
                 group" // Added group class for hover effects on children
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-0 space-y-3">
        <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
          {logo}
        </div>
        {topText && <CardDescription className="text-sm text-gray-500">{topText}</CardDescription>}
        <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-blue-800 transition-colors duration-300">
          {bottomText}
        </CardTitle>
        {description && <CardDescription className="text-xs text-gray-400 mt-1">{description}</CardDescription>}
      </CardContent>
    </Card>
  );
};


const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex flex-col items-center">
      {/* Title Section */}
      <div className="text-center mb-12 mt-8 animate-in fade-in slide-in-from-top-6 duration-700 relative">
        <LayoutDashboard className="w-24 h-24 text-blue-700 mx-auto mb-4 drop-shadow-md" />
        <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow-sm leading-tight">
          Panel de Administración
        </h1>
        <p className="text-lg text-gray-600 mt-3 max-w-xl mx-auto">
          Selecciona una de las opciones para gestionar tu plataforma.
        </p>
        <button
          onClick={logout}
          className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition font-medium text-sm"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">

        <HasModule module="inventario">
          <CardModule
            bottomText="Gestión de Inventario"
            description="Controla tus productos, stock y categorías."
            onClick={() => navigate("inventario")}
            logo={<SquareChartGantt size={48} />}
          />
        </HasModule>


        <HasModule module="pedidos">
          <CardModule
            bottomText="Resumen de Pedidos"
            description="Visualiza y gestiona todos los pedidos."
            onClick={() => navigate("pedidos")}
            logo={<BookA size={48} />}
          />
        </HasModule>
        <HasModule module="vistapedidos">
          <CardModule
            bottomText="Ver de Pedidos"
            description="Visualiza y gestiona todos los pedidos."
            onClick={() => navigate("vistapedidos")}
            logo={<BookOpen size={48} />}
          />
        </HasModule>
        <HasModule module="usuarios">
          <CardModule
            bottomText="Administración de Usuarios"
            description="Crea, edita y asigna roles a tus usuarios."
            onClick={() => navigate("usuarios")}
            logo={<User size={48} />}
          />
        </HasModule>

        {/* Assuming this is a distinct module for "Armar Pedidos" */}
        <HasModule module="picking"> {/* Use a more specific module if available */}
          <CardModule
            bottomText="Picking de Pedidos"
            description="Procesa y prepara los pedidos para el envío."
            onClick={() => navigate("pickingpedidos")}
            logo={<PackageCheck size={48} />} /* Changed icon for better representation */
          />
        </HasModule>

        {/* Módulo para Packing de Pedidos */}
        <HasModule module="packing">
          <CardModule
            bottomText="Packing de Pedidos"
            description="Gestiona y envía los pedidos ya armados."
            onClick={() => navigate("packingpedidos")}
            logo={<PackageCheck size={48} />}
          />
        </HasModule>

        {/* Módulo para Pedidos Enviados */}
        <HasModule module="envios">
          <CardModule
            bottomText="Pedidos Enviados"
            description="Consulta el historial de pedidos enviados."
            onClick={() => navigate("enviadospedidos")}
            logo={<PackageCheck size={48} />}
          />
        </HasModule>

        <HasModule module="info-pedido">
          <CardModule
            bottomText="Dashboard de Pedidos"
            description="Visualiza todos los pedidos, tiempos y estado actual."
            onClick={() => navigate("pedidos-dashboard")}
            logo={<BookA size={48} />}
          />
        </HasModule>
        <HasModule module="pedidos">
          <CardModule
            bottomText="Crear Pedido"
            description="Visualiza todos los pedidos, tiempos y estado actual."
            onClick={() => navigate("crear-pedido")}
            logo={<BookA size={48} />}
          />
        </HasModule>

        {/* Módulo para Facturación de Pedidos */}
        <HasModule module="facturacion">
          <CardModule
            bottomText="Facturación de Pedidos"
            description="Gestiona y factura los pedidos listos para facturación."
            onClick={() => navigate("facturacionpedidos")}
            logo={<BookA size={48} />}
          />
        </HasModule>
        <HasModule module="pendientes">
          <CardModule
            bottomText="Pedidos Pendientes"
            description="Visualiza y gestiona los pedidos con estado pendiente."
            onClick={() => navigate("pendientespedidos")}
            logo={<BookA size={48} />}
          />
        </HasModule>
        <HasModule module="checkpicking">
          <CardModule
            bottomText="Verificación de Picking"
            description="Gestiona y verifica los pedidos en proceso de picking."
            onClick={() => navigate("checkpickingpedidos")}
            logo={<BookA size={48} />}
          />
        </HasModule>

      </div>
    </div>
  );
};

export default AdminPage;