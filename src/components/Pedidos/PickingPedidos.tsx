import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePedido, ESTADOS_PEDIDO, PedidoArmado } from "../hooks/usePedido"; // Asegúrate de exportar PedidoArmado de tu hook
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { toast } from "sonner"; // Necesitarás instalar 'sonner' (npm install sonner)
import {
  Loader2, // Ícono para el spinner de carga
  SearchX // Ícono para no hay pedidos
} from "lucide-react"; // Usaremos íconos de Lucide
import PedidoCard from './PedidoCard';
import { ScrollArea } from "@/components/ui/scroll-area";

const PickingPedidos: React.FC = () => {
  const { pedidos, obtenerPedidos, loading, actualizarEstadoPedido } = usePedido();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const handleSeleccionarPedido = (pedidoId: string) => {
    // Si el pedido está en estado NUEVO, lo pasamos a PICKING antes de navegar
    const pedido = pedidos.find((p) => p._id === pedidoId);
    if (pedido && pedido.estado === ESTADOS_PEDIDO.NUEVO) {
      handleActualizarEstado(pedidoId, ESTADOS_PEDIDO.PICKING, () => {
        navigate(`/admin/pedido/${pedidoId}`);
      });
    } else {
      navigate(`/admin/pedido/${pedidoId}`);
    }
  };

  const handleActualizarEstado = async (pedidoId: string, nuevoEstado: string, callback?: () => void) => {
    try {
      await actualizarEstadoPedido(pedidoId, nuevoEstado as any);
      await obtenerPedidos(); // Refresca los pedidos
      toast.success("Estado Actualizado", {
        description: `El pedido ahora está en estado: ${nuevoEstado.replace(/_/g, ' ')}.`,
      });
      if (callback) callback();
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast.error("Error al actualizar el estado", {
        description: "Hubo un problema al intentar cambiar el estado del pedido.",
      });
    }
  };

  // Mostrar pedidos NUEVO y PICKING
  const pedidosMostrar = pedidos.filter(
    (pedido: PedidoArmado) =>
      pedido.estado === ESTADOS_PEDIDO.NUEVO || pedido.estado === ESTADOS_PEDIDO.PICKING
  );

  // Solo navegación y cambio de estado, sin lógica de cantidades ni packing aquí


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 text-gray-500 text-lg">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-4">PICKING</h2>
      {pedidosMostrar.length === 0 ? (
        <Card className="bg-white shadow-lg rounded-xl p-8 text-center border-dashed border-2 border-gray-300">
          <CardHeader>
            <SearchX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <CardDescription className="text-gray-500">
              Todos los pedidos han sido procesados o no hay nuevos pedidos actualmente.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ScrollArea className="h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pedidosMostrar.map((pedido) => (
              <PedidoCard
                key={pedido._id}
                pedido={pedido}
                onClick={() => handleSeleccionarPedido(pedido._id)}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default PickingPedidos;