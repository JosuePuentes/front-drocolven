// src/components/Admin/CartModal.tsx
import React from 'react';
import { ResumenCarrito } from './ResumenCarrito';
import { CarritoProducto, Cliente } from './types/types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrito: CarritoProducto[];
  onEliminar: (idProducto: string) => void;
  cliente: Cliente | null;
  onLimpiarCarrito: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  carrito,
  onEliminar,
  cliente,
  onLimpiarCarrito,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex justify-center items-center">
      <div className="w-3xl max-h-[80vh] overflow-y-auto rounded-2xl relative shadow-2xl p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-red-600 text-xl"
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <ResumenCarrito
          carrito={carrito}
          onEliminar={onEliminar}
          cliente={cliente}
          onLoadOrder={() => {}} // Mantén esto si se usa en AdminResumenCarrito
        />
        <div className="mt-4 text-right">
          <button onClick={() => { onLimpiarCarrito(); onClose(); }} className="text-red-600">
            Limpiar Carrito
          </button>
        </div>
      </div>
    </div>
  );
};