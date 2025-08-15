// src/components/VistaCliente.tsx

import React, { useState, useEffect } from 'react';
// 1. Se importa useParams
import { useParams } from 'react-router-dom';

// Interfaz del cliente
interface Client {
  _id: string;
  email: string;
  rif: string;
  encargado: string;
  direccion?: string;
  telefono?: string;
  activo: boolean;
  descuento1: number;
  descuento2: number;
  descuento3: number;
}

// 2. El componente ya no recibe 'rif' como prop
const VistaCliente: React.FC = () => {
  // 3. Obtenemos el 'rif' desde la URL
  const { rif } = useParams<{ rif: string }>();

  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Efecto para cargar los datos del cliente
  useEffect(() => {
    if (!rif) return;

    const fetchClientData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/clientes/${rif}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `Error: No se pudo encontrar el cliente.`);
        }
        const data: Client = await response.json();
        setClient(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [rif]); // La dependencia es el 'rif' de la URL

  if (isLoading) {
    return <div className="text-center p-8">Cargando datos del cliente...</div>;
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-300 rounded-lg">
        <h3 className="text-xl font-semibold text-red-800">Ocurrió un error</h3>
        <p className="mt-2 text-red-700">{error}</p>
      </div>
    );
  }
  
  if (!client) {
    return <div className="text-center p-8">No se encontraron datos para este cliente.</div>;
  }
  
  const renderDetail = (label: string, value: string | number | undefined | boolean) => {
    let displayValue: string | number = '';
    if (typeof value === 'boolean') {
        displayValue = value ? 'Activo' : 'Inactivo';
    } else {
        displayValue = value ?? "No especificado";
    }

    return (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{displayValue}</dd>
        </div>
    );
  }

  return (
    <div className="bg-white max-w-2xl mx-auto shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-xl leading-6 font-semibold text-gray-900">Detalles del Cliente</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Información personal y de contacto.</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {renderDetail('RIF', client.rif)}
          {renderDetail('Correo Electrónico', client.email)}
          {renderDetail('Persona a Cargo', client.encargado)}
          {renderDetail('Dirección', client.direccion)}
          {renderDetail('Teléfono', client.telefono)}
          {renderDetail('Estado', client.activo)}
          {renderDetail('Descuento 1', `${client.descuento1}%`)}
          {renderDetail('Descuento 2', `${client.descuento2}%`)}
          {renderDetail('Descuento 3', `${client.descuento3}%`)}
        </dl>
      </div>
    </div>
  );
};

export default VistaCliente;