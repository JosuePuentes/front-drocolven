import { useEffect, useState } from "react";
import { usePedidoArmado } from "../hooks/usePedidoArmado";


export const PedidosOrganizados = () => {

  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState<string | null>(null);

  const {
    pedido,
    iniciarPedido,
    actualizarCantidadEncontrada,
  } = usePedidoArmado();

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const response = await fetch("http://localhost:8000/obtener_pedidos/");
        const data = await response.json();

        const ventasFiltradas = data.filter((venta: Venta) => venta.estado === "pedido_creado");

        const ventasFormateadas = ventasFiltradas.map((venta: Venta) => ({
          ...venta,
          fecha: venta.fecha.split(" ")[0],
          productos: venta.productos.map((prod: any) => ({
            ...prod,
            precio: parseFloat(prod.precio || "0"),
            precio_n: parseFloat(prod.precio_n || "0"),
            subtotal: parseFloat(prod.subtotal || "0"),
            cantidad: parseInt(prod.cantidad || "0"),
            descuento1: prod.descuento1 || 0,
            descuento2: prod.descuento2 || 0,
            descuento3: prod.descuento3 || 0,
            descuento4: prod.descuento4 || 0,
          })),
        }));

        setVentas(ventasFormateadas);
      } catch (error) {
        console.error("Error al obtener ventas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVentas();
  }, []);

  const fechasDisponibles = [...new Set(ventas.map((venta) => venta.fecha))];
  const clientesDelDia = ventas.filter((v) => v.fecha === fechaSeleccionada);

  const manejarInicioPedido = async (venta: Venta) => {
    try {
      await fetch(`http://localhost:8000/pedidos/actualizar_estado/${venta._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "nuevo_estado": "pedido_armandose" }),
      });

      iniciarPedido(
        venta.cliente,
        venta.rif,
        venta.total,
        venta.fecha,
        venta._id,
        venta.observacion,
        venta.productos.map((p) => ({
          ...p,
          cantidadPedida: p.cantidad,
          cantidadEncontrada: 0,
        }))
      );

      setClienteSeleccionadoId(venta._id);
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
                const correcto = p.cantidadEncontrada === p.cantidadPedida;
                const incompleto = p.cantidadEncontrada < p.cantidadPedida;
                const sobrante = p.cantidadEncontrada > p.cantidadPedida;

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
                    <div className="text-sm text-gray-700">Cantidad pedida: {p.cantidadPedida}</div>
                    <div className="mt-2">
                      <label htmlFor={`cantidad-${p.id}`} className="mr-2 text-gray-600">
                        Cantidad encontrada:
                      </label>
                      <input
                        id={`cantidad-${p.id}`}
                        type="number"
                        min="0"
                        value={p.cantidadEncontrada || ""}
                        onChange={(e) =>
                          actualizarCantidadEncontrada(p.id, parseInt(e.target.value || "0"))
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
            <h2 className="text-2xl font-semibold text-center">Selecciona un día:</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {fechasDisponibles.map((fecha) => (
                <button
                  key={fecha}
                  onClick={() => {
                    setFechaSeleccionada(fecha);
                    setClienteSeleccionadoId(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    fecha === fechaSeleccionada ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {fecha}
                </button>
              ))}
            </div>
          </div>

          {fechaSeleccionada && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-center">Selecciona un cliente:</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {clientesDelDia.map((venta) => (
                  <button
                    key={venta._id}
                    onClick={() => manejarInicioPedido(venta)}
                    className={`px-4 py-2 rounded-lg ${
                      venta._id === clienteSeleccionadoId
                        ? "bg-green-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {venta.cliente}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
