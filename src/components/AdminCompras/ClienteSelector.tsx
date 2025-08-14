// src/components/Admin/ClientSelector.tsx
import React, { useState, useMemo } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface Cliente {
  rif: string;
  encargado: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  password?: string;
  descripcion?: string;
  dias_credito?: number;
  limite_credito?: number;
  activo?: boolean;
  descuento1?: number;
  descuento2?: number;
  descuento3?: number;
  preciosmp?: boolean;
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
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
    return clientes.filter(c =>
      c.encargado.toLowerCase().includes(texto) ||
      c.rif.toLowerCase().includes(texto) ||
      c.direccion?.toLowerCase().includes(texto)
    );
  }, [clientes, busqueda]);

  const handleSelect = async (rif: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/clientes/${rif}`);
      const data = await res.json();
      setClienteSeleccionado(data);
      onSelectClient(rif);
    } catch (err) {
      setClienteSeleccionado(null);
      onSelectClient(null);
    } finally {
      setBusqueda('');
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const handleRemove = () => {
    if (carritoLength > 0) return;
    setClienteSeleccionado(null);
    onSelectClient(null);
    setBusqueda('');
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative">
      {clienteSeleccionado ? (
        <div className="w-full ">
          <div className="bg-white border border-blue-200 rounded-2xl p-6 mb-4 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2 w-full">
              <span className="text-blue-800 font-semibold text-xl break-words">
                {clienteSeleccionado.encargado} - {clienteSeleccionado.rif}
              </span>
              <div className="flex gap-2">
                {carritoLength === 0 && (
                  <button
                    type="button"
                    className="p-1 rounded-full hover:bg-blue-100 focus:outline-none"
                    onClick={handleRemove}
                    aria-label="Quitar cliente seleccionado"
                  >
                    <AiOutlineClose className="w-5 h-5 text-blue-600" />
                  </button>
                )}
                <button
                  type="button"
                  className="px-3 py-1 rounded-xl border border-blue-300 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition disabled:opacity-50"
                  onClick={() => setClienteSeleccionado(null)}
                  disabled={carritoLength > 0}
                  aria-label="Cambiar cliente"
                >
                  Cambiar cliente
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-2 text-sm text-blue-700 w-full">
              {clienteSeleccionado.email && (
                <div><span className="font-medium">Email:</span> {clienteSeleccionado.email}</div>
              )}
              {clienteSeleccionado.telefono && (
                <div><span className="font-medium">Teléfono:</span> {clienteSeleccionado.telefono}</div>
              )}
              {clienteSeleccionado.direccion && (
                <div className="md:col-span-2"><span className="font-medium">Dirección:</span> {clienteSeleccionado.direccion}</div>
              )}
              {clienteSeleccionado.descripcion && (
                <div className="md:col-span-2"><span className="font-medium">Descripción:</span> {clienteSeleccionado.descripcion}</div>
              )}
              {typeof clienteSeleccionado.dias_credito !== 'undefined' && (
                <div><span className="font-medium">Días de crédito:</span> {clienteSeleccionado.dias_credito}</div>
              )}
              {typeof clienteSeleccionado.limite_credito !== 'undefined' && (
                <div><span className="font-medium">Límite de crédito:</span> {clienteSeleccionado.limite_credito}</div>
              )}
              {typeof clienteSeleccionado.activo !== 'undefined' && (
                <div><span className="font-medium">Estado:</span> <span className={`font-semibold ${clienteSeleccionado.activo ? 'text-green-600' : 'text-red-500'}`}>{clienteSeleccionado.activo ? 'Activo' : 'Inactivo'}</span></div>
              )}
              {typeof clienteSeleccionado.descuento1 !== 'undefined' && (
                <div><span className="font-medium">Descuento 1:</span> {clienteSeleccionado.descuento1}%</div>
              )}
              {typeof clienteSeleccionado.descuento2 !== 'undefined' && (
                <div><span className="font-medium">Descuento 2:</span> {clienteSeleccionado.descuento2}%</div>
              )}
              {typeof clienteSeleccionado.descuento3 !== 'undefined' && (
                <div><span className="font-medium">Descuento 3:</span> {clienteSeleccionado.descuento3}%</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-[95vw]">
            <input
              type="text"
              placeholder="Buscar cliente por nombre o RIF..."
              className="mb-2 p-2 border rounded-xl shadow w-full text-base"
              value={busqueda}
              onChange={e => {
                setBusqueda(e.target.value);
                setShowDropdown(e.target.value.length > 0);
                setSelectedIndex(-1);
              }}
              onFocus={() => setShowDropdown(busqueda.length > 0)}
              onKeyDown={e => {
                if (!showDropdown || clientesFiltrados.length === 0) return;
                if (e.key === 'Tab') {
                  e.preventDefault();
                  if (e.shiftKey) {
                    setSelectedIndex(prev => prev <= 0 ? clientesFiltrados.length - 1 : prev - 1);
                  } else {
                    setSelectedIndex(prev => prev >= clientesFiltrados.length - 1 ? 0 : prev + 1);
                  }
                } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < clientesFiltrados.length) {
                  e.preventDefault();
                  handleSelect(clientesFiltrados[selectedIndex].rif);
                }
              }}
              autoComplete="off"
            />
            {showDropdown && clientesFiltrados.length > 0 && (
              <ul
                className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto mt-1 text-base"
                id="clientes-dropdown-list"
              >
                {clientesFiltrados.map((c, idx) => (
                  <li
                    key={c.rif}
                    ref={el => {
                      if (selectedIndex === idx && el) {
                        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                      }
                    }}
                    className={`px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-700 truncate ${selectedIndex === idx ? 'bg-blue-100 text-blue-800 font-semibold' : ''}`}
                    onClick={() => handleSelect(c.rif)}
                  >
                    <span className="block md:hidden font-medium">{c.encargado}</span>
                    <span className="hidden md:inline">{c.encargado} - {c.rif} {c.direccion}</span>
                  </li>
                ))}
              </ul>
            )}
            {showDropdown && clientesFiltrados.length === 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 px-4 py-2 text-gray-400 text-base">
                No se encontraron clientes
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};