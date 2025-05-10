import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePedidoArmado, ESTADOS_PEDIDO } from "../hooks/usePedidoArmado";

const PedidosResumen: React.FC = () => {
  const { pedidos, obtenerPedidos, loading, actualizarEstadoPedido } = usePedidoArmado();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPedidos();
  }, []);

  if (loading) return <div className="text-center p-6">Cargando pedidos...</div>;

  const handleSeleccionarPedido = (pedidoId: string) => {
    navigate(`/admin/pedido/${pedidoId}`);
  };

  const handleActualizarEstado = async (pedidoId: string, nuevoEstado: string) => {
    try {
      await actualizarEstadoPedido(pedidoId, nuevoEstado as any);
      await obtenerPedidos(); // Recargar la lista después de actualizar
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      alert("Error al actualizar el estado del pedido");
    }
  };

  const pedidosPendientes = pedidos.filter(
    (pedido) => pedido.estado === ESTADOS_PEDIDO.PEDIDO_CREADO
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Pedidos Resumidos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {pedidosPendientes.map((pedido) => (
          <div
            key={pedido._id}
            className="bg-white p-4 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div 
              className="cursor-pointer"
              onClick={() => handleSeleccionarPedido(pedido._id)}
            >
              <h2 className="text-xl font-semibold">{pedido.cliente}</h2>
              <p className="text-sm text-gray-500">Fecha: {pedido.fecha}</p>
              <p className="text-sm text-gray-500">Total: ${pedido.total.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Observacion: {pedido.observacion}</p>
              <p className="text-sm text-gray-500">Estado: {pedido.estado}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleActualizarEstado(pedido._id, ESTADOS_PEDIDO.EN_PROCESO)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                En Proceso
              </button>
              <button
                onClick={() => handleActualizarEstado(pedido._id, ESTADOS_PEDIDO.CANCELADO)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PedidosResumen;
