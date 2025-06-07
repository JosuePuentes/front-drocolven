import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePedidoArmado, PedidoArmado, ProductoArmado } from "../hooks/usePedidoArmado";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiOutlineSend, AiOutlineArrowLeft } from "react-icons/ai";
import { animate } from 'animejs';
import { Input } from '@/components/ui/input';

const PackingDetalle: React.FC = () => {
  const { id } = useParams();
  const { pedidos, obtenerPedidos, actualizarEstadoPedido, loading } = usePedidoArmado();
  const [pedido, setPedido] = useState<PedidoArmado | null>(null);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
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

  useEffect(() => {
    if (pedido) {
      // Inicializar cantidades encontradas con los valores actuales del pedido
      const inicial: Record<string, number> = {};
      pedido.productos.forEach((prod) => {
        inicial[prod.id] = prod.cantidad_encontrada;
      });
      setCantidades(inicial);
    }
  }, [pedido]);

  const handleCantidadChange = (id: string, value: number) => {
    setCantidades((prev) => ({ ...prev, [id]: value }));
  };

  const handleEnviar = async () => {
    if (!pedido) return;
    await actualizarEstadoPedido(pedido._id, "enviado");
    navigate("/admin/packingpedidos");
  };

  const handleGuardarCantidades = async () => {
    if (!pedido) return;
    try {
      const cantidadesPayload: Record<string, number> = {};
      pedido.productos.forEach((prod) => {
        cantidadesPayload[`${pedido._id}_${prod.id}`] = cantidades[prod.id] ?? 0;
      });
      await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_cantidades/${pedido._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidades: cantidadesPayload }),
      });
      // Opcional: feedback visual
      // toast.success('Cantidades encontradas guardadas');
    } catch (error) {
      // toast.error('Error al guardar cantidades');
    }
  };

  if (loading || !pedido) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Cargando...</div>;
  }

  if (pedido.estado !== "packing") {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Acceso restringido</CardTitle>
            <CardDescription>Este pedido no está en estado <Badge variant='outline'>packing</Badge>.</CardDescription>
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
              <Badge variant="outline">packing</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-gray-600 text-sm mb-2">
              <span>Fecha: {pedido.fecha}</span>
              <span>Total: ${pedido.total}</span>
            </div>
            <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] pr-1 sm:pr-2 mt-4">
              <ul className="space-y-6">
                {pedido.productos.map((producto: ProductoArmado) => {
                  const d1 = producto.descuento1 ?? 0;
                  const d2 = producto.descuento2 ?? 0;
                  const d3 = producto.descuento3 ?? 0;
                  const d4 = producto.descuento4 ?? 0;
                  const precioBase = producto.precio ?? 0;
                  const cantidad = producto.cantidad_pedida ?? 0;
                  const subtotal = producto.subtotal ?? 0;
                  const precioConDescuentos = precioBase * (1 - d1 / 100) * (1 - d2 / 100) * (1 - d3 / 100) * (1 - d4 / 100);
                  const subtotalConDescuentos = precioConDescuentos * cantidad;
                  const isMissing = producto.cantidad_encontrada < cantidad;
                  const isOverstocked = producto.cantidad_encontrada > cantidad;
                  return (
                    <li
                      key={producto.id}
                      className="flex flex-col md:flex-row md:items-center gap-4 border rounded-2xl p-4 sm:p-6 shadow-sm bg-white even:bg-gray-50 transition-all hover:shadow-md"
                    >
                      <div className="flex-1 min-w-0 w-full">
                        <div className="font-bold text-base xs:text-lg sm:text-xl text-gray-900 mb-1 break-words whitespace-normal">{producto.descripcion}</div>
                        <div className="flex flex-col xs:flex-row flex-wrap items-start xs:items-center gap-x-6 gap-y-1 text-xs xs:text-sm text-gray-600 mb-2">
                          <span>Cant. pedida: <span className="font-semibold text-gray-800">{cantidad}</span></span>
                          <span>Precio base: <span className="font-semibold text-gray-800">${precioBase.toFixed(2)}</span></span>
                          <span>Subtotal base: <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span></span>
                          <span className="text-green-700 font-semibold">Subtotal c/desc: <span className="font-semibold">${subtotalConDescuentos.toFixed(2)}</span></span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 text-[10px] xs:text-xs">DL: {d1.toFixed(2)}%</Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 text-[10px] xs:text-xs">DE: {d2.toFixed(2)}%</Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 font-medium px-2 py-0.5 text-[10px] xs:text-xs">DC: {d3.toFixed(2)}%</Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 font-medium px-2 py-0.5 text-[10px] xs:text-xs">PP: {d4.toFixed(2)}%</Badge>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center justify-center min-w-[120px] sm:min-w-[160px] max-w-[200px] mx-auto md:mx-0 gap-2 md:gap-0">
                        <div className="block text-xs xs:text-sm font-medium text-gray-700 mb-0 md:mb-1">Cantidad encontrada</div>
                        <Input
                          type="number"
                          min={0}
                          value={cantidades[producto.id] ?? 0}
                          onChange={e => handleCantidadChange(producto.id, parseInt(e.target.value, 10) || 0)}
                          className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border text-base sm:text-lg font-bold text-center tracking-wide ${isMissing ? 'border-red-500 text-red-600 bg-red-50' : isOverstocked ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-900 bg-gray-50'}`}
                          aria-label={`Cantidad encontrada para ${producto.descripcion}`}
                        />
                        {isMissing && <p className="text-red-500 text-xs mt-1">¡Faltan unidades!</p>}
                        {isOverstocked && <p className="text-orange-500 text-xs mt-1">Más unidades de las pedidas.</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
              <Button onClick={handleGuardarCantidades} variant="outline" className="pedido-acciones-btn w-full sm:w-auto px-6 py-2 transition-all duration-300 bg-white border border-gray-300 text-gray-800 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium">
                Guardar Cantidades
              </Button>
              <Button onClick={handleEnviar} variant="default" className="pedido-acciones-btn w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-semibold bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl shadow-md">
                <AiOutlineSend className="w-5 h-5" /> Enviar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PackingDetalle;
