import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePedido, ESTADOS_PEDIDO, PedidoArmado } from "../hooks/usePedido";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Loader2, SearchX } from "lucide-react";

const FacturacionPedidos: React.FC = () => {
  const {
    pedidos,
    obtenerPedidos,
    loading
  } = usePedido();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPedidos(["para_facturar", "facturando"]);
  }, []);

  const handleSeleccionarPedido = (pedidoId: string) => {
    navigate(`/admin/facturacion/${pedidoId}`);
  };

  // Mostrar pedidos PARA_FACTURAR y FACTURANDO
  const pedidosMostrar = pedidos.filter(
    (pedido: PedidoArmado) =>
      pedido.estado === ESTADOS_PEDIDO.PARA_FACTURAR || pedido.estado === ESTADOS_PEDIDO.FACTURANDO
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-6 text-gray-500 text-lg">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
        <p>Cargando pedidos para facturación...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-4">FACTURACIÓN</h2>
      {pedidosMostrar.length === 0 ? (
        <Card className="bg-white shadow-lg rounded-xl p-8 text-center border-dashed border-2 border-gray-300">
          <CardHeader>
            <SearchX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <CardDescription className="text-gray-500">
              No hay pedidos pendientes de facturación actualmente.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pedidosMostrar.map((pedido) => (
              <Card key={pedido._id} className="cursor-pointer group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onClick={() => handleSeleccionarPedido(pedido._id)}>
                <CardHeader>
                  <h3 className="font-semibold text-lg">Pedido #{pedido._id}</h3>
                  <CardDescription className="text-gray-500">Cliente: {pedido.cliente || 'N/A'}</CardDescription>
                  <CardDescription className="text-gray-400">Estado: {pedido.estado.replace(/_/g, ' ')}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturacionPedidos;
