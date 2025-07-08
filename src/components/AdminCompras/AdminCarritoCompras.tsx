// src/pages/AdminCarritoCompras.tsx
import { useEffect, useState } from "react";
import { useCarrito } from "../hooks/useCarrito";
import { useProductos } from "../hooks/useProductos";
import { useClientes } from "../hooks/useClientes";
import { ProductList } from "./ProductList";
import { CartModal } from "./CartModal";
import { ClientSelector } from "./ClienteSelector";
import { filtrarPorMultiplesPalabrasAND } from "./filters";

export const AdminCarritoCompras = () => {
  const { clientes, clienteSeleccionado, seleccionarCliente } = useClientes();
  const { carrito, agregarProducto, eliminarProducto, limpiarCarrito } = useCarrito();
  const { productos } = useProductos();
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  const productosFiltrados = filtrarPorMultiplesPalabrasAND(productos, busqueda, ["descripcion"]);

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative mt-12 px-3">
      <div className="md:col-span-2 grid gap-4">
        <h1 className="text-2xl font-bold mb-4">Lista de productos</h1>

        <ClientSelector
          clientes={clientes}
          onSelectClient={seleccionarCliente}
        />

        {clienteSeleccionado ? (
          <>
            <input
              type="text"
              placeholder="Buscar producto..."
              className="p-2 border rounded-xl shadow w-full"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <ProductList
              productos={productosFiltrados}
              onAgregar={agregarProducto}
              descuentoCliente1={Number(clienteSeleccionado?.descuento1) || 0}
              descuentoCliente2={Number(clienteSeleccionado?.descuento2) || 0}
            />
          </>
        ) : (
          <p className="text-gray-500">Seleccione un cliente para ver los productos.</p>
        )}
      </div>

      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
        onClick={() => setModalAbierto(true)}
      >
        Ver Carrito ({carrito.length})
      </button>

      <CartModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        carrito={carrito}
        onEliminar={eliminarProducto}
        cliente={clienteSeleccionado}
        onLimpiarCarrito={limpiarCarrito}
      />
    </div>
  );
};