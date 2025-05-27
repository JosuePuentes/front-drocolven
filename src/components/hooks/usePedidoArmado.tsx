import { useState } from "react";

export const ESTADOS_PEDIDO = {
  PEDIDO_CREADO: "pedido_creado",
  EN_PROCESO: "en_proceso",
  CANCELADO: "cancelado",
  COMPLETADO: "completado"
} as const;

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

export interface PedidoArmado {
  cliente: string;
  fecha: string;
  total: number;
  rif: string;
  _id: string;
  observacion: string;
  productos: ProductoArmado[];
  estado: string;
  armado_por?: string;
}

export const usePedidoArmado = () => {
  const [pedido, setPedido] = useState<PedidoArmado | null>(null);
  const [pedidos, setPedidos] = useState<PedidoArmado[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/obtener_pedidos/`);
      const data: PedidoArmado[] = await response.json();
      const ventasFiltradas = data.filter((venta) => venta.estado === "pedido_creado");
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

  // Función para actualizar el estado de un pedido
  const actualizarEstadoPedido = async (pedidoId: string, nuevoEstado: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_estado/${pedidoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nuevo_estado: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el estado del pedido");
      }

      console.log(`Estado del pedido ${pedidoId} actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error(`Error al actualizar el estado del pedido (${nuevoEstado}):`, error);
    }
  };

  const iniciarPedido = (
    cliente: string,
    rif: string,
    total: number,
    fecha: string,
    observacion: string,
    _id: string,
    productos: ProductoArmado[],
    estado: "pedido_armandose"
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
      estado,
    });
  };

  const actualizarCantidadEncontrada = (productoId: string, cantidad: number) => {
    if (!pedido) return;
    console.log("Actualizando cantidad encontrada para producto:", productoId, "con cantidad:", cantidad);
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
  };
};
