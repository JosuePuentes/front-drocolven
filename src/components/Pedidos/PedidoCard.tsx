import { animate } from 'animejs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AiOutlineFileText, AiOutlineTag, AiOutlineCalendar, AiOutlineUser, AiOutlineClockCircle } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import { differenceInSeconds } from 'date-fns';
import type { PackingInfo, PickingInfo, EnvioInfo } from './pedidotypes';

export const PedidoCard: React.FC<{ pedido: any, onClick: () => void, extra?: React.ReactNode }> = ({ pedido, onClick, extra }) => {
    const packing: PackingInfo = pedido.packing;
    const picking: PickingInfo = pedido.picking;
    const envio: EnvioInfo = pedido.envio;

    // Cronómetro de picking
    const [pickingElapsed, setPickingElapsed] = useState<string>('—');
    // Cronómetro de packing
    const [packingElapsed, setPackingElapsed] = useState<string>('—');
    // Cronómetro de envío
    const [envioElapsed, setEnvioElapsed] = useState<string>('—');

    const cardRef = useRef<HTMLDivElement>(null); // Ref para la animación de entrada

    // Lógica del cronómetro de Picking
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (
            picking?.fechainicio_picking &&
            picking?.estado_picking === 'en_proceso' &&
            !picking?.fechafin_picking
        ) {
            const updateElapsed = () => {
                const inicio = toZonedTime(new Date(picking.fechainicio_picking!), 'America/Caracas');
                const nowVenezuela = toZonedTime(new Date(), 'America/Caracas');
                const diff = differenceInSeconds(nowVenezuela, inicio);
                const hours = Math.floor(diff / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = diff % 60;
                setPickingElapsed(
                    hours > 0
                        ? `${hours}h ${minutes}m ${seconds}s`
                        : `${minutes}m ${seconds}s`
                );
            };
            updateElapsed();
            interval = setInterval(updateElapsed, 1000);
        } else if (picking?.fechainicio_picking && picking?.fechafin_picking) {
            const inicio = toZonedTime(new Date(picking.fechainicio_picking), 'America/Caracas');
            const fin = toZonedTime(new Date(picking.fechafin_picking), 'America/Caracas');
            const diff = differenceInSeconds(fin, inicio);
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;
            setPickingElapsed(
                hours > 0
                    ? `${hours}h ${minutes}m ${seconds}s`
                    : `${minutes}m ${seconds}s`
            );
        } else {
            setPickingElapsed('—');
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [picking?.fechainicio_picking, picking?.fechafin_picking, picking?.estado_picking]);

    // Lógica del cronómetro de Packing
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (
            packing?.fechainicio_packing &&
            packing.estado_packing === 'en_proceso' &&
            !packing.fechafin_packing
        ) {
            const updateElapsed = () => {
                const inicio = toZonedTime(new Date(packing!.fechainicio_packing!), 'America/Caracas');
                const nowVenezuela = toZonedTime(new Date(), 'America/Caracas');
                const diff = differenceInSeconds(nowVenezuela, inicio);
                const hours = Math.floor(diff / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = Math.floor(diff % 60); // Math.floor para segundos
                setPackingElapsed(
                    hours > 0
                        ? `${hours}h ${minutes}m ${seconds}s`
                        : `${minutes}m ${seconds}s`
                );
            };
            updateElapsed();
            interval = setInterval(updateElapsed, 1000);
        } else if (packing?.fechainicio_packing && packing.fechafin_packing) {
            const inicio = toZonedTime(new Date(packing.fechainicio_packing), 'America/Caracas');
            const fin = toZonedTime(new Date(packing.fechafin_packing), 'America/Caracas');
            const diff = differenceInSeconds(fin, inicio);
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = Math.floor(diff % 60); // Math.floor para segundos
            setPackingElapsed(
                hours > 0
                    ? `${hours}h ${minutes}m ${seconds}s`
                    : `${minutes}m ${seconds}s`
            );
        } else {
            setPackingElapsed('—');
        }
        return () => { if (interval) clearInterval(interval); };
    }, [packing?.fechainicio_packing, packing?.fechafin_packing, packing?.estado_packing]);

    // Lógica del cronómetro de Envío (simétrico a los anteriores)
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (
            envio?.fechainicio_envio &&
            envio?.estado_envio === 'en_proceso' &&
            !envio?.fechafin_envio
        ) {
            const updateElapsed = () => {
                const inicio = toZonedTime(new Date(envio!.fechainicio_envio!), 'America/Caracas');
                const nowVenezuela = toZonedTime(new Date(), 'America/Caracas');
                const diff = differenceInSeconds(nowVenezuela, inicio);
                const hours = Math.floor(diff / 3600);
                const minutes = Math.floor((diff % 3600) / 60);
                const seconds = Math.floor(diff % 60);
                setEnvioElapsed(
                    hours > 0
                        ? `${hours}h ${minutes}m ${seconds}s`
                        : `${minutes}m ${seconds}s`
                );
            };
            updateElapsed();
            interval = setInterval(updateElapsed, 1000);
        } else if (envio?.fechainicio_envio && envio?.fechafin_envio) {
            const inicio = toZonedTime(new Date(envio.fechainicio_envio), 'America/Caracas');
            const fin = toZonedTime(new Date(envio.fechafin_envio), 'America/Caracas');
            const diff = differenceInSeconds(fin, inicio);
            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = Math.floor(diff % 60);
            setEnvioElapsed(
                hours > 0
                    ? `${hours}h ${minutes}m ${seconds}s`
                    : `${minutes}m ${seconds}s`
            );
        } else {
            setEnvioElapsed('—');
        }
        return () => { if (interval) clearInterval(interval); };
    }, [envio?.fechainicio_envio, envio?.fechafin_envio, envio?.estado_envio]);


    // Animación de entrada de la tarjeta
    useEffect(() => {
        if (cardRef.current) {
            animate(cardRef.current, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 800,
                ease: 'easeOutExpo'
            });
        }
    }, []);

    // Función para renderizar el temporizador en vivo de forma genérica
    const renderLiveTimer = (elapsedTime: string, status: string | undefined | null, label: string, colorClass: string) => {
        if (status === 'en_proceso') {
            return (
                <div className="flex flex-col items-center justify-center py-3 px-4 bg-gradient-to-r from-background to-secondary/10 border-t border-b border-dashed border-gray-200 animate-pulse">
                    <span className={`text-2xl font-mono font-bold ${colorClass} tracking-widest drop-shadow-sm select-none`}>
                        {elapsedTime}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">{label}</span>
                </div>
            );
        }
        return null;
    };

    // Función para obtener la clase de color del estado del Badge
    const getEstadoBadgeVariant = (estado?: string): 'default' | 'secondary' | 'outline' | 'destructive' | null | undefined => {
        switch (estado) {
            case 'nuevo': return 'secondary';
            case 'picking': return 'secondary'; // Usar 'secondary' para picking
            case 'en_proceso': return 'destructive'; // En proceso es un estado crítico o activo
            case 'terminado': return 'default'; // Usar 'default' para terminado
            case 'packing': return 'secondary'; // Usar 'secondary' para packing
            case 'enviado': return 'default';
            case 'entregado': return 'default'; // Usar 'default' para entregado
            case 'cancelado': return 'destructive';
            default: return 'outline'; // Para cualquier otro estado o nulo
        }
    };

    const formatDateTime = (isoString?: string | null): string => {
        if (!isoString) return '—';
        try {
            const date = toZonedTime(new Date(isoString), 'America/Caracas');
            return date.toLocaleString();
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    return (
        <Card
            ref={cardRef}
            className="bg-card text-card-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] flex flex-col justify-between cursor-pointer border-border animate-in fade-in slide-in-from-bottom-5"
            onClick={onClick}
            tabIndex={0}
            aria-label={`Ver detalles del pedido ${pedido._id} de ${pedido.cliente}`}
        >
            {/* Encabezado del Pedido */}
            <div className="flex flex-col gap-1 p-4 border-b border-border/70 bg-secondary/10 rounded-t-xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground leading-tight">{pedido.cliente}</h3>
                    <Badge variant={getEstadoBadgeVariant(pedido.estado)} className="text-xs px-2 py-0.5 capitalize">
                        {pedido.estado.replace('_', ' ')}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                    <span className="font-medium">RIF:</span> {pedido.rif || 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium">ID Pedido:</span> {pedido._id}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <AiOutlineCalendar className="h-3 w-3" />
                    <span className="font-medium">Fecha:</span> {formatDateTime(pedido.fecha)}
                </p>
            </div>

            {/* Temporizadores en vivo */}
            {renderLiveTimer(pickingElapsed, picking?.estado_picking, "Picking en curso", "text-primary")}
            {renderLiveTimer(packingElapsed, packing?.estado_packing, "Packing en curso", "text-indigo-600")}
            {renderLiveTimer(envioElapsed, envio?.estado_envio, "Envío en curso", "text-yellow-600")}

            <CardContent className="text-sm text-muted-foreground space-y-3 p-4">
                {pedido.observacion && (
                    <div className="flex items-start gap-2 pt-2 border-t border-border/50">
                        <AiOutlineFileText className="h-4 w-4 text-primary mt-1" />
                        <div>
                            <p className="font-semibold text-foreground">Observaciones:</p>
                            <p className="text-sm">{pedido.observacion}</p>
                        </div>
                    </div>
                )}

                {extra} {/* Para contenido adicional pasado como prop */}

                {/* Sección de Picking */}
                {(picking?.usuario || picking?.fechainicio_picking || picking?.fechafin_picking || picking?.estado_picking) && (
                    <div className="pt-3 border-t border-border/50">
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <AiOutlineTag className="h-4 w-4 text-green-500" />
                            Información de Picking
                        </h4>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <dt className="flex items-center gap-1 text-muted-foreground"><AiOutlineUser className="h-3 w-3" /> Usuario:</dt>
                            <dd className="font-medium text-foreground">{picking.usuario || '—'}</dd>

                            <dt className="flex items-center gap-1 text-muted-foreground"><AiOutlineCalendar className="h-3 w-3" /> Inicio:</dt>
                            <dd className="font-medium text-foreground">{formatDateTime(picking.fechainicio_picking)}</dd>

                            <dt className="flex items-center gap-1 text-muted-foreground"><AiOutlineClockCircle className="h-3 w-3" /> Duración:</dt>
                            <dd className="font-medium text-foreground">{pickingElapsed}</dd>

                            <dt className="flex items-center gap-1 text-muted-foreground"><AiOutlineTag className="h-3 w-3" /> Estado:</dt>
                            <dd className={`font-semibold capitalize ${picking.estado_picking === 'en_proceso' ? 'text-destructive' : 'text-success'}`}>
                                {picking.estado_picking ? picking.estado_picking.replace('_', ' ') : '—'}
                            </dd>
                        </dl>
                    </div>
                )}

                {/* Sección de Packing */}
                {(packing?.usuario || packing?.fechainicio_packing || packing?.fechafin_packing || packing?.estado_packing) && (
                    <div className="pt-3 border-t border-border/50">
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <AiOutlineTag className="h-4 w-4 text-blue-500" />
                            Información de Packing
                        </h4>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <dt className="flex items-center gap-1 text-muted-foreground"><AiOutlineUser className="h-3 w-3" /> Usuario:</dt>
                            <dd className="font-medium text-foreground">{packing.usuario || '—'}</dd>

                            <dt className="flex items-center gap-1 text-muted-foreground"><AiOutlineCalendar className="h-3 w-3" /> Inicio:</dt>
                            <dd className="font-medium text-foreground">{formatDateTime(packing.fechainicio_packing)}</dd>

                            <dt className="flex items-center gap-1 text-muted-foreground"><AiOutlineClockCircle className="h-3 w-3" /> Duración:</dt>
                            <dd className="font-medium text-foreground">{packingElapsed}</dd>

                            <dt className="flex items-center gap-1 text-muted-foreground"><AiOutlineTag className="h-3 w-3" /> Estado:</dt>
                            <dd className={`font-semibold capitalize ${packing.estado_packing === 'en_proceso' ? 'text-destructive' : 'text-success'}`}>
                                {packing.estado_packing ? packing.estado_packing.replace('_', ' ') : '—'}
                            </dd>
                        </dl>
                    </div>
                )}

                {/* Sección de Envío */}
                {(envio?.usuario || envio?.fechainicio_envio || envio?.fechafin_envio || envio?.estado_envio) && (
                    <div className="pt-3 border-t border-border/50">
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <AiOutlineTag className="h-4 w-4 text-yellow-500" />
                            Información de Envío
                        </h4>
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <dt className="flex items-center gap-1 text-muted-foreground">Conductor:</dt>
                            <dd className="font-medium text-foreground">{envio?.conductor || '—'}</dd>
                            <dt className="flex items-center gap-1 text-muted-foreground">Usuario:</dt>
                            <dd className="font-medium text-foreground">{envio?.usuario || '—'}</dd>
                            <dt className="flex items-center gap-1 text-muted-foreground">Inicio:</dt>
                            <dd>{envio?.fechainicio_envio ? formatDateTime(envio.fechainicio_envio) : '—'}</dd>
                            <dt className="flex items-center gap-1 text-muted-foreground">Fin:</dt>
                            <dd>{envio?.fechafin_envio ? formatDateTime(envio.fechafin_envio) : '—'}</dd>
                            <dt className="flex items-center gap-1 text-muted-foreground">Estado:</dt>
                            <dd>{envio?.estado_envio ? envio.estado_envio.replace('_', ' ') : '—'}</dd>
                        </dl>
                    </div>
                )}

                {/* Pie de la tarjeta */}
                <div className="flex justify-between items-center pt-4 border-t border-border/50 text-foreground font-semibold">
                    <span>Total:</span>
                    <span className="text-xl">${pedido.total ? pedido.total.toFixed(2) : '0.00'}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default PedidoCard;