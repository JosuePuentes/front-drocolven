import { usePedidoArmado } from "../hooks/usePedidoArmado";

export const PedidosOrganizados = () => {
  const {
    pedido,
    actualizarCantidadEncontrada
  } = usePedidoArmado();

  const totalizarPedido = async () => {
    if (!pedido) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_estado/${pedido._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevo_estado: "pedido_armado" }),
      });

      alert("Pedido totalizado exitosamente.");
    } catch (error) {
      console.error("Error al totalizar el pedido:", error);
      alert("Error al totalizar el pedido.");
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Preparar Pedidos</h1>

      {pedido ? (
        <>
          <h2 className="text-2xl font-semibold text-center">Pedido de {pedido.cliente}</h2>

          <div className="mt-6 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
            <ul className="space-y-3">
              {pedido.productos.map((p) => {
                const correcto = p.cantidad_encontrada === p.cantidad_pedida;
                const incompleto = p.cantidad_encontrada < p.cantidad_pedida;
                const sobrante = p.cantidad_encontrada > p.cantidad_pedida;

                const bgColor = correcto
                  ? "bg-green-100 border-green-300"
                  : incompleto
                    ? "bg-red-100 border-red-300"
                    : sobrante
                      ? "bg-yellow-100 border-yellow-300"
                      : "bg-white";

                return (
                  <li key={p.id} className={`border ${bgColor} rounded-lg p-4`}>
                    <div className="font-semibold">
                      {p.descripcion} (Código: {p.id})
                    </div>
                    <div className="text-sm text-gray-700">
                      Precio: ${p.precio.toFixed(2)} | Subtotal: ${p.subtotal.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-700">Cantidad pedida: {p.cantidad_pedida}</div>
                    <div className="mt-2">
                      <label htmlFor={`cantidad-${p.id}`} className="mr-2 text-gray-600">
                        Cantidad encontrada:
                      </label>
                      <input
                        id={`cantidad-${p.id}`}
                        type="number"
                        min="0"
                        value={p.cantidad_encontrada || ""}
                        onChange={(e) =>
                          actualizarCantidadEncontrada(p.id, Number(e.target.value || "0"))
                        }
                        className="w-20 p-2 border rounded-lg text-center"
                        aria-label={`Cantidad encontrada para ${p.descripcion}`}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-wrap justify-end gap-4 mt-6">
            <button
              onClick={totalizarPedido}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Totalizar Pedido
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg">No hay pedidos para mostrar.</p>
        </div>
      )}
    </div>
  );
};
