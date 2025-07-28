import React, { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { Button } from '@/components/ui/button';
import CheckPickingDetalle from './CheckPickingDetalle';
import { useCheckPedidos, Pedido } from './useCheck';
import type { PedidoArmado } from '../pedidotypes';

const CheckPicking: React.FC = () => {
  const { pedidos, loading, error } = useCheckPedidos();
  const [detallePedido, setDetallePedido] = useState<PedidoArmado | null>(null);

  // Adaptador: convierte Pedido a PedidoArmado (rellena campos requeridos si faltan)
  // Solo valores válidos para EstadoPedido
  const ESTADOS_VALIDOS = [
    'nuevo',
    'picking',
    'checkpicking',
    'packing',
    'enviado',
    'entregado',
    'cancelado',
    'para_facturar',
    'facturando',
  ] as const;
  type EstadoPedido = typeof ESTADOS_VALIDOS[number];

  const adaptPedido = (pedido: Pedido): PedidoArmado => ({
    ...pedido,
    cliente: pedido.cliente ?? 'Cliente desconocido',
    rif: pedido.rif ?? '',
    fecha: pedido.fecha ?? '',
    total: pedido.total ?? 0,
    estado: ESTADOS_VALIDOS.includes(pedido.estado as EstadoPedido)
      ? (pedido.estado as EstadoPedido)
      : 'checkpicking',
    productos: pedido.productos || [],
    picking: pedido.picking || {},
    packing: pedido.packing || {},
    envio: pedido.envio || {},
  });

  if (detallePedido) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-6">
          <Button variant="ghost" className="mb-4" onClick={() => setDetallePedido(null)}>
            ← Volver
          </Button>
          <CheckPickingDetalle pedido={detallePedido} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <AiOutlineCheckCircle className="w-7 h-7 text-green-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-800">Pedidos en Check Picking</h1>
        </div>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : pedidos.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No hay pedidos en checkpicking.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {pedidos.map((pedido) => (
              <li key={pedido._id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">{pedido.cliente || 'Cliente desconocido'}</span>
                    <span className="text-xs text-gray-400">{pedido.rif}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Fecha: {pedido.fecha || '-'}</div>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span className="text-base font-semibold text-gray-800">{pedido.total ? `$${pedido.total.toFixed(2)}` : '-'}</span>
                  <Button
                    variant="outline"
                    className="text-xs px-3 py-1"
                    onClick={() => setDetallePedido(adaptPedido(pedido))}
                  >
                    Ver Detalle
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CheckPicking;