import { useState, useEffect, useRef, useMemo } from "react";
import { animate } from "animejs";
import { useCarrito } from "../hooks/useCarrito";
import { useProductos } from "../hooks/useProductos";
import { useClientes } from "../hooks/useClientes";
import { ProductoItem } from "./ClientProductoItem";
import { ResumenCarrito } from "../carrito/ResumenCarrito"; // Asumiendo que es el componente mejorado del carrito.
import { OrdenesGuardadas } from "./OrdenesGuardadas"; // Importar OrdenesGuardadas

// Importar iconos para el botón flotante y el botón de cerrar del modal
import { AiOutlineShoppingCart, AiOutlineClose, AiOutlineSearch } from "react-icons/ai";

// Función de utilidad para filtrado (se mantiene igual)
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
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalOrdenesAbierto, setModalOrdenesAbierto] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null); // Referencia para animar el overlay

  const { clienteSeleccionado, seleccionarCliente } = useClientes();
  const { productos, loading: productosLoading } = useProductos(); // Asumiendo que useProductos tiene un estado de carga
  const { carrito, agregarProducto, eliminarProducto, limpiarCarrito } = useCarrito();

  // Animación de aparición/desaparición del modal y su overlay
  useEffect(() => {
    if (modalAbierto) {
      document.body.style.overflow = 'hidden'; // Evita el scroll del body
      if (overlayRef.current) {
        animate(overlayRef.current, {
          opacity: [0, 1],
          duration: 200,
          easing: "easeOutQuad",
        });
      }
      if (modalRef.current) {
        animate(modalRef.current, {
          opacity: [0, 1],
          translateY: [50, 0], // Sutil desplazamiento desde abajo
          scale: [0.95, 1], // Un poco de zoom
          duration: 400,
          easing: "easeOutBack", // Un easing más dinámico
        });
      }
    } else {
      // Solo anima la salida si el modal estaba visible
      if (modalRef.current) {
        animate(modalRef.current, {
          opacity: [1, 0],
          translateY: [0, 50],
          scale: [1, 0.95],
          duration: 300,
          easing: "easeInQuad",
        }).then(() => {
          document.body.style.overflow = ''; // Restore body scroll
        });
      }
      if (overlayRef.current) {
        animate(overlayRef.current, {
          opacity: [1, 0],
          duration: 250,
          easing: "easeInQuad",
        });
      }
    }
  }, [modalAbierto]);

  // Cerrar modal al presionar ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalAbierto(false);
    };
    if (modalAbierto) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [modalAbierto]);

  // Recuperar usuario desde localStorage y seleccionar cliente SOLO si no hay cliente seleccionado
  useEffect(() => {
    if (!clienteSeleccionado) {
      try {
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
          const usuario = JSON.parse(usuarioStr);
          if (usuario?.name) {
            seleccionarCliente(usuario.name);
          }
        }
      } catch (error) {
        console.error("Error al leer usuario desde localStorage:", error);
      }
    }
  }, [clienteSeleccionado, seleccionarCliente]);

  const productosFiltrados = useMemo(
    () => filtrarPorMultiplesPalabrasAND(productos, busqueda, ["descripcion", "id"]), // Búsqueda por ID también
    [productos, busqueda]
  );

  // Handler para cargar una orden guardada al carrito usando el hook useCarrito
  const handleSeleccionarOrdenGuardada = (productosOrden: any[]) => {
    limpiarCarrito();
    productosOrden.forEach((prodGuardado) => {
      const prodCatalogo = productos.find((p) => p.id === prodGuardado.id);
      const productoCompleto = prodCatalogo ? { ...prodCatalogo, ...prodGuardado } : prodGuardado;
      agregarProducto(productoCompleto);
    });
    setModalOrdenesAbierto(false);
    alert("Orden cargada en el carrito actual.");
  };

  if (!clienteSeleccionado) {
    return <div>Por favor, selecciona un cliente.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Título de la Página */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-6">
          Realiza tu Compra
        </h1>

        {/* Sección de Cliente No Seleccionado */}
        {!clienteSeleccionado ? (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-lg shadow-sm">
            <p className="font-semibold text-lg">
              ¡Bienvenido!
            </p>
            <p className="mt-1">
              Para empezar a ver y agregar productos, por favor,{" "}
              **selecciona un cliente**. Si ya iniciaste sesión, debería cargarse automáticamente.
            </p>
          </div>
        ) : (
          <>
            {/* Barra de Búsqueda */}
            <div className="relative mb-6 animate__animated animate__fadeInDown animate__fast">
              <input
                type="text"
                placeholder="Buscar productos por descripción o código..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-gray-700 text-base"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar producto"
              />
              <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Lista de Productos */}
            {productosLoading ? (
              <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
                Cargando productos...
              </div>
            ) : productosFiltrados.length === 0 ? (
              <p className="text-gray-500 text-center py-10 bg-white rounded-xl shadow-sm">
                No se encontraron productos que coincidan con la búsqueda.
              </p>
            ) : (
              <div className="grid gap-4 sm:gap-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                {productosFiltrados.map((producto) => (
                  <ProductoItem
                    key={producto.id}
                    producto={producto}
                    onAgregar={(prod, cantidad) => {
                      agregarProducto({
                        ...prod,
                        cantidad_pedida: cantidad,
                        precio_n: prod.precio_n ?? 0,
                        cantidad_encontrada: 0, // Valor por defecto requerido por Producto
                      });
                    }}
                    descuentoCliente1={Number(clienteSeleccionado?.descuento1) || 0}
                    descuentoCliente2={Number(clienteSeleccionado?.descuento2) || 0}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Botón Flotante para Abrir el Carrito */}
        <button
          className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 active:scale-95 animate__animated animate__bounceIn"
          onClick={() => setModalAbierto(true)}
          aria-label={`Ver Carrito con ${carrito.length} productos`}
        >
          <AiOutlineShoppingCart className="w-7 h-7" />
          {carrito.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center -mt-1 -mr-1 border-2 border-white">
              {carrito.length}
            </span>
          )}
        </button>
        {/* Botón para abrir el modal de Órdenes Guardadas */}
        <button
          className="fixed bottom-6 left-6 z-40 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
          onClick={() => setModalOrdenesAbierto(true)}
          aria-label="Ver Órdenes Guardadas"
        >
          <AiOutlineShoppingCart className="w-6 h-6" />
          <span className="hidden sm:inline text-sm font-medium">Órdenes Guardadas</span>
        </button>

        {/* Modal del Carrito */}
        {modalAbierto && (
          <div
            ref={overlayRef}
            className="fixed inset-0 z-50 bg-white bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4"
            onClick={(e) => {
              if (overlayRef.current && e.target === overlayRef.current) {
                setModalAbierto(false);
              }
            }}
          >
            <div
              ref={modalRef}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-0 sm:p-0 transition-all duration-300"
            >
              <div className="p-8 sm:p-10">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                  aria-label="Cerrar carrito"
                >
                  <AiOutlineClose className="w-7 h-7" />
                </button>

                <ResumenCarrito
                  carrito={carrito}
                  onEliminar={eliminarProducto}
                  cliente={clienteSeleccionado}
                  onTotalizar={() => {
                    limpiarCarrito();
                    setModalAbierto(false); // Aquí puedes añadir una notificación de éxito (toast)
                  }}
                  onLoadOrder={() => {}}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal de Órdenes Guardadas */}
        {modalOrdenesAbierto && (
          <div
            className="fixed inset-0 z-50 bg-white bg-opacity-60 backdrop-blur-sm flex justify-center items-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setModalOrdenesAbierto(false);
              }
            }}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-6"
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                onClick={() => setModalOrdenesAbierto(false)}
                aria-label="Cerrar"
              >
                <AiOutlineClose className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold mb-4">Órdenes Guardadas</h2>
              <OrdenesGuardadas onSelectOrder={handleSeleccionarOrdenGuardada} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ShoppingCartClient = CarritoComprasCliente;