// src/pages/AdminCarritoCompras.tsx
import { useEffect, useRef, useState } from "react";
import { useCarrito } from "../hooks/useCarrito";
import { useProductos } from "../hooks/useProductos";
import { useClientes } from "../hooks/useClientes";
import { ProductList } from "./ProductList";
import { CartModal } from "./CartModal";
import { ClientSelector } from "./ClienteSelector";
import { filtrarPorMultiplesPalabrasAND } from "./filters";
import { AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';

export const AdminCarritoCompras = () => {
  const { clientes, clienteSeleccionado, seleccionarCliente } = useClientes();
  const { carrito, agregarProducto, eliminarProducto, limpiarCarrito } = useCarrito();
  const { productos } = useProductos(clienteSeleccionado?.preciosmp);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const inputBusquedaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        if (inputBusquedaRef.current) {
          inputBusquedaRef.current.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const productosFiltrados = filtrarPorMultiplesPalabrasAND(productos, busqueda, ["descripcion", "codigo"]);

  return (
    <div className="max-w-[100vw] min-h-screen flex flex-col gap-8 px-2 md:px-0 items-center justify-center max-h-screen overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 text-center w-full">Lista de productos</h1>
      </div>

      <div className="flex flex-col gap-6 items-center w-full">
        {/* Card Cliente */}
        <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 flex flex-col items-center">
          <ClientSelector 
            clientes={clientes} 
            onSelectClient={(rif: string | null) => seleccionarCliente(rif ?? "")}
            carritoLength={carrito.length}
          />
        </div>

        {/* Productos y búsqueda */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 items-center">
          {clienteSeleccionado ? (
            <>
              <div className="relative mb-2 w-full">
                <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  ref={inputBusquedaRef}
                  type="text"
                  placeholder="Buscar producto..."
                  className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-base bg-gray-50"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  aria-label="Buscar producto"
                />
              </div>
              <div className="flex flex-col gap-4 w-full items-center max-h-[60vh]">
                <ProductList
                  productos={productosFiltrados as any}
                  onAgregar={agregarProducto as any}
                  descuentoCliente1={Number(clienteSeleccionado?.descuento1) || 0}
                  descuentoCliente2={Number(clienteSeleccionado?.descuento2) || 0}
                />
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-center h-40">
              <p className="text-gray-400 text-lg">Seleccione un cliente para ver los productos.</p>
            </div>
          )}
        </div>
      </div>

      <button
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-full shadow-lg text-base font-semibold shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={() => setModalAbierto(true)}
        aria-label="Ver Carrito"
      >
        <AiOutlineShoppingCart className="w-6 h-6" />
        Ver Carrito ({carrito.length})
      </button>

      <CartModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        carrito={carrito as any}
        onEliminar={eliminarProducto as any}
        cliente={clienteSeleccionado}
        onLimpiarCarrito={limpiarCarrito}
      />
    </div>
  );
};