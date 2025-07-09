import { useState, useEffect, useMemo, useRef } from "react";
import { animate, stagger } from 'animejs';
import { FiRefreshCw, FiMoreHorizontal } from "react-icons/fi";
import { EstadoPedido, usePedido } from "../hooks/usePedido";

const ESTADOS = [
  { id: 'nuevo', label: 'Nuevo' },
  { id: 'picking', label: 'Picking' },
  { id: 'packing', label: 'Packing' },
  { id: 'enviado', label: 'Enviado' },
  { id: 'entregado', label: 'Entregado' },
  { id: 'cancelado', label: 'Cancelado' },
];

export default function MonitorPedidos() {
  const { pedidos, obtenerPedidos, actualizarEstadoPedido } = usePedido();
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(ESTADOS[0].id);
  const [search, setSearch] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const listaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const pedidosFiltrados = useMemo(() =>
    pedidos.filter(p => {
      const matchEstado = p.estado === estadoSeleccionado;
      const matchSearch = p.cliente.toLowerCase().includes(search.toLowerCase());
      const fechaISO = new Date(p.fecha_creacion ?? 0).toISOString().split('T')[0];
      const matchDesde = fechaDesde ? fechaISO >= fechaDesde : true;
      const matchHasta = fechaHasta ? fechaISO <= fechaHasta : true;
      return matchEstado && matchSearch && matchDesde && matchHasta;
    }),
    [pedidos, estadoSeleccionado, search, fechaDesde, fechaHasta]
  );

  useEffect(() => {
    if (listaRef.current) {
      const items = listaRef.current.querySelectorAll('.pedido-item');
      if (items.length > 0) {
        animate(items, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 400,
          delay: stagger(60),
          easing: 'easeOutQuad',
        });
      }
    }
  }, [pedidosFiltrados]);

  const handleChangeEstado = async (id: string, nuevoEstado: string) => {
    await actualizarEstadoPedido(id, nuevoEstado as EstadoPedido); // Usa el tipo correcto
    obtenerPedidos();
  };

  return (
    <div className="p-6 pt-20 space-y-6 bg-gray-50 min-h-screen" ref={listaRef}>
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto">
          {ESTADOS.map(e => (
            <button
              key={e.id}
              onClick={() => setEstadoSeleccionado(e.id)}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                estadoSeleccionado === e.id
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
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
            className="input"
          />
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            className="input"
          />
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            className="input"
          />
          <button
            onClick={() => obtenerPedidos()}
            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 p-2 rounded-md"
            title="Refrescar"
          >
            <FiRefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Lista de pedidos */}
      <div className="space-y-4">
        {pedidosFiltrados.map(p => {
          const getNumber = (val: any) => {
            if (typeof val === 'number') return val;
            if (val?.$numberDouble) return parseFloat(val.$numberDouble);
            if (val?.$numberInt) return parseInt(val.$numberInt);
            return 0;
          };
          const subtotal = getNumber((p as any).subtotal);
          const total = getNumber(p.total);
          return (
            <div
              key={p._id}
              className="pedido-item border rounded-xl shadow-sm p-5 bg-white space-y-3"
              style={{ opacity: 0, transform: 'translateY(20px)' }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-gray-900">Cliente: {p.cliente}</h3>
                  <p className="text-sm text-gray-500">RIF: {p.rif}</p>
                  <p className="text-sm text-gray-500">Fecha: {p.fecha_creacion ? new Date(p.fecha_creacion).toLocaleString() : 'Sin fecha'}</p>
                  <p className="text-sm text-gray-500">Estado: <span className="font-medium">{p.estado}</span></p>
                  {p.observacion && (
                    <p className="text-sm text-gray-500">Observación: {p.observacion}</p>
                  )}
                </div>
                <FiMoreHorizontal className="text-gray-400" size={24} />
              </div>

              <div className="flex flex-wrap gap-4">
                {subtotal > 0 && (
                  <span className="text-base font-semibold text-gray-700">Subtotal: ${subtotal.toFixed(2)}</span>
                )}
                <span className="text-base font-semibold text-gray-700">Total: ${total.toFixed(2)}</span>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Productos:</h4>
                <ul className="divide-y divide-gray-100">
                  {p.productos?.map((prod: any, idx: number) => {
                    const precio = getNumber(prod.precio);
                    const cantidad = getNumber(prod.cantidad_pedida);
                    const d1 = getNumber(prod.descuento1);
                    const d2 = getNumber(prod.descuento2);
                    const d3 = getNumber(prod.descuento3);
                    const d4 = getNumber(prod.descuento4);
                    let precioConDescuentos = precio;
                    precioConDescuentos *= (1 - d1 / 100);
                    precioConDescuentos *= (1 - d2 / 100);
                    precioConDescuentos *= (1 - d3 / 100);
                    precioConDescuentos *= (1 - d4 / 100);
                    const subtotalConDescuentos = precioConDescuentos * cantidad;
                    return (
                      <li key={prod.id + idx} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{prod.descripcion}</span>
                          <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-3">
                            <span>Cant. pedida: <strong>{cantidad}</strong></span>
                            <span>Encontrada: <strong>{getNumber(prod.cantidad_encontrada)}</strong></span>
                            <span>Precio base: <strong>${precio.toFixed(2)}</strong></span>
                            <span className="text-blue-700">Subtotal c/desc: <strong>${subtotalConDescuentos.toFixed(2)}</strong></span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 text-xs font-semibold">
                          <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5">DL: {d1.toFixed(2)}%</span>
                          <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5">DE: {d2.toFixed(2)}%</span>
                          <span className="bg-green-100 text-green-700 rounded px-2 py-0.5">DC: {d3.toFixed(2)}%</span>
                          <span className="bg-green-100 text-green-700 rounded px-2 py-0.5">PP: {d4.toFixed(2)}%</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="pt-3 border-t mt-3 flex flex-wrap gap-2">
                {ESTADOS.filter(e => e.id !== p.estado).map(e => (
                  <button
                    key={e.id}
                    onClick={() => handleChangeEstado(p._id, e.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    {e.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {pedidosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 italic">No se encontraron pedidos para este filtro.</p>
      )}
    </div>
  );
}
