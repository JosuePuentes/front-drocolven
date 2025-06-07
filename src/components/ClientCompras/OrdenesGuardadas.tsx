import React, { useEffect, useState } from "react";
import { Producto } from "../hooks/useProductos";
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
    dpto?: string;
    laboratorio?: string;
    nacional?: string;
    fv?: string;
    descuento1?: number;
    descuento2?: number;
    descuento3?: number;
    descuento4?: number;
  }>;
  total: number;
}

interface OrdenesGuardadasProps {
  onSelectOrder?: (productos: Producto[], clientDetail?: ClienteDetalle) => void;
  onClose: () => void;
}

export const OrdenesGuardadas: React.FC<OrdenesGuardadasProps> = ({ onSelectOrder, onClose }) => {
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
                <li key={prod.id} className="py-2 flex flex-col sm:flex-row justify-between text-sm gap-1 sm:gap-0">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-base sm:text-lg leading-tight">
                      {prod.descripcion}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Cant: {prod.cantidad_pedida}{" "}
                      <span className="font-medium text-gray-600">
                        ${prod.precio_n.toFixed(2)} c/u
                      </span>
                    </span>
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                      {prod.dpto && (
                        <span className="bg-gray-100 rounded px-2 py-0.5 font-medium order-1">Dpto: <span className="text-gray-700">{prod.dpto}</span></span>
                      )}
                      {prod.laboratorio && (
                        <span className="bg-gray-100 rounded px-2 py-0.5 font-medium order-2">Lab: <span className="text-gray-700">{prod.laboratorio}</span></span>
                      )}
                      {prod.nacional && (
                        <span className="bg-gray-100 rounded px-2 py-0.5 font-medium order-3">Nacional: <span className="text-gray-700">{prod.nacional}</span></span>
                      )}
                      {prod.fv && (
                        <span className="bg-gray-100 rounded px-2 py-0.5 font-medium order-4">FV: <span className="text-gray-700">{prod.fv}</span></span>
                      )}
                      {prod.descuento1 !== undefined && prod.descuento1 > 0 && (
                        <span className="bg-yellow-100 rounded px-2 py-0.5 font-medium order-5 text-yellow-800">
                          Dcto1: <span className="text-yellow-900">{prod.descuento1}%</span>
                        </span>
                      )}
                      {prod.descuento2 !== undefined && prod.descuento2 > 0 && (
                        <span className="bg-yellow-100 rounded px-2 py-0.5 font-medium order-5 text-yellow-800">
                          Dcto2: <span className="text-yellow-900">{prod.descuento2}%</span>
                        </span>
                      )}
                      {prod.descuento3 !== undefined && prod.descuento3 > 0 && (
                        <span className="bg-yellow-100 rounded px-2 py-0.5 font-medium order-5 text-yellow-800">
                          Dcto3: <span className="text-yellow-900">{prod.descuento3}%</span>
                        </span>
                      )}
                      {prod.descuento4 !== undefined && prod.descuento4 > 0 && (
                        <span className="bg-yellow-100 rounded px-2 py-0.5 font-medium order-5 text-yellow-800">
                          Dcto4: <span className="text-yellow-900">{prod.descuento4}%</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 sm:mt-0">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      ${(prod.precio_n * prod.cantidad_pedida).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              onClick={() => {
                // Extraer productos completos y cliente_detalle si existe
                const productosCompletos = orden.productos.map((prod) => ({
                  ...prod,
                  precio: prod.precio_n,
                  cantidad_encontrada: 0,
                  existencia: 0,
                  descuento1: prod.descuento1 ?? 0,
                  descuento2: prod.descuento2 ?? 0,
                  descuento3: prod.descuento3 ?? 0,
                  descuento4: prod.descuento4 ?? 0,
                }));
                const nuevasOrdenes = ordenes.filter(o => o.id !== orden.id);
                localStorage.setItem("ordenes_guardadas", JSON.stringify(nuevasOrdenes));
                if (onSelectOrder) onSelectOrder(productosCompletos, (orden as any).cliente_detalle);
                onClose();
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
