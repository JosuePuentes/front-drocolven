// src/hooks/useProductos.ts

import { useEffect, useState } from "react";

// La interfaz no necesita cambios
export interface Producto {
  id: string;
  descripcion: string;
  precio: number;
  precio_n?: number;
  cantidad_pedida: number;
  cantidad_encontrada: number;
  existencia: number;
  descuento1: number;
  descuento2: number;
  descuento3: number;
  descuento4: number;
}

interface Convenio {
    _id: string;
    estado: string;
    productos: Record<string, number>;
}

export const useProductos = (preciosmp: boolean = false) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const inventarioPromise = fetch(`${import.meta.env.VITE_API_URL}/inventario_maestro`);
        const conveniosPromise = preciosmp 
          ? fetch(`${import.meta.env.VITE_API_URL}/convenios`)
          : Promise.resolve(null);

        const [inventarioRes, conveniosRes] = await Promise.all([inventarioPromise, conveniosPromise]);

        if (!inventarioRes.ok) throw new Error("Error al cargar el inventario");
        const inventarioData = await inventarioRes.json();

        // ==================================================================
        // INICIO DE LA LÓGICA MODIFICADA ✨
        // ==================================================================
        let preciosConvenio: Record<string, number> | null = null;
        if (conveniosRes && conveniosRes.ok) {
          const conveniosData: Convenio[] = await conveniosRes.json();
          
          // Filtramos los convenios activos y fusionamos sus listas de productos
          preciosConvenio = conveniosData
            .filter(convenio => convenio.estado === 'activo')
            .reduce((preciosAcumulados, convenioActual) => {
                // Fusionamos el objeto de precios del convenio actual con el acumulado
                return { ...preciosAcumulados, ...convenioActual.productos };
            }, {}); // Empezamos con un objeto vacío
        }
        // ==================================================================
        // FIN DE LA LÓGICA MODIFICADA
        // ==================================================================

        if (!inventarioData || !Array.isArray(inventarioData["inventario_maestro"])) {
          throw new Error("Inventario no válido");
        }

        const productosFormateados = inventarioData["inventario_maestro"]
          .filter((item: any) => item.existencia > 0)
          .map((item: any): Producto => {
            const codigoProducto = item.codigo;
            // La lógica de aquí en adelante no cambia, ya que 'preciosConvenio'
            // ahora tiene el formato correcto que esperábamos.
            const precioEspecial = preciosConvenio ? preciosConvenio[codigoProducto] : undefined;

            return {
              id: codigoProducto,
              descripcion: item.descripcion.trim(),
              precio: parseFloat(precioEspecial !== undefined ? String(precioEspecial) : item.precio) || 0,
              cantidad_pedida: Number(item.cantidad) || 0,
              cantidad_encontrada: 0,
              existencia: item.existencia,
              descuento1: parseFloat(item.descuento1) || 0,
              descuento2: parseFloat(item.descuento2) || 0,
              descuento3: parseFloat(item.descuento3) || 0,
              descuento4: parseFloat(item.descuento4) || 0,
            };
          });
          
        setProductos(productosFormateados);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [preciosmp]);

  return { productos, loading };
};