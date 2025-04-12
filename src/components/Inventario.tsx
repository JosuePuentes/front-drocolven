import { useEffect, useState } from "react";
import axios from "axios";

type Producto = {
  codigo: string;
  descripcion: string;
  dpto: string;
  importado: string;
  laboratorio: string;
  fv: string;
  existencia: number;
  precio: number;
  cantidad: number;
  descuentoPorCantidad: number;
  descuentoLineal: number;
};

export default function Inventario() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await axios.get("http://localhost:8000/inventario/");
        const data = response.data;

        // Extraer la clave dinámica tipo "inventario_08-04-2025"
        const claveInventario = Object.keys(data).find((key) =>
          key.startsWith("inventario_")
        );

        if (claveInventario) {
          setProductos(data[claveInventario]);
          setFecha(claveInventario.replace("inventario_", ""));
        }
      } catch (error) {
        console.error("Error al obtener inventario:", error);
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
              <th className="border p-2">Desc. Cant.</th>
              <th className="border p-2">Desc. Lineal</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto, index) => (
              <tr key={index}>
                <td className="border p-2">{producto.codigo}</td>
                <td className="border p-2">{producto.descripcion.trim()}</td>
                <td className="border p-2">{producto.dpto.trim()}</td>
                <td className="border p-2">{producto.importado.trim()}</td>
                <td className="border p-2">{producto.laboratorio.trim()}</td>
                <td className="border p-2">{producto.fv}</td>
                <td className="border p-2">{producto.existencia}</td>
                <td className="border p-2">{producto.precio}</td>
                <td className="border p-2">{producto.cantidad}</td>
                <td className="border p-2">{producto.descuentoPorCantidad}</td>
                <td className="border p-2">{producto.descuentoLineal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
