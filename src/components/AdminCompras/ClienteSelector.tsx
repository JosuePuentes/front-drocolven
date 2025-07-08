// src/components/Admin/ClientSelector.tsx
import React from 'react';

interface Cliente {
  rif: string;
  encargado: string;
  // Agrega aquí cualquier otra propiedad del cliente que uses
}

interface ClientSelectorProps {
  clientes: Cliente[];
  onSelectClient: (rif: string) => void;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({ clientes, onSelectClient }) => {
  console.log('Lista de clientes:', clientes);
  return (
    <select
      className="p-2 border rounded-xl shadow w-full mb-4"
      onChange={(e) => onSelectClient(e.target.value)}
    >
      <option value="">Seleccione un cliente</option>
      {clientes.map((c) => (
        <option key={c.rif} value={c.rif}>
          {c.encargado} - {c.rif}
        </option>
      ))}
    </select>
  );
};