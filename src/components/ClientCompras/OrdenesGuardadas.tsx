import React, { useEffect, useState } from "react";
import { Producto } from "../hooks/useCarrito";
import { ClienteDetalle } from "../hooks/useClientes";

interface OrdenGuardada {
  id: string;
  fecha: string;
  cliente: string;
  productos: Array<{
    id: string;
    descripcion: string;
    cantidad_pedida: number;
    precio_n: number;
  }>;
  total: number;
}

export interface OrdenesGuardadasProps {
  onSelectOrder: (productos: Producto[], clientDetail?: ClienteDetalle) => void;
}

export const OrdenesGuardadas: React.FC<OrdenesGuardadasProps> = ({ onSelectOrder }) => {
  const [ordenes, setOrdenes] = useState<OrdenGuardada[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("ordenes_guardadas");
    if (data) {
      setOrdenes(JSON.parse(data));
    }
  }, []);

  return (
    <div className="space-y-6">
      {ordenes.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          No tienes órdenes guardadas.
        </div>
      ) : (
        ordenes.map((orden) => (
          <div key={orden.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">{orden.fecha}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{orden.cliente}</span>
            </div>
            <ul className="divide-y divide-gray-100 mb-4">
              {orden.productos.map((prod) => (
                <li key={prod.id} className="py-2 flex justify-between text-sm">
                  <span>{prod.descripcion} <span className="text-gray-400">x{prod.cantidad_pedida}</span></span>
                  <span className="font-mono">${prod.precio_n.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              onClick={() => {
                // Buscar detalles del cliente si es necesario
                const productosCompletos = orden.productos.map((prod) => ({
                  ...prod,
                  precio: prod.precio_n, // Asume que precio_n es el precio neto
                  cantidad_encontrada: 0,
                  existencia: 0,
                  descuento1: 0,
                  descuento2: 0,
                  descuento3: 0,
                  descuento4: 0,
                }));
                onSelectOrder(productosCompletos, undefined);
              }}
            >
              Cargar esta orden
            </button>
          </div>
        ))
      )}
    </div>
  );
};
