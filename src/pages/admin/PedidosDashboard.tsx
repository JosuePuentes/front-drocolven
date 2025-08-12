import { useEffect } from 'react';
import { usePedido, ESTADOS_PEDIDO } from '../../components/hooks/usePedido';
import PedidoMiniCard from '../../components/Pedidos/PedidoMiniCard';
import PedidoNuevoCard from '../../components/Pedidos/PedidoNuevoCard';


// Helpers para rango de fechas +/- 15 días
function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}
const today = new Date();
const dateBefore = new Date(today);
dateBefore.setDate(today.getDate() - 15);
const dateAfter = new Date(today);
dateAfter.setDate(today.getDate() + 15);

const [fechaDesde, fechaHasta] = [formatDate(dateBefore), formatDate(dateAfter)];

const PedidosDashboard: React.FC = () => {
  const { pedidos, obtenerPedidos, loading } = usePedido();

  useEffect(() => {
    obtenerPedidos([
      "picking","checkpicking","packing","enviado","nuevo","facturando","para_facturar"
    ], fechaDesde, fechaHasta);
    const interval = setInterval(() => {
      obtenerPedidos([
        "picking","checkpicking","packing","enviado","nuevo","facturando","para_facturar"
      ], fechaDesde, fechaHasta);
    }, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pedidos && pedidos.length > 0) {
      console.log('Pedidos nuevos:', pedidos.filter((p) => p.estado === ESTADOS_PEDIDO.NUEVO));
    }
  }, [pedidos]);

  // Filtrar pedidos en picking, packing, enviado, nuevo y facturación
  const pedidosFiltrados = pedidos.filter(
    (pedido) =>
      pedido.estado === ESTADOS_PEDIDO.PICKING ||
      pedido.estado === ESTADOS_PEDIDO.CHECKPICKING ||
      pedido.estado === ESTADOS_PEDIDO.PACKING ||
      pedido.estado === ESTADOS_PEDIDO.ENVIADO ||
      pedido.estado === ESTADOS_PEDIDO.NUEVO ||
      pedido.estado === ESTADOS_PEDIDO.FACTURANDO ||
      pedido.estado === ESTADOS_PEDIDO.PARA_FACTURAR
  );

  // Separar pedidos por estado
  const pedidosPicking = pedidosFiltrados.filter(
    (p) => p.estado === ESTADOS_PEDIDO.PICKING
  );
  const pedidosCheckPicking = pedidosFiltrados.filter(
    (p) => p.estado === ESTADOS_PEDIDO.CHECKPICKING
  );
  const pedidosPacking = pedidosFiltrados.filter(
    (p) => p.estado === ESTADOS_PEDIDO.PACKING
  );
  const pedidosEnviando = pedidosFiltrados.filter(
    (p) => p.estado === ESTADOS_PEDIDO.ENVIADO
  );
  const pedidosNuevos = pedidosFiltrados.filter(
    (p) => p.estado === ESTADOS_PEDIDO.NUEVO
  );
  const pedidosFacturacion = pedidosFiltrados.filter(
    (p) =>
      p.estado === ESTADOS_PEDIDO.FACTURANDO ||
      p.estado === ESTADOS_PEDIDO.PARA_FACTURAR
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center mb-4">
        <h1 className="text-2xl font-bold text-foreground text-center w-full">Dashboard de Pedidos</h1>
      </div>
      <div className="flex flex-col gap-10">
        {/* Lista de Nuevos */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 pl-1">
            Nuevos
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {pedidosNuevos.length === 0 && !loading && (
                <li className="text-center text-muted-foreground py-8 w-full">
                  No hay pedidos nuevos.
                </li>
              )}
              {pedidosNuevos.map((pedido) => (
                <li key={pedido._id} className="px-4 py-2">
                  <PedidoNuevoCard pedido={pedido} onClick={() => {}} />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Lista de Picking */}
        <div>
          <h2 className="text-lg font-semibold text-blue-700 mb-3 pl-1">
            En Picking
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {pedidosPicking.length === 0 && !loading && (
                <li className="text-center text-muted-foreground py-8 w-full">
                  No hay pedidos en picking.
                </li>
              )}
              {pedidosPicking.map((pedido) => (
                <li key={pedido._id} className="px-4 py-2">
                  <PedidoMiniCard pedido={pedido} onClick={() => {}} size="lg" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Lista de check picking */}
        <div>
          <h2 className="text-lg font-semibold text-blue-700 mb-3 pl-1">
            En Check Picking
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {pedidosCheckPicking.length === 0 && !loading && (
                <li className="text-center text-muted-foreground py-8 w-full">
                  No hay pedidos en check picking.
                </li>
              )}
              {pedidosCheckPicking.map((pedido) => (
                <li key={pedido._id} className="px-4 py-2">
                  <PedidoMiniCard pedido={pedido} onClick={() => {}} size="lg" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Lista de Packing */}
        <div>
          <h2 className="text-lg font-semibold text-indigo-700 mb-3 pl-1">
            En Packing
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {pedidosPacking.length === 0 && !loading && (
                <li className="text-center text-muted-foreground py-8 w-full">
                  No hay pedidos en packing.
                </li>
              )}
              {pedidosPacking.map((pedido) => (
                <li key={pedido._id} className="px-4 py-2">
                  <PedidoMiniCard pedido={pedido} onClick={() => {}} size="lg" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Lista de Facturación */}
        <div>
          <h2 className="text-lg font-semibold text-green-700 mb-3 pl-1">
            En Facturación
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {pedidosFacturacion.length === 0 && !loading && (
                <li className="text-center text-muted-foreground py-8 w-full">
                  No hay pedidos en facturación.
                </li>
              )}
              {pedidosFacturacion.map((pedido) => (
                <li key={pedido._id} className="px-4 py-2">
                  <PedidoMiniCard pedido={pedido} onClick={() => {}} size="lg" />
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Lista de Envío */}
        <div>
          <h2 className="text-lg font-semibold text-yellow-700 mb-3 pl-1">
            En Envío
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {pedidosEnviando.length === 0 && !loading && (
                <li className="text-center text-muted-foreground py-8 w-full">
                  No hay pedidos en envío.
                </li>
              )}
              {pedidosEnviando.map((pedido) => (
                <li key={pedido._id} className="px-4 py-2">
                  <PedidoMiniCard pedido={pedido} onClick={() => {}} size="lg" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidosDashboard;
