// src/components/ProductoItem.tsx
import React, { useState, useMemo } from "react";
import { AiOutlinePlusCircle, AiOutlineMinusCircle, AiOutlineShoppingCart } from "react-icons/ai";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MdDiscount, MdInfoOutline } from "react-icons/md"; // Nuevo icono para el chip de descuentos y uno para la información de stock

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
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

    const precioNetoFinal = useMemo(() => {
        let precioCalculado = producto.precio;

        precioCalculado *= (1 - producto.descuento1 / 100);
        precioCalculado *= (1 - producto.descuento2 / 100);
        // Si descuento3 y descuento4 del producto son aplicables, actívalos aquí.
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
        <div className="flex flex-col sm:flex-row items-stretch bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-5 space-y-4 sm:space-y-0 sm:space-x-6 border border-gray-100 transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:border-blue-300">
            {/* Sección de Descripción y Precios */}
            <div className="flex-1 text-center sm:text-left flex flex-col justify-between">
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-snug mb-1">
                        {producto.descripcion}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono">
                        Código: <span className="font-semibold text-gray-700">{producto.id}</span>
                    </p>
                </div>

                {/* --- SECCIÓN DE DESCUENTOS (RESPONSIVE) --- */}
                {/* Visualización para pantallas grandes (sm y superiores) */}
                <div className="hidden sm:flex flex-wrap gap-2 mt-3 items-center justify-start">
                    <span className="text-sm text-gray-600 font-medium">Base: <span className="font-bold text-gray-800">${producto.precio.toFixed(2)}</span></span>
                    {producto.descuento1 > 0 && (
                        <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 font-medium transition-transform duration-200 hover:scale-105">
                            DL: {producto.descuento1.toFixed(2)}%
                        </span>
                    )}
                    {producto.descuento2 > 0 && (
                        <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 font-medium transition-transform duration-200 hover:scale-105">
                            DE: {producto.descuento2.toFixed(2)}%
                        </span>
                    )}
                    {descuentoCliente1 > 0 && (
                        <span className="text-xs rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 font-medium transition-transform duration-200 hover:scale-105">
                            DC: {descuentoCliente1.toFixed(2)}%
                        </span>
                    )}
                    {descuentoCliente2 > 0 && (
                        <span className="text-xs rounded-full bg-green-100 text-green-700 px-2.5 py-0.5 font-medium transition-transform duration-200 hover:scale-105">
                            PP: {descuentoCliente2.toFixed(2)}%
                        </span>
                    )}
                </div>

                {/* Visualización para pantallas pequeñas (solo móvil) - EL CHIP INTERACTIVO */}
                <div className="sm:hidden mt-3 flex justify-center">
                    <Dialog open={isDiscountModalOpen} onOpenChange={setIsDiscountModalOpen}>
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm hover:bg-indigo-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                <MdDiscount className="w-5 h-5" />
                                <span>Ver Descuentos</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="w-[95%] max-w-sm rounded-2xl p-6">
                            <DialogHeader className="mb-4">
                                <DialogTitle className="text-2xl font-extrabold text-gray-900">Detalles de Descuentos</DialogTitle>
                                <DialogDescription className="text-gray-600 mt-1">
                                    Desglose de todas las rebajas aplicadas.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 text-base text-gray-800">
                                <div className="flex justify-between items-center">
                                    <span>Precio Base:</span>
                                    <span className="font-bold">${producto.precio.toFixed(2)}</span>
                                </div>
                                {producto.descuento1 > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span>Descuento de Línea (DL):</span>
                                        <span className="font-medium text-blue-700">-{producto.descuento1.toFixed(2)}%</span>
                                    </div>
                                )}
                                {producto.descuento2 > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span>Descuento Especial (DE):</span>
                                        <span className="font-medium text-blue-700">-{producto.descuento2.toFixed(2)}%</span>
                                    </div>
                                )}
                                {descuentoCliente1 > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span>Descuento Cliente (DC):</span>
                                        <span className="font-medium text-green-700">-{descuentoCliente1.toFixed(2)}%</span>
                                    </div>
                                )}
                                {descuentoCliente2 > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span>Pronto Pago (PP):</span>
                                        <span className="font-medium text-green-700">-{descuentoCliente2.toFixed(2)}%</span>
                                    </div>
                                )}
                                <div className="pt-4 border-t border-gray-200 mt-4 flex justify-between items-center text-lg font-bold text-blue-700">
                                    <span>Precio Neto Final:</span>
                                    <span>${precioNetoFinal.toFixed(2)}</span>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                {/* --- FIN SECCIÓN DE DESCUENTOS --- */}

                <div className="mt-4 flex items-center justify-center sm:justify-start">
                    <p className="text-xl sm:text-3xl font-extrabold text-blue-800">
                        ${precioNetoFinal.toFixed(2)}{" "}
                        <span className="text-base font-normal text-gray-500">c/u</span>
                    </p>
                </div>
                <div className="text-xs text-gray-500 mt-2 flex items-center justify-center sm:justify-start gap-1">
                    <MdInfoOutline className="w-4 h-4 text-gray-400" />
                    <span>Stock: <span className={`font-bold ${producto.existencia === 0 ? 'text-red-600' : 'text-gray-700'}`}>{producto.existencia}</span> unidades</span>
                </div>
            </div>

            {/* Sección de Cantidad y Botón de Agregar */}
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0 w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCantidadPedida(prev => Math.max(1, prev - 1))}
                        className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Disminuir cantidad"
                        disabled={cantidadPedida <= 1 || producto.existencia === 0}
                    >
                        <AiOutlineMinusCircle className="w-7 h-7 text-gray-700" />
                    </button>
                    <input
                        type="number"
                        value={cantidadPedida === 0 ? "" : cantidadPedida}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1) {
                                setCantidadPedida(Math.min(val, producto.existencia));
                            } else if (e.target.value === "") {
                                setCantidadPedida(0);
                            }
                        }}
                        onBlur={(e) => {
                            if (parseInt(e.target.value) < 1 || isNaN(parseInt(e.target.value)) || e.target.value === "") {
                                setCantidadPedida(1);
                            }
                        }}
                        className="w-20 text-center border border-gray-300 rounded-xl py-2.5 text-lg font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-500"
                        min="1"
                        max={producto.existencia}
                        aria-label="Cantidad a agregar"
                        disabled={producto.existencia === 0}
                    />
                    <button
                        onClick={() => setCantidadPedida(prev => Math.min(producto.existencia, prev + 1))}
                        className="p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Aumentar cantidad"
                        disabled={cantidadPedida >= producto.existencia || producto.existencia === 0}
                    >
                        <AiOutlinePlusCircle className="w-7 h-7 text-gray-700" />
                    </button>
                </div>
                <button
                    onClick={handleAgregar}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    disabled={isAddButtonDisabled}
                    aria-label="Agregar al carrito"
                >
                    <AiOutlineShoppingCart className="w-6 h-6" />
                    <span>Agregar</span>
                </button>
            </div>
        </div>
    );
};