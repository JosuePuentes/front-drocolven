import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePedido, ESTADOS_PEDIDO } from "../hooks/usePedido";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AiOutlineLoading3Quarters,
  AiOutlineArrowLeft,
  AiOutlinePlayCircle,
  AiOutlineSend,
  AiOutlineBarcode,
} from "react-icons/ai";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AuthAdminContext";
import { toZonedTime } from "date-fns-tz";
import { differenceInSeconds } from "date-fns";
import { PedidoArmado } from "./pedidotypes";
import { animate } from "animejs";
import { BuscarProductoPorCodigo } from "./BuscarProductoPorCodigo";
import ProductoConfirmModal from "./ProductoConfirmModal";

const PackingDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  const {
    pedido,
    setPedido,
    pedidos,
    fetchPedidos,
    loading,
    setLoading,
    iniciarPacking,
    finalizarPacking,
  } = usePedido();

  const [elapsed, setElapsed] = useState<string>("—");
  const [noMatch, setNoMatch] = useState(false);
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [confirmados, setConfirmados] = useState<{ [codigo: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const fetchPedidoById = async (pedidoId: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/pedido/${pedidoId}`
        );
        if (!response.ok) throw new Error("No se pudo cargar el pedido");
        const pedidoData = await response.json();
        setPedido(pedidoData);
      } catch (error: any) {
        toast.error("No se pudo cargar el pedido: " + (error.message || error));
        setPedido(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      const pedidoEncontrado = pedidos.find((p: PedidoArmado) => p._id === id);
      if (pedidoEncontrado) {
        setPedido(pedidoEncontrado);
      } else {
        fetchPedidoById(id);
      }
    }
    return () => {
      setPedido(null);
    };
  }, [id, pedidos, setPedido]);

  useEffect(() => {
    if (pedido) {
      animate("#packing-info", {
        opacity: [0, 1],
        y: [20, 0],
        duration: 500,
        ease: "outQuad",
      });
    }
  }, [pedido]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (
      pedido?.packing?.estado_packing === "en_proceso" &&
      pedido.packing.fechainicio_packing
    ) {
      const updateElapsed = () => {
        const inicio = new Date(pedido.packing!.fechainicio_packing!);
        const nowVenezuela = toZonedTime(new Date(), "America/Caracas");
        const diff = differenceInSeconds(nowVenezuela, inicio);
        if (diff >= 0) {
          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;
          setElapsed(
            hours > 0
              ? `${hours}h ${minutes}m ${seconds}s`
              : `${minutes}m ${seconds}s`
          );
        }
      };
      updateElapsed();
      interval = setInterval(updateElapsed, 1000);
    } else if (
      pedido?.packing?.fechainicio_packing &&
      pedido.packing.fechafin_packing
    ) {
      const inicio = new Date(pedido.packing.fechainicio_packing);
      const fin = new Date(pedido.packing.fechafin_packing);
      const diff = differenceInSeconds(fin, inicio);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      setElapsed(
        hours > 0
          ? `${hours}h ${minutes}m ${seconds}s`
          : `${minutes}m ${seconds}s`
      );
    } else {
      setElapsed("—");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pedido]);

  const handleIniciarPacking = async () => {
    if (!id || !admin) return;
    setLoading(true);
    try {
      await iniciarPacking(id, admin.usuario);
      toast.success("Packing iniciado correctamente.");
      fetchPedidos();
    } catch (error: any) {
      toast.error(`Error al iniciar packing: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarPacking = async () => {
    if (!pedido) return;
    setLoading(true);
    try {
      await finalizarPacking(pedido._id);
      toast.success("Packing finalizado. Listo para enviar.");
      navigate("/admin");
    } catch (error: any) {
      toast.error(`Error al finalizar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !pedido) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <AiOutlineLoading3Quarters className="animate-spin h-8 w-8 text-blue-500 mr-3" />
        Cargando detalle del pedido...
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-red-500">
        <h2 className="text-2xl font-bold mb-4">Pedido no encontrado</h2>
        <p>El pedido que buscas no existe o no se pudo cargar.</p>
        <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
          <AiOutlineArrowLeft className="mr-2" /> Volver
        </Button>
      </div>
    );
  }

  const isPackingStarted = pedido.packing?.estado_packing === "en_proceso";
  const isPackingFinalizado = pedido.packing?.estado_packing === "finalizado";
  const isEditable =
    pedido.estado === ESTADOS_PEDIDO.PACKING && !isPackingFinalizado;
  const allConfirmed = pedido.productos.every(
    (producto) => confirmados[String(producto.codigo)]
  );

  return (
    <div className="container mx-auto p-1.5 max-h-screen">
      <Card className="pt-0 px-1 ">
        <CardHeader className="p-1">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm">
                Packing de Pedido #{pedido._id.slice(-6)}
              </CardTitle>
              <CardDescription className="text-sm">
                Cliente: {pedido.cliente}
              </CardDescription>
              <CardDescription className="text-sm">
                RIF: {pedido.rif}
              </CardDescription>
            </div>
            <Badge
              variant={pedido.estado === "packing" ? "default" : "secondary"}
            >
              {pedido.estado.toUpperCase()}
            </Badge>
          </div>
          <div
            id="packing-info"
            className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-2 p-2 border rounded-lg"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">
                Usuario Packing
              </p>
              <p className="text-sm font-semibold">
                {pedido.packing?.usuario || "No iniciado"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Inicio Packing
              </p>
              <p className="text-sm font-semibold">
                {pedido.packing?.fechainicio_packing
                  ? new Date(
                      pedido.packing.fechainicio_packing
                    ).toLocaleString()
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tiempo</p>
              <p className="text-sm font-semibold">{elapsed}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estado</p>
              <p
                className={`text-sm font-semibold ${
                  isPackingStarted ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {pedido.packing?.estado_packing?.replace("_", " ") ||
                  "Pendiente"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <BuscarProductoPorCodigo
            productos={pedido.productos
              .filter((p) => typeof p.codigo === "string")
              .map((p) => ({
                codigo: String(p.codigo),
                descripcion: p.descripcion,
              }))}
            onEncontrado={(codigo) => {
              const productoEncontrado = pedido.productos.find(
                (producto) => String(producto.codigo) === codigo
              );
              if (productoEncontrado) {
                setModalOpen(codigo);
              } else {
                setNoMatch(true);
                setTimeout(() => setNoMatch(false), 2000);
              }
            }}
            placeholder="Buscar o escanear código de barras..."
          />
          <h3 className="text-lg text-center font-bold mb-2 text-gray-800">
            Productos del Packing
          </h3>
          <div className="mt-1 flex-1 max-h-[60vh] overflow-y-auto">
            <div
              className={`flex flex-col gap-12 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100 ${
                noMatch ? "bg-red-100 transition-colors duration-500" : ""
              }`}
              ref={(el) => {
                if (noMatch && el) {
                  animate(el, {
                    backgroundColor: ["#fff", "#fee2e2", "#fff"],
                    duration: 2000,
                    ease: "outCubic",
                  });
                }
              }}
            >
              {pedido.productos.map((producto, idx) => {
                const codigo = String(producto.codigo);
                const confirmado = confirmados[codigo];
                return (
                  <div
                    key={codigo}
                    className="flex flex-col md:flex-row md:items-center justify-start bg-gray-50 rounded-lg p-2 border border-gray-100 shadow-sm min-h-[120px] md:min-h-[100px]"
                  >
                    <div className="flex flex-row gap-2 mb-2  items-center">
                      <div className="border p-2 rounded-lg flex-1">
                        <div className="flex justify-center items-center">
                          <span className="text-black font-bold text-base text-center">
                            {idx + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-sm mt-1">
                          <AiOutlineBarcode className="w-5 h-5 text-gray-500" />
                          <span className="font-mono tracking-widest">
                            {codigo ?? "—"}
                          </span>
                        </div>
                        <div className="font-semibold text-black text-xl md:text-lg mt-1">
                          {producto.descripcion}
                        </div>
                        <span className="font-semibold text-green-600 text-lg mt-1">
                          ${" "}
                          {(
                            producto.precio ??
                            producto.precio_unitario ??
                            0
                          ).toFixed(2)}
                        </span>
                        <div className="flex text-gray-500 mt-1 text-xl justify-between">
                          <div>
                            Cantidad pedida:{" "}
                            <span className="font-bold text-gray-700">
                              {producto.cantidad_pedida}
                            </span>
                            <span className="mx-2 text-gray-400">|</span>
                            {(() => {
                              const encontrada =
                                producto.cantidad_encontrada ?? 0;
                              let color = "text-yellow-500";
                              if (encontrada > producto.cantidad_pedida)
                                color = "text-red-600";
                              else if (encontrada === producto.cantidad_pedida)
                                color = "text-green-600";
                              return (
                                <span className={`font-bold text-2xl ${color}`}>
                                  {encontrada}
                                </span>
                              );
                            })()}
                          </div>
                          <Button
                            type="button"
                            className={`w-8 h-8 p-0 rounded-full border-2 ${
                              confirmado
                                ? "bg-green-500 border-green-600 text-white"
                                : "bg-red-100 border-red-400 text-red-600"
                            } transition-colors`}
                            onClick={() =>
                              isPackingStarted ? setModalOpen(codigo) : null
                            }
                            aria-label={
                              confirmado
                                ? "Producto confirmado"
                                : "Confirmar producto"
                            }
                            disabled={!isPackingStarted}
                          >
                            {confirmado ? (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 12h8"
                                />
                              </svg>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="relative flex mt-2 md:mt-0">
                      <ProductoConfirmModal
                        open={modalOpen === codigo && isPackingStarted}
                        onClose={() => setModalOpen(null)}
                        onConfirm={() => {
                          setConfirmados((prev) => ({
                            ...prev,
                            [codigo]: true,
                          }));
                          setModalOpen(null);
                        }}
                        onUnconfirm={() => {
                          setConfirmados((prev) => {
                            const nuevo = { ...prev };
                            delete nuevo[codigo];
                            return nuevo;
                          });
                          setModalOpen(null);
                        }}
                        producto={producto}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t">
            <div className="text-lg font-bold">
              Total: $ {pedido.total.toFixed(2)}
            </div>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                <AiOutlineArrowLeft className="mr-2 h-4 w-4" /> Volver
              </Button>
              {isPackingStarted && isEditable && (
                <>
                  <Button
                    onClick={handleFinalizarPacking}
                    disabled={loading || !allConfirmed}
                    className="bg-black text-white"
                  >
                    <AiOutlineSend className="mr-2 h-4 w-4" /> Finalizar Packing
                  </Button>
                </>
              )}
              {!isPackingStarted && isEditable && (
                <Button onClick={handleIniciarPacking} disabled={loading}>
                  <AiOutlinePlayCircle className="mr-2 h-4 w-4" /> Iniciar
                  Packing
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackingDetalle;
