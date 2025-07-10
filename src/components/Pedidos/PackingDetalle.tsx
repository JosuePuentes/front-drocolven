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
    AiOutlineBarcode
} from 'react-icons/ai';
import { toast } from "sonner";
import { useAdminAuth } from '@/context/AuthAdminContext';
import { toZonedTime } from 'date-fns-tz';
import { differenceInSeconds } from 'date-fns';
import { PedidoArmado } from "./pedidotypes";
import { animate } from 'animejs';
import { BuscarProductoPorCodigo } from './BuscarProductoPorCodigo';

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
    const [filtroCodigo, setFiltroCodigo] = useState<string>('');
    const [noMatch, setNoMatch] = useState(false);

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

                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">Productos del Pedido</h3>
                        <BuscarProductoPorCodigo
                            productos={pedido.productos.filter(p => typeof p.codigo === 'string').map(p => ({ codigo: String(p.codigo), descripcion: p.descripcion }))}
                            onEncontrado={(codigo) => {
                                setFiltroCodigo(codigo);
                                const hayMatch = pedido.productos.some(producto => String(producto.codigo).includes(codigo));
                                if (!hayMatch && codigo) {
                                    setNoMatch(true);
                                    setTimeout(() => setNoMatch(false), 2000);
                                } else {
                                    setNoMatch(false);
                                }
                            }}
                            placeholder="Buscar o escanear código de barras..."
                        />
                        <div className={`space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100 ${noMatch ? 'bg-red-100 transition-colors duration-500' : ''}`}
                            ref={el => {
                                if (noMatch && el) {
                                    animate(el, { backgroundColor: ['#fff', '#fee2e2', '#fff'], duration: 2000, ease: 'outCubic' });
                                }
                            }}
                        >
                            {(pedido.productos.some(producto => !filtroCodigo || String(producto.codigo).includes(filtroCodigo))
                                ? pedido.productos.filter(producto => !filtroCodigo || String(producto.codigo).includes(filtroCodigo))
                                : pedido.productos
                            ).map((producto, idx) => (
                                <div key={producto.codigo} className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                                        <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-base shadow-sm">{idx + 1}</span>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-base md:text-lg">{producto.descripcion}</div>
                                            <div className="flex items-center gap-2 text-gray-700 text-sm mt-1">
                                                <AiOutlineBarcode className="w-5 h-5 text-gray-500" />
                                                <span className="font-mono tracking-widest">{producto.codigo ?? '—'}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Cantidad pedida: <span className="font-bold text-lg text-gray-700">{producto.cantidad_pedida}</span>
                                                <span className="mx-2 text-gray-400">|</span>
                                                Encontrada: <span className="font-bold text-2xl text-blue-700">{producto.cantidad_encontrada ?? 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-0 text-right">
                                        <span className="text-base font-bold text-gray-900">${(producto.precio_n ?? producto.precio_unitario ?? 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PackingDetalle;