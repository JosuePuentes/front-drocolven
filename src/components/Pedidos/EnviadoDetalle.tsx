import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePedidoArmado, PedidoArmado, ProductoArmado } from "../hooks/usePedidoArmado";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { animate } from 'animejs';

const EnviadoDetalle: React.FC = () => {
  const { id } = useParams();
  const { pedidos, obtenerPedidos, actualizarEstadoPedido, loading } = usePedidoArmado();
  const [pedido, setPedido] = useState<PedidoArmado | null>(null);
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    obtenerPedidos();
  }, []);

  useEffect(() => {
    if (id) {
      const encontrado = pedidos.find((p) => p._id === id);
      setPedido(encontrado || null);
    }
  }, [id, pedidos]);

  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [0, 1],
        y: [40, 0],
        duration: 500,
        ease: 'easeOutQuad',
      });
    }
  }, [pedido]);

  const handleEntregar = async () => {
    if (!pedido) return;
    await actualizarEstadoPedido(pedido._id, "entregado");
    navigate("/admin/enviadospedidos");
  };

  if (loading || !pedido) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Cargando...</div>;
  }

  if (pedido.estado !== "enviado") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Acceso restringido</CardTitle>
            <CardDescription>Este pedido no está en estado <Badge variant='outline'>enviado</Badge>.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate(-1)} className="mt-4 flex items-center gap-2">
              <AiOutlineArrowLeft className="w-5 h-5" /> Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white/60 p-4">
      <div ref={cardRef} className="w-full max-w-2xl">
        <Card className="mb-6 shadow-sm border border-gray-100">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Pedido #{pedido._id.slice(-5)}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <span>Cliente:</span> <span className="font-medium">{pedido.cliente}</span>
              <Badge variant="outline">enviado</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-gray-600 text-sm mb-2">
              <span>Fecha: {pedido.fecha}</span>
              <span>Total: ${pedido.total}</span>
            </div>
            <ScrollArea className="max-h-72 mt-4">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-500 border-b">
                    <th className="py-1">Producto</th>
                    <th className="py-1">Pedida</th>
                    <th className="py-1">Encontrada</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.productos.map((prod: ProductoArmado) => (
                    <tr key={prod.id} className="border-b last:border-0">
                      <td className="py-1 pr-2">{prod.descripcion}</td>
                      <td className="py-1 pr-2">{prod.cantidad_pedida}</td>
                      <td className="py-1">{prod.cantidad_encontrada}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
            <div className="flex justify-end mt-6">
              <Button onClick={handleEntregar} variant="default" className="flex items-center gap-2 px-6 py-2 text-base font-semibold bg-green-600 hover:bg-green-700 transition-colors">
                Marcar como Entregado
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnviadoDetalle;
