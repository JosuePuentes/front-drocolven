// src/components/ProductoItem.tsx
import { useState } from "react";
import { CarritoProducto } from "./types/types";

interface Props {
  producto: CarritoProducto;
  onAgregar: (producto: CarritoProducto) => void;
  descuentoCliente1: number; // Primer descuento del cliente
  descuentoCliente2: number; // Segundo descuento del cliente
}

const AdminProductoItem = ({
  producto,
  onAgregar,
  descuentoCliente1,
  descuentoCliente2,
}: Props) => {
  const [cantidadPedida, setCantidadPedida] = useState(0);

  // Precio base tras aplicar solo DL y DE
  const calcularPrecioBaseDLDE = () => {
    const { precio, descuento1, descuento2 } = producto;
    return precio * (1 - descuento1 / 100) * (1 - descuento2 / 100);
  };

  const calcularPrecioNeto = () => {
    return (
      calcularPrecioBaseDLDE() *
      (1 - descuentoCliente1 / 100) *
      (1 - descuentoCliente2 / 100)
    );
  };

  const precioBaseDLDE = calcularPrecioBaseDLDE();
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
          <p className="text-sm text-gray-500">
            Precio base: ${producto.precio.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 bg-green-50 rounded-full px-3 py-1">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700 font-semibold text-sm">Existencia:</span>
            <span className="text-green-700 font-bold text-base ml-1">{producto.existencia ?? 0}</span>
          </div>
          <p className="text-sm rounded-full bg-blue-200 px-2 py-1 font-medium text-gray-800">
            DL: {producto.descuento1.toFixed(2)}%
          </p>
          <p className="text-sm rounded-full bg-blue-200 px-2 py-1 font-medium text-gray-800">
            DE: {producto.descuento2.toFixed(2)}%
          </p>
          <p className="text-sm rounded-full bg-blue-200 px-2 py-1 font-medium text-gray-800">
            DC: {descuentoCliente1.toFixed(2)}%
          </p>
          <p className="text-sm rounded-full bg-blue-200 px-2 py-1 font-medium text-gray-800">
            PP: {descuentoCliente2.toFixed(2)}%
          </p>
          <div>
            <p className="text-sm text-green-500">
              Base DL+DE: ${precioBaseDLDE.toFixed(2)}
            </p>
            <p className="text-sm text-black font-semibold">
              Neto: ${precioNeto.toFixed(2)}
            </p>
          </div>
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

export const AdminProductItem = AdminProductoItem;
