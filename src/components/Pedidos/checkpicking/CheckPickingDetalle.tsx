import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckPedidos } from './useCheck';
import { AiOutlineUser, AiOutlineCalendar, AiOutlineDollar, AiOutlineFileText, AiOutlineWarning } from 'react-icons/ai';
import { MdAcUnit } from 'react-icons/md';
import { FaLeaf } from 'react-icons/fa';
import type { PedidoArmado, ProductoArmado } from '../pedidotypes';
import CheckLote, { LoteInfo } from './CheckLote';

interface CheckPickingDetalleProps {
  pedido: PedidoArmado;
}

const CheckPickingDetalle: React.FC<CheckPickingDetalleProps> = ({ pedido }) => {
  const [loading, setLoading] = useState(false);
  // Estado para iconos de selección por producto
  const [iconosSeleccion, setIconosSeleccion] = useState<Record<string, { frio: boolean; advertencia: boolean; calendario: boolean; limpieza: boolean; lotes?: LoteInfo[] }>>({});
  const [loteModal, setLoteModal] = useState<{ key: string; lotes: LoteInfo[] } | null>(null);
  // Estado para observación editable (se usará en modal)
  const [observacion, setObservacion] = useState<string>(`Pedido generado automáticamente con productos pendientes del pedido ${pedido._id}`);
  // Estado para mostrar modal de observación
  const [showObsModal, setShowObsModal] = useState(false);
  // Estado para selección de productos pendientes
  type ProductoPendiente = ProductoArmado & { cantidad_pendiente: number, frio?: boolean, advertencia?: boolean, calendario?: boolean, limpieza?: boolean, lotes?: LoteInfo[] };
  // Calcular productos pendientes (solo para selección de pedido)
  const productosPendientes: ProductoPendiente[] = (pedido.productos || [])
    .map((prod) => {
      if (!prod) return undefined;
      const cantidad_pedida = Number(prod.cantidad_pedida ?? 0);
      const cantidad_encontrada = Number(prod.cantidad_encontrada ?? 0);
      const cantidad_pendiente = cantidad_pedida - cantidad_encontrada;
      const key = prod.codigo || prod.id || '';
      if (cantidad_pendiente > 0) {
        return {
          ...prod,
          cantidad_pedida,
          cantidad_encontrada: 0,
          cantidad_pendiente,
          frio: iconosSeleccion[key]?.frio || false,
          advertencia: iconosSeleccion[key]?.advertencia || false,
          calendario: iconosSeleccion[key]?.calendario || false,
          limpieza: iconosSeleccion[key]?.limpieza || false,
          lotes: iconosSeleccion[key]?.lotes || [],
        } as ProductoPendiente;
      }
      return undefined;
    })
    .filter((prod): prod is ProductoPendiente => !!prod);
  // Estado: productos seleccionados (por defecto todos los pendientes)
  const [seleccionados, setSeleccionados] = useState<Record<string, boolean>>(
    () => Object.fromEntries(productosPendientes.map((prod) => [(prod.codigo || prod.id || ''), true]))
  );

  // Lógica para enviar el pedido pendiente (se llama desde el modal)
  const enviarPedidoPendiente = async () => {
    const productosAEnviar = productosPendientes.filter((prod) => seleccionados[prod.codigo || prod.id || '']);
    if (productosAEnviar.length === 0) {
      alert('Selecciona al menos un producto pendiente para generar el nuevo pedido.');
      return;
    }
    const total = productosAEnviar.reduce((acc, prod) => acc + (Number(prod.precio_n ?? prod.precio_unitario ?? prod.precio ?? 0) * Number(prod.cantidad_pedida)), 0);
    const subtotal = productosAEnviar.reduce((acc, prod) => acc + (Number(prod.precio_unitario ?? prod.precio ?? 0) * Number(prod.cantidad_pedida)), 0);
    const resumen = {
      cliente: pedido.cliente || 'Cliente no seleccionado',
      rif: pedido.rif || 'RIF no seleccionado',
      observacion: observacion,
      total: parseFloat(total.toFixed(2)),
      estado: 'pendiente',
      subtotal: parseFloat(subtotal.toFixed(2)),
      descuento_cliente1: (pedido as any).descuento_cliente1 ?? 0,
      descuento_cliente2: (pedido as any).descuento_cliente2 ?? 0,
      productos: productosAEnviar.map((prod) => ({
        ...prod,
        cantidad_pedida: prod.cantidad_pendiente, // Solo la cantidad pendiente
        cantidad_encontrada: 0,
        frio: prod.frio,
        advertencia: prod.advertencia,
        calendario: prod.calendario,
        limpieza: prod.limpieza,
        lotes: prod.lotes,
      })),
    };
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumen),
      });
      if (response.ok) {
        alert('¡Pedido pendiente generado exitosamente!');
        setShowObsModal(false);
      } else {
        const errorData = await response.json();
        alert(`Error al generar el pedido pendiente: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      alert('Error de conexión. Verifica tu red.');
    } finally {
      setLoading(false);
    }
  };

  // Finalizar checkpicking actualizando productos y estado
  const [finalizando, setFinalizando] = useState(false);
  const { actualizarPedidoCheckPicking } = useCheckPedidos();
  const navigate = useNavigate();
  const handleFinalizarCheckpicking = async () => {
    if (!pedido._id || !Array.isArray(pedido.productos)) return;
    setFinalizando(true);
    try {
      // Generar productos actualizados con iconos/lotes
      const productosActualizados = pedido.productos.map((prod) => {
        const key = prod.codigo || prod.id || '';
        return {
          ...prod,
          frio: iconosSeleccion[key]?.frio || false,
          advertencia: iconosSeleccion[key]?.advertencia || false,
          calendario: iconosSeleccion[key]?.calendario || false,
          lotes: iconosSeleccion[key]?.lotes || [],
        };
      });
      await actualizarPedidoCheckPicking(pedido._id, productosActualizados);
      alert('Checkpicking finalizado y productos actualizados. El pedido avanzó a packing.');
      navigate('/admin');
    } catch (e: any) {
      alert(e.message || 'Error al finalizar checkpicking.');
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <AiOutlineUser className="w-6 h-6 text-gray-500" />
        <span className="font-medium text-gray-700 text-lg">{pedido.cliente || 'Cliente desconocido'}</span>
        <span className="text-xs text-gray-400 ml-2">{pedido.rif}</span>
      </div>
      <div className="flex items-center gap-3">
        <AiOutlineCalendar className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500">Fecha: {pedido.fecha || '-'}</span>
      </div>
      <div className="flex items-center gap-3">
        <AiOutlineDollar className="w-5 h-5 text-gray-400" />
        <span className="text-base font-semibold text-gray-800">{pedido.total ? `$${pedido.total.toFixed(2)}` : '-'}</span>
      </div>
      <div className="flex items-center gap-3">
        <AiOutlineFileText className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500">Estado: <span className="font-medium text-gray-700">{pedido.estado}</span></span>
      </div>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Productos</h2>
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
              onClick={() => setShowObsModal(true)}
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Pedido Pendiente'}
            </button>
            <button
              className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors disabled:opacity-60"
              onClick={handleFinalizarCheckpicking}
              disabled={finalizando}
            >
              {finalizando ? 'Finalizando...' : 'Finalizar Checkpicking'}
            </button>
          </div>
        </div>
        {/* Modal para editar observación y confirmar generación de pedido pendiente */}
        {showObsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center-30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Observación para el nuevo pedido</h3>
              <textarea
                id="observacion"
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 mb-4 resize-y min-h-[80px] max-h-[200px]"
                value={observacion}
                onChange={e => setObservacion(e.target.value)}
                maxLength={200}
                autoFocus
                rows={4}
                placeholder="Agrega una observación para el nuevo pedido..."
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-3 py-1.5 rounded-md text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => setShowObsModal(false)}
                  disabled={loading}
                >Cancelar</button>
                <button
                  className="px-3 py-1.5 rounded-md text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  onClick={enviarPedidoPendiente}
                  disabled={loading}
                >{loading ? 'Generando...' : 'Confirmar'}</button>
              </div>
            </div>
          </div>
        )}
        {/* Lista de todos los productos, solo los pendientes tienen checkbox para el nuevo pedido */}
        {Array.isArray(pedido.productos) && pedido.productos.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {pedido.productos.map((prod) => {
              const key = prod.codigo || prod.id || '';
              const frio = iconosSeleccion[key]?.frio || false;
              const advertencia = iconosSeleccion[key]?.advertencia || false;
              const calendario = iconosSeleccion[key]?.calendario || false;
              const cantidad_pedida = Number(prod.cantidad_pedida ?? 0);
              const cantidad_encontrada = Number(prod.cantidad_encontrada ?? 0);
              const cantidad_pendiente = cantidad_pedida - cantidad_encontrada;
              const esPendiente = cantidad_pendiente > 0;
              const limpieza = iconosSeleccion[key]?.limpieza || false;
              return (
                <li key={key} className="py-3 flex items-start gap-2">
                  {esPendiente ? (
                    <input
                      type="checkbox"
                      className="mt-1 accent-blue-600"
                      checked={!!seleccionados[key]}
                      onChange={() => setSeleccionados((prev) => ({ ...prev, [key]: !prev[key] }))}
                    />
                  ) : (
                    <span className="w-4 h-4 mt-1 inline-block" />
                  )}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
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
                          <span>Subtotal: <span className="font-semibold text-gray-700">${prod.subtotal?.toFixed(2)}</span></span>
                          <span>Descuento1: {prod.descuento1}%</span>
                          <span>Descuento2: {prod.descuento2}%</span>
                          <span>Descuento3: {prod.descuento3}%</span>
                          <span>Descuento4: {prod.descuento4}%</span>
                        </div>
                      </div>
                      <div>
                        {/* Iconos de selección */}
                        <button
                          type="button"
                          aria-label="Marcar como frío"
                          className={`ml-2 rounded-full p-1 border transition-colors ${frio ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300 hover:bg-blue-50'}`}
                          onClick={() => setIconosSeleccion((prev) => ({ ...prev, [key]: { ...prev[key], frio: !frio, advertencia: prev[key]?.advertencia || false, calendario: prev[key]?.calendario || false, limpieza: prev[key]?.limpieza || false, lotes: prev[key]?.lotes } }))}
                        >
                          <MdAcUnit className={`w-5 h-5 ${frio ? 'text-blue-600' : 'text-gray-400'}`} />
                        </button>
                        <button
                          type="button"
                          aria-label="Marcar advertencia"
                          className={`ml-1 rounded-full p-1 border transition-colors ${advertencia ? 'bg-purple-100 border-purple-400' : 'bg-white border-gray-300 hover:bg-yellow-50'}`}
                          onClick={() => setIconosSeleccion((prev) => ({ ...prev, [key]: { ...prev[key], advertencia: !advertencia, frio: prev[key]?.frio || false, calendario: prev[key]?.calendario || false, limpieza: prev[key]?.limpieza || false, lotes: prev[key]?.lotes } }))}
                        >
                          <AiOutlineWarning className={`w-5 h-5 ${advertencia ? 'text-purple-600' : 'text-gray-400'}`} />
                        </button>
                        <button
                          type="button"
                          aria-label="Marcar como limpieza"
                          className={`ml-1 rounded-full p-1 border transition-colors ${limpieza ? 'bg-amber-100 border-amber-400' : 'bg-white border-gray-300 hover:bg-amber-50'}`}
                          onClick={() => setIconosSeleccion((prev) => ({ ...prev, [key]: { ...prev[key], limpieza: !limpieza, frio: prev[key]?.frio || false, advertencia: prev[key]?.advertencia || false, calendario: prev[key]?.calendario || false, lotes: prev[key]?.lotes } }))}
                        >
                          <FaLeaf className={`w-5 h-5 ${limpieza ? 'text-amber-700' : 'text-gray-400'}`} />
                        </button>
                        <button
                          type="button"
                          aria-label="Marcar calendario"
                          className={`ml-1 rounded-full p-1 border transition-colors ${calendario ? 'bg-green-100 border-green-400' : 'bg-white border-gray-300 hover:bg-green-50'}`}
                          onClick={() => setLoteModal({ key, lotes: iconosSeleccion[key]?.lotes || [] })}
                        >
                          <AiOutlineCalendar className={`w-5 h-5 ${calendario ? 'text-green-600' : 'text-gray-400'}`} />
                        </button>
                      </div>
                      <div className="flex flex-col items-end gap-1 mt-2 sm:mt-0 min-w-[120px]">
                        <span className="text-gray-500 text-sm">Pedida: <span className="font-semibold text-gray-700">{prod.cantidad_pedida}</span></span>
                        <span className="text-blue-500 text-xs">Encontrada: {prod.cantidad_encontrada}</span>
                        {esPendiente && (
                          <span className="text-xs text-orange-500">Pendiente: {cantidad_pendiente}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="text-gray-400 text-sm">No hay productos en este pedido o la información no está disponible.</div>
        )}
      </div>
      {loteModal && (
        <CheckLote
          lotes={loteModal.lotes}
          onChange={(lotes) => {
            setIconosSeleccion((prev) => ({
              ...prev,
              [loteModal.key]: {
                ...prev[loteModal.key],
                calendario: lotes.length > 0,
                lotes,
              },
            }));
            setLoteModal(null);
          }}
          onClose={() => {
            // Si se cierra el modal sin guardar, no se actualiza el estado
            setLoteModal(null);
          }}
        />
      )}
    </div>
  );
};

export default CheckPickingDetalle;
