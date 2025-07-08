// src/components/Admin/ClientSelector.tsx
import React, { useState, useMemo } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface Cliente {
  rif: string;
  encargado: string;
  // Agrega aquí cualquier otra propiedad del cliente que uses
}

interface ClientSelectorProps {
  clientes: Cliente[];
  onSelectClient: (rif: string | null) => void;
  carritoLength: number;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({ clientes, onSelectClient, carritoLength }) => {
  const [busqueda, setBusqueda] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return clientes.filter(c =>
      c.encargado.toLowerCase().includes(texto) ||
      c.rif.toLowerCase().includes(texto)
    );
  }, [clientes, busqueda]);

  const handleSelect = (rif: string) => {
    const cliente = clientes.find(c => c.rif === rif) || null;
    setClienteSeleccionado(cliente);
    onSelectClient(rif);
    setBusqueda('');
    setShowDropdown(false);
  };

  const handleRemove = () => {
    if (carritoLength > 0) return;
    setClienteSeleccionado(null);
    onSelectClient(null);
    setBusqueda('');
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {clienteSeleccionado ? (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 mb-2">
          <span className="text-blue-800 font-medium">
            {clienteSeleccionado.encargado} - {clienteSeleccionado.rif}
          </span>
          {carritoLength === 0 && (
            <button
              type="button"
              className="ml-2 p-1 rounded-full hover:bg-blue-100 focus:outline-none"
              onClick={handleRemove}
              aria-label="Quitar cliente seleccionado"
            >
              <AiOutlineClose className="w-4 h-4 text-blue-600" />
            </button>
          )}
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Buscar cliente por nombre o RIF..."
            className="mb-2 p-2 border rounded-xl shadow w-full"
            value={busqueda}
            onChange={e => {
              setBusqueda(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onFocus={() => setShowDropdown(busqueda.length > 0)}
            autoComplete="off"
          />
          {showDropdown && clientesFiltrados.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto mt-1">
              {clientesFiltrados.map((c) => (
                <li
                  key={c.rif}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-700"
                  onClick={() => handleSelect(c.rif)}
                >
                  {c.encargado} - {c.rif}
                </li>
              ))}
            </ul>
          )}
          {showDropdown && clientesFiltrados.length === 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 px-4 py-2 text-gray-400">
              No se encontraron clientes
            </div>
          )}
        </>
      )}
    </div>
  );
};