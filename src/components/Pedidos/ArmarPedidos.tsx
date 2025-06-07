import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePedidoArmado, ESTADOS_PEDIDO, PedidoArmado } from "../hooks/usePedidoArmado"; // Asegúrate de exportar PedidoArmado de tu hook
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner"; // Necesitarás instalar 'sonner' (npm install sonner)
import {
  ListFilter, // Nuevo ícono para el título
  Clock, // Ícono para la fecha
  DollarSign, // Ícono para el total
  MessageSquare, // Ícono para observación
  Package, // Ícono para el estado
  ArrowRight, // Ícono para seleccionar pedido
  Loader2, // Ícono para el spinner de carga
  SearchX // Ícono para no hay pedidos
} from "lucide-react"; // Usaremos íconos de Lucide

const PedidosResumen: React.FC = () => {
  const { pedidos, obtenerPedidos, loading, actualizarEstadoPedido } = usePedidoArmado();
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

  // Función para obtener la variante de la insignia según el estado
  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case ESTADOS_PEDIDO.NUEVO:
        return "default";
      case ESTADOS_PEDIDO.PICKING:
        return "secondary";
      case ESTADOS_PEDIDO.PACKING:
        return "secondary";
      case ESTADOS_PEDIDO.ENVIADO:
        return "outline";
      case ESTADOS_PEDIDO.ENTREGADO:
        return "secondary";
      case ESTADOS_PEDIDO.CANCELADO:
        return "destructive";
      default:
        return "default";
    }
  };

  // Función para obtener el color de texto del estado
  const getStatusTextColor = (estado: string) => {
    switch (estado) {
      case ESTADOS_PEDIDO.NUEVO:
        return "text-yellow-700";
      case ESTADOS_PEDIDO.PICKING:
        return "text-blue-700";
      case ESTADOS_PEDIDO.PACKING:
        return "text-indigo-700";
      case ESTADOS_PEDIDO.ENVIADO:
        return "text-cyan-700";
      case ESTADOS_PEDIDO.ENTREGADO:
        return "text-green-700";
      case ESTADOS_PEDIDO.CANCELADO:
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 text-gray-500 text-lg">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 leading-tight flex items-center justify-center gap-3">
        <ListFilter className="h-10 w-10 text-blue-600" />
        Resumen de Pedidos
      </h1>

      {pedidosMostrar.length === 0 ? (
        <Card className="bg-white shadow-lg rounded-xl p-8 text-center border-dashed border-2 border-gray-300">
          <CardHeader>
            <SearchX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-2xl font-semibold text-gray-700">No hay pedidos pendientes</CardTitle>
            <CardDescription className="text-gray-500">
              Todos los pedidos han sido procesados o no hay nuevos pedidos actualmente.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pedidosMostrar.map((pedido) => (
            <Card
              key={pedido._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] flex flex-col justify-between"
            >
              <CardHeader className="pb-3 cursor-pointer" onClick={() => handleSeleccionarPedido(pedido._id)}>
                <CardTitle className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <span className="truncate">{pedido.cliente}</span>
                  <ArrowRight className="h-5 w-5 text-blue-500 ml-auto flex-shrink-0" />
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Fecha: {new Date(pedido.fecha).toLocaleString()}</p>
                  <p className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Total: <span className="font-semibold text-gray-700">${pedido.total.toFixed(2)}</span></p>
                  {pedido.observacion && (
                    <p className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> Obs: <span className="text-gray-700">{pedido.observacion}</span></p>
                  )}
                  <p className="flex items-center gap-1.5">
                    <Package className="h-4 w-4" /> Estado:
                    <Badge variant={getBadgeVariant(pedido.estado)} className={`${getStatusTextColor(pedido.estado)} bg-opacity-20`}>
                      {pedido.estado}
                    </Badge>
                  </p>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-2 border-t bg-gray-50 p-4">
                {/* Aquí solo tabla resumen o mensaje, sin inputs ni botones de cantidades */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosResumen;