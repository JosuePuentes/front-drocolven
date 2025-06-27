import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  AlertCircle, // For error messages
  ClipboardX, // For no orders found
  Loader2, // For loading spinner
  PackagePlus,
  CheckCircle,
  Truck, // Alternative for "Armado"
} from 'lucide-react';
import { TbClipboardList } from "react-icons/tb";
import PedidoCard from './componentsClient/PedidoCard';
import { Pedido } from './componentsClient/PedidoTypes';

// El resto de la lógica y componentes deben modularizarse aquí
const PedidoClientePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user || !isAuthenticated) {
        setError('Debes iniciar sesión para ver tus pedidos.');
        setLoading(false);
        return;
      }

      if (!user.rif || typeof user.rif !== 'string' || user.rif.trim() === '') {
        setError('No se encontró un RIF válido en tu perfil. Por favor, revisa tus datos o contacta soporte.');
        setLoading(false);
        return;
      }

      setError('');
      setLoading(true);
      try {
        const res = await axios.get<Pedido[]>(`${import.meta.env.VITE_API_URL}/pedidos/por_cliente/${user.rif}`);
        if (Array.isArray(res.data)) {
          setPedidos(res.data);
          if (res.data.length === 0) {
            // No need to set error if no orders, the dedicated "no orders" card handles this
          }
        } else {
          setError('Respuesta inesperada del servidor.');
        }
      } catch (err: any) {
        let errorMessage = 'No se pudieron cargar los pedidos. Intenta nuevamente.';
        if (axios.isAxiosError(err)) {
          if (err.response) {
            if (err.response.status === 404) {
              errorMessage = 'No se encontraron pedidos para tu RIF.';
            } else if (err.response.data && err.response.data.detail) {
              errorMessage = `Error: ${err.response.data.detail}`;
            } else {
              errorMessage = `Error del servidor: ${err.response.status}`;
            }
          } else if (err.request) {
            errorMessage = 'Error de red: No se pudo conectar al servidor.';
          } else {
            errorMessage = `Error: ${err.message}`;
          }
        }
        setError(errorMessage);
        toast.error("Error al cargar pedidos", { description: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-sm text-center p-6 shadow-lg border-red-200 bg-red-50 animate-in fade-in zoom-in-95 duration-500">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl text-red-700">Acceso Denegado</h2>
          <p className="text-red-600">Debes iniciar sesión para ver tus pedidos.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="w-full max-w-4xl mx-auto py-6 px-2 sm:px-4 md:px-6 lg:px-8 bg-gray-50 min-h-screen flex flex-col">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500 text-lg">
            <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
            <p className="text-base md:text-lg">Cargando tus pedidos...</p>
          </div>
        )}

        {/* Error State (only show if there's an actual error, not just no orders) */}
        {error && !loading && pedidos.length === 0 && ( // Ensure it only shows for actual errors, not for "no orders"
          <Card className="w-full max-w-md mx-auto text-center p-4 sm:p-6 shadow-lg border-red-200 bg-red-50 animate-in fade-in zoom-in-95 duration-500">
            <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl text-red-700">¡Ups, un problema!</h2>
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {/* No Orders State */}
        {!loading && !error && pedidos.length === 0 && (
          <Card className="w-full max-w-md mx-auto text-center p-4 sm:p-6 shadow-lg border-dashed border-2 border-gray-300 bg-white animate-in fade-in zoom-in-95 duration-500">
            <ClipboardX className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-700">No tienes pedidos registrados.</h2>
            <p className="text-gray-500">
              Cuando realices tu primer pedido, aparecerá aquí. ¡Estamos listos para atenderte!
            </p>
          </Card>
        )}

        {/* Orders List */}
        {!loading && !error && pedidos.length > 0 && (
          <div className="space-y-4  ml-14 sm:space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {pedidos.map((pedido) => {
              // Definir los pasos reales del trayecto del pedido
              const steps = [
                { key: 'picking', label: 'Picking', icon: <TbClipboardList className="h-5 w-5 sm:h-6 sm:w-6" /> },
                { key: 'packing', label: 'Packing', icon: <PackagePlus className="h-5 w-5 sm:h-6 sm:w-6" /> },
                { key: 'enviado', label: 'Enviado', icon: <Truck className="h-5 w-5 sm:h-6 sm:w-6" /> },
                { key: 'entregado', label: 'Entregado', icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" /> },
              ];
              // Determinar el índice del estado actual
              const currentStep = steps.findIndex(s => s.key === pedido.estado);

              return (
                <PedidoCard
                  key={pedido._id}
                  pedido={pedido}
                  steps={steps}
                  currentStep={currentStep}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidoClientePage;