import { useEffect } from 'react';
import { usePedido, ESTADOS_PEDIDO } from '../../components/hooks/usePedido';
import PedidoMiniCard from '../../components/Pedidos/PedidoMiniCard';

const PedidosDashboard: React.FC = () => {
  const { pedidos, fetchPedidos, loading } = usePedido();

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(() => {
      fetchPedidos();
    }, 480000); // Actualiza cada 8 minutos (480,000 ms)
    return () => clearInterval(interval);
  }, []);

  // Filtrar pedidos en picking, packing o enviado
  const pedidosFiltrados = pedidos.filter(
    (pedido) =>
      pedido.estado === ESTADOS_PEDIDO.PICKING ||
      pedido.estado === ESTADOS_PEDIDO.PACKING ||
      pedido.estado === ESTADOS_PEDIDO.ENVIADO
  );

  // Separar pedidos por estado
  const pedidosPicking = pedidosFiltrados.filter(
    (p) => p.estado === ESTADOS_PEDIDO.PICKING
  );
  const pedidosPacking = pedidosFiltrados.filter(
    (p) => p.estado === ESTADOS_PEDIDO.PACKING
  );
  const pedidosEnviando = pedidosFiltrados.filter(
    (p) => p.estado === ESTADOS_PEDIDO.ENVIADO
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard de Pedidos</h1>
        {/* Botón de actualización manual eliminado, ya que la actualización es automática */}
      </div>
      <div className="flex flex-col gap-10">
        {/* Lista de Picking */}
        <div>
          <h2 className="text-lg font-semibold text-blue-700 mb-3 pl-1">
            En Picking
          </h2>
          <ul className="flex flex-row gap-6">
            {pedidosPicking.length === 0 && !loading && (
              <li className="text-center text-muted-foreground py-8">
                No hay pedidos en picking.
              </li>
            )}
            {pedidosPicking.map((pedido) => (
              <li key={pedido._id}>
                <PedidoMiniCard pedido={pedido} onClick={() => {}} size="lg" />
              </li>
            ))}
          </ul>
        </div>
        {/* Lista de Packing */}
        <div>
          <h2 className="text-lg font-semibold text-indigo-700 mb-3 pl-1">
            En Packing
          </h2>
          <ul className="flex flex-row gap-6">
            {pedidosPacking.length === 0 && !loading && (
              <li className="text-center text-muted-foreground py-8">
                No hay pedidos en packing.
              </li>
            )}
            {pedidosPacking.map((pedido) => (
              <li key={pedido._id}>
                <PedidoMiniCard pedido={pedido} onClick={() => {}} size="lg" />
              </li>
            ))}
          </ul>
        </div>
        {/* Lista de Envío */}
        <div>
          <h2 className="text-lg font-semibold text-yellow-700 mb-3 pl-1">
            En Envío
          </h2>
          <ul className="flex flex-row gap-6">
            {pedidosEnviando.length === 0 && !loading && (
              <li className="text-center text-muted-foreground py-8">
                No hay pedidos en envío.
              </li>
            )}
            {pedidosEnviando.map((pedido) => (
              <li key={pedido._id}>
                <PedidoMiniCard pedido={pedido} onClick={() => {}} size="lg" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PedidosDashboard;
