import { useEffect, useState } from "react";
import { usePedidoArmado, PedidoArmado } from "../hooks/usePedidoArmado";

export const PedidosOrganizados = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState<string | null>(null);

  const {
    pedido,
    iniciarPedido,
    actualizarCantidadEncontrada,
    ventas,
    loading,
    fetchVentas
  } = usePedidoArmado();

  useEffect(() => {
    fetchVentas();
  }, []);

  const fechasDisponibles = [...new Set(ventas.map((venta) => venta.fecha))];
  const clientesDelDia = ventas.filter((v) => v.fecha === fechaSeleccionada);

  const manejarInicioPedido = async (pedido: PedidoArmado) => {
    try {
      await fetch(`http://localhost:8000/pedidos/actualizar_estado/${pedido._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "nuevo_estado": "pedido_creado" }),
      });

      iniciarPedido(
        pedido.cliente,
        pedido.rif,
        pedido.total,
        pedido.fecha || new Date().toISOString().split('T')[0],
        pedido.observacion,
        pedido._id,
        pedido.productos.map((p) => ({
          ...p,
          cantidad_encontrada: 0,
        })),
        "pedido_armandose"
      );

      setClienteSeleccionadoId(pedido._id);
    } catch (error) {
      console.error("Error al iniciar armado de pedido:", error);
      alert("No se pudo iniciar el armado del pedido.");
    }
  };

  const totalizarPedido = async () => {
    if (!pedido) return;

    try {
      await fetch(`http://localhost:8000/pedidos/actualizar_estado/${pedido._id}`, {
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

  if (loading) return <div className="text-center p-6">Cargando pedidos...</div>;

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
        <>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Selecciona un día y cliente:</h2>

            {/* Contenedor de tarjetas para seleccionar la fecha */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {fechasDisponibles.map((fecha) => (
                <div
                  key={fecha}
                  className={`p-4 border rounded-lg text-center cursor-pointer transition-colors 
                    ${fecha === fechaSeleccionada ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  onClick={() => {
                    setFechaSeleccionada(fecha);
                    setClienteSeleccionadoId(null);
                  }}
                >
                  {fecha}
                </div>
              ))}
            </div>
          </div>

          {fechaSeleccionada && (
            <div className="space-y-4 mt-6">
              <h2 className="text-2xl font-semibold text-center">Selecciona un cliente:</h2>

              {/* Contenedor de tarjetas para seleccionar el cliente */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {clientesDelDia.map((venta) => (
                  <div
                    key={venta._id}
                    className={`p-4 border rounded-lg text-center cursor-pointer transition-colors
                      ${venta._id === clienteSeleccionadoId ? "bg-green-600 text-white" : "bg-gray-200"}`}
                    onClick={() => manejarInicioPedido(venta)}
                  >
                    {venta.cliente}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
