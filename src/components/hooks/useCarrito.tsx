// src/hooks/useCarrito.ts
import { useEffect, useState } from "react";

export interface Producto {
  id: string;
  descripcion: string;
  precio: number;
  precio_n?: number; // precio_n es opcional y puede ser null
  cantidad_pedida: number;
  cantidad_encontrada: number; // Ensure this property is included
  existencia: number; // Ensure this property is included
  subtotal?: number;
  descuento1: number;
  descuento2: number; // Added descuento2 property
  descuento3: number;
  descuento4: number;
}

export function useCarrito() {
  const [carrito, setCarrito] = useState<Producto[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) {
      setCarrito(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarProducto = (producto: Producto) => {
    const cantidad = producto.cantidad_pedida !== undefined && producto.cantidad_pedida > 0
      ? producto.cantidad_pedida
      : 1;

    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);

      if (existe) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad_pedida: p.cantidad_pedida + cantidad }
            : p
        );
      }

      return [...prev, { ...producto, cantidad_pedida: cantidad }];
    });
  };



  const quitarProducto = (id: string) => {
    setCarrito((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, cantidad_pedida: p.cantidad_pedida - 1 } : p))
        .filter((p) => p.cantidad_pedida > 0)
    );
  };

  const eliminarProducto = (id: string) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  return {
    carrito,
    agregarProducto,
    quitarProducto,
    eliminarProducto,
    limpiarCarrito,
  };
}
