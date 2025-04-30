import { useEffect, useState } from "react";

export interface Producto {
  id: string;
  descripcion: string;
  precio: number;
  precio_n: number;
  cantidad_pedida: number;
  descuento1: number;
  descuento2: number;
  descuento3: number;
  descuento4: number;
  [key: string]: any; // para aceptar campos adicionales como descuentos
}

export const useProductos = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:8000/inventario");
        const data = await res.json();


        if (!data || !Array.isArray(data["inventario"])) {
          throw new Error("Inventario no válido");
        }
        const productosFormateados = data["inventario"]
          .filter((item: any) => item.existencia > 0)
          .map((item) => ({
            id: item.codigo,
            descripcion: item.descripcion.trim(),
            precio: parseFloat(item.precio) || 0,
            cantidad_pedida: Number(item.cantidad) || 0,
            descuento1: parseFloat(item.descuento1) || 0,
            descuento2: parseFloat(item.descuento2) || 0,
            descuento3: parseFloat(item.descuento3) || 0,
            descuento4: parseFloat(item.descuento4) || 0,
            ...item,
          }));
        console.log("Productos cargados:", productosFormateados);
        setProductos(productosFormateados);
      } catch (error) {
        console.error("Error al cargar productos del backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};
