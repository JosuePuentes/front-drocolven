// src/components/EdicionCliente.tsx

import React, { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';

// 1. Actualizamos las interfaces con todos los campos nuevos
interface Client {
  _id: string;
  rif: string;
  encargado: string;
  direccion: string;
  telefono: string;
  email: string;
  descripcion: string;
  dias_credito: number;
  limite_credito: number;
  activo: boolean;
  descuento1: number;
  descuento2: number;
  descuento3: number;
  preciosmp: boolean;
}

type ClientUpdatePayload = {
  encargado?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  password?: string; // Para enviar una nueva contraseña
  descripcion?: string;
  dias_credito?: number;
  limite_credito?: number;
  activo?: boolean;
  descuento1?: number;
  descuento2?: number;
  descuento3?: number;
  preciosmp?: boolean;
};


const EdicionCliente: React.FC = () => {
  const { rif } = useParams<{ rif: string }>();

  // 2. Actualizamos el estado inicial del formulario
  const [formData, setFormData] = useState<ClientUpdatePayload>({
    encargado: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '', // Inicia vacío
    descripcion: '',
    dias_credito: 0,
    limite_credito: 0,
    activo: true,
    descuento1: 0,
    descuento2: 0,
    descuento3: 0,
    preciosmp: false, // Nuevo campo
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 3. El useEffect ahora carga todos los nuevos campos desde la API
  useEffect(() => {
    if (!rif) return;
    const fetchClientData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/clientes/${rif}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo encontrar el cliente.`);
        }
        const data: Client = await response.json();
        setFormData({
          encargado: data.encargado,
          direccion: data.direccion,
          telefono: data.telefono,
          email: data.email,
          password: '', // Importante: mantenemos la contraseña vacía por seguridad
          descripcion: data.descripcion,
          dias_credito: data.dias_credito,
          limite_credito: data.limite_credito,
          activo: data.activo,
          descuento1: data.descuento1,
          descuento2: data.descuento2,
          descuento3: data.descuento3,
          preciosmp: data.preciosmp,
        });
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error al cargar los datos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClientData();
  }, [rif]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // La lógica para checkboxes debe verificar el tipo de elemento
    const isCheckbox = 'checked' in e.target;
    
    setFormData({
      ...formData,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : type === 'number'
        ? parseFloat(value) || 0
        : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Copia los datos para no modificar el estado directamente
    const payload = { ...formData };

    // Si el campo de contraseña está vacío, no lo enviamos en el payload
    if (!payload.password) {
      delete payload.password;
    }

    try {
      const response = await fetch(`http://localhost:8000/clientes/${rif}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Enviamos el payload sin la contraseña si está vacía
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ocurrió un error al actualizar.');
      }
      setSuccessMessage('¡Cliente actualizado con éxito!');
      // Opcional: limpiar el campo de contraseña después de un envío exitoso
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Cargando datos del cliente...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Cliente: {rif}</h2>
      
      {successMessage && <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-400 rounded-md">{successMessage}</div>}
      {error && <div className="mb-4 p-3 text-red-800 bg-red-100 border border-red-400 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div><label htmlFor="encargado" className="block text-sm font-medium text-gray-700">Encargado / Razón Social</label><input type="text" id="encargado" name="encargado" value={formData.encargado} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/></div>
        <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/></div>
        <div><label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label><input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/></div>
        <div><label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label><textarea id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea></div>
        <div><label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">Descripción</label><textarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea></div>
        
            <div className='flex flex-row'><label htmlFor="preciosmp" className="flex text-lg font-semibold text-blue-700">Precio SMP</label><input type="checkbox" id="preciosmp" name="preciosmp" checked={formData.preciosmp} onChange={handleChange} className="ml-2 border-gray-300 rounded-md"/></div>
        {/* Sección de Crédito */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="dias_credito" className="block text-sm font-medium text-gray-700">Días de Crédito</label><input type="number" id="dias_credito" name="dias_credito" value={formData.dias_credito} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-100 rounded-md"/></div>
            <div><label htmlFor="limite_credito" className="block text-sm font-medium text-gray-700">Límite de Crédito (USD)</label><input type="number" id="limite_credito" name="limite_credito" value={formData.limite_credito} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-gray-100 border-gray-300 rounded-md"/></div>
        </div>

        {/* Sección de Descuentos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label htmlFor="descuento1" className="block text-sm font-medium text-gray-700">Descuento 1 (%)</label><input type="number" id="descuento1" name="descuento1" value={formData.descuento1} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md"/></div>
            <div><label htmlFor="descuento2" className="block text-sm font-medium text-gray-700">Descuento 2 (%)</label><input type="number" id="descuento2" name="descuento2" value={formData.descuento2} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md"/></div>
            <div><label htmlFor="descuento3" className="block text-sm font-medium text-gray-700">Descuento 3 (%)</label><input type="number" id="descuento3" name="descuento3" value={formData.descuento3} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border-gray-300 rounded-md"/></div>
        </div>

        {/* Sección de Contraseña y Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Cambiar Contraseña</label><input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Dejar en blanco para no cambiar" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/></div>
            <div className="flex items-center pt-6">
                <input id="activo" name="activo" type="checkbox" checked={formData.activo} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-900">Cliente Activo</label>
            </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
};

export default EdicionCliente;