import { useState, useEffect, useRef, useMemo } from "react";
import { animate } from "animejs";
import { useCarrito } from "../hooks/useCarrito";
import { useProductos } from "../hooks/useProductos";
import { useClientes } from "../hooks/useClientes";
import { ProductoItem } from "./ClientProductoItem";
import { OrdenesGuardadas } from "./OrdenesGuardadas";

import { AiOutlineShoppingCart, AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { MdOutlineSaveAlt } from "react-icons/md";
import { ResumenCarrito } from "../AdminCompras/ResumenCarrito";

// Función de utilidad para filtrar productos
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
    const overlayRef = useRef<HTMLDivElement>(null);

    const { clienteSeleccionado, seleccionarCliente } = useClientes();
    const { productos, loading: productosLoading } = useProductos();
    const { carrito, agregarProducto, eliminarProducto, limpiarCarrito } = useCarrito();

    // Efecto para controlar las animaciones de los modales con Anime.js
    useEffect(() => {
        const isModalOpen = modalAbierto || modalOrdenesAbierto;
        const currentOverlayRef = overlayRef.current;
        const currentModalRef = modalRef.current;

        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
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
            if (currentModalRef && (currentModalRef.style.opacity === '1' || currentModalRef.style.opacity === '')) {
                animate(currentModalRef, {
                    opacity: [1, 0],
                    translateY: [0, 50],
                    scale: [1, 0.95],
                    duration: 300,
                    easing: "easeInQuad",
                }).then(() => {
                    document.body.style.overflow = '';
                    if (currentModalRef) currentModalRef.style.opacity = '0';
                });
            } else {
                document.body.style.overflow = '';
            }

            if (currentOverlayRef && (currentOverlayRef.style.opacity === '1' || currentOverlayRef.style.opacity === '')) {
                animate(currentOverlayRef, {
                    opacity: [1, 0],
                    duration: 250,
                    easing: "easeInQuad",
                });
            }
        }
    }, [modalAbierto, modalOrdenesAbierto]);

    // Efecto para cerrar modales con la tecla Escape
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

    // Efecto para seleccionar el cliente desde localStorage al cargar la página
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

    // Memoiza los productos filtrados para evitar recálculos innecesarios
    const productosFiltrados = useMemo(
        () => filtrarPorMultiplesPalabrasAND(productos, busqueda, ["descripcion", "codigo"]),
        [productos, busqueda]
    );

    // Manejador para cargar una orden guardada en el carrito
    const handleSeleccionarOrdenGuardada = (productosOrden: any[]) => {
        limpiarCarrito();
        productosOrden.forEach((prodGuardado) => {
            const prodCatalogo = productos.find((p) => p.codigo === prodGuardado.codigo);
            const productoCompleto = prodCatalogo ? { ...prodCatalogo, ...prodGuardado } : prodGuardado;
            agregarProducto(productoCompleto);
        });
        setModalOrdenesAbierto(false);
        // Utiliza toast para una notificación más elegante
        // Asegúrate de importar 'toast' de 'sonner' si aún no lo has hecho:
        // import { toast } from 'sonner';
        // toast.success("Orden cargada", { description: "Los productos de la orden guardada se han añadido a tu carrito." });
        alert("Orden cargada en el carrito actual."); // Fallback si 'sonner' no está configurado
    };

    // Mensaje inicial si no hay cliente seleccionado
    if (!clienteSeleccionado) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
                <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-8 rounded-lg shadow-xl text-center max-w-sm animate-in fade-in zoom-in-95 duration-500">
                    <p className="font-bold text-2xl mb-3">👋 ¡Hola!</p>
                    <p className="text-lg leading-relaxed">
                        Para comenzar tu compra, por favor,{" "}
                        <strong className="text-blue-900 font-extrabold">selecciona un cliente</strong>.
                        Si ya has iniciado sesión, debería cargarse automáticamente.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8 lg:pl-56 font-sans antialiased">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Título de la Página */}
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 text-center mb-8 tracking-tight text-balance animate-in fade-in slide-in-from-top-12 duration-1000"><span className="text-blue-600 drop-shadow-md">Catálogo</span>
                </h1>

                {/* Barra de Búsqueda */}
                <div className="relative mb-8 shadow-lg rounded-full overflow-hidden transition-all duration-300 focus-within:ring-4 focus-within:ring-blue-400/50 focus-within:shadow-xl">
                    <input
                        type="text"
                        placeholder="Buscar productos por descripción..."
                        className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-full border border-gray-300 focus:outline-none transition-all text-gray-700 text-base sm:text-lg bg-white placeholder-gray-400"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        aria-label="Buscar producto"
                    />
                    <AiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 pointer-events-none" />
                </div>

                {/* Estado de Carga de Productos */}
                {productosLoading ? (
                    <div className="flex flex-col justify-center items-center h-64 text-gray-500 text-lg bg-white rounded-xl shadow-sm animate-pulse">
                        <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-gray-700 font-medium">Cargando productos...</p>
                    </div>
                ) : productosFiltrados.length === 0 ? (
                    /* Estado de "No se encontraron productos" */
                    <p className="text-gray-600 text-center py-12 bg-white rounded-xl shadow-sm text-lg border border-dashed border-gray-300 animate-in fade-in duration-500">
                        No se encontraron productos que coincidan con la búsqueda.
                    </p>
                ) : (
                    /* Lista de Productos */
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 max-h-[calc(100vh-280px)] md:max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
                        {productosFiltrados.map((producto) => (
                            <ProductoItem
                                key={producto.codigo}
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

            {/* Botones de Acción Flotantes (FABs) */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-4">
                {/* Botón del Carrito */}
                <button
                    className="relative bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 animate-in fade-in zoom-in-90 duration-500 delay-100"
                    onClick={() => setModalAbierto(true)}
                    aria-label={`Ver Carrito con ${carrito.length} productos`}
                >
                    <AiOutlineShoppingCart className="w-7 h-7 sm:w-8 sm:h-8" />
                    {carrito.length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center -mt-1 -mr-1 border-2 border-white animate-bounce-custom">
                            {carrito.length}
                        </span>
                    )}
                </button>
                {/* Botón de Órdenes Guardadas */}
                <button
                    className="relative bg-neutral-100 text-blue-700 p-4 rounded-full shadow-2xl hover:bg-blue-100 transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-offset-2"
                    onClick={() => setModalOrdenesAbierto(true)}
                    aria-label="Ver Órdenes Guardadas"
                >
                    <MdOutlineSaveAlt className="w-7 h-7 sm:w-8 sm:h-8" />
                </button>
            </div>

            {/* MODAL ELEGANTE Y MINIMALISTA */}
            {(modalAbierto || modalOrdenesAbierto) && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                    aria-modal="true"
                    role="dialog"
                    tabIndex={-1}
                >
                    <div
                        ref={modalRef}
                        className="relative w-full max-w-3xl xl:max-w-3xl 2xl:max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-0 sm:p-0 overflow-hidden animate-fade-in-up"
                        style={{ minHeight: 200 }}
                    >
                        {/* Botón de cierre elegante */}
                        <button
                            onClick={() => {
                                setModalAbierto(false);
                                setModalOrdenesAbierto(false);
                            }}
                            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-blue-50 rounded-full p-2 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                            aria-label="Cerrar modal"
                        >
                            <AiOutlineClose className="w-6 h-6 text-gray-500" />
                        </button>
                        {/* Contenido del modal: Carrito o Órdenes Guardadas */}
                        <div className="p-6 sm:p-8">
                            {modalAbierto && (
                                <ResumenCarrito
                                    carrito={carrito.map(prod => ({
                                        codigo: prod.codigo,
                                        descripcion: prod.descripcion,
                                        precio: prod.precio,
                                        precio_n: prod.precio_n,
                                        descuento1: prod.descuento1,
                                        descuento2: prod.descuento2,
                                        descuento3: prod.descuento3,
                                        descuento4: prod.descuento4,
                                        cantidad_pedida: prod.cantidad_pedida,
                                        cantidad_encontrada: prod.cantidad_encontrada,
                                        existencia: prod.existencia,
                                    }))}
                                    onEliminar={eliminarProducto}
                                    cliente={clienteSeleccionado}
                                    onTotalizar={limpiarCarrito}
                                    onLoadOrder={handleSeleccionarOrdenGuardada}
                                />
                            )}
                            {modalOrdenesAbierto && (
                                <OrdenesGuardadas
                                    onSelectOrder={handleSeleccionarOrdenGuardada}
                                    onClose={() => setModalOrdenesAbierto(false)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export const ShoppingCartClient = CarritoComprasCliente;