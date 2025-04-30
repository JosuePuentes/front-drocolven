import { useState, useMemo } from "react";
import { Producto } from "../hooks/useCarrito";
import { ClienteDetalle } from "../hooks/useClientes";

type Props = {
  carrito: Producto[];
  onEliminar: (id: string) => void;
  cliente: ClienteDetalle | null;
};

export const ResumenCarrito = ({ carrito, onEliminar, cliente }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [observacion, setObservacion] = useState("");
  
  // Calcular subtotales y total con precisión de 4 decimales
  const total = useMemo(() => {
    return carrito.reduce((acc, prod) => {
      const precioNeto = parseFloat((prod.precio_n ?? 0).toFixed(4));
      return acc + parseFloat((precioNeto * prod.cantidad_pedida).toFixed(4));
    }, 0);
  }, [carrito]);

  const subtotal = useMemo(() => {
    return carrito.reduce((acc, prod) => {
      const precio = parseFloat(prod.precio.toFixed(4));
      return acc + parseFloat((precio * prod.cantidad_pedida).toFixed(4));
    }, 0);
  }, [carrito]);

  const enviarResumen = async () => {
    
    const resumen = {
      cliente: cliente?.encargado || "Cliente no seleccionado",
      rif: cliente?.rif || "RIF no seleccionado",
      observacion,
      total: parseFloat(total.toFixed(2)), // 2 decimales para el total final
      estado: "pedido_creado", // Añadir el estado al documento
      subtotal: parseFloat(subtotal.toFixed(2)), // 4 decimales para el subtotal
      productos: carrito.map((prod: Producto) => {
        const precio = parseFloat(prod.precio.toFixed(4));
        const precio_n = parseFloat((prod.precio_n ?? 0).toFixed(4));
        const subtotal = parseFloat((precio * prod.cantidad_pedida).toFixed(4));
        const total_Neto = parseFloat((precio_n * prod.cantidad_pedida).toFixed(4));
        return {
          id: prod.id,
          descripcion: prod.descripcion,
          precio,
          descuento1: parseFloat(prod.descuento1.toFixed(4)),
          descuento2: parseFloat(prod.descuento2.toFixed(4)),
          descuento3: parseFloat(prod.descuento3.toFixed(4)),
          descuento4: parseFloat(prod.descuento4.toFixed(4)),
          precio_n: parseFloat(precio_n.toFixed(4)),
          total_Neto,
          subtotal,
          cantidad_pedida: prod.cantidad_pedida,
        };
      }),
    };

    console.log("Resumen del pedido:", resumen);

    try {
      const response = await fetch("http://localhost:8000/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumen),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Pedido registrada:", data);
        alert("Pedido registrada exitosamente");
      } else {
        const errorData = await response.json();
        console.error("Error al registrar el pedido:", errorData);
        alert("Error al registrar el pedido");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red al registrar el pedido");
    }
  };

  return (
    <div className="bg-gray-100 p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-bold">PEDIDO</h2>

      {carrito.length === 0 ? (
        <p className="text-gray-500">No hay productos agregados.</p>
      ) : (
        carrito.map((producto) => (
          <div key={producto.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-semibold">{producto.descripcion}</p>
              <p className="text-sm text-gray-600">Precio: ${producto.precio.toFixed(4)}</p>
              <div className="flex flex-row gap-1 text-sm text-gray-600">
                {producto.descuento1 > 0 && <p className="pr-1 border-r-2">Dto. 1: {producto.descuento1}%</p>}
                {producto.descuento2 > 0 && <p className="pr-1 border-r-2">Dto. 2: {producto.descuento2}%</p>}
                {producto.descuento3 > 0 && <p className="pr-1 border-r-2">Dto. 3: {producto.descuento3}%</p>}
                {producto.descuento4 > 0 && <p className="pr-1 border-r-2">Dto. 4: {producto.descuento4}%</p>}
              </div>
              <div className="flex flex-row gap-1 text-sm text-gray-600">
                <p className="pr-1 border-r-2">
                  Precio Neto: ${parseFloat((producto.precio_n ?? 0).toFixed(4))}
                </p>
                <p className="text-blue-600">Cantidad: {producto.cantidad_pedida}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => onEliminar(producto.id)}>Eliminar</button>
            </div>
          </div>
        ))
      )}

      <div className="text-right font-bold text-lg">
        Total: ${total.toFixed(2)}
      </div>

      {carrito.length > 0 && (
        <div className="text-right">
          <button
            onClick={() => setModalVisible(true)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Totalizar Pedido
          </button>
        </div>
      )}

      {modalVisible && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white border border-black p-6 rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setModalVisible(false)}
              className="absolute top-2 right-4 text-red-600 text-xl"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">Observación para el pedido</h3>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="w-full border p-2 rounded-xl mb-4"
              rows={4}
              placeholder="Escribe aquí tu observación..."
            />
            <div className="text-right">
              <button
                onClick={enviarResumen}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
