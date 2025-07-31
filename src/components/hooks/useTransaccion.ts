import { CarritoProducto, Cliente } from '../AdminCompras/types/types';

export const useTransaccion = () => {
    // Descargo: registrar movimiento en Kardex y restar cantidades por cada producto
    const registrarDescargoCarrito = async (
        carrito: CarritoProducto[],
        cliente: Cliente | null,
        observacion: string,
        resumen: any
    ) => {
        for (const prod of carrito) {
            await fetch(`${import.meta.env.VITE_API_URL}/transaccion/descargar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    producto_codigo: prod.codigo,
                    cantidad: prod.cantidad_pedida,
                    usuario: cliente?.encargado || "admin",
                    tipo_movimiento: "pedido",
                    observaciones: observacion,
                    documento_origen: resumen
                })
            });
        }
    };

    // Cargo: ejemplo de función para registrar ingreso de productos (puedes adaptar según tu API)
    const registrarCargoCarrito = async (
        carrito: CarritoProducto[],
        cliente: Cliente | null,
        observacion: string,
        resumen: any
    ) => {
        for (const prod of carrito) {
            await fetch(`${import.meta.env.VITE_API_URL}/transaccion/cargar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    producto_codigo: prod.codigo,
                    cantidad: prod.cantidad_pedida,
                    usuario: cliente?.encargado || "admin",
                    tipo_movimiento: "ingreso",
                    observaciones: observacion,
                    documento_origen: resumen
                })
            });
        }
    };

    // Kardex: ejemplo de consulta de movimientos (puedes adaptar según tu API)
    const consultarKardexProducto = async (codigo: string) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/transaccion/kardex/${codigo}`);
        if (!response.ok) throw new Error('Error consultando kardex');
        return await response.json();
    };

    return {
        registrarDescargoCarrito,
        registrarCargoCarrito,
        consultarKardexProducto,
    };
};