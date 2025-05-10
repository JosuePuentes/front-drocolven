import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiMoreHorizontal } from "react-icons/fi";
import { usePedidoArmado } from "../hooks/usePedidoArmado";

const ESTADOS = [
  { id: 'pedido_creado', label: 'Nuevos' },
  { id: 'pedido_armandose', label: 'Armándose' },
  { id: 'pedido_armado', label: 'Armado' },
  { id: 'pedido_enviado', label: 'Enviado' },
  { id: 'pedido_eliminado', label: 'Eliminado' },
];

export default function MonitorPedidos() {
  const { pedidos, obtenerPedidos, actualizarEstadoPedido } = usePedidoArmado();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(ESTADOS[0].id);
  const [search, setSearch] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const pedidosFiltrados = useMemo(() =>
    pedidos.filter(p => {
      const matchEstado = p.estado === estadoSeleccionado;
      const matchSearch = p.cliente.toLowerCase().includes(search.toLowerCase());
      const fechaISO = new Date(p.fecha).toISOString().split('T')[0];
      const matchDesde = fechaDesde ? fechaISO >= fechaDesde : true;
      const matchHasta = fechaHasta ? fechaISO <= fechaHasta : true;
      return matchEstado && matchSearch && matchDesde && matchHasta;
    }),
    [pedidos, estadoSeleccionado, search, fechaDesde, fechaHasta]
  );

  const handleChangeEstado = async (id, nuevoEstado) => {
    await actualizarEstadoPedido(id, nuevoEstado);
    obtenerPedidos();
  };

  return (
    <div className="p-6 pt-20 space-y-6">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto">
          {ESTADOS.map(e => (
            <button
              key={e.id}
              onClick={() => setEstadoSeleccionado(e.id)}
              className={`${estadoSeleccionado === e.id ? 'bg-blue-600 text-white' : 'bg-gray-200'} py-2 px-4 rounded`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={() => obtenerPedidos()}
            className="border rounded px-2 py-1 flex items-center justify-center"
            title="Refrescar"
          >
            <FiRefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Lista de pedidos */}
      <AnimatePresence>
        {pedidosFiltrados.map(p => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="border rounded-lg shadow p-4 bg-white relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{p.cliente}</h3>
                <p className="text-sm text-gray-500">{new Date(p.fecha).toLocaleString()}</p>
              </div>
              <FiMoreHorizontal className="text-gray-400" size={24} />
            </div>
            <p className="mt-2 font-semibold">Total: ${p.total.toFixed(2)}</p>
            <ul className="mt-2 list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
              {p.productos.map((prod, idx) => (
                <li key={idx} className="text-sm">
                  {prod.descripcion} - pedido: {prod.cantidad_pedida} encontrado: {prod.cantidad_encontrada || 0} x ${prod.precio.toFixed(2)}
                </li>
              ))}
            </ul>

            {/* Botones de cambio de estado */}
            <div className="mt-4 flex flex-wrap gap-2">
              {ESTADOS.filter(e => e.id !== p.estado).map(e => (
                <button
                  key={e.id}
                  onClick={() => handleChangeEstado(p._id, e.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  {e.label}
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {pedidosFiltrados.length === 0 && (
        <p className="text-center text-gray-500">No se encontraron pedidos para este filtro.</p>
      )}
    </div>
  );
}
