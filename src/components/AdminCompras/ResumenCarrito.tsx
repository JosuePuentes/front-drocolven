import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { AiOutlineDelete, AiOutlineCloseCircle, AiOutlineSave } from "react-icons/ai";
import { MdOutlineCleaningServices } from "react-icons/md";
import { animate } from "animejs"; // Asegúrate de que 'animejs' esté instalado
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OrdenesGuardadas } from "@/components/ClientCompras/OrdenesGuardadas";

interface Producto {
    id: string;
    descripcion: string;
    precio: number;
    precio_n?: number;
    descuento1: number;
    descuento2: number;
    descuento3: number;
    descuento4: number;
    cantidad_pedida: number;
    cantidad_encontrada: number;
    existencia?: number;
    dpto?: string;
    laboratorio?: string;
    nacional?: string;
    fv?: string;
}

interface ClienteDetalle {
    encargado: string;
    rif: string;
    descuento1?: number;
    descuento2?: number;
}

interface ResumenCarritoProps {
    carrito: Producto[];
    onEliminar: (id: string) => void;
    cliente: ClienteDetalle | null;
    titulo?: string;
    onTotalizar?: () => void; // Esta función debería limpiar el carrito principal
    onLoadOrder: (productos: Producto[], clientDetail?: ClienteDetalle) => void; // Permite clientDetail opcional
}

