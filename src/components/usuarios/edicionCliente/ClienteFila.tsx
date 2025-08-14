// src/components/ClienteFila.tsx

import React from 'react';
import { useNavigate } from 'react-router';

// Reutilizamos la interfaz del cliente
interface Client {
  _id: string;
  email: string;
  rif: string;
  encargado: string;
}

interface ClienteFilaProps {
  client: Client;
}

const ClienteFila: React.FC<ClienteFilaProps> = ({ client }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Información del Cliente */}
      <div className="md:col-span-2">
        <p className="font-semibold text-indigo-600">{client.encargado}</p>
        <p className="text-sm text-gray-600">{client.rif}</p>
        <p className="text-sm text-gray-500">{client.email}</p>
      </div>

      {/* Botones de Acción */}
      <div className="flex space-x-2 justify-start md:justify-end">
        <button
          onClick={() => handleNavigate(`/admin/clientes/${client.rif}`)}
          className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ver
        </button>
        <button
          onClick={() => handleNavigate(`/admin/clientes/${client.rif}/editar`)}
          className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default ClienteFila;