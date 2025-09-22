import React from 'react';

interface CartItem {
  id: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  // Agrega aquí cualquier otra propiedad relevante de tus productos
}

interface PreliminarPedidoPDFProps {
  cartItems: CartItem[];
  total: number;
}

const PreliminarPedidoPDF = React.forwardRef<HTMLDivElement, PreliminarPedidoPDFProps>(
  ({ cartItems, total }, ref) => {
    return (
      <div ref={ref} className="p-6 bg-white print:p-0 print:text-black">
        <h1 className="text-2xl font-bold mb-4 text-center print:text-xl">Vista Preliminar de Pedido</h1>
        <div className="mb-6">
          <p className="text-sm">Fecha: {new Date().toLocaleDateString()}</p>
          <p className="text-sm">Hora: {new Date().toLocaleTimeString()}</p>
          {/* Puedes añadir más información del cliente o del pedido aquí si está disponible */}
        </div>

        <table className="w-full border-collapse mb-6 print:text-sm">
          <thead>
            <tr className="bg-gray-200 print:bg-gray-100">
              <th className="border p-2 text-left">Producto</th>
              <th className="border p-2 text-left">Cantidad</th>
              <th className="border p-2 text-right">Precio Unitario</th>
              <th className="border p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.nombre}</td>
                <td className="border p-2">{item.cantidad}</td>
                <td className="border p-2 text-right">${item.precioUnitario.toFixed(2)}</td>
                <td className="border p-2 text-right">${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 print:bg-gray-50">
              <td colSpan={3} className="border p-2 text-right font-bold">Total:</td>
              <td className="border p-2 text-right font-bold">${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <p className="text-sm text-center mt-8 print:text-xs">
          Este es un documento preliminar y no constituye una factura final.
        </p>
      </div>
    );
  }
);

export default PreliminarPedidoPDF;
