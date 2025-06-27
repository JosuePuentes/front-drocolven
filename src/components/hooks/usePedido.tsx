import { useState } from "react";

export const ESTADOS_PEDIDO = {
  NUEVO: "nuevo",
  PICKING: "picking",
  PACKING: "packing",
  ENVIADO: "enviado",
  ENTREGADO: "entregado",
  CANCELADO: "cancelado"
} as const;

export type EstadoPedido = typeof ESTADOS_PEDIDO[keyof typeof ESTADOS_PEDIDO];


export interface ProductoArmado {
  id: string;
  precio: number;
  precio_n: number;
  subtotal: number;
  descripcion: string;
  descuento1: number;
  descuento2: number;
  descuento3: number;
  descuento4: number;
  cantidad_pedida: number;
  cantidad_encontrada: number;
}

export interface PackingInfo {
  usuario?: string;
  estado_packing?: 'en_proceso' | 'finalizado' | 'cancelado';
  fechainicio_packing?: string;
  fechafin_packing?: string;
}

// Agregar tipo para EnvioInfo
export interface EnvioInfo {
  usuario?: string;
  chofer?: string;
  estado_envio?: 'en_proceso' | 'entregado' | 'cancelado';
  fechaini_envio?: string;
  fechafin_envio?: string;
}
export interface PickingInfo {
  usuario?: string;
  fechainicio_picking?: string;
  fechafin_picking?: string;
  estado_picking?: 'en_proceso' | 'finalizado' | 'cancelado';
}

export interface PedidoArmado {
  cliente: string;
  fecha: string;
  total: number;
  rif: string;
  _id: string;
  observacion: string;
  productos: ProductoArmado[];
  estado: EstadoPedido;
  armado_por?: string;
  // Remove flat picking fields, add nested picking
  picking?: PickingInfo;
  // Packing object
  packing?: PackingInfo;
  envio?: EnvioInfo;
}

