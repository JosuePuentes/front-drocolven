// src/components/ProductoItem.tsx
import { useState } from "react";
import { Producto } from "../hooks/useCarrito";

interface Props {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
  descuentoCliente1: number; // Primer descuento del cliente
  descuentoCliente2: number; // Segundo descuento del cliente
}

export const AdminProductoItem = ({ producto, onAgregar, descuentoCliente1, descuentoCliente2 }: Props) => {
  const [cantidadPedida, setCantidadPedida] = useState(0);
  const calcularPrecioNeto = () => {
    const { precio, descuento1, descuento2 } = producto;
    return (
      precio *
      (1 - descuento1 / 100) *
      (1 - descuento2 / 100) *
      (1 - descuentoCliente1 / 100) * // Aplicar el descuento del cliente como tercer descuento
      (1 - descuentoCliente2 / 100)   // Aplicar el descuento del cliente como cuarto descuento
    );
  };

  const precioNeto = calcularPrecioNeto();

  const handleAgregar = () => {
    const cantidadValida = Number(cantidadPedida);
    if (isNaN(cantidadValida) || cantidadValida <= 0) return;
    onAgregar({
      ...producto,
      descuento3: descuentoCliente1,
      descuento4: descuentoCliente2,
      cantidad_pedida: cantidadValida,
      cantidad_encontrada: producto.cantidad_encontrada, // Se pasa correctamente
      precio_n: precioNeto,
    });
    setCantidadPedida(0); // Reset después de agregar
  };
  
  return (
    <div className="border rounded-2xl shadow p-4 flex flex-col md:flex-row justify-between items-center bg-white gap-4">
      <div className="flex-1">
        <h3 className="text-lg font-bold">{producto.descripcion}</h3>
        <div className="flex flex-row flex-wrap gap-1 mt-2 items-center">
          <p className="text-sm text-gray-500">Precio base: ${producto.precio.toFixed(2)}</p>
          <p className="text-sm rounded-full bg-blue-200 px-2 py-1 font-medium text-gray-800">DL: {producto.descuento1.toFixed(2)}%</p>
          <p className="text-sm rounded-full bg-blue-200 px-2 py-1 font-medium text-gray-800">DE: {producto.descuento2.toFixed(2)}%</p>
          <p className="text-sm rounded-full bg-blue-200 px-2 py-1 font-medium text-gray-800">DC: {descuentoCliente1.toFixed(2)}%</p>
          <p className="text-sm rounded-full bg-blue-200 px-2 py-1 font-medium text-gray-800">PP: {descuentoCliente2.toFixed(2)}%</p>
          <p className="text-sm text-gray-800 font-semibold">Neto: ${precioNeto.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          value={cantidadPedida}
          onChange={(e) => setCantidadPedida(parseInt(e.target.value) || 1)}
          className="w-20 p-1 border rounded text-center"
        />
        <button
          onClick={handleAgregar}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
        >
          Agregar
        </button>
      </div>
    </div>
  );
};
