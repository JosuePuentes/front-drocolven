import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePedidoArmado, PedidoArmado } from "../hooks/usePedidoArmado";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const EnviadosPedidos: React.FC = () => {
  const { pedidos, obtenerPedidos, loading } = usePedidoArmado();
  const navigate = useNavigate();

  useEffect(() => {
    obtenerPedidos();
  }, []);

  // Filtrar solo pedidos en estado 'enviado'
  const enviadosPedidos = pedidos.filter((pedido: PedidoArmado) => pedido.estado === "enviado");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pedidos Enviados</h2>
      <ScrollArea className="h-[70vh]">
        {loading ? (
          <div>Cargando...</div>
        ) : enviadosPedidos.length === 0 ? (
          <div>No hay pedidos enviados.</div>
        ) : (
          enviadosPedidos.map((pedido) => (
            <Card key={pedido._id} className="mb-4 cursor-pointer hover:shadow-lg transition" onClick={() => navigate(`/admin/enviado/${pedido._id}`)}>
              <CardHeader>
                <CardTitle>Pedido #{pedido._id.slice(-5)}</CardTitle>
                <Badge variant="outline">{pedido.estado}</Badge>
              </CardHeader>
              <CardContent>
                <div>Cliente: {pedido.cliente}</div>
                <div>Fecha: {pedido.fecha}</div>
                <div>Total: ${pedido.total}</div>
              </CardContent>
            </Card>
          ))
        )}
      </ScrollArea>
    </div>
  );
};

export default EnviadosPedidos;
