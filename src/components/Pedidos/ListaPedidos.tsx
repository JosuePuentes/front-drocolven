import { useEffect, useState } from "react";
import { usePedidoArmado} from "../hooks/usePedidoArmado";

const estadosDisponibles = [
  "pedido_creado",
  "pedido_armandose",
  "pedido_armado",
  "pedido_enviado",
  "pedido_entregado",
  "pedido_cancelado",
  "todos", // Opción para ver todos los estados
];

export const ListaPedidos = () => {
  const {
    pedidos,
    setPedidos,
    actualizarEstadoPedido,
    manejarInicioPedido,
    loading,
    setLoading,
  } = usePedidoArmado();

  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");
  const [fechaFiltro, setFechaFiltro] = useState<string>(""); // Filtro de fecha (si es necesario)
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/obtener_pedidos/");
      const data: PedidoArmado[] = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      setError("No se pudieron cargar los pedidos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleEstadoChange = async (pedido: PedidoArmado, nuevoEstado: string) => {
    try {
      await actualizarEstadoPedido(pedido._id, nuevoEstado);
      setPedidos((prev) =>
        prev.map((p) => (p._id === pedido._id ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (error) {
      console.error("Error al actualizar estado:", error);
    }
  };

  const handleIniciarPedido = (pedido: PedidoArmado) => {
    manejarInicioPedido(pedido);
  };

  const handleFiltroEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEstadoFiltro(e.target.value);
  };

  const handleFiltroFechaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaFiltro(e.target.value);
  };

  const filtrarPedidos = () => {
    return pedidos.filter((pedido) => {
      // Filtrar por estado
      const estadoMatch = estadoFiltro === "todos" || pedido.estado === estadoFiltro;
      // Filtrar por fecha (si se especifica)
      const fechaMatch = fechaFiltro ? pedido.fecha === fechaFiltro : true;
      return estadoMatch && fechaMatch;
    });
  };

  const pedidosFiltrados = filtrarPedidos();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Pedidos</h2>

      {/* Filtro de estado */}
      <div className="mb-4">
        <label htmlFor="estadoFiltro" className="mr-2">Filtrar por estado:</label>
        <select
          id="estadoFiltro"
          value={estadoFiltro}
          onChange={handleFiltroEstadoChange}
          className="border rounded px-2 py-1"
        >
          {estadosDisponibles.map((estado) => (
            <option key={estado} value={estado}>
              {estado === "todos" ? "Todos los estados" : estado}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de fecha (opcional) */}
      <div className="mb-4">
        <label htmlFor="fechaFiltro" className="mr-2">Filtrar por fecha:</label>
        <input
          type="date"
          id="fechaFiltro"
          value={fechaFiltro}
          onChange={handleFiltroFechaChange}
          className="border rounded px-2 py-1"
        />
      </div>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : pedidosFiltrados.length === 0 ? (
        <p>No hay pedidos en el estado seleccionado.</p>
      ) : (
        <div className="grid gap-4">
          {pedidosFiltrados.map((pedido) => (
            <div
              key={pedido._id}
              className="p-4 border rounded-lg shadow-md bg-white space-y-2"
            >
              <div>
                <strong>Cliente:</strong> {pedido.cliente}
              </div>
              <div>
                <strong>RIF:</strong> {pedido.rif}
              </div>
              <div>
                <strong>Total:</strong> ${pedido.total}
              </div>
              <div>
                <strong>Estado actual:</strong> {pedido.estado}
              </div>

              <select
                value={pedido.estado}
                onChange={(e) => handleEstadoChange(pedido, e.target.value)}
                className="border rounded px-2 py-1"
              >
                {estadosDisponibles.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>

              <button
                onClick={() => handleIniciarPedido(pedido)}
                className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Iniciar Armado
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
