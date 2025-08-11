import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePedido, PedidoArmado } from "../hooks/usePedido";
import PedidoCard from "./PedidoCard";
import { ScrollArea } from "@/components/ui/scroll-area";

const EnviadosPedidos: React.FC = () => {
  const { pedidos, obtenerPedidos, loading } = usePedido();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPedidos(["enviado"]);
  }, []);

  // Filtrar solo pedidos en estado 'enviado'
  const enviadosPedidos = pedidos.filter((pedido: PedidoArmado) => pedido.estado === "enviado");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold mb-4">Pedidos Enviados</h2>
      <ScrollArea className="h-[70vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 py-8">Cargando...</div>
          ) : enviadosPedidos.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">No hay pedidos enviados.</div>
          ) : (
            enviadosPedidos.map((pedido) => (
              <PedidoCard
                key={pedido._id}
                pedido={pedido}
                onClick={() => navigate(`/admin/enviado/${pedido._id}`)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EnviadosPedidos;
