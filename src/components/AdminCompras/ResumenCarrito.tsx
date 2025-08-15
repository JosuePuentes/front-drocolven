// src/components/ResumenCarrito.tsx

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { AiOutlineDelete, AiOutlineCloseCircle } from "react-icons/ai";
import { MdOutlineCleaningServices } from "react-icons/md";
import { animate } from "animejs";
import { CarritoProducto, Cliente } from "./types/types"; // Asegúrate que esta ruta sea correcta
import { useNavigate } from "react-router-dom";

// Importa el hook y el tipo desde sus nuevas ubicaciones
import { useEnviarTransaccion } from "@/hooks/useEnviarTransaccion"; // Ajusta la ruta si es necesario
import { TransaccionPayload } from "@/api/transacciones"; // Ajusta la ruta si es necesario

interface ResumenCarritoProps {
  carrito: CarritoProducto[];
  onEliminar: (id: string) => void;
  cliente: Cliente | null;
  titulo?: string;
  onTotalizar?: () => void;
  onLoadOrder: (productos: CarritoProducto[], clientDetail?: Cliente) => void;
}

export const ResumenCarrito: React.FC<ResumenCarritoProps> = ({
  carrito,
  onEliminar,
  cliente,
  titulo = "RESUMEN DEL PEDIDO",
  onTotalizar,
}) => {
  const navigate = useNavigate();

  // Llama al hook de transacciones
  const { ejecutar: enviarTransaccion } = useEnviarTransaccion();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  ordersModalOpen
  const [observacion, setObservacion] = useState("");

  // Estados para controlar el proceso completo de dos pasos
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const confirmModalRef = useRef<HTMLDivElement>(null);
  const confirmOverlayRef = useRef<HTMLDivElement>(null);

  // Animación de aparición/desaparición del modal
  useEffect(() => {
    if (confirmModalVisible) {
      document.body.style.overflow = "hidden";
      if (confirmOverlayRef.current) {
        animate(confirmOverlayRef.current, {
          opacity: [0, 1],
          duration: 250,
          ease: "easeOutQuad",
        });
      }
      if (confirmModalRef.current) {
        animate(confirmModalRef.current, {
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 300,
          ease: "easeOutQuad",
        });
      }
    }
  }, [confirmModalVisible]);

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
      document.body.style.overflow = ""; // Restaura el scroll al desmontar
    };
  }, []);

  // Cálculo del total neto del carrito
  const total = useMemo(() => {
    return carrito.reduce((acc, prod) => {
      const precioNeto = prod.precio_n ?? prod.precio;
      return acc + precioNeto * prod.cantidad_pedida;
    }, 0);
  }, [carrito]);

  // Cálculo del subtotal (sin descuentos)
  const subtotal = useMemo(() => {
    return carrito.reduce((acc, prod) => {
      const precio = prod.precio;
      return acc + precio * prod.cantidad_pedida;
    }, 0);
  }, [carrito]);

  // Cálculo del total con descuentos de línea y adicional
  const totalDLDE = useMemo(() => {
    return carrito.reduce((acc, prod) => {
      const precioDLDE =
        prod.precio *
        (1 - (prod.descuento1 ?? 0) / 100) *
        (1 - (prod.descuento2 ?? 0) / 100);
      return acc + precioDLDE * prod.cantidad_pedida;
    }, 0);
  }, [carrito]);

  const handleConfirmarPedido = useCallback(async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
    let usuario;
    try {
      const usuarioStr = localStorage.getItem("usuario");
      if (!usuarioStr)
        throw new Error("No se encontró información del usuario.");
      usuario = JSON.parse(usuarioStr);
    } catch (e) {
      alert("Error al validar el cliente logueado.");
      return;
    }

    setIsProcessing(true);
    setProcessError(null);

    try {
      // --- PASO 1: Registrar el pedido ---
      const resumenPedido = {
        cliente: cliente?.encargado || "Cliente no seleccionado",
        rif: cliente?.rif || "RIF no seleccionado",
        observacion,
        total: parseFloat(total.toFixed(2)),
        estado: "nuevo",
        subtotal: parseFloat(subtotal.toFixed(2)),
        descuento_cliente1: cliente?.descuento1 ?? 0,
        descuento_cliente2: cliente?.descuento2 ?? 0,
        productos: carrito.map((prod) => ({
          codigo: prod.codigo,
          descripcion: prod.descripcion,
          precio: parseFloat(prod.precio.toFixed(4)),
          descuento1: parseFloat(prod.descuento1.toFixed(4)),
          descuento2: parseFloat(prod.descuento2.toFixed(4)),
          descuento3: parseFloat(prod.descuento3.toFixed(4)),
          descuento4: parseFloat(prod.descuento4.toFixed(4)),
          precio_n: parseFloat((prod.precio_n ?? prod.precio).toFixed(4)),
          total_Neto: parseFloat(
            ((prod.precio_n ?? prod.precio) * prod.cantidad_pedida).toFixed(4)
          ),
          subtotal: parseFloat((prod.precio * prod.cantidad_pedida).toFixed(4)),
          cantidad_pedida: prod.cantidad_pedida,
          cantidad_encontrada: prod.cantidad_encontrada,
          existencia: prod.existencia,
          nacional: prod.nacional,
          fv: prod.fv,
          dpto: prod.dpto,
          laboratorio: prod.laboratorio,
          
        })),
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumenPedido),
      });

      const pedidoCreado = await response.json();
      if (!response.ok) {
        throw new Error(
          pedidoCreado.message || "Error al registrar el pedido."
        );
      }
      console.log("Pedido registrado con éxito:", pedidoCreado);

      // --- PASO 2: Construir y enviar la transacción usando el hook ---
      const transaccionPayload: TransaccionPayload = {
        tipo_movimiento: "pedido",
        usuario: usuario.login || "usuario_desconocido", // ¡Confirma esta propiedad!
        observaciones: `Descargo por pedido N° ${pedidoCreado.pedido_id}. ${observacion}`,
        documento_origen: pedidoCreado.pedido_id.toString(),
        productos: carrito.map((p) => ({
          producto_codigo: p.codigo,
          cantidad: p.cantidad_pedida,
        })),
      };

      await enviarTransaccion(transaccionPayload);
      console.log("Transacción de inventario enviada con éxito.");

      // --- PASO 3: Lógica de éxito final ---
      alert("¡Pedido y transacción registrados exitosamente!");
      setConfirmModalVisible(false);
      setObservacion("");
      localStorage.removeItem("carrito");
      if (onTotalizar) onTotalizar();
      navigate("/admin");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error de conexión.";
      setProcessError(errorMessage);
      console.error("Falló el proceso de totalización:", error);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  }, [
    carrito,
    cliente,
    observacion,
    total,
    onTotalizar,
    navigate,
    enviarTransaccion,
    subtotal,
  ]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl space-y-6 max-w-sm sm:max-w-md lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto border border-gray-50 w-full">
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
          <MdOutlineCleaningServices className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg font-medium">No hay productos agregados</p>
          <p className="text-sm">¡Empieza a añadir artículos a tu pedido!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {carrito.map((producto) => (
            <div
              key={producto.codigo}
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
              </div>
              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <span className="text-base sm:text-lg font-bold text-gray-900">
                  $
                  {(
                    (producto.precio_n ?? producto.precio) *
                    producto.cantidad_pedida
                  ).toFixed(2)}
                </span>
                <button
                  aria-label={`Eliminar ${producto.descripcion}`}
                  onClick={() => onEliminar(producto.codigo)}
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
        <div className="flex flex-col items-end gap-1 text-base font-medium text-gray-700 mb-2">
          <div className="flex gap-4">
            <span className="text-gray-500">Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-gray-500">Total DL+DE:</span>
            <span>${totalDLDE.toFixed(2)}</span>
          </div>
          <div className="flex gap-4">
            <span className="text-gray-500">Descuento:</span>
            <span>- ${(subtotal - total).toFixed(2)}</span>
          </div>
          <div className="flex gap-4 text-lg font-bold">
            <span className="text-gray-800">Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg shadow-sm hover:bg-green-700 transition-colors"
            onClick={() => setConfirmModalVisible(true)}
          >
            Totalizar Pedido
          </button>
          {/* Otros botones como 'Guardar Orden' o 'Ver Órdenes' pueden ir aquí */}
        </div>
      </div>

      {confirmModalVisible && (
        <div
          ref={confirmOverlayRef}
          className="fixed inset-0 flex justify-center items-center z-50 bg-white bg-opacity-30 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === confirmOverlayRef.current)
              setConfirmModalVisible(false);
          }}
        >
          <div
            ref={confirmModalRef}
            className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm md:max-w-md space-y-6 border border-gray-100 opacity-0"
          >
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                Confirmar Pedido
              </h3>
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
                <label
                  htmlFor="observacion"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Observación (opcional)
                </label>
                <textarea
                  id="observacion"
                  className="border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-y min-h-[100px] transition-all duration-200"
                  value={observacion}
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Ej: Entregar en horario de la tarde..."
                  rows={4}
                />
              </div>
              <div className="flex flex-col sm:flex-row-reverse justify-start gap-3 pt-2">
                <button
                  onClick={handleConfirmarPedido}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Procesando..." : "Confirmar Pedido"}
                </button>
                <button
                  onClick={() => setConfirmModalVisible(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancelar
                </button>
              </div>
              {processError && (
                <p className="text-red-600 text-center text-sm pt-2">
                  Error: {processError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