export const usePedido = () => {
  const [pedido, setPedido] = useState<PedidoArmado | null>(null);
  const [pedidos, setPedidos] = useState<PedidoArmado[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/obtener_pedidos/`);
      const data: PedidoArmado[] = await response.json();
      const ventasFiltradas = data.filter((venta) => venta.estado === ESTADOS_PEDIDO.NUEVO);
      setPedidos(ventasFiltradas);
    } catch (error) {
      console.error("Error al obtener ventas:", error);
    } finally {
      setLoading(false);
    }
  };


  // Función para obtener pedidos desde el backend
  const obtenerPedidos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/obtener_pedidos/`);
      if (!response.ok) {
        throw new Error("Error al obtener pedidos");
      }
      const data: PedidoArmado[] = await response.json();
      setPedidos(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  const actualizarPedido = async (pedidoId: string, datos: Partial<PedidoArmado>) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/${pedidoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el pedido");
      }
      // Actualizar el estado local
      const pedidoActualizado = await response.json();
      setPedido(pedidoActualizado);
      setPedidos(prev => prev.map(p => p._id === pedidoId ? pedidoActualizado : p));

    } catch (error) {
      console.error(`Error al actualizar el pedido:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  // Función para actualizar el estado de un pedido
  const actualizarEstadoPedido = async (pedidoId: string, nuevoEstado: EstadoPedido) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_estado/${pedidoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevo_estado: nuevoEstado }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el estado del pedido");
      }
      // Opcional: refrescar el pedido actualizado
      await obtenerPedidos();
    } catch (error) {
      console.error(`Error al actualizar el estado del pedido (${nuevoEstado}):`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const iniciarPicking = async (pedidoId: string, usuario: string) => {
    const datos = {
      estado: ESTADOS_PEDIDO.PICKING,
      picking: {
        usuario,
        fechainicio_picking: new Date().toISOString(),
        estado_picking: 'en_proceso' as const,
      }
    };
    await actualizarPedido(pedidoId, datos);
  };

  const guardarPicking = async (pedidoId: string, productos: ProductoArmado[]) => {
    await actualizarPedido(pedidoId, { productos });
  };

  const finalizarPicking = async (pedidoId: string) => {
    const datos = {
      estado: ESTADOS_PEDIDO.PACKING,
      picking: {
        ...pedido?.picking,
        fechafin_picking: new Date().toISOString(),
        estado_picking: 'finalizado' as const,
      }
    };
    await actualizarPedido(pedidoId, datos);
  };

  const iniciarPacking = async (pedidoId: string, usuario: string) => {
    const datos = {
      estado: ESTADOS_PEDIDO.PACKING,
      packing: {
        usuario,
        fechainicio_packing: new Date().toISOString(),
        estado_packing: 'en_proceso' as const,
      }
    };
    await actualizarPedido(pedidoId, datos);
  };

  const finalizarPacking = async (pedidoId: string) => {
    const datos = {
      estado: ESTADOS_PEDIDO.ENVIADO,
      packing: {
        ...pedido?.packing,
        fechafin_packing: new Date().toISOString(),
        estado_packing: 'finalizado' as const,
      }
    };
    await actualizarPedido(pedidoId, datos);
  };

  const iniciarEnvio = async (pedidoId: string, usuario: string, chofer: string) => {
    const datos = {
      estado: ESTADOS_PEDIDO.ENVIADO,
      envio: {
        usuario,
        chofer,
        fechaini_envio: new Date().toISOString(),
        estado_envio: 'en_proceso' as const,
      }
    };
    await actualizarPedido(pedidoId, datos);
  };

  const entregarPedido = async (pedidoId: string) => {
    const datos = {
      estado: ESTADOS_PEDIDO.ENTREGADO,
      envio: {
        ...pedido?.envio,
        fechafin_envio: new Date().toISOString(),
        estado_envio: 'entregado' as const,
      }
    };
    await actualizarPedido(pedidoId, datos);
  };

  const cancelarProceso = async (pedidoId: string, estadoActual: EstadoPedido) => {
    let datos: Partial<PedidoArmado> = {};
    switch (estadoActual) {
      case ESTADOS_PEDIDO.PICKING:
        datos = {
          estado: ESTADOS_PEDIDO.NUEVO,
          picking: undefined,
          productos: pedido?.productos.map(p => ({ ...p, cantidad_encontrada: 0 }))
        };
        break;
      case ESTADOS_PEDIDO.PACKING:
        datos = {
          estado: ESTADOS_PEDIDO.PICKING,
          packing: undefined,
        };
        break;
      case ESTADOS_PEDIDO.ENVIADO:
        datos = {
          estado: ESTADOS_PEDIDO.PACKING,
          envio: undefined,
        };
        break;
      default:
        return;
    }
    await actualizarPedido(pedidoId, datos);
  };


  const iniciarPedido = (
    cliente: string,
    rif: string,
    total: number,
    fecha: string,
    observacion: string,
    _id: string,
    productos: ProductoArmado[]
  ) => {
    const productosConCantidadEncontrada = productos.map((prod) => ({
      ...prod,
      cantidad_encontrada: 0,
    }));

    setPedido({
      cliente,
      fecha,
      total,
      rif,
      _id,
      observacion,
      productos: productosConCantidadEncontrada,
      estado: ESTADOS_PEDIDO.NUEVO,
    });
  };

  const actualizarCantidadEncontrada = (productoId: string, cantidad: number) => {
    if (!pedido) return;
    console.log(" cantidad encontrada para producto:", productoId, "con cantidad:", cantidad);
    const productosActualizados = pedido.productos.map((prod) =>
      prod.id === productoId ? { ...prod, cantidad_encontrada: cantidad } : prod
    );

    setPedido({ ...pedido, productos: productosActualizados });
  };


  return {
    pedido,
    pedidos,
    loading,
    obtenerPedidos,
    actualizarEstadoPedido,
    iniciarPedido,
    actualizarCantidadEncontrada,
    fetchPedidos,
    setLoading,
    // Nuevas funciones
    actualizarPedido,
    iniciarPicking,
    guardarPicking,
    finalizarPicking,
    iniciarPacking,
    finalizarPacking,
    iniciarEnvio,
    entregarPedido,
    cancelarProceso,
    setPedido
  };
};
