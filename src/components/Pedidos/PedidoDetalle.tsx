import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePedidoArmado, PedidoArmado, ProductoArmado } from "../hooks/usePedidoArmado";

const PedidoDetalle: React.FC = () => {
  const { id } = useParams();
  const { pedidos, fetchPedidos, actualizarCantidadEncontrada, loading } = usePedidoArmado();
  const [pedidoDetalle, setPedidoDetalle] = useState<PedidoArmado | null>(null);
  const [usuarioArmando, setUsuarioArmando] = useState<string>("");

  useEffect(() => {
    fetchPedidos();
    // Obtener el usuario del localStorage
    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      setUsuarioArmando(usuario);
    }
  }, []);

  useEffect(() => {
    if (id) {
      console.log(pedidos);
      console.log(id);
      const pedidoEncontrado = pedidos.find((pedido) => pedido._id === id);
      setPedidoDetalle(pedidoEncontrado || null);
    }
  }, [id, pedidos]);

  const handleGuardarCambios = async () => {
    try {
      if (!pedidoDetalle) return;
      
      // Crear una copia del pedido sin el campo '_id'
      const { _id, ...pedidoSinId } = pedidoDetalle;
  
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoSinId),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar los cambios del pedido");
      }
  
      const data = await response.json();
      console.log("Pedido actualizado correctamente:", data);
  
      // Actualizar el estado con el pedido actualizado
      setPedidoDetalle(data);
      alert("Cambios guardados correctamente");
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
      alert("Error al guardar los cambios. Intenta nuevamente.");
    }
  };

  const handleArmarPedido = async () => {
    if (!pedidoDetalle) return;

    const confirmacion = window.confirm(
      "¿Estás seguro que deseas marcar este pedido como armado? Esta acción no se puede deshacer."
    );

    if (confirmacion) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar/${pedidoDetalle._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...pedidoDetalle,
            estado: "pedido_armado",
            armado_por: usuarioArmando
          }),
        });

        if (!response.ok) {
          throw new Error("Error al actualizar el estado del pedido");
        }

        const data = await response.json();
        setPedidoDetalle(data);
        alert("Pedido marcado como armado exitosamente");
      } catch (error) {
        console.error("Error al armar el pedido:", error);
        alert("Error al marcar el pedido como armado");
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!pedidoDetalle) return <div>Pedido no encontrado.</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Detalle del Pedido</h1>
      <div>
        <h2 className="text-2xl font-semibold">{pedidoDetalle.cliente}</h2>
        <p className="text-sm text-gray-500">Fecha: {pedidoDetalle.fecha}</p>
        <p className="text-sm text-gray-500">Total: ${pedidoDetalle.total.toFixed(2)}</p>
        <p className="text-sm text-gray-500">Estado: {pedidoDetalle.estado}</p>
        {pedidoDetalle.armado_por && (
          <p className="text-sm text-gray-500">Armado por: {pedidoDetalle.armado_por}</p>
        )}
        <h3 className="mt-4 text-xl font-semibold">Productos</h3>
        <ul className="mt-2 space-y-2">
          {pedidoDetalle.productos.map((producto: ProductoArmado) => (
            <li key={producto.id} className="flex justify-between items-center border-b pb-3">
              <div className="flex-1">
                <span className="block font-semibold">{producto.descripcion}</span>
                <div className="text-sm text-gray-500">Precio: ${producto.precio.toFixed(2)}</div>
                <div className="text-sm text-gray-500">Cantidad pedida: {producto.cantidad_pedida}</div>
              </div>
              <div className="flex-1">
                <label htmlFor={`cantidad-${producto.id}`} className="block text-sm text-gray-600">Cantidad encontrada:</label>
                <input
                  id={`cantidad-${producto.id}`}
                  type="number"
                  value={producto.cantidad_encontrada}
                  onChange={(e) => actualizarCantidadEncontrada(producto.id, parseInt(e.target.value, 10))}
                  className="mt-1 p-2 border border-gray-300 rounded w-full"
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 text-center space-x-4">
          <button
            onClick={handleGuardarCambios}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Guardar Cambios
          </button>
          {pedidoDetalle.estado !== "pedido_armado" && (
            <button
              onClick={handleArmarPedido}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Marcar como Armado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PedidoDetalle;
