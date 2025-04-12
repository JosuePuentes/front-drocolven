import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";

type Producto = {
  codigo: string;
  descripcion: string;
  dpto: string;
  importado: string;
  laboratorio: string;
  fv: string;
  existencia: number;
  precio: number;
  cantidad: number;
  descuentoPorCantidad: number;
  descuentoLineal: number;
};

type ProductoCarrito = {
  id: string;
  codigo: string;
  descripcion: string;
  precio: number;
  cantidad: number;
  total: number;
};

export default function CarritoCompras() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosCarrito, setProductosCarrito] = useState<ProductoCarrito[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [confirmarCompraVisible, setConfirmarCompraVisible] = useState(false);
  const [observacion, setObservacion] = useState("");

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      setProductosCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(productosCarrito));
  }, [productosCarrito]);

  // Fetch inventario
  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await axios.get("http://localhost:8000/inventario/");
        const data = response.data;
        const claveInventario = Object.keys(data).find((key) => key.startsWith("inventario_"));
        if (claveInventario) setProductos(data[claveInventario]);
      } catch (error) {
        console.error("Error al obtener inventario:", error);
      }
    };

    fetchInventario();
  }, []);

  const mostrarMensaje = (texto: string) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(null), 2000);
  };

  const agregarProducto = (productoBase: Producto) => {
    const cantidadDeseada = cantidades[productoBase.codigo] || 1;

    if (cantidadDeseada > productoBase.existencia) {
      mostrarMensaje("No hay suficiente existencia");
      return;
    }

    setProductosCarrito((prev) => {
      const productoExistente = prev.find((item) => item.id === productoBase.codigo);
      if (productoExistente) {
        const nuevaCantidad = productoExistente.cantidad + cantidadDeseada;
        if (nuevaCantidad > productoBase.existencia) {
          mostrarMensaje("No hay suficiente existencia");
          return prev;
        }
        return prev.map((item) =>
          item.id === productoBase.codigo
            ? {
              ...item,
              cantidad: nuevaCantidad,
              total: nuevaCantidad * item.precio,
            }
            : item
        );
      } else {
        if (productoBase.existencia < 1) {
          mostrarMensaje("Producto sin existencia");
          return prev;
        }
        mostrarMensaje("Producto agregado");
        return [
          ...prev,
          {
            id: productoBase.codigo,
            codigo: productoBase.codigo,
            descripcion: productoBase.descripcion.trim(),
            precio: productoBase.precio,
            cantidad: cantidadDeseada,
            total: cantidadDeseada * productoBase.precio,
          },
        ];
      }
    });
  };

  const eliminarProducto = (id: string) => {
    setProductosCarrito((prev) => prev.filter((producto) => producto.id !== id));
  };

  const actualizarCantidad = (id: string, cantidad: number) => {
    if (isNaN(cantidad) || cantidad < 1) return;
    const producto = productos.find((p) => p.codigo === id);
    if (!producto) return;
    if (cantidad > producto.existencia) {
      mostrarMensaje("Cantidad excede existencia");
      return;
    }
    setProductosCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad, total: cantidad * item.precio } : item
      )
    );
  };

  const calcularTotal = () =>
    productosCarrito.reduce((total, producto) => total + producto.total, 0);

  const toggleModal = () => setModalAbierto(!modalAbierto);

  const productosFiltrados = productos.filter((p) =>
    p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
  );
  const confirmarCompra = () => {
    const datosCompra = {
      fecha: new Date().toISOString(),
      observacion: observacion.trim(),
      productos: productosCarrito,
      total: calcularTotal().toFixed(2),
    };

    const blob = new Blob([JSON.stringify(datosCompra, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compra_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    link.click();
    URL.revokeObjectURL(url);

    // Resetear estados
    setConfirmarCompraVisible(false);
    setModalAbierto(false);
    setProductosCarrito([]);
    setObservacion("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Carrito flotante */}
      <button
        className="fixed top-16 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 z-50 flex items-center gap-2"
        onClick={toggleModal}
      >
        <ShoppingCart className="w-5 h-5" />
        {productosCarrito.length}
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Inventario de Productos</h1>

      {mensaje && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mb-4 text-center">
          {mensaje}
        </div>
      )}

      {/* Input de búsqueda con ícono */}
      <div className="relative mb-6 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="🔍 Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 shadow-sm focus:ring focus:ring-blue-200"
        />
        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full w-[1200px] mx-auto border border-gray-200 bg-white rounded-xl shadow">
          <thead className="bg-blue-100 text-gray-700 text-sm">
            <tr>
              <th className="p-3 border">Código</th>
              <th className="p-3 border">Descripción</th>
              <th className="p-3 border">Existencia</th>
              <th className="p-3 border">Precio</th>
              <th className="p-3 border">Cantidad</th>
              <th className="p-3 border">Agregar</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr
                key={producto.codigo}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="p-3 border text-center">{producto.codigo}</td>
                <td className="p-3 border">{producto.descripcion.trim()}</td>
                <td className="p-3 border text-center">{producto.existencia}</td>
                <td className="p-3 border text-right">${producto.precio.toFixed(2)}</td>
                <td className="p-3 border text-center">
                  <input
                    type="number"
                    min={1}
                    max={producto.existencia}
                    value={cantidades[producto.codigo] || 1}
                    onChange={(e) =>
                      setCantidades({
                        ...cantidades,
                        [producto.codigo]: parseInt(e.target.value),
                      })
                    }
                    className="w-16 border border-gray-300 rounded p-1 text-center"
                  />
                </td>
                <td className="p-3 border text-center">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 text-sm"
                    onClick={() => agregarProducto(producto)}
                  >
                    Agregar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal del carrito (igual al tuyo, solo le aplicamos mejoras visuales también) */}
      {modalAbierto && (
        <div
          className="fixed inset-0 bg-gray-50 bg-opacity-40 flex justify-center items-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🛒 Carrito de Compras</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Código</th>
                    <th className="border p-2">Descripción</th>
                    <th className="border p-2">Cantidad</th>
                    <th className="border p-2">Precio</th>
                    <th className="border p-2">Total</th>
                    <th className="border p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosCarrito.map((producto) => (
                    <tr key={producto.id}>
                      <td className="border p-2 text-center">{producto.codigo}</td>
                      <td className="border p-2">{producto.descripcion}</td>
                      <td className="border p-2 text-center">
                        <input
                          type="number"
                          value={producto.cantidad}
                          min={1}
                          max={
                            productos.find((p) => p.codigo === producto.id)?.existencia || 99
                          }
                          className="w-16 p-1 border border-gray-300 rounded text-center"
                          onChange={(e) =>
                            actualizarCantidad(producto.id, parseInt(e.target.value))
                          }
                        />
                      </td>
                      <td className="border p-2 text-right">${producto.precio.toFixed(2)}</td>
                      <td className="border p-2 text-right">${producto.total.toFixed(2)}</td>
                      <td className="border p-2 text-center">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                          onClick={() => eliminarProducto(producto.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-right text-lg font-semibold text-gray-700">
              Total: ${calcularTotal().toFixed(2)}
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={toggleModal}
              >
                Cerrar
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setConfirmarCompraVisible(true)}
              >
                Comprar
              </button>

            </div>
          </div>
        </div>
      )}
      {confirmarCompraVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setConfirmarCompraVisible(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirmar Compra</h2>

            <textarea
              placeholder="Observación (opcional)"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 mb-4 min-h-[100px]"
            />

            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => setConfirmarCompraVisible(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={confirmarCompra}
              >
                Confirmar Compra
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
