import { useEffect, useState } from "react";

interface ResultadoProducto {
  id: string;
  descripcion: string;
  cantidadPedida: number;
  cantidadEncontrada: number;
  estado: "completo" | "incompleto" | "sobrante";
}

interface PedidoGuardado {
  fecha: string;
  cliente: string;
  productos: ResultadoProducto[];
}

export const PedidosGuardados = () => {
  const [pedidos, setPedidos] = useState<PedidoGuardado[]>([]);

  useEffect(() => {
    const pedidosGuardados = localStorage.getItem("pedidos_guardados");
    if (pedidosGuardados) {
      setPedidos(JSON.parse(pedidosGuardados));
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Pedidos Guardados</h1>

      {/* Mostrar los pedidos guardados */}
      {pedidos.length === 0 ? (
        <p className="text-center text-gray-500">No hay pedidos guardados en LocalStorage.</p>
      ) : (
        pedidos.map((pedido, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md space-y-4">
            <div className="text-lg font-semibold">Pedido para {pedido.cliente}</div>
            <div className="text-sm text-gray-500">Fecha: {pedido.fecha}</div>

            {/* Listar los productos del pedido */}
            <div className="mt-4">
              <h3 className="font-semibold">Productos:</h3>
              <ul className="space-y-2">
                {pedido.productos.map((producto, index) => (
                  <li
                    key={index}
                    className={`p-2 rounded-md ${
                      producto.estado === "completo"
                        ? "bg-green-100"
                        : producto.estado === "incompleto"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <div className="font-semibold text-gray-800">{producto.descripcion}</div>
                    <div className="text-sm text-gray-600">
                      Cantidad pedida: {producto.cantidadPedida}
                    </div>
                    <div className="text-sm text-gray-600">
                      Cantidad encontrada: {producto.cantidadEncontrada}
                    </div>
                    <div className="text-sm text-gray-600">
                      Estado: <span className="font-semibold">{producto.estado}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
