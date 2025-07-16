import { useEffect } from 'react';
import { usePedido, ESTADOS_PEDIDO } from '../../components/hooks/usePedido';
import PedidoMiniCard from '../../components/Pedidos/PedidoMiniCard';
import PedidoNuevoCard from '../../components/Pedidos/PedidoNuevoCard';

const PedidosDashboard: React.FC = () => {
  const { pedidos, fetchPedidos, loading } = usePedido();

  useEffect(() => {
    fetchPedidos();
    const interval = setInterval(() => {
      fetchPedidos();
    }, 20000); // Actualiza cada 20 segundos (20,000 ms)
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard de Pedidos</h1>
        {/* Botón de actualización manual eliminado, ya que la actualización es automática */}
      </div>
      <div className="flex flex-col gap-10">
        {/* Lista de Nuevos */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3 pl-1">
            Nuevos
          </h2>
          <ul className="flex flex-row gap-6">
            {pedidosNuevos.length === 0 && !loading && (
              <li className="text-center text-muted-foreground py-8">
                No hay pedidos nuevos.
              </li>
            )}
            {pedidosNuevos.map((pedido) => (
              <li key={pedido._id}>
                <PedidoNuevoCard pedido={pedido} onClick={() => {}} />
              </li>
            ))}
          </ul>
        </div>
        {/* Lista de Facturación */}
        <div>
          <h2 className="text-lg font-semibold text-green-700 mb-3 pl-1">
            En Facturación
          </h2>
          <ul className="flex flex-row gap-6">
            {pedidosFacturacion.length === 0 && !loading && (
              <li className="text-center text-muted-foreground py-8">
                No hay pedidos en facturación.
              </li>
            )}
            {pedidosFacturacion.map((pedido) => (
              <li key={pedido._id}>
                <PedidoMiniCard pedido={pedido} onClick={() => {}} size="lg" />
              </li>
            ))}
          </ul>
        </div>
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
