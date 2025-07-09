import { useState } from "react";
import {
  PedidoArmado,
  EstadoPedido,
  ProductoArmado,
} from "../Pedidos/pedidotypes";

export const ESTADOS_PEDIDO = {
  NUEVO: "nuevo",
  PICKING: "picking",
  PACKING: "packing",
  ENVIADO: "enviado",
  ENTREGADO: "entregado",
  CANCELADO: "cancelado"
} as const;

export const usePedido = () => {
  const [pedido, setPedido] = useState<PedidoArmado | null>(null);
  const [pedidos, setPedidos] = useState<PedidoArmado[]>([]);
  const [loading, setLoading] = useState(false);
  const [conductores, setConductores] = useState<{ _id: string; nombre: string; ci: string }[]>([]);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/obtener_pedidos/`);
      const data: PedidoArmado[] = await response.json();
      setPedidos(data);
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
      // Cambiar el endpoint al correcto según backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar/${pedidoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(datos),
        }
      );
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
    setLoading(true);
    try {
      const picking = {
        usuario,
        fechainicio_picking: new Date().toISOString(),
        estado_picking: 'en_proceso' as const,
      };
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_picking/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(picking),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al iniciar picking");
      }
      // Opcional: refrescar el pedido actualizado
      await obtenerPedidos();
    } catch (error) {
      console.error(`Error al iniciar picking:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const guardarPicking = async (pedidoId: string, productos: ProductoArmado[]) => {
    await actualizarPedido(pedidoId, { productos });
  };

  const finalizarPicking = async (pedidoId: string, productosActualizados?: ProductoArmado[]) => {
    if (!pedido) throw new Error("No hay pedido cargado");
    // Usar productos actualizados si se pasan, si no, usar los actuales
    const productos = productosActualizados || pedido.productos;
    const datos: PedidoArmado = {
      ...pedido,
      estado: ESTADOS_PEDIDO.PACKING,
      productos,
      picking: {
        ...pedido.picking,
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
        fechafin_packing: null,
        estado_packing: 'en_proceso' as const,
      }
    };
    await actualizarPedido(pedidoId, datos);
  };

  const finalizarPacking = async (pedidoId: string) => {
    const datos = {
      estado: ESTADOS_PEDIDO.ENVIADO,
      packing: {
        usuario: pedido?.packing?.usuario || '',
        fechainicio_packing: pedido?.packing?.fechainicio_packing || null,
        fechafin_packing: new Date().toISOString(),
        estado_packing: 'finalizado' as const,
      }
    };
    await actualizarPedido(pedidoId, datos);
  };

  const iniciarEnvio = async (pedidoId: string, usuario: string, conductor: string) => {
    const datos = {
      estado: ESTADOS_PEDIDO.ENVIADO,
      envio: {
        usuario,
        conductor, // Cambiado de chofer a conductor
        fechainicio_envio: new Date().toISOString(),
        fechafin_envio: null,
        estado_envio: 'en_proceso' as const,
        tracking: '',
      }
    };
    await actualizarPedido(pedidoId, datos);
  };

  const entregarPedido = async (pedidoId: string) => {
    const datos = {
      estado: ESTADOS_PEDIDO.ENTREGADO,
      envio: {
        usuario: pedido?.envio?.usuario || '',
        conductor: pedido?.envio?.conductor || '', // Cambiado de chofer a conductor
        fechainicio_envio: pedido?.envio?.fechainicio_envio || null,
        fechafin_envio: new Date().toISOString(),
        estado_envio: 'entregado' as const,
        tracking: pedido?.envio?.tracking || '',
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
    fecha_creacion: string,
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
      fecha_creacion,
      total,
      rif,
      _id,
      observacion,
      productos: productosConCantidadEncontrada,
      estado: ESTADOS_PEDIDO.NUEVO,
      picking: {
        usuario: '',
        fechainicio_picking: null,
        fechafin_picking: null,
        estado_picking: 'pendiente',
      },
      packing: {
        usuario: '',
        fechainicio_packing: null,
        fechafin_packing: null,
        estado_packing: 'pendiente',
      },
      envio: {
        usuario: '',
        fechainicio_envio: null,
        fechafin_envio: null,
        estado_envio: 'pendiente',
        tracking: '',
        conductor: '',
      },
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

  const fetchConductores = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/conductores/`);
      if (!response.ok) throw new Error('Error al obtener conductores');
      const data = await response.json();
      setConductores(data);
    } catch (error) {
      console.error('Error al obtener conductores:', error);
    } finally {
      setLoading(false);
    }
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
    actualizarPedido,
    iniciarPicking,
    guardarPicking,
    finalizarPicking,
    iniciarPacking,
    finalizarPacking,
    iniciarEnvio,
    entregarPedido,
    cancelarProceso,
    setPedido,
    conductores,
    fetchConductores
  };
};

export type { PedidoArmado, EstadoPedido } from "../Pedidos/pedidotypes";
