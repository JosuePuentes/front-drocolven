import { usePedido, PedidoArmado } from "../hooks/usePedido";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { AiOutlineArrowLeft, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { animate } from 'animejs';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EnvioDetalle: React.FC = () => {
  const { id } = useParams();
  const { pedidos, fetchPedidos, loading, entregarPedido, cancelarProceso } = usePedido();
  const [pedido, setPedido] = useState<PedidoArmado | null>(null);
  const [elapsed, setElapsed] = useState<string>('—');
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchPedidos(); }, []);

  useEffect(() => {
    if (id) {
      const encontrado = pedidos.find((p) => p._id === id) || null;
      setPedido(encontrado);
    }
  }, [id, pedidos]);

  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [0, 1],
        y: [40, 0],
        duration: 500,
        ease: 'easeOutQuad',
      });
    }
  }, [pedido]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (
      pedido &&
      pedido.envio?.fechaini_envio &&
      pedido.envio?.estado_envio === 'en_proceso' &&
      !pedido.envio?.fechafin_envio
    ) {
      const start = new Date(pedido.envio.fechaini_envio).getTime();
      interval = setInterval(() => {
        const now = Date.now();
        const diff = now - start;
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setElapsed(`${mins}:${secs.toString().padStart(2, '0')}`);
      }, 1000);
    } else if (
      pedido &&
      pedido.envio?.fechaini_envio &&
      pedido.envio?.fechafin_envio
    ) {
      const start = new Date(pedido.envio.fechaini_envio).getTime();
      const end = new Date(pedido.envio.fechafin_envio).getTime();
      const diff = end - start;
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setElapsed(`${mins}:${secs.toString().padStart(2, '0')}`);
    } else {
      setElapsed('—');
    }
    return () => { if (interval) clearInterval(interval); };
  }, [pedido]);

  const handleEntregar = async () => {
    if (!pedido) return;
    await entregarPedido(pedido._id);
    navigate("/admin/enviadospedidos");
  };

  const handleCancelarEnvio = async () => {
    if (!pedido) return;
    await cancelarProceso(pedido._id, 'enviado');
    navigate("/admin/enviopedidos");
  };

  if (loading || !pedido) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Cargando detalles del envío...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card ref={cardRef} className="w-full max-w-2xl shadow-lg border-gray-200 bg-white rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <Button onClick={() => navigate(-1)} variant="ghost" size="icon" aria-label="Volver">
            <AiOutlineArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex flex-col items-center flex-1">
            <span className="text-xs text-gray-400 tracking-wide">Envío</span>
            <span className="text-lg font-semibold text-gray-800">Pedido #{pedido._id.slice(-6)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gray-100 pb-4 mb-4">
          <div>
            <span className="text-xs text-gray-500">Usuario Envío:</span>
            <span className="block text-sm font-semibold text-gray-800">{pedido.envio?.usuario || '—'}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500">Inicio Envío:</span>
            <span className="block text-sm font-semibold text-gray-800">{pedido.envio?.fechaini_envio ? new Date(pedido.envio.fechaini_envio).toLocaleString() : '—'}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500">Tiempo de Envío:</span>
            <span className="block text-sm font-semibold text-gray-800">{elapsed}</span>
          </div>
          <div>
            <span className="text-xs text-gray-500">Estado Envío:</span>
            <span className={`block text-sm font-semibold ${pedido.envio?.estado_envio === 'en_proceso' ? 'text-blue-600' : 'text-green-700'}`}>{pedido.envio?.estado_envio?.replace('_', ' ') || '—'}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <span className="text-base font-semibold text-gray-700">Cliente: {pedido.cliente}</span>
          <span className="text-base font-semibold text-gray-700">RIF: {pedido.rif}</span>
          <span className="text-base font-semibold text-gray-700">Total: ${pedido.total.toFixed(2)}</span>
        </div>
        <div className="flex flex-wrap gap-2 justify-end mt-4">
          <Button onClick={handleEntregar} variant="default" className="flex items-center gap-1">
            <AiOutlineCheckCircle className="w-5 h-5" /> Entregar
          </Button>
          <Button onClick={handleCancelarEnvio} variant="destructive" className="flex items-center gap-1">
            <AiOutlineCloseCircle className="w-5 h-5" /> Cancelar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EnvioDetalle;
