import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePedido, ESTADOS_PEDIDO } from "../hooks/usePedido";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    AiOutlineLoading3Quarters,
    AiOutlineArrowLeft,
    AiOutlineSave,
    AiOutlineClose,
    AiOutlinePlayCircle,
    AiOutlineSend,
    AiOutlineUser,
    AiOutlineClockCircle,
    AiOutlineCheckCircle
} from 'react-icons/ai';
import { toast } from "sonner";
import { useAdminAuth } from '@/context/AuthAdminContext';
import { toZonedTime } from 'date-fns-tz';
import { differenceInSeconds } from 'date-fns';
import { animate } from 'animejs';
import { CantidadesInput } from "./pedidotypes";

const PickingDetalle: React.FC = () => {
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
        iniciarPicking,
        guardarPicking,
        finalizarPicking,
        cancelarProceso,
    } = usePedido();

    const [cantidadesInput, setCantidadesInput] = useState<CantidadesInput>({});
    const [elapsed, setElapsed] = useState<string>("—");

    useEffect(() => {
        if (id) {
            const fetchPedidoById = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/pedido/${id}`);
                    if (!response.ok) throw new Error('No se pudo cargar el pedido');
                    let pedidoData = await response.json();
                    // Si no existe el objeto picking, inicialízalo con valores por defecto y usuario actual
                    if (!pedidoData.picking) {
                        pedidoData.picking = {
                            usuario: admin?.usuario || '',
                            fechainicio_picking: '',
                            fechafin_picking: '',
                            estado_picking: 'pendiente',
                        };
                    } else {
                        // Asegura que todos los campos estén presentes y asigna usuario actual si no hay
                        pedidoData.picking = {
                            usuario: pedidoData.picking.usuario || admin?.usuario || '',
                            fechainicio_picking: pedidoData.picking.fechainicio_picking || '',
                            fechafin_picking: pedidoData.picking.fechafin_picking || '',
                            estado_picking: pedidoData.picking.estado_picking || 'pendiente',
                        };
                    }
                    setPedido(pedidoData);
                } catch (error: any) {
                    toast.error('No se pudo cargar el pedido: ' + (error.message || error));
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
            pedido.productos.forEach(prod => {
                initialCantidades[prod.id] = (prod.cantidad_encontrada ?? prod.cantidad_pedida).toString();
            });
            setCantidadesInput(initialCantidades);
        }
    }, [pedido]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (pedido?.picking?.estado_picking === 'en_proceso' && pedido.picking.fechainicio_picking) {
            const updateElapsed = () => {
                const inicio = new Date(pedido.picking!.fechainicio_picking!);
                const nowVenezuela = toZonedTime(new Date(), 'America/Caracas');
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
        } else if (pedido?.picking?.fechainicio_picking && pedido.picking.fechafin_picking) {
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
            setElapsed('—');
        }
        return () => { if (interval) clearInterval(interval); };
    }, [pedido]);

    useEffect(() => {
        if (pedido) {
            animate('#picking-info', {
                opacity: [0, 1],
                y: [20, 0],
                duration: 500,
                ease: 'outQuad',
            });
        }
    }, [pedido]);

    const handleCantidadEncontradaChange = (productoId: string, value: string) => {
        if (/^\d*$/.test(value)) {
            setCantidadesInput(prev => ({ ...prev, [productoId]: value }));
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
        } catch (error: any) {
            toast.error(`Error al iniciar picking: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleGuardarCantidades = async () => {
        if (!pedido) return;

        let hasError = false;
        const productosActualizados = pedido.productos.map(prod => {
            const val = cantidadesInput[prod.id];
            const cantidad_encontrada = parseInt(val, 10);

            if (val === '' || isNaN(cantidad_encontrada) || cantidad_encontrada < 0) {
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

        if (hasError) return;

        setLoading(true);
        try {
            await guardarPicking(pedido._id, productosActualizados);
            toast.success("Cantidades guardadas.");
            fetchPedidos();
        } catch (error: any) {
            toast.error(`Error al guardar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalizarPicking = async () => {
        if (!pedido) return;
        
        let hasError = false;
        pedido.productos.forEach((prod) => {
            const val = cantidadesInput[prod.id];
            const parsedCantidad = parseInt(val, 10);
            if (val === '' || isNaN(parsedCantidad) || parsedCantidad < 0) {
                toast.error(`Cantidad inválida para "${prod.descripcion}".`);
                hasError = true;
            }
        });
        if (hasError) {
            toast.warning("Corrige los errores en las cantidades antes de finalizar.");
            return;
        }
        
        await handleGuardarCantidades();

        setLoading(true);
        try {
            await finalizarPicking(pedido._id);
            toast.success("Picking finalizado. Listo para empacar.");
            navigate("/admin/packingpedidos");
        } catch (error: any) {
            toast.error(`Error al finalizar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarPicking = async () => {
        if (!pedido) return;
        setLoading(true);
        try {
            await cancelarProceso(pedido._id, ESTADOS_PEDIDO.PICKING);
            toast.success("Picking cancelado. Pedido devuelto a 'nuevo'.");
            navigate("/admin/pickingpedidos");
        } catch (error: any) {
            toast.error(`Error al cancelar: ${error.message}`);
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

    const isPickingStarted = pedido.picking?.estado_picking === 'en_proceso';
    const isPickingFinalizado = pedido.picking?.estado_picking === 'finalizado';
    const isEditable = pedido.estado === ESTADOS_PEDIDO.PICKING && !isPickingFinalizado;

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Picking de Pedido #{pedido._id.slice(-6)}</CardTitle>
                            <CardDescription>Cliente: {pedido.cliente} - RIF: {pedido.rif}</CardDescription>
                        </div>
                        <Badge variant={pedido.estado === 'picking' ? 'default' : 'secondary'}>
                            {pedido.estado.toUpperCase()}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Usuario Picking</p>
                            <p className="text-lg font-semibold">{pedido.picking?.usuario || 'No iniciado'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Inicio Picking</p>
                            <p className="text-lg font-semibold">{pedido.picking?.fechainicio_picking ? new Date(pedido.picking.fechainicio_picking).toLocaleString() : '—'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tiempo Transcurrido</p>
                            <p className="text-lg font-semibold">{elapsed}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Estado Picking</p>
                            <p className={`text-lg font-semibold ${isPickingStarted ? 'text-blue-600' : 'text-gray-600'}`}>
                                {pedido.picking?.estado_picking?.replace('_', ' ') || 'Pendiente'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Productos a Pickear</h3>
                        <div className="space-y-4">
                            {pedido.productos.map((prod) => {
                                const cantidadPedida = prod.cantidad_pedida;
                                const cantidadEncontrada = parseInt(cantidadesInput[prod.id] || '0', 10);
                                const isMissing = cantidadEncontrada < cantidadPedida;
                                const isOver = cantidadEncontrada > cantidadPedida;

                                return (
                                    <div key={prod.id} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-grow">
                                            <p className="font-semibold">{prod.descripcion}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span>Pedido: <strong>{cantidadPedida}</strong></span>
                                                {isMissing && <Badge variant="destructive">Faltante</Badge>}
                                                {isOver && <Badge variant="secondary">Sobrante</Badge>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label htmlFor={`cantidad-${prod.id}`} className="text-sm font-medium">Encontrado:</label>
                                            <Input
                                                id={`cantidad-${prod.id}`}
                                                type="number"
                                                min="0"
                                                value={cantidadesInput[prod.id] || ''}
                                                onChange={(e) => handleCantidadEncontradaChange(prod.id, e.target.value)}
                                                className="w-24 text-right"
                                                disabled={!isEditable || loading}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t">
                        <div className="text-lg font-bold">
                            Total: ${pedido.total.toFixed(2)}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                            <Button variant="outline" onClick={() => navigate(-1)} disabled={loading}>
                                <AiOutlineArrowLeft className="mr-2 h-4 w-4" /> Volver
                            </Button>
                            {!isPickingStarted && isEditable && (
                                <Button onClick={handleIniciarPicking} disabled={loading}>
                                    <AiOutlinePlayCircle className="mr-2 h-4 w-4" /> Iniciar Picking
                                </Button>
                            )}
                            {isPickingStarted && isEditable && (
                                <>
                                    <Button variant="secondary" onClick={handleGuardarCantidades} disabled={loading}>
                                        <AiOutlineSave className="mr-2 h-4 w-4" /> Guardar
                                    </Button>
                                    <Button onClick={handleFinalizarPicking} disabled={loading}>
                                        <AiOutlineSend className="mr-2 h-4 w-4" /> Finalizar Picking
                                    </Button>
                                    <Button variant="destructive" onClick={handleCancelarPicking} disabled={loading}>
                                        <AiOutlineClose className="mr-2 h-4 w-4" /> Cancelar
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PickingDetalle;