// Tipos e interfaces relacionados con pedidos extraídos para uso global en la app.

export interface ProductoArmado {
  id: string;
  descripcion: string;
  cantidad_pedida: number;
  cantidad_encontrada: number;
  precio_unitario: number;
  subtotal: number;
  // Opcionales para compatibilidad
  precio?: number;
  precio_n?: number;
  descuento1?: number;
  descuento2?: number;
  descuento3?: number;
  descuento4?: number;
}

export interface PickingInfo {
  usuario: string;
  fechainicio_picking: string | null;
  fechafin_picking: string | null;
  estado_picking: 'pendiente' | 'en_proceso' | 'finalizado' | 'cancelado' | '';
}

export interface PackingInfo {
  usuario: string;
  fechainicio_packing: string | null;
  fechafin_packing: string | null;
  estado_packing: 'pendiente' | 'en_proceso' | 'finalizado' | 'cancelado' | '';
}

export interface EnvioInfo {
  usuario: string;
  conductor: string; // Cambiado de chofer a conductor
  fechainicio_envio: string | null;
  fechafin_envio: string | null;
  estado_envio: 'pendiente' | 'en_proceso' | 'entregado' | 'finalizado' | 'cancelado';
  tracking?: string;
}

export type EstadoPedido =
  | 'nuevo'
  | 'picking'
  | 'packing'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

export interface PedidoArmado {
  _id: string;
  cliente: string;
  rif: string;
  productos: ProductoArmado[];
  total: number;
  estado: EstadoPedido;
  picking: PickingInfo;
  packing: PackingInfo;
  envio: EnvioInfo;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  observacion?: string;
  armado_por?: string;
}

export interface CantidadesInput {
  [productoId: string]: string;
}
