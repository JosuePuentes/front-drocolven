import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ESTADOS, EstadoPedidoKey } from './PedidoTypes';

interface EstadoBadgeProps {
  estado: EstadoPedidoKey;
  icon: React.ReactNode;
}

const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado, icon }) => (
  <Badge className={`flex items-center gap-1 border ${ESTADOS[estado].badgeClass} px-2 py-1 text-xs font-medium`}> 
    {icon}
    {ESTADOS[estado].label}
  </Badge>
);

export default EstadoBadge;