export const ResumenCarrito: React.FC<ResumenCarritoProps> = ({
    carrito,
    onEliminar,
    cliente,
    titulo = "RESUMEN DEL PEDIDO",
    onTotalizar,
    onLoadOrder,
}) => {
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [ordersModalOpen, setOrdersModalOpen] = useState(false);
    const [observacion, setObservacion] = useState("");

    const confirmModalRef = useRef<HTMLDivElement>(null);
    const confirmOverlayRef = useRef<HTMLDivElement>(null);

    // Animación de aparición/desaparición del modal de CONFIRMACIÓN (Totalizar Pedido)
    useEffect(() => {
        if (confirmModalVisible) {
            document.body.style.overflow = 'hidden'; // Evita scroll del body
            if (confirmOverlayRef.current) {
                animate(confirmOverlayRef.current, { opacity: [0, 1], duration: 250, ease: "easeOutQuad" });
            }
            if (confirmModalRef.current) {
                animate(confirmModalRef.current, { opacity: [0, 1], translateY: [20, 0], duration: 300, ease: "easeOutQuad" });
            }
        } else {
            if (confirmModalRef.current) {
                animate(confirmModalRef.current, { opacity: [1, 0], translateY: [0, 20], duration: 200, ease: "easeInQuad" });
            }
            if (confirmOverlayRef.current) {
                animate(confirmOverlayRef.current, { opacity: [1, 0], duration: 200, ease: "easeInQuad" });
            }
        }
    }, [confirmModalVisible, ordersModalOpen]);

    // Control del scroll del body cuando el modal de órdenes guardadas se abre/cierra
    useEffect(() => {
        if (ordersModalOpen) {
            document.body.style.overflow = 'hidden';
        } else if (!confirmModalVisible) {
            document.body.style.overflow = '';
        }
    }, [ordersModalOpen, confirmModalVisible]);

    // Cerrar modales al presionar ESC
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setConfirmModalVisible(false);
                setOrdersModalOpen(false);
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const total = useMemo(() => {
        return carrito.reduce((acc, prod) => {
            const precioNeto = prod.precio_n ?? prod.precio;
            return acc + (precioNeto * prod.cantidad_pedida);
        }, 0);
    }, [carrito]);

    const subtotal = useMemo(() => {
        return carrito.reduce((acc, prod) => {
            const precio = prod.precio;
            return acc + (precio * prod.cantidad_pedida);
        }, 0);
    }, [carrito]);

    const enviarResumen = useCallback(async () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío. Agrega productos antes de totalizar.");
            return;
        }

        // Validación: cliente logueado vs cliente del carrito
        try {
            const usuarioStr = localStorage.getItem('usuario');
            if (usuarioStr && cliente) {
                const usuario = JSON.parse(usuarioStr);
                // Compara por RIF (puedes ajustar a email o id si es necesario)
                if (usuario?.rif && usuario.rif !== cliente.rif) {
                    alert('El cliente logueado no coincide con el cliente del pedido. Por favor, inicia sesión con el cliente correcto.');
                    return;
                }
            }
        } catch (e) {
            alert('Error al validar el cliente logueado.');
            return;
        }

        const resumen = {
            cliente: cliente?.encargado || "Cliente no seleccionado",
            rif: cliente?.rif || "RIF no seleccionado",
            observacion,
            total: parseFloat(total.toFixed(2)),
            estado: "nuevo",
            subtotal: parseFloat(subtotal.toFixed(2)),
            descuento_cliente1: cliente?.descuento1 ?? 0, // Enviar descuento1 del cliente
            descuento_cliente2: cliente?.descuento2 ?? 0, // Enviar descuento2 del cliente
            productos: carrito.map((prod: Producto) => ({
                id: prod.id,
                descripcion: prod.descripcion,
                precio: parseFloat(prod.precio.toFixed(4)),
                descuento1: parseFloat(prod.descuento1.toFixed(4)),
                descuento2: parseFloat(prod.descuento2.toFixed(4)),
                descuento3: parseFloat(prod.descuento3.toFixed(4)),
                descuento4: parseFloat(prod.descuento4.toFixed(4)),
                precio_n: parseFloat((prod.precio_n ?? prod.precio).toFixed(4)),
                total_Neto: parseFloat(((prod.precio_n ?? prod.precio) * prod.cantidad_pedida).toFixed(4)),
                subtotal: parseFloat((prod.precio * prod.cantidad_pedida).toFixed(4)),
                cantidad_pedida: prod.cantidad_pedida,
                cantidad_encontrada: prod.cantidad_encontrada,
            })),
        };
        // Imprimir en consola el resumen antes de enviar
        console.log("Resumen a enviar:", JSON.stringify(resumen, null, 2));

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resumen),
            });

            if (response.ok) {
                alert("¡Pedido registrado exitosamente!");
                setConfirmModalVisible(false);
                setObservacion("");
                if (onTotalizar) onTotalizar();
            } else {
                const errorData = await response.json();
                alert(`Error al registrar el pedido: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error("Error de red al registrar el pedido:", error);
            alert("Error de conexión. Verifica tu red.");
        }
    }, [carrito, cliente, observacion, subtotal, total, onTotalizar]);

    const guardarOrdenLocalmente = useCallback(() => {
        if (!cliente || carrito.length === 0) {
            alert("Debes seleccionar un cliente y tener productos en el carrito para guardar una orden.");
            return;
        }

        const orden = {
            id: Date.now().toString(),
            fecha: new Date().toLocaleString(),
            cliente: cliente.encargado,
            cliente_detalle: cliente,
            productos: carrito.map((p) => ({ ...p })),
            total: parseFloat(total.toFixed(2)),
            observacion,
        };

        let ordenes = [];
        const data = localStorage.getItem("ordenes_guardadas");
        if (data) {
            try {
                ordenes = JSON.parse(data);
            } catch (e) {
                console.error("Error al parsear órdenes guardadas de localStorage:", e);
            }
        }
        ordenes.unshift(orden);
        localStorage.setItem("ordenes_guardadas", JSON.stringify(ordenes));
        alert("Orden guardada correctamente.");
        setObservacion("");
        if (onTotalizar) {
            onTotalizar();
        }
    }, [carrito, cliente, observacion, total, onTotalizar]);

    const handleLoadOrder = useCallback((productos: Producto[], clientDetail?: ClienteDetalle) => {
        setOrdersModalOpen(false); // Cierra el modal de órdenes
        onLoadOrder(productos, clientDetail); // Llama a la nueva función para cargar la orden
        setObservacion(""); // Limpia observación
    }, [onLoadOrder]);

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl space-y-6 max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto border border-gray-50 w-full"> {/* Ajuste: max-w más grande y w-full para pantallas grandes */}
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 text-center pb-4 border-b border-gray-100">
                {titulo}
            </h2>

            {cliente && (
                <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-xl text-sm mb-4 border border-blue-100 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p>
                        <span className="font-semibold">Cliente:</span> {cliente.encargado}
                    </p>
                    <p>
                        <span className="font-semibold">RIF:</span> {cliente.rif}
                    </p>
                </div>
            )}

            {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <MdOutlineCleaningServices className="w-16 h-16 mb-4 text-gray-300" /> {/* Icono más grande */}
                    <p className="text-lg font-medium">No hay productos agregados</p>
                    <p className="text-sm">¡Empieza a añadir artículos a tu pedido!</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"> {/* Custom scrollbar más sutil */}
                    {carrito.map((producto) => (
                        <div
                            key={producto.id}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-100 last:border-b-0 last:pb-0"
                        >
                            <div className="flex flex-col mb-1 sm:mb-0">
                                <span className="font-semibold text-gray-800 text-base sm:text-lg leading-tight">
                                    {producto.descripcion}
                                </span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Cant: {producto.cantidad_pedida}{" "}
                                    <span className="font-medium text-gray-600">
                                        ${(producto.precio_n ?? producto.precio).toFixed(2)} c/u
                                    </span>
                                </span>
                                {/* NUEVA INFO: dpto, fv, laboratorio, nacional */}
                                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                                    {producto.dpto && (
                                        <span className="bg-gray-100 rounded px-2 py-0.5 font-medium order-1">Dpto: <span className="text-gray-700">{producto.dpto}</span></span>
                                    )}
                                    {producto.laboratorio && (
                                        <span className="bg-gray-100 rounded px-2 py-0.5 font-medium order-2">Lab: <span className="text-gray-700">{producto.laboratorio}</span></span>
                                    )}
                                    {producto.nacional && (
                                        <span className="bg-gray-100 rounded px-2 py-0.5 font-medium order-3">Nacional: <span className="text-gray-700">{producto.nacional}</span></span>
                                    )}
                                    {producto.fv && (
                                        <span className="bg-gray-100 rounded px-2 py-0.5 font-medium order-4">FV: <span className="text-gray-700">{producto.fv}</span></span>
                                    )}
                                    {producto.descuento1 !== undefined && producto.descuento1 > 0 && (
                                        <span className="bg-yellow-100 rounded px-2 py-0.5 font-medium order-5 text-yellow-800">
                                            DL: <span className="text-yellow-900">{producto.descuento1}%</span>
                                        </span>
                                    )}
                                    {producto.descuento2 !== undefined && producto.descuento2 > 0 && (
                                        <span className="bg-yellow-100 rounded px-2 py-0.5 font-medium order-5 text-yellow-800">
                                            DA: <span className="text-yellow-900">{producto.descuento2}%</span>
                                        </span>
                                    )}
                                    {producto.descuento3 !== undefined && producto.descuento3 > 0 && (
                                        <span className="bg-yellow-100 rounded px-2 py-0.5 font-medium order-5 text-yellow-800">
                                            DC: <span className="text-yellow-900">{producto.descuento3}%</span>
                                        </span>
                                    )}
                                    {producto.descuento4 !== undefined && producto.descuento4 > 0 && (
                                        <span className="bg-yellow-100 rounded px-2 py-0.5 font-medium order-5 text-yellow-800">
                                            PP: <span className="text-yellow-900">{producto.descuento4}%</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 mt-2 sm:mt-0">
                                <span className="text-base sm:text-lg font-bold text-gray-900">
                                    ${((producto.precio_n ?? producto.precio) * producto.cantidad_pedida).toFixed(2)}
                                </span>
                                <button
                                    aria-label={`Eliminar ${producto.descripcion}`}
                                    onClick={() => onEliminar(producto.id)}
                                    className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-100"
                                >
                                    <AiOutlineDelete className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="pt-6 border-t border-gray-100 space-y-3"> 
                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
                    onClick={guardarOrdenLocalmente}
                  >
                    Guardar Orden
                  </button>
                  <button
                    className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
                    onClick={() => setConfirmModalVisible(true)}
                  >
                    Totalizar Pedido
                  </button>
                  <button
                    className="bg-gray-200 text-gray-700 text-sm px-3 py-1.5 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                    onClick={() => setOrdersModalOpen(true)}
                  >
                    Ver Órdenes Guardadas
                  </button>
                </div>
            </div>

            {/* Modal de Confirmación para Totalizar Pedido */}
            {confirmModalVisible && (
                <div
                    ref={confirmOverlayRef}
                    className="fixed inset-0 flex justify-center items-center z-50 bg-white bg-opacity-30 backdrop-blur-sm p-4"
                    onClick={(e) => {
                        if (confirmOverlayRef.current && e.target === confirmOverlayRef.current) {
                            setConfirmModalVisible(false);
                        }
                    }}
                >
                    <div
                        ref={confirmModalRef}
                        className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm md:max-w-md space-y-6 border border-gray-100 opacity-0"
                    >
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Confirmar Pedido</h3>
                            <button
                                onClick={() => setConfirmModalVisible(false)}
                                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-100"
                                aria-label="Cerrar modal"
                            >
                                <AiOutlineCloseCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div className="flex flex-col">
                                <label htmlFor="observacion" className="text-sm font-medium text-gray-700 mb-2">
                                    Observación (opcional)
                                </label>
                                <textarea
                                    id="observacion"
                                    className="border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-y min-h-[100px] transition-all duration-200"
                                    value={observacion}
                                    onChange={(e) => setObservacion(e.target.value)}
                                    placeholder="Ej: Entregar en horario de la tarde, contactar antes de llegar..."
                                    rows={4}
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row-reverse justify-start gap-3 pt-2"> {/* Botones en orden inverso para que Confirmar sea el último */}
                                <button
                                    onClick={enviarResumen}
                                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    Confirmar Pedido
                                </button>
                                <button
                                    onClick={() => setConfirmModalVisible(false)}
                                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};