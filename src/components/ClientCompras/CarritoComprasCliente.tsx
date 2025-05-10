// src/pages/CarritoCompras.tsx
import { useEffect, useMemo, useState } from "react";
import { useCarrito } from "../hooks/useCarrito";
import { useProductos } from "../hooks/useProductos";
import { useClientes } from "../hooks/useClientes";
import { ProductoItem } from "./ClientProductoItem";
import { ResumenCarrito } from "./ClientResumenCarrito";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

function filtrarPorMultiplesPalabrasAND<T>(
  data: T[],
  textoBusqueda: string,
  campos: (keyof T)[]
): T[] {
  const palabras = textoBusqueda.toLowerCase().split(" ").filter(Boolean);
  return data.filter((item) =>
    palabras.every((palabra) =>
      campos.some((campo) =>
        String(item[campo]).toLowerCase().includes(palabra)
      )
    )
  );
}

export const CarritoComprasCliente = () => {
  const isMobile = useIsMobile();
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  const { clienteSeleccionado, seleccionarCliente } = useClientes();
  const { productos } = useProductos();
  const { carrito, agregarProducto, eliminarProducto, limpiarCarrito } = useCarrito();

  // Recuperar usuario desde localStorage y seleccionar cliente
  useEffect(() => {
    try {
      const usuarioStr = localStorage.getItem('usuario');
      console.log("Usuario:", usuarioStr);
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        if (usuario?.name) {
          seleccionarCliente(usuario.name);
        }
      }
    } catch (error) {
      console.error("Error al leer usuario desde localStorage:", error);
    }
  }, []);

  const productosFiltrados = useMemo(
    () => filtrarPorMultiplesPalabrasAND(productos, busqueda, ["descripcion"]),
    [productos, busqueda]
  );

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative mt-12 px-3">
      {/* Lista de productos */}
      <div className="md:col-span-2 grid gap-4">
        <h1 className="text-2xl font-bold mb-4">Lista de productos</h1>

        {clienteSeleccionado ? (
          <>
            <input
              type="text"
              placeholder="Buscar producto..."
              className="p-2 border rounded-xl shadow w-full"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto">
              {productosFiltrados.map((producto) => (
                <ProductoItem
                  key={producto.id}
                  producto={producto}
                  onAgregar={agregarProducto}
                  descuentoCliente1={Number(clienteSeleccionado.descuento1) || 0}
                  descuentoCliente2={Number(clienteSeleccionado.descuento2) || 0}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Seleccione un cliente para ver los productos.</p>
        )}
      </div>

      {/* Resumen del carrito */}
      {isMobile ? (
        <>
          <button
            className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
            onClick={() => setModalAbierto(true)}
          >
            Ver Carrito ({carrito.length})
          </button>

          {modalAbierto && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white w-11/12 max-h-[80vh] overflow-y-auto rounded-2xl p-4 shadow-xl relative">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="absolute top-2 right-4 text-red-600 text-xl"
                >
                  &times;
                </button>

                <ResumenCarrito
                  carrito={carrito}
                  onEliminar={eliminarProducto}
                  cliente={clienteSeleccionado}
                />

                <div className="mt-4 text-right">
                  <button
                    onClick={() => {
                      limpiarCarrito();
                      setModalAbierto(false);
                    }}
                    className="text-red-600"
                  >
                    Limpiar Carrito
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="max-h-[80vh] overflow-y-auto">
          <ResumenCarrito
            carrito={carrito}
            onEliminar={eliminarProducto}
            cliente={clienteSeleccionado}
          />
        </div>
      )}

      {/* Botón limpiar carrito en escritorio */}
      {!isMobile && carrito.length > 0 && (
        <div className="md:col-span-3 flex justify-end">
          <button onClick={limpiarCarrito} className="text-red-600">
            Limpiar Carrito
          </button>
        </div>
      )}
    </div>
  );
};
