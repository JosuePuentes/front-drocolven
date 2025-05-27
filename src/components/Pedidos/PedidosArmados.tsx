import { useEffect, useState } from "react";

interface PedidoArmado {
  _id: string;
  cliente: string;
  fecha: string;
  total: number;
  estado: string;
  armado_por: string;
  productos: Array<{
    id: string;
    descripcion: string;
    cantidad_pedida: number;
    cantidad_encontrada: number;
    precio: number;
  }>;
}

const PedidosArmados: React.FC = () => {
  const [pedidosArmados, setPedidosArmados] = useState<PedidoArmado[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("Usuario:", localStorage);

  useEffect(() => {
    const fetchPedidosArmados = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/obtener_pedidos/`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los pedidos");
        }
        const data = await response.json();
        const pedidosFiltrados = data.filter(
          (pedido: PedidoArmado) => pedido.estado === "pedido_armado"
        );
        setPedidosArmados(pedidosFiltrados);
      } catch (error) {
        console.error("Error al cargar pedidos armados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidosArmados();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Cargando pedidos armados...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Pedidos Armados</h1>
      
      {pedidosArmados.length === 0 ? (
        <div className="text-center text-gray-500">
          No hay pedidos armados para mostrar
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pedidosArmados.map((pedido) => (
            <div
              key={pedido._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {pedido.cliente}
                </h2>
                <p className="text-sm text-gray-500">
                  Fecha: {new Date(pedido.fecha).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Armado por: {pedido.armado_por}
                </p>
                <p className="text-lg font-semibold text-green-600 mt-2">
                  Total: ${pedido.total.toFixed(2)}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Productos:</h3>
                <ul className="space-y-2">
                  {pedido.productos.map((producto) => (
                    <li
                      key={producto.id}
                      className="text-sm border-b pb-2 last:border-b-0"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{producto.descripcion}</span>
                        <span className="text-gray-600">
                          {producto.cantidad_encontrada}/{producto.cantidad_pedida}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        ${producto.precio.toFixed(2)} c/u
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PedidosArmados;