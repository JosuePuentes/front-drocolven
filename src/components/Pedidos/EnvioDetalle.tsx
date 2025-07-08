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
    AiOutlineSend,
    AiOutlineCheckCircle
} from 'react-icons/ai';
import { toast } from "sonner";
import { useAdminAuth } from '@/context/AuthAdminContext';
import { toZonedTime } from 'date-fns-tz';
import { differenceInSeconds } from 'date-fns';
import { PedidoArmado } from "./pedidotypes";
import { animate } from 'animejs';

const EnvioDetalle: React.FC = () => {
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
        iniciarEnvio,
        entregarPedido,
        cancelarProceso,
        conductores,
        fetchConductores
    } = usePedido();

    const [elapsed, setElapsed] = useState<string>("—");
    const [selectedConductor, setSelectedConductor] = useState<string>("");

    // Helper para obtener el nombre del conductor por id
    const getConductorNombre = (id: string) => {
        const c = conductores.find(c => c._id === id);
        return c ? `${c.nombre} (${c.ci})` : '—';
    };

    useEffect(() => {
        fetchConductores();
    }, []);

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
            animate('#envio-info', {
                opacity: [0, 1],
                y: [20, 0],
                duration: 500,
                ease: 'outQuad',
            });
        }
    }, [pedido]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (pedido?.envio?.estado_envio === 'en_proceso' && pedido.envio.fechainicio_envio) {
            const updateElapsed = () => {
                const inicio = new Date(pedido.envio!.fechainicio_envio!);
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
        } else if (pedido?.envio?.fechainicio_envio && pedido.envio.fechafin_envio) {
            const inicio = new Date(pedido.envio.fechainicio_envio);
            const fin = new Date(pedido.envio.fechafin_envio);
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

    const handleIniciarEnvio = async () => {
        if (!id || !admin || !selectedConductor) return;
        setLoading(true);
        try {
            const conductorObj = conductores.find(c => c._id === selectedConductor);
            const conductorNombre = conductorObj ? conductorObj.nombre : '';
            await iniciarEnvio(id, admin.usuario, conductorNombre);
            toast.success("Envío iniciado correctamente.");
            fetchPedidos();
        } catch (error: any) {
            toast.error(`Error al iniciar envío: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEntregar = async () => {
        if (!pedido) return;
        setLoading(true);
        try {
            await entregarPedido(pedido._id);
            toast.success("Pedido entregado.");
            navigate("/admin/enviadospedidos");
        } catch (error: any) {
            toast.error(`Error al entregar: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarEnvio = async () => {
        if (!pedido) return;
        setLoading(true);
        try {
            await cancelarProceso(pedido._id, ESTADOS_PEDIDO.ENVIADO);
            toast.success("Envío cancelado. Pedido devuelto a 'packing'.");
            navigate("/admin/enviopedidos");
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

    const isEnvioStarted = pedido.envio?.estado_envio === 'en_proceso';
    const isEnvioFinalizado = pedido.envio?.estado_envio === 'entregado';
    const isEditable = pedido.estado === ESTADOS_PEDIDO.ENVIADO && !isEnvioFinalizado;

    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Envío de Pedido #{pedido._id.slice(-6)}</CardTitle>
                            <CardDescription>Cliente: {pedido.cliente} - RIF: {pedido.rif}</CardDescription>
                        </div>
                        <Badge variant={pedido.estado === 'enviado' ? 'default' : 'secondary'}>
                            {pedido.estado.toUpperCase()}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div id="envio-info" className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Usuario Envío</p>
                            <p className="text-lg font-semibold">{pedido.envio?.usuario || 'No iniciado'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Conductor</p>
                            <p className="text-lg font-semibold">{getConductorNombre(pedido.envio?.conductor || "")}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Inicio Envío</p>
                            <p className="text-lg font-semibold">{pedido.envio?.fechainicio_envio ? new Date(pedido.envio.fechainicio_envio).toLocaleString() : '—'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tiempo Transcurrido</p>
                            <p className="text-lg font-semibold">{elapsed}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Estado Envío</p>
                            <p className={`text-lg font-semibold ${isEnvioStarted ? 'text-blue-600' : 'text-gray-600'}`}>
                                {pedido.envio?.estado_envio?.replace('_', ' ') || 'Pendiente'}
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
                            {!isEnvioStarted && isEditable && (
                                <div className="flex flex-col md:flex-row gap-2 items-center">
                                    <select
                                        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground min-w-[180px]"
                                        value={selectedConductor}
                                        onChange={e => setSelectedConductor(e.target.value)}
                                        required
                                        aria-label="Seleccionar conductor"
                                    >
                                        <option value="" disabled>
                                            Selecciona un conductor
                                        </option>
                                        {conductores.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.nombre} ({c.ci})
                                            </option>
                                        ))}
                                    </select>
                                    {selectedConductor && (
                                        <span className="text-sm text-gray-700 px-2 py-1 bg-gray-100 rounded transition-all">
                                            {getConductorNombre(selectedConductor)}
                                        </span>
                                    )}
                                    <Button onClick={handleIniciarEnvio} disabled={loading || !selectedConductor}>
                                        <AiOutlinePlayCircle className="mr-2 h-4 w-4" /> Iniciar Envío
                                    </Button>
                                </div>
                            )}
                            {isEnvioStarted && isEditable && (
                                <>
                                    <Button onClick={handleEntregar} disabled={loading}>
                                        <AiOutlineCheckCircle className="mr-2 h-4 w-4" /> Entregar
                                    </Button>
                                    <Button variant="destructive" onClick={handleCancelarEnvio} disabled={loading}>
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

export default EnvioDetalle;
