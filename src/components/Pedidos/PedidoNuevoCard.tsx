import React from "react";
import { PedidoArmado } from "../../components/Pedidos/pedidotypes";

interface PedidoNuevoCardProps {
  pedido: PedidoArmado;
  onClick?: () => void;
}

const PedidoNuevoCard: React.FC<PedidoNuevoCardProps> = ({ pedido, onClick }) => {
  const fechaPedido = pedido.fecha_creacion || pedido.fecha;

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-start justify-center cursor-pointer hover:shadow-md transition-all duration-200 min-w-[220px]"
      onClick={onClick}
      aria-label={`Pedido nuevo de ${pedido.cliente}`}
    >
      <div className="text-base font-bold text-gray-900 mb-1 truncate">{pedido.cliente}</div>
      <div className="text-xs text-gray-500 font-mono">RIF: {pedido.rif}</div>
      {fechaPedido && (
        <div className="text-xs text-gray-400 mt-1 font-mono">{fechaPedido}</div>
      )}
    </div>
  );
};

export default PedidoNuevoCard;
