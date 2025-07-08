import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePedido, ESTADOS_PEDIDO } from "../hooks/usePedido";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    AiOutlineLoading3Quarters,
    AiOutlineArrowLeft,
    AiOutlineClose,
    AiOutlinePlayCircle,
    AiOutlineSend
} from 'react-icons/ai';
import { toast } from "sonner";
import { useAdminAuth } from '@/context/AuthAdminContext';
import { toZonedTime } from 'date-fns-tz';
import { differenceInSeconds } from 'date-fns';
import { PedidoArmado } from "./pedidotypes";
import { animate } from 'animejs';

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
        cancelarProceso,
    } = usePedido();

    const [elapsed, setElapsed] = useState<string>("—");

    useEffect(() => {
        const fetchPedidoById = async (pedidoId: string) => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/pedido/${pedidoId}`);
                if (!response.ok) throw new Error('No se pudo cargar el pedido');
                const pedidoData = await response.json();
                setPedido(pedidoData);
            } catch (error: any) {
                toast.error('No se pudo cargar el pedido: ' + (error.message || error));
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
            animate('#packing-info', {
                opacity: [0, 1],
                y: [20, 0],
                duration: 500,
                ease: 'outQuad',
            });
        }
    }, [pedido]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (pedido?.packing?.estado_packing === 'en_proceso' && pedido.packing.fechainicio_packing) {
            const updateElapsed = () => {
                const inicio = new Date(pedido.packing!.fechainicio_packing!);
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
        } else if (pedido?.packing?.fechainicio_packing && pedido.packing.fechafin_packing) {
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
            setElapsed('—');
        }
        return () => { if (interval) clearInterval(interval); };
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
            navigate("/admin/enviadospedidos");
        } catch (error: any) {
            toast.error(`Error al finalizar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarPacking = async () => {
        if (!pedido) return;
        setLoading(true);
        try {
            await cancelarProceso(pedido._id, ESTADOS_PEDIDO.PACKING);
            toast.success("Packing cancelado. Pedido devuelto a 'picking'.");
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

    const isPackingStarted = pedido.packing?.estado_packing === 'en_proceso';
    const isPackingFinalizado = pedido.packing?.estado_packing === 'finalizado';
    const isEditable = pedido.estado === ESTADOS_PEDIDO.PACKING && !isPackingFinalizado;

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Packing de Pedido #{pedido._id.slice(-6)}</CardTitle>
                            <CardDescription>Cliente: {pedido.cliente} - RIF: {pedido.rif}</CardDescription>
                        </div>
                        <Badge variant={pedido.estado === 'packing' ? 'default' : 'secondary'}>
                            {pedido.estado.toUpperCase()}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div id="packing-info" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Usuario Packing</p>
                            <p className="text-lg font-semibold">{pedido.packing?.usuario || 'No iniciado'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Inicio Packing</p>
                            <p className="text-lg font-semibold">{pedido.packing?.fechainicio_packing ? new Date(pedido.packing.fechainicio_packing).toLocaleString() : '—'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tiempo Transcurrido</p>
                            <p className="text-lg font-semibold">{elapsed}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Estado Packing</p>
                            <p className={`text-lg font-semibold ${isPackingStarted ? 'text-blue-600' : 'text-gray-600'}`}>
                                {pedido.packing?.estado_packing?.replace('_', ' ') || 'Pendiente'}
                            </p>
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
                            {!isPackingStarted && isEditable && (
                                <Button onClick={handleIniciarPacking} disabled={loading}>
                                    <AiOutlinePlayCircle className="mr-2 h-4 w-4" /> Iniciar Packing
                                </Button>
                            )}
                            {isPackingStarted && isEditable && (
                                <>
                                    <Button onClick={handleFinalizarPacking} disabled={loading}>
                                        <AiOutlineSend className="mr-2 h-4 w-4" /> Finalizar Packing
                                    </Button>
                                    <Button variant="destructive" onClick={handleCancelarPacking} disabled={loading}>
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

export default PackingDetalle;