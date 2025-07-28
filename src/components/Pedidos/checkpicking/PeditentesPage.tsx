import React, { useEffect, useState } from 'react';
import { AiOutlineUser, AiOutlineCalendar, AiOutlineDollar, AiOutlineFileText, AiOutlineWarning } from 'react-icons/ai';
import { MdAcUnit } from 'react-icons/md';
import { FaLeaf } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface Producto {
  id?: string;
  codigo?: string;
  descripcion?: string;
  laboratorio?: string;
  dpto?: string;
  fv?: string;
  nacional?: string;
  precio_unitario?: number;
  precio?: number;
  subtotal?: number;
  descuento1?: number;
  descuento2?: number;
  descuento3?: number;
  descuento4?: number;
  cantidad_pedida?: number;
  frio?: boolean;
  advertencia?: boolean;
  limpieza?: boolean;
  calendario?: boolean;
  lotes?: any[];
}

interface Pedido {
  _id: string;
  cliente: string;
  rif: string;
  fecha: string;
  total: number;
  estado: string;
  productos: Producto[];
  observacion?: string;
}

const PeditentesPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [actualizando, setActualizando] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/por_estado/pendiente`);
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch {
        setPedidos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPedidos();
  }, []);

  const handlePasarAPicking = async (pedidoId: string) => {
    if (!window.confirm('¿Estás seguro que deseas pasar este pedido a picking? Esta acción no se puede deshacer.')) {
      return;
    }
    setActualizando(pedidoId);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_estado/${pedidoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevo_estado: 'picking' }),
      });
      setPedidos((prev) => prev.filter((p) => p._id !== pedidoId));
    } catch {
      // Manejo de error opcional
    } finally {
      setActualizando(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Pedidos Pendientes</h1>
      {loading ? (
        <div className="text-gray-500">Cargando pedidos...</div>
      ) : pedidos.length === 0 ? (
        <div className="text-gray-400">No hay pedidos pendientes.</div>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido._id} className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <AiOutlineUser className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700 text-base">{pedido.cliente}</span>
              <span className="text-xs text-gray-400 ml-2">{pedido.rif}</span>
              <AiOutlineCalendar className="w-4 h-4 text-gray-400 ml-4" />
              <span className="text-xs text-gray-500">{pedido.fecha}</span>
              <AiOutlineDollar className="w-4 h-4 text-gray-400 ml-4" />
              <span className="text-xs font-semibold text-gray-800">${pedido.total?.toFixed(2)}</span>
              <AiOutlineFileText className="w-4 h-4 text-gray-400 ml-4" />
              <span className="text-xs text-gray-500">Estado: <span className="font-medium text-gray-700">{pedido.estado}</span></span>
            </div>
            {pedido.observacion && (
              <div className="text-xs text-gray-500 mb-2">{pedido.observacion}</div>
            )}
            <ul className="divide-y divide-gray-100 mb-4">
              {pedido.productos.map((prod, idx) => {
                const key = prod.codigo || prod.id || idx;
                return (
                  <li key={key} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border border-gray-200 rounded-md bg-gray-50 px-3 mb-2 shadow-sm">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 items-center mb-1">
                        <span className="text-gray-700 font-medium">{prod.descripcion || 'Producto sin nombre'}</span>
                        <span className="text-xs text-gray-400">{prod.codigo}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{prod.laboratorio}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{prod.dpto}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">FV: {prod.fv}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 rounded px-2 py-0.5">{prod.nacional}</span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>Precio: <span className="font-semibold text-gray-700">${prod.precio_unitario?.toFixed(2) ?? prod.precio?.toFixed(2)}</span></span>
                        <span>Cant: <span className="font-semibold text-gray-700">{prod.cantidad_pedida}</span></span>
                        <span>Descuento1: {prod.descuento1}%</span>
                        <span>Descuento2: {prod.descuento2}%</span>
                        <span>Descuento3: {prod.descuento3}%</span>
                        <span>Descuento4: {prod.descuento4}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1 items-center mt-2 sm:mt-0">
                      {prod.frio && <MdAcUnit className="w-5 h-5 text-blue-600" title="Frío" />}
                      {prod.advertencia && <AiOutlineWarning className="w-5 h-5 text-purple-600" title="Advertencia" />}
                      {prod.limpieza && <FaLeaf className="w-5 h-5 text-amber-700" title="Limpieza" />}
                      {prod.calendario && <AiOutlineCalendar className="w-5 h-5 text-green-600" title="Calendario" />}
                    </div>
                    {Array.isArray(prod.lotes) && prod.lotes.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                        <span className="font-semibold text-gray-600">Lotes:</span>
                        {prod.lotes.map((lote, i) => (
                          <span key={i} className="bg-gray-100 rounded px-2 py-0.5 text-gray-700">
                            {typeof lote === 'string' ? lote : lote.numero || lote.lote || JSON.stringify(lote)}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded shadow-sm disabled:opacity-60"
              onClick={() => handlePasarAPicking(pedido._id)}
              disabled={actualizando === pedido._id}
            >
              {actualizando === pedido._id ? 'Actualizando...' : 'Pasar a Picking'}
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default PeditentesPage;
