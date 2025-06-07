import { useState } from "react";

interface ProductoArmado {
  id: string;
  precio: number;
  precio_n: number;
  subtotal: number;
  descripcion: string;
  descuento1: number;
  descuento2: number;
  descuento3: number;
  descuento4: number;
  cantidadPedida: number;
  cantidadEncontrada: number;
}

interface PedidoArmado {
  cliente: string;
  fecha: string;
  total: number;
  rif: string;
  _id:string;
  observacion: string;
  productos: ProductoArmado[];
}

export const usePedidoArmado = () => {
  const [pedido, setPedido] = useState<PedidoArmado | null>(null);

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
      cantidadEncontrada: 0,
    }));

    setPedido({
      cliente,
      fecha,
      total,
      rif,
      _id,
      observacion,
      productos: productosConCantidadEncontrada,
    });
  };

  const actualizarCantidadEncontrada = (productoId: string, cantidad: number) => {
    if (!pedido) return;

    const productosActualizados = pedido.productos.map((prod) =>
      prod.id === productoId ? { ...prod, cantidadEncontrada: cantidad } : prod
    );

    setPedido({ ...pedido, productos: productosActualizados });
  };

  const guardarPedidoArmado = async () => {
    if (!pedido) {
      alert("No hay un pedido activo para guardar.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/armados/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: pedido.cliente,
          rif: pedido.rif,
          observacion: pedido.observacion || "Sin observaciones",
          total: pedido.total,
          productos: pedido.productos.map((p) => ({
            id: p.id,
            descripcion: p.descripcion,
            precio: p.precio,
            cantidad: p.cantidadPedida,
            cantidad_encontrada: p.cantidadEncontrada, // ✅ agregado
            subtotal: p.subtotal,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Pedido armado registrado exitosamente para ${data.cliente}. Total: $${data.total}`);
      } else {
        const errorData = await response.json();
        console.error("Error al registrar el pedido armado:", errorData);
        alert("Error al registrar el pedido armado. Verifica los datos e inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de red al registrar el pedido armado. Verifica tu conexión.");
    }
  };

  return {
    pedido,
    iniciarPedido,
    actualizarCantidadEncontrada,
    guardarPedidoArmado,
  };
};
