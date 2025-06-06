import { useEffect, useState } from "react";
import axios from "axios";

type Producto = {
  codigo: string;
  descripcion: string;
  dpto: string;
  nacional: string;
  laboratorio: string;
  fv: string;
  existencia: number;
  precio: number;
  cantidad: number;
  cantidad_encontrada: number; // Asegurando que esta propiedad esté incluida
  descuento1: number;
  descuento2: number;
  descuento3: number;
};

function InventarioList() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/inventario/`);
        const data = response.data;

        // // Extraer la clave dinámica tipo "inventario_08-04-2025"
        // const claveInventario = Object.keys(data["ultimo_inventario"]).find((key) =>
        //   key.startsWith("inventario_")
        // );

        if (data) {
          setProductos(data.inventario);
        } else {
          console.warn("No se encontró una clave de inventario válida en la respuesta.");
          setProductos([]); // Establecer un estado vacío si no se encuentra la clave
          setFecha("");
        }
      } catch (error) {
        console.error("Error al obtener inventario:", error);

        // Mostrar un mensaje de error al usuario (opcional)
        alert("Hubo un problema al cargar el inventario. Por favor, inténtelo de nuevo más tarde.");
      }
    };

    fetchInventario();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario del {fecha}</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Código</th>
              <th className="border p-2">Descripción</th>
              <th className="border p-2">Dpto</th>
              <th className="border p-2">Importado</th>
              <th className="border p-2">Laboratorio</th>
              <th className="border p-2">F.V.</th>
              <th className="border p-2">Existencia</th>
              <th className="border p-2">Precio</th>
              <th className="border p-2">Cantidad</th>
              <th className="border p-2">Desc. 1</th>
              <th className="border p-2">Desc. 2</th>
              <th className="border p-2">Desc. 3</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                <td className="border p-2">{producto.codigo}</td>
                <td className="border p-2">{producto.descripcion.trim()}</td>
                <td className="border p-2">{producto.dpto.trim()}</td>
                <td className="border p-2">{producto.nacional.trim()}</td>
                <td className="border p-2">{producto.laboratorio.trim()}</td>
                <td className="border p-2">{producto.fv}</td>
                <td className="border p-2">{producto.existencia}</td>
                <td className="border p-2">{producto.precio}</td>
                <td className="border p-2">{producto.cantidad}</td>
                <td className="border p-2">{producto.descuento1}</td>
                <td className="border p-2">{producto.descuento2}</td>
                <td className="border p-2">{producto.descuento3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const InventoryList = InventarioList;
