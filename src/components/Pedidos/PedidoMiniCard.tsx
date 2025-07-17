import { animate } from 'animejs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AiOutlineUser, AiOutlineClockCircle, AiOutlineIdcard } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import type { PedidoArmado } from './pedidotypes';

interface PedidoMiniCardProps {
  pedido: PedidoArmado;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const estadoLabels: Record<string, string> = {
  picking: 'Picking',
  packing: 'Packing',
  enviado: 'Envío',
  facturando: 'Facturación',
};

const getUsuarioActual = (pedido: PedidoArmado): string => {
  switch (pedido.estado) {
    case 'picking':
      return pedido.picking?.usuario || '—';
    case 'packing':
      return pedido.packing?.usuario || '—';
    case 'enviado':
      return pedido.envio?.conductor || pedido.envio?.usuario || '—';
    case 'facturando':
      return pedido.facturacion?.usuario || '—';
    default:
      return '—';
  }
};

const getTiempoInicio = (pedido: PedidoArmado): string | null => {
  switch (pedido.estado) {
    case 'picking':
      return pedido.picking?.fechainicio_picking || null;
    case 'packing':
      return pedido.packing?.fechainicio_packing || null;
    case 'enviado':
      return pedido.envio?.fechainicio_envio || null;
    case 'facturando':
      return pedido.facturacion?.fechainicio_facturacion || null;
    default:
      return null;
  }
};

const PedidoMiniCard: React.FC<PedidoMiniCardProps> = ({ pedido, onClick, size = 'md' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiempo, setTiempo] = useState('—');
  const [timerColor, setTimerColor] = useState<string>('text-green-600');

  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        ease: 'easeOutExpo',
      });
    }
  }, []);

  useEffect(() => {
    const inicio = getTiempoInicio(pedido);
    let interval: NodeJS.Timeout | null = null;
    function update() {
      if (inicio) {
        const diff = Math.floor((Date.now() - new Date(inicio).getTime()) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        setTiempo(h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`);
        // Color logic considerando horas y minutos
        if (minColorAplica(pedido)) {
          const totalMin = h * 60 + m;
          if (totalMin < 25) {
            setTimerColor('text-green-600');
          } else if (totalMin < 40) {
            setTimerColor('text-yellow-500');
          } else {
            setTimerColor('text-red-600');
          }
        } else if (pedido.estado === 'facturando') {
          setTimerColor('text-blue-600');
        } else {
          setTimerColor('text-gray-700');
        }
      } else {
        setTiempo('—');
        setTimerColor('text-green-600');
      }
    }
    const enCurso =
      (pedido.estado === 'picking' && pedido.picking?.estado_picking === 'en_proceso') ||
      (pedido.estado === 'packing' && pedido.packing?.estado_packing === 'en_proceso') ||
      (pedido.estado === 'enviado' && pedido.envio?.estado_envio === 'en_proceso') ||
      (pedido.estado === 'facturando' && pedido.facturacion?.estado_facturacion === 'en_proceso');
    update();
    if (enCurso) {
      interval = setInterval(update, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [pedido]);

  // Helper para aplicar color solo en los estados picking, packing, enviado
  function minColorAplica(pedido: PedidoArmado) {
    return pedido.estado === 'picking' || pedido.estado === 'packing' || pedido.estado === 'enviado';
  }

  return (
    <Card
      ref={cardRef}
      className={`bg-card rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border animate-in fade-in slide-in-from-bottom-5 w-full max-w-md mx-auto ${size === 'lg' ? 'p-0 md:p-0' : 'p-0'}`}
      onClick={onClick}
      tabIndex={0}
      aria-label={`Ver detalles del pedido ${pedido._id}`}
    >
      <CardContent className={`flex flex-col gap-2 ${size === 'lg' ? 'p-4' : 'p-3'}`}>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className={`capitalize text-xs px-2 py-0.5 ${size === 'lg' ? 'text-base' : ''}`}>
            {estadoLabels[pedido.estado] || pedido.estado}
          </Badge>
          <span className={`text-xs text-muted-foreground ${size === 'lg' ? 'text-base' : ''}`}>#{pedido._id.slice(-5)}</span>
        </div>
        <div className="flex items-center gap-2">
          <AiOutlineIdcard className="w-6 h-6 text-green-600" />
          <span className="text-base text-gray-500 font-semibold">Cliente:</span>
          <span className="text-lg text-gray-800 font-semibold truncate max-w-[160px]">{pedido.cliente}</span>
        </div>
        <div className="flex items-center gap-2">
          <AiOutlineClockCircle className="w-6 h-6 text-gray-500" />
          <span className={`text-2xl font-mono font-bold ${timerColor}`}>{tiempo}</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <AiOutlineUser className="w-6 h-6 text-blue-600" />
          <span className="text-base text-gray-500 font-semibold">Usuario:</span>
          <span className="text-xl font-bold text-foreground truncate max-w-[160px]">{getUsuarioActual(pedido)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PedidoMiniCard;
