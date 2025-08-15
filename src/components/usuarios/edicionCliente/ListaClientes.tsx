// src/components/ListaClientes.tsx

import React, { useState, useEffect } from 'react';
import ClienteFila from './ClienteFila'; // Importamos el componente de la fila

// La interfaz del cliente, podría estar en un archivo central de tipos
interface Client {
  _id: string;
  email: string;
  rif: string;
  encargado: string;
  // Agrega otros campos si los necesitas para la búsqueda
}

const ListaClientes: React.FC = () => {
  // Estado para la lista completa de clientes que viene de la API
  const [clients, setClients] = useState<Client[]>([]);
  // Estado para la lista filtrada que se muestra al usuario
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  // Estados de carga y error
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Efecto para cargar los clientes desde la API
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/clientes/all`);
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de clientes.');
        }
        const data: Client[] = await response.json();
        setClients(data);
        setFilteredClients(data); // Inicialmente, la lista filtrada es la lista completa
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // 2. Efecto para filtrar la lista cuando el término de búsqueda cambia
  useEffect(() => {
    const results = clients.filter(client =>
      client.encargado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.rif.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClients(results);
  }, [searchTerm, clients]);

  // --- Renderizado del Componente ---

  if (isLoading) {
    return <div className="text-center p-8 text-gray-600">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Buscar Clientes</h2>

      {/* Barra de Búsqueda */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o RIF..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Contenedor de la Lista de Clientes */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <ClienteFila key={client._id} client={client} />
          ))
        ) : (
          <p className="p-6 text-center text-gray-500">No se encontraron clientes que coincidan con la búsqueda.</p>
        )}
      </div>
    </div>
  );
};

export default ListaClientes;