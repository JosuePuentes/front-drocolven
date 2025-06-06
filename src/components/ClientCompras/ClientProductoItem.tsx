// src/components/ProductoItem.tsx
import React, { useState, useMemo } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai"; // Icono para el botón de info

interface Producto {
    id: string;
    descripcion: string;
    precio: number;
    precio_n?: number;
    descuento1: number;
    descuento2: number;
    descuento3: number;
    descuento4: number;
    cantidad_pedida: number;
    existencia: number;
}

interface ProductoItemProps {
    producto: Producto;
    onAgregar: (producto: Producto, cantidad: number) => void;
    descuentoCliente1: number;
    descuentoCliente2: number;
}

export const ProductoItem: React.FC<ProductoItemProps> = ({
    producto,
    onAgregar,
    descuentoCliente1,
    descuentoCliente2,
}) => {
    const [cantidadPedida, setCantidadPedida] = useState(1);
    const [showDescuentos, setShowDescuentos] = useState(false); // Estado para mostrar/ocultar descuentos en mobile

    const precioNetoFinal = useMemo(() => {
        let precioCalculado = producto.precio;

        precioCalculado *= (1 - producto.descuento1 / 100);
        precioCalculado *= (1 - producto.descuento2 / 100);
        // Si descuento3 y descuento4 del producto del producto son aplicables, actívalos aquí.
        // precioCalculado *= (1 - producto.descuento3 / 100);
        // precioCalculado *= (1 - producto.descuento4 / 100);

        precioCalculado *= (1 - descuentoCliente1 / 100);
        precioCalculado *= (1 - descuentoCliente2 / 100);

        // Aseguramos que el resultado siempre sea un número, y si no, devolvemos 0
        return isNaN(precioCalculado) ? 0 : parseFloat(precioCalculado.toFixed(2));
    }, [
        producto.precio,
        producto.descuento1,
        producto.descuento2,
        descuentoCliente1,
        descuentoCliente2,
    ]);

    const handleAgregar = () => {
        const cantidadValida = Number(cantidadPedida);

        if (isNaN(cantidadValida) || cantidadValida <= 0) {
            alert("Por favor, introduce una cantidad válida.");
            return;
        }
        if (cantidadValida > producto.existencia) {
            alert(`Solo hay ${producto.existencia} unidades disponibles en stock.`);
            return;
        }

        onAgregar(
            {
                ...producto,
                precio_n: precioNetoFinal,
                cantidad_pedida: cantidadValida,
            },
            cantidadValida
        );
        setCantidadPedida(1); // Restablece la cantidad a 1 después de agregar
    };

    const isAddButtonDisabled = cantidadPedida === 0 || cantidadPedida > producto.existencia || producto.existencia === 0;

    return (
        <div className="flex flex-col sm:flex-row items-stretch bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-3 sm:p-5 md:p-6 gap-4 sm:gap-6 border border-gray-100 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:border-blue-300 w-full max-w-full md:max-w-2xl lg:max-w-3xl mx-auto overflow-visible">
            {/* Sección de Descripción y Precios */}
            <div className="flex-1 flex flex-col justify-between min-w-0 text-center sm:text-left gap-2">
                <div className="flex flex-col gap-1">
                    <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800 leading-snug mb-1 break-words">
                        {producto.descripcion}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-mono break-words">
                        Código: <span className="font-semibold text-gray-700">{producto.id}</span>
                    </p>
                </div>
                {/* --- SECCIÓN DE DESCUENTOS (MEJORADO) --- */}
                {/* Desktop: todos los descuentos visibles */}
                <div className="hidden sm:flex flex-wrap gap-2 mt-3 items-center justify-start">
                    <span className="text-sm text-gray-600 font-medium whitespace-nowrap">Base: <span className="font-bold text-gray-800">${producto.precio.toFixed(2)}</span></span>
                    {producto.descuento1 > 0 && (
                        <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 font-medium whitespace-nowrap">
                            DL: {producto.descuento1.toFixed(2)}%
                        </span>
                    )}
                    {producto.descuento2 > 0 && (
                        <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 font-medium whitespace-nowrap">
                            DE: {producto.descuento2.toFixed(2)}%
                        </span>
                    )}
                    {descuentoCliente1 > 0 && (
                        <span className="text-xs rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 font-medium whitespace-nowrap">
                            DC: {descuentoCliente1.toFixed(2)}%
                        </span>
                    )}
                    {descuentoCliente2 > 0 && (
                        <span className="text-xs rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 font-medium whitespace-nowrap">
                            PP: {descuentoCliente2.toFixed(2)}%
                        </span>
                    )}
                    <span className="text-base sm:text-lg text-gray-800 font-bold ml-0 sm:ml-2 mt-2 sm:mt-0 whitespace-nowrap">Final: <span className="text-blue-700 font-extrabold">${precioNetoFinal}</span></span>
                </div>
                {/* Mobile: chip de información para descuentos */}
                <div className="flex sm:hidden flex-col gap-2 mt-3 items-center w-full">
                    <span className="text-xs text-gray-600 font-medium">Base: <span className="font-bold text-gray-800">${producto.precio.toFixed(2)}</span></span>
                    <button
                        type="button"
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                        onClick={() => setShowDescuentos((v) => !v)}
                        aria-label="Ver descuentos"
                    >
                        <AiOutlineInfoCircle className="w-4 h-4" />
                        Ver descuentos
                    </button>
                    {showDescuentos && (
                        <div className="flex flex-col gap-1 mt-2 w-full max-w-xs mx-auto">
                            {producto.descuento1 > 0 && (
                                <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 font-medium">DL: {producto.descuento1.toFixed(2)}%</span>
                            )}
                            {producto.descuento2 > 0 && (
                                <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 font-medium">DE: {producto.descuento2.toFixed(2)}%</span>
                            )}
                            {descuentoCliente1 > 0 && (
                                <span className="text-xs rounded-full bg-green-100 text-green-700 px-2 py-0.5 font-medium">DC1: {descuentoCliente1.toFixed(2)}%</span>
                            )}
                            {descuentoCliente2 > 0 && (
                                <span className="text-xs rounded-full bg-green-100 text-green-700 px-2 py-0.5 font-medium">DC2: {descuentoCliente2.toFixed(2)}%</span>
                            )}
                        </div>
                    )}
                    <span className="text-xs text-gray-800 font-semibold">Final: <span className="text-blue-700 font-bold">${precioNetoFinal}</span></span>
                </div>
                {/* Stock info (siempre visible) */}
                <div className="flex items-center justify-center sm:justify-start mt-2">
                    <span className="flex items-center text-xs sm:text-sm text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                        Stock: <span className="ml-1 font-semibold text-gray-700">{producto.existencia}</span>
                    </span>
                </div>
            </div>
            {/* Sección de acciones: cantidad y botón agregar */}
            <div className="flex flex-col justify-end items-center w-full sm:w-auto sm:min-w-[160px] gap-2 sm:gap-4 mt-2 sm:mt-0">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
                    <input
                        type="number"
                        min={1}
                        max={producto.existencia}
                        value={cantidadPedida}
                        onChange={e => setCantidadPedida(Number(e.target.value))}
                        className="w-full sm:w-20 px-2 py-1 border border-gray-300 rounded-md text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                        aria-label="Cantidad"
                        disabled={producto.existencia === 0}
                    />
                    <button
                        onClick={handleAgregar}
                        disabled={isAddButtonDisabled}
                        className={`w-full sm:w-auto px-4 py-1.5 rounded-lg font-semibold text-white transition bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm shadow-sm`}
                        aria-label="Agregar al carrito"
                    >
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    );
};