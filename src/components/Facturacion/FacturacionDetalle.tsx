import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePedido, ESTADOS_PEDIDO } from "../hooks/usePedido";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import {
  AiOutlineLoading3Quarters,
  AiOutlineArrowLeft,
  AiOutlineSend,
  AiOutlinePlayCircle
} from "react-icons/ai";
import { animate } from 'animejs';
import { ProductoArmado } from "../Pedidos/pedidotypes";

const FacturacionDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { pedido, setPedido, loading, finalizarFacturacion, actualizarEstadoFacturacion } = usePedido();
  const detalleRef = useRef<HTMLDivElement>(null);
  const [elapsed, setElapsed] = useState<string>("—");

  useEffect(() => {
    const fetchPedidoById = async (pedidoId: string) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pedido/${pedidoId}`);
        if (!response.ok) throw new Error('No se pudo cargar el pedido');
        const pedidoData = await response.json();
        setPedido(pedidoData);
      } catch (error: any) {
        toast.error('No se pudo cargar el pedido: ' + (error.message || error));
        setPedido(null);
      }
    };
    if (id) {
      fetchPedidoById(id);
    }
    return () => {
      setPedido(null);
    };
  }, [id, setPedido]);

  useEffect(() => {
    if (pedido && detalleRef.current) {
      animate(detalleRef.current, {
        opacity: [0, 1],
        y: [20, 0],
        duration: 500,
        ease: 'outQuad',
      });
    }
  }, [pedido]);

  // Simula tiempo desde creación (como elapsed en Packing)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (pedido?.fecha_creacion && pedido.estado === ESTADOS_PEDIDO.FACTURANDO) {
      const updateElapsed = () => {
        const inicio = new Date(pedido.fecha_creacion!);
        const now = new Date();
        const diff = Math.floor((now.getTime() - inicio.getTime()) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setElapsed(
          hours > 0
            ? `${hours}h ${minutes}m ${seconds}s`
            : `${minutes}m ${seconds}s`
        );
      };
      updateElapsed();
      interval = setInterval(updateElapsed, 1000);
    } else {
      setElapsed('—');
    }
    return () => { if (interval) clearInterval(interval); };
  }, [pedido]);

  const handleFinalizar = async () => {
    if (!pedido) return;
    try {
      await finalizarFacturacion(pedido._id);
      toast.success("Facturación finalizada. Pedido enviado.");
      navigate('/admin/facturacionpedidos');
    } catch (error) {
      toast.error("Error al finalizar la facturación");
    }
  };

  const handleIniciarFacturacion = async () => {
    if (!pedido) return;
    try {
      // Crear subobjeto de facturacion si no existe
      const facturacion = pedido.facturacion || {
        usuario: '',
        fechainicio_facturacion: new Date().toISOString(),
        fechafin_facturacion: null,
        estado_facturacion: 'en_proceso',
      };
      // Actualizar el pedido con el subestado de facturación
      await actualizarEstadoFacturacion(pedido._id);
      toast.success("Facturación iniciada correctamente.");
      setPedido({ ...pedido, estado: ESTADOS_PEDIDO.FACTURANDO, facturacion });
    } catch (error: any) {
      toast.error(`Error al iniciar facturación: ${error.message}`);
    }
  };

  if (loading && !pedido) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <AiOutlineLoading3Quarters className="animate-spin h-8 w-8 text-blue-500 mr-3" />
        Cargando detalle de facturación...
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-red-500">
        <h2 className="text-2xl font-bold mb-4">Pedido no encontrado</h2>
        <p>El pedido que buscas no existe o no se pudo cargar.</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          <AiOutlineArrowLeft className="mr-2" /> Volver
        </Button>
      </div>
    );
  }

  // Estadísticas y productos
  const productos: ProductoArmado[] = pedido.productos || [];
  const montoTotal = productos.reduce((acc, p) => acc + ((p.cantidad_pedida || 0) * (p.precio_unitario || 0)), 0);
  const usuarioFacturo = "-";
  const fechaInicio = pedido.fecha_creacion ? new Date(pedido.fecha_creacion).toLocaleString() : "-";

  return (
    <div className="container mx-auto p-1.5 max-h-screen">
      <Card className="pt-0 px-1 ">
        <CardHeader className="p-1">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm">Facturación de Pedido #{pedido._id.slice(-6)}</CardTitle>
              <CardDescription className="text-sm">Cliente: {pedido.cliente}</CardDescription>
              <CardDescription className="text-sm">RIF: {pedido.rif}</CardDescription>
            </div>
            <Badge variant={pedido.estado === ESTADOS_PEDIDO.FACTURANDO ? 'default' : 'secondary'}>
              {pedido.estado.toUpperCase()}
            </Badge>
          </div>
          <div ref={detalleRef} id="facturacion-info" className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-2 p-2 border rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500">Usuario Facturación</p>
              <p className="text-sm font-semibold">{usuarioFacturo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Inicio Facturación</p>
              <p className="text-sm font-semibold">{fechaInicio}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tiempo</p>
              <p className="text-sm font-semibold">{elapsed}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estado</p>
              <p className={`text-sm font-semibold ${pedido.estado === ESTADOS_PEDIDO.FACTURANDO ? 'text-blue-600' : 'text-gray-600'}`}>{pedido.estado.replace('_', ' ')}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg text-center font-bold mb-2 text-gray-800">Productos de la Facturación</h3>
          <div className="mt-1 flex-1 max-h-[60vh] overflow-y-auto">
            <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
              {productos.map((producto, idx) => {
                const codigo = String(producto.codigo ?? idx);
                return (
                  <div key={codigo} className="flex flex-col md:flex-row md:items-center justify-start bg-gray-50 rounded-lg p-2 border border-gray-100 shadow-sm max-h-[20vh]">
                    <div className="flex flex-row gap-2 mb-2 md:mb-0 items-center w-full">
                      <div className="border p-2 rounded-lg flex-1 w-full">
                        <div className="flex justify-between items-center">
                          <span className="text-black font-bold text-base">{idx + 1}</span>
                          <span className="font-mono tracking-widest text-xs text-gray-500">{producto.codigo ?? '—'}</span>
                        </div>
                        <div className="font-semibold text-black text-xl md:text-lg mt-1">{producto.descripcion}</div>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm">
                          <span className="text-gray-700">Precio: <span className="font-semibold text-green-600">$ {(producto.precio ?? producto.precio_unitario ?? 0).toFixed(2)}</span></span>
                          <span className="text-gray-700">Subtotal: <span className="font-semibold">$ {(producto.subtotal ?? (producto.cantidad_pedida * (producto.precio_unitario || 0))).toFixed(2)}</span></span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-1 text-xs">
                          <span className="text-gray-500">Descuento1: <span className="font-bold text-blue-700">{producto.descuento1 ?? 0}%</span></span>
                          <span className="text-gray-500">Descuento2: <span className="font-bold text-blue-700">{producto.descuento2 ?? 0}%</span></span>
                          <span className="text-gray-500">Descuento3: <span className="font-bold text-blue-700">{producto.descuento3 ?? 0}%</span></span>
                          <span className="text-gray-500">Descuento4: <span className="font-bold text-blue-700">{producto.descuento4 ?? 0}%</span></span>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-1 text-xs">
                          <span className="text-gray-700">Cantidad pedida: <span className="font-bold">{producto.cantidad_pedida}</span></span>
                          <span className="text-gray-700">Cantidad encontrada: <span className="font-bold text-green-700">{producto.cantidad_encontrada ?? 0}</span></span>
                          <span className="text-gray-700">Existencia real: <span className="font-bold text-purple-700">{producto.existencia ?? '-'}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t">
            <div className="text-lg font-bold">
              Total: $ {montoTotal.toFixed(2)}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Button variant="outline" onClick={() => navigate(-1)} disabled={loading}>
                <AiOutlineArrowLeft className="mr-2 h-4 w-4" /> Volver
              </Button>
              {pedido.estado === ESTADOS_PEDIDO.PARA_FACTURAR && (
                <Button onClick={handleIniciarFacturacion} disabled={loading} className="bg-blue-600 text-white">
                  <AiOutlinePlayCircle className="mr-2 h-4 w-4" /> Iniciar Facturación
                </Button>
              )}
              {pedido.estado === ESTADOS_PEDIDO.FACTURANDO && (
                <Button onClick={handleFinalizar} disabled={loading} className="bg-blue-600 text-white">
                  <AiOutlineSend className="mr-2 h-4 w-4" /> Finalizar Facturación
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacturacionDetalle;
