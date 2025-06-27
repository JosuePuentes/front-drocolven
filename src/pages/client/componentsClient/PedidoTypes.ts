export interface ProductoPedido {
  id: string;
  descripcion: string;
  cantidad_pedida: number;
  precio: number;
  descuento1?: number;
  descuento2?: number;
  descuento3?: number;
  descuento4?: number;
}

export interface Pedido {
  _id: string;
  fecha: string;
  total: number;
  estado: string;
  observacion?: string;
  productos?: ProductoPedido[];
  cliente: string;
}

export interface EstadoPedidoType {
  label: string;
  badgeClass: string;
}

export type EstadoPedidoKey = 'pedido_creado' | 'en_proceso' | 'pedido_armado' | 'enviado' | 'entregado' | 'cancelado';

export const ESTADOS: Record<EstadoPedidoKey, EstadoPedidoType> = {
  pedido_creado: {
    label: 'Pendiente',
    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  en_proceso: {
    label: 'En Proceso',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  pedido_armado: {
    label: 'Armado',
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
  },
  enviado: {
    label: 'Enviado',
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  entregado: {
    label: 'Entregado',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  cancelado: {
    label: 'Cancelado',
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
  },
};
