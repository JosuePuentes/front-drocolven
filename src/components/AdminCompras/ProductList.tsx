// src/components/Admin/ProductList.tsx
import React from 'react';
import { AdminProductItem } from './AdminProductoItem';
import { CarritoProducto } from './types/types';

interface ProductListProps {
  productos: CarritoProducto[];
  onAgregar: (producto: CarritoProducto) => void;
  descuentoCliente1: number;
  descuentoCliente2: number;
}

export const ProductList: React.FC<ProductListProps> = ({
  productos,
  onAgregar,
  descuentoCliente1,
  descuentoCliente2,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto">
      {productos.map((producto) => (
        <AdminProductItem
          key={producto.codigo}
          producto={producto}
          onAgregar={onAgregar}
          descuentoCliente1={descuentoCliente1}
          descuentoCliente2={descuentoCliente2}
        />
      ))}
    </div>
  );
};