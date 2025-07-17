import { useEffect, useState, useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AiOutlineLoading3Quarters,
  AiOutlineArrowLeft,
  AiOutlineSave,
  AiOutlinePlayCircle,
  AiOutlineSend,
  AiOutlineBarcode,
} from "react-icons/ai";
import { toast } from "sonner";
import { useAdminAuth } from "@/context/AuthAdminContext";
import { toZonedTime } from "date-fns-tz";
import { differenceInSeconds } from "date-fns";
import { animate } from "animejs";
import { CantidadesInput } from "./pedidotypes";
import { BuscarProductoPorCodigo } from "./BuscarProductoPorCodigo";

const PickingDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { admin } = useAdminAuth();

  const {
    pedido,
    setPedido,
    fetchPedidos,
    loading,
    setLoading,
    iniciarPicking,
    guardarPicking,
    finalizarPicking,
  } = usePedido();

  const [cantidadesInput, setCantidadesInput] = useState<CantidadesInput>({});
  const [elapsed, setElapsed] = useState<string>("—");

  // refs para inputs de cantidad
  const cantidadRefs = useRef<{ [codigo: string]: HTMLInputElement | null }>(
    {}
  );

  useEffect(() => {
    if (id) {
      const fetchPedidoById = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/pedido/${id}`
          );
          if (!response.ok) throw new Error("No se pudo cargar el pedido");
          let pedidoData = await response.json();
          // Si no existe el objeto picking, inicialízalo con valores por defecto y usuario actual
          if (!pedidoData.picking) {
            pedidoData.picking = {
              usuario: admin?.usuario || "",
              fechainicio_picking: "",
              fechafin_picking: "",
              estado_picking: "pendiente",
            };
          } else {
            // Asegura que todos los campos estén presentes y asigna usuario actual si no hay
            pedidoData.picking = {
              usuario: pedidoData.picking.usuario || admin?.usuario || "",
              fechainicio_picking: pedidoData.picking.fechainicio_picking || "",
              fechafin_picking: pedidoData.picking.fechafin_picking || "",
              estado_picking: pedidoData.picking.estado_picking || "pendiente",
            };
          }
          setPedido(pedidoData);
        } catch (error: any) {
          toast.error(
            "No se pudo cargar el pedido: " + (error.message || error)
          );
          setPedido(null);
        } finally {
          setLoading(false);
        }
      };
      fetchPedidoById();
    }
    return () => {
      setPedido(null);
    };
  }, [id, setPedido, admin]);

  useEffect(() => {
    if (pedido) {
      const initialCantidades: CantidadesInput = {};
      pedido.productos.forEach((prod) => {
        if (prod.codigo) {
          initialCantidades[String(prod.codigo)] =
            typeof prod.cantidad_encontrada === "number"
              ? String(prod.cantidad_encontrada)
              : "0";
        }
      });
      setCantidadesInput(initialCantidades);
    }
  }, [pedido]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (
      pedido?.picking?.estado_picking === "en_proceso" &&
      pedido.picking.fechainicio_picking
    ) {
      const updateElapsed = () => {
        const inicio = new Date(pedido.picking!.fechainicio_picking!);
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
      pedido?.picking?.fechainicio_picking &&
      pedido.picking.fechafin_picking
    ) {
      const inicio = new Date(pedido.picking.fechainicio_picking);
      const fin = new Date(pedido.picking.fechafin_picking);
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

  useEffect(() => {
    if (pedido) {
      animate("#picking-info", {
        opacity: [0, 1],
        y: [20, 0],
        duration: 500,
        ease: "outQuad",
      });
    }
  }, [pedido]);

  const handleCantidadEncontradaChange = (
    productoCodigo: string | undefined,
    value: string
  ) => {
    if (!productoCodigo) return;
    if (/^\d*$/.test(value)) {
      setCantidadesInput((prev) => ({ ...prev, [productoCodigo]: value }));
    } else {
      toast.warning("Por favor, introduce solo números enteros.");
    }
  };

  const handleIniciarPicking = async () => {
    if (!id || !admin) return;
    setLoading(true);
    try {
      await iniciarPicking(id, admin.usuario);
      toast.success("Picking iniciado correctamente.");
      fetchPedidos();
      window.location.reload(); // Recarga la página al iniciar picking
    } catch (error: any) {
      toast.error(`Error al iniciar picking: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarCantidades = async (): Promise<boolean> => {
    if (!pedido) return false;

    let hasError = false;
    const productosActualizados = pedido.productos.map((prod) => {
      const codigo = String(prod.codigo);
      const val = cantidadesInput[codigo];
      // Si está vacío, se guarda como cero
      const cantidad_encontrada = val === "" ? 0 : parseInt(val, 10);

      if (isNaN(cantidad_encontrada) || cantidad_encontrada < 0) {
        toast.error(`La cantidad para "${prod.descripcion}" no es válida.`);
        hasError = true;
        return prod;
      }
      if (cantidad_encontrada > prod.cantidad_pedida) {
        toast.error(`La cantidad para "${prod.descripcion}" excede la pedida.`);
        hasError = true;
        return prod;
      }
      return { ...prod, cantidad_encontrada };
    });

    if (hasError) return false;

    setLoading(true);
    try {
      const result = await guardarPicking(pedido._id, productosActualizados);
      console.log("Resultado guardarPicking:", result);
      console.log("Productos actualizados:", productosActualizados);
      toast.success("Cantidades guardadas.");
      fetchPedidos();
      navigate("/admin");
      return true;
    } catch (error: any) {
      toast.error(`Error al guardar: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Nueva función: guarda cantidades y finaliza picking en un solo paso
  const guardarYFinalizarPicking = async (): Promise<boolean> => {
    if (!pedido) return false;

    let hasError = false;
    const productosActualizados = pedido.productos.map((prod) => {
      const codigo = String(prod.codigo);
      const val = cantidadesInput[codigo];
      // Si está vacío, se guarda como cero
      const cantidad_encontrada = val === "" ? 0 : parseInt(val, 10);

      if (isNaN(cantidad_encontrada) || cantidad_encontrada < 0) {
        hasError = true;
        return prod;
      }
      if (cantidad_encontrada > prod.cantidad_pedida) {
        hasError = true;
        return prod;
      }
      return { ...prod, cantidad_encontrada };
    });

    if (hasError) return false;

    setLoading(true);
    try {
      await finalizarPicking(pedido._id, productosActualizados);
      toast.success("Picking finalizado. Listo para empacar.");
      navigate("/admin");
      return true;
    } catch (error: any) {
      toast.error(`Error al finalizar picking: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizarPicking = async () => {
    if (!pedido) return;
    let hasError = false;
    let firstErrorCodigo: string | null = null;
    pedido.productos.forEach((prod) => {
      const codigo = String(prod.codigo);
      const val = cantidadesInput[codigo];
      // Si está vacío, se considera cero
      const parsedCantidad = val === "" ? 0 : parseInt(val, 10);
      if (isNaN(parsedCantidad) || parsedCantidad < 0) {
        if (!firstErrorCodigo) firstErrorCodigo = codigo;
        hasError = true;
      }
    });
    if (hasError && firstErrorCodigo) {
      const ref = cantidadRefs.current[firstErrorCodigo];
      if (ref) {
        ref.focus();
        animate(ref, {
          backgroundColor: ["#fff", "#fee2e2", "#fff"],
          duration: 700,
          ease: "outCubic",
        });
      }
      toast.warning(
        "Corrige los errores en las cantidades antes de finalizar."
      );
      return;
    }
    setLoading(true);
    try {
      const finalizadoOk = await guardarYFinalizarPicking();
      if (!finalizadoOk) {
        setLoading(false);
        return;
      }
    } catch (error: any) {
      toast.error(`Error al finalizar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // const handleCancelarPicking = async () => {
  //     if (!pedido) return;
  //     setLoading(true);
  //     try {
  //         await cancelarProceso(pedido._id, ESTADOS_PEDIDO.PICKING);
  //         toast.success("Picking cancelado. Pedido devuelto a 'nuevo'.");
  //         navigate("/admin/pickingpedidos");
  //     } catch (error: any) {
  //         toast.error(`Error al cancelar: ${error.message}`);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  // función para enfocar input de cantidad por código
  const handleEncontrarPorCodigo = (codigo: string) => {
    const ref = cantidadRefs.current[codigo];
    if (ref) {
      ref.scrollIntoView({ behavior: "smooth", block: "center" });
      ref.focus();
      animate(ref, { scale: [1, 1.1, 1], duration: 350, ease: "outCubic" });
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

  const isPickingStarted = pedido.picking?.estado_picking === "en_proceso";
  const isPickingFinalizado = pedido.picking?.estado_picking === "finalizado";
  const isEditable =
    pedido.estado === ESTADOS_PEDIDO.PICKING && !isPickingFinalizado;

  return (
    <div className="container mx-auto p-1.5">
      <Card className="pt-0 px-1">
        <CardHeader className="p-1">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-sm">
                Picking de Pedido #{pedido._id.slice(-6)}
              </CardTitle>
              <CardDescription className="text-sm">
                Cliente: {pedido.cliente}
              </CardDescription>
              <CardDescription className="text-sm">
                RIF: {pedido.rif}
              </CardDescription>
            </div>
            <Badge
              variant={pedido.estado === "picking" ? "default" : "secondary"}
            >
              {pedido.estado.toUpperCase()}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-4 p-2 border rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Usuario Picking
              </p>
              <p className="text-sm font-semibold">
                {pedido.picking?.usuario || "No iniciado"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Inicio Picking
              </p>
              <p className="text-sm font-semibold">
                {pedido.picking?.fechainicio_picking
                  ? new Date(
                      pedido.picking.fechainicio_picking
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
                  isPickingStarted ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {pedido.picking?.estado_picking?.replace("_", " ") ||
                  "Pendiente"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-1.5">
          <div>
            <BuscarProductoPorCodigo
              productos={pedido.productos
                .filter((p) => typeof p.codigo === "string")
                .map((p) => ({
                  codigo: String(p.codigo),
                  descripcion: p.descripcion,
                }))}
              onEncontrado={handleEncontrarPorCodigo}
            />
            <h3 className="text-md text-center font-semibold mb-2">
              Productos del Picking
            </h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-thin">
              {pedido.productos.map((prod, idx) => {
                const codigo = String(prod.codigo);
                return (
                  <div className="flex flex-row pb-3" key={codigo}>
                    <div
                      key={codigo}
                      className="p-2 border rounded-lg flex flex-col items-center "
                    >
                      <span className="text-black font-bold flex items-center justify-center text-base">
                        {idx + 1}
                      </span>
                      <div className="flex items-center mb-2 md:mb-0">
                        <div>
                          <div className="flex items-center gap-2 text-gray-700 text-sm mt-1">
                            <AiOutlineBarcode className="w-5 h-5 text-gray-500" />
                            <span className="font-mono tracking-widest">
                              {codigo ?? "—"}
                            </span>
                          </div>
                          <div className="font-semibold text-gray-900 text-xl md:text-lg">
                            {prod.descripcion}
                          </div>

                          <div className="flex justify-between">
                            <div className={`text-2xl max-w-fit mt-2`}>
                              PEDIDO:{" "}
                              <span
                                className={`font-medium rounded-full px-1.5 w-fit
                                  ${
                                    cantidadesInput[codigo] === undefined ||
                                    cantidadesInput[codigo] === "" ||
                                    parseInt(cantidadesInput[codigo], 10) == 0
                                      ? "bg-black text-white"
                                      : parseInt(cantidadesInput[codigo], 10) == prod.cantidad_pedida
                                      ? "bg-green-500 text-white"
                                      : parseInt(cantidadesInput[codigo], 10) > prod.cantidad_pedida
                                      ? "bg-red-500 text-white"
                                      : parseInt(cantidadesInput[codigo], 10) < prod.cantidad_pedida
                                      ? "bg-yellow-400 text-black"
                                      : "bg-black text-white"
                                  }
                                `}
                              >
                                {prod.cantidad_pedida}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <label
                                htmlFor={`cantidad-${codigo}`}
                                className="text-sm font-medium"
                              ></label>
                              <Input
                                id={`cantidad-${codigo}`}
                                placeholder={`0`}
                                type="number"
                                min="0"
                                value={(() => {
                                  const val = cantidadesInput[codigo];
                                  if (val !== undefined && val !== "") {
                                    const parsed = parseInt(val, 10);
                                    return isNaN(parsed) ? "0" : String(parsed);
                                  }
                                  // Si no hay valor en el input, usar cantidad_encontrada del producto si existe
                                  const prodObj = pedido.productos.find(
                                    (p) => String(p.codigo) === codigo
                                  );
                                  if (
                                    prodObj &&
                                    typeof prodObj.cantidad_encontrada ===
                                      "number"
                                  ) {
                                    return String(prodObj.cantidad_encontrada);
                                  }
                                  return "0";
                                })()}
                                onChange={(e) =>
                                  handleCantidadEncontradaChange(
                                    codigo,
                                    e.target.value
                                  )
                                }
                                className="w-16 h-16 text-center text-2xl"
                                disabled={
                                  pedido.picking?.estado_picking !==
                                    "en_proceso" || loading
                                }
                                ref={(el) => {
                                  cantidadRefs.current[codigo] = el;
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" ||
                                    e.key === "Tab" ||
                                    (e.key.length === 1 && !/\d/.test(e.key))
                                  ) {
                                    e.preventDefault();
                                    setTimeout(() => {
                                      const barcodeInput =
                                        document.querySelector<HTMLInputElement>(
                                          "input[placeholder^='Escanea']"
                                        );
                                      if (barcodeInput) {
                                        barcodeInput.focus();
                                        animate(barcodeInput, {
                                          scale: [1, 1.1, 1],
                                          duration: 350,
                                          ease: "outCubic",
                                        });
                                      }
                                    }, 10);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t">
            <div className="flex flex-col items-center justify-center gap-1 mt-1 w-full">
              <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                <div className="text-lg font-bold text-green-600">
                  Total: $ {pedido.total.toFixed(2)}
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  <AiOutlineArrowLeft className="mr-2 h-4 w-4" /> Volver
                </Button>
                {!isPickingStarted && isEditable && (
                  <Button onClick={handleIniciarPicking} disabled={loading}>
                    <AiOutlinePlayCircle className="mr-2 h-4 w-4" /> Iniciar
                    Picking
                  </Button>
                )}
                {isPickingStarted && isEditable && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleGuardarCantidades}
                      disabled={loading}
                    >
                      <AiOutlineSave className="mr-2 h-4 w-4" /> Guardar
                    </Button>
                    <Button
                      className="bg-black text-white"
                      onClick={handleFinalizarPicking}
                      disabled={loading}
                    >
                      <AiOutlineSend className="mr-2 h-4 w-4" /> Finalizar
                      Picking
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PickingDetalle;
