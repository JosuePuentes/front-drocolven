import { useState, useEffect, useRef, useMemo } from "react";
import { animate } from "animejs";
import { useCarrito } from "../hooks/useCarrito";
import { useProductos } from "../hooks/useProductos";
import { useClientes } from "../hooks/useClientes";
import { ProductoItem } from "./ClientProductoItem";
import { ResumenCarrito } from "../carrito/ResumenCarrito";
import { OrdenesGuardadas } from "./OrdenesGuardadas";

// Importar iconos
import { AiOutlineShoppingCart, AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { MdOutlineSaveAlt } from "react-icons/md"; // Nuevo icono para órdenes guardadas

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
    const { productos, loading: productosLoading } = useProductos();
    const { carrito, agregarProducto, eliminarProducto, limpiarCarrito } = useCarrito();

    // Animación de aparición/desaparición del modal y su overlay
    useEffect(() => {
        if (modalAbierto || modalOrdenesAbierto) {
            document.body.style.overflow = 'hidden'; // Evita el scroll del body
            const currentOverlayRef = overlayRef.current;
            const currentModalRef = modalRef.current;

            if (currentOverlayRef) {
                animate(currentOverlayRef, {
                    opacity: [0, 1],
                    duration: 200,
                    easing: "easeOutQuad",
                });
            }
            if (currentModalRef) {
                animate(currentModalRef, {
                    opacity: [0, 1],
                    translateY: [50, 0],
                    scale: [0.95, 1],
                    duration: 400,
                    easing: "easeOutBack",
                });
            }
        } else {
            const currentOverlayRef = overlayRef.current;
            const currentModalRef = modalRef.current;

            if (currentModalRef) {
                animate(currentModalRef, {
                    opacity: [1, 0],
                    translateY: [0, 50],
                    scale: [1, 0.95],
                    duration: 300,
                    easing: "easeInQuad",
                }).then(() => {
                    document.body.style.overflow = ''; // Restaura el scroll del body
                });
            }
            if (currentOverlayRef) {
                animate(currentOverlayRef, {
                    opacity: [1, 0],
                    duration: 250,
                    easing: "easeInQuad",
                });
            }
        }
    }, [modalAbierto, modalOrdenesAbierto]); // Dependencia para ambos modales

    // Cerrar modal al presionar ESC
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setModalAbierto(false);
                setModalOrdenesAbierto(false);
            }
        };
        if (modalAbierto || modalOrdenesAbierto) {
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [modalAbierto, modalOrdenesAbierto]);

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
        () => filtrarPorMultiplesPalabrasAND(productos, busqueda, ["descripcion", "id"]),
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
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-6 rounded-lg shadow-md text-center">
                    <p className="font-semibold text-xl mb-2">
                        ¡Bienvenido!
                    </p>
                    <p className="text-base">
                        Para empezar a ver y agregar productos, por favor,{" "}
                        <strong className="text-blue-900">selecciona un cliente</strong>.
                        Si ya iniciaste sesión, debería cargarse automáticamente.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Título de la Página */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-8 tracking-tight">
                    Realiza tu <span className="text-blue-600">Compra</span>
                </h1>

                {/* Barra de Búsqueda */}
                <div className="relative mb-8 shadow-lg rounded-xl overflow-hidden">
                    <input
                        type="text"
                        placeholder="Buscar productos por descripción o código..."
                        className="w-full pl-12 pr-4 py-3 sm:py-3.5 border-none focus:ring-4 focus:ring-blue-400 focus:outline-none transition-all text-gray-700 text-base sm:text-lg bg-white"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        aria-label="Buscar producto"
                    />
                    <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                </div>

                {/* Lista de Productos */}
                {productosLoading ? (
                    <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
                        Cargando productos...
                    </div>
                ) : productosFiltrados.length === 0 ? (
                    <p className="text-gray-600 text-center py-12 bg-white rounded-xl shadow-md text-lg">
                        No se encontraron productos que coincidan con la búsqueda.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-h-[calc(100vh-280px)] md:max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
                        {productosFiltrados.map((producto) => (
                            <ProductoItem
                                key={producto.id}
                                producto={producto}
                                onAgregar={(prod, cantidad) => {
                                    agregarProducto({
                                        ...prod,
                                        cantidad_pedida: cantidad,
                                        precio_n: prod.precio_n ?? 0,
                                        cantidad_encontrada: 0,
                                    });
                                }}
                                descuentoCliente1={Number(clienteSeleccionado?.descuento1) || 0}
                                descuentoCliente2={Number(clienteSeleccionado?.descuento2) || 0}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Botones Flotantes */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-4">
                {/* Botón Flotante para Abrir el Carrito */}
                <button
                    className="relative bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 animate__animated animate__bounceIn"
                    onClick={() => setModalAbierto(true)}
                    aria-label={`Ver Carrito con ${carrito.length} productos`}
                >
                    <AiOutlineShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
                    {carrito.length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center -mt-1 -mr-1 border-2 border-white animate-pulse">
                            {carrito.length}
                        </span>
                    )}
                </button>
                {/* Botón para abrir el modal de Órdenes Guardadas */}
                <button
                    className="flex items-center gap-2 bg-gray-800 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-600 animate__animated animate__bounceIn"
                    onClick={() => setModalOrdenesAbierto(true)}
                    aria-label="Ver Órdenes Guardadas"
                >
                    <MdOutlineSaveAlt className="w-6 h-6 sm:w-7 sm:h-7" />
                    <span className="hidden sm:inline text-sm font-medium">Órdenes</span>
                </button>
            </div>

            {/* Overlay para ambos modales (mejorado) */}
            {(modalAbierto || modalOrdenesAbierto) && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center p-4 transition-opacity duration-300"
                    onClick={(e) => {
                        if (e.target === overlayRef.current) {
                            setModalAbierto(false);
                            setModalOrdenesAbierto(false);
                        }
                    }}
                >
                    {/* Modal del Carrito */}
                    {modalAbierto && (
                        <div
                            ref={modalRef} // Usa modalRef para el carrito
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-95 opacity-0"
                            style={{ opacity: 0 }} // Estado inicial para la animación
                        >
                            <div className="p-6 sm:p-8 md:p-10">
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
                                        setModalAbierto(false);
                                        // Aquí puedes añadir una notificación de éxito (toast)
                                    }}
                                    onLoadOrder={() => {}}
                                />
                            </div>
                        </div>
                    )}

                    {/* Modal de Órdenes Guardadas */}
                    {modalOrdenesAbierto && (
                        <div
                            // Podrías usar otro ref si quieres animar los modales de forma independiente
                            // Por ahora, para simplificar, si se abren bajo el mismo overlay, no necesitan un ref de animación separado.
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 scale-95 opacity-0"
                            style={{ opacity: 0 }} // Estado inicial para la animación
                        >
                            <div className="p-6 sm:p-8 md:p-10">
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    onClick={() => setModalOrdenesAbierto(false)}
                                    aria-label="Cerrar"
                                >
                                    <AiOutlineClose className="w-7 h-7" />
                                </button>
                                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Órdenes Guardadas</h2>
                                <OrdenesGuardadas onSelectOrder={handleSeleccionarOrdenGuardada} />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const ShoppingCartClient = CarritoComprasCliente;