// src/components/CreateClient.tsx

import React, { useState } from 'react';
import axios from 'axios';

const CreateClient = () => {
  // Estado para los datos del cliente
  const [rif, setRif] = useState('');
  const [cliente, setCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [numero, setNumero] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [descuentoComercial, setDescuentoComercial] = useState(0);
  const [descuentoAdicional, setDescuentoAdicional] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validación de campos
  const validateForm = () => {
    if (!rif || !cliente || !direccion || !numero || !correo || !contraseña) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    if (descuentoComercial < 0 || descuentoAdicional < 0) {
      setError('Los descuentos no pueden ser negativos');
      return false;
    }
    setError('');
    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return; // No enviar si la validación falla
    console.log("entro");

    try {
      // Crear un objeto con los datos del cliente
      const newClient = {
        rif,
        cliente,
        direccion,
        numero,
        correo,
        contraseña,
        descuento_comercial: descuentoComercial,
        descuento_adicional: descuentoAdicional,
      };

      // Realizar la solicitud HTTP POST
      const response = await axios.post('http://127.0.0.1:8000/clientes/', newClient);
      console.log("Cliente creado:", response.data);
      console.log(response);
      
      // Si la solicitud es exitosa, limpiar los campos del formulario
      setSuccess('Cliente registrado exitosamente');
      setRif('');
      setCliente('');
      setDireccion('');
      setNumero('');
      setCorreo('');
      setContraseña('');
      setDescuentoComercial(0);
      setDescuentoAdicional(0);
      setError('');
    } catch (error: any) {
      // En caso de error, mostrar el mensaje
      setError(error.response?.data?.detail || 'Error al crear el cliente');
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Registrar Cliente</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">RIF</label>
          <input
            type="text"
            value={rif}
            onChange={(e) => setRif(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre del Cliente</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Número de Teléfono</label>
          <input
            type="text"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descuento Comercial (%)</label>
          <input
            type="number"
            value={descuentoComercial}
            onChange={(e) => setDescuentoComercial(parseFloat(e.target.value))}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
            min="0"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descuento Adicional (%)</label>
          <input
            type="number"
            value={descuentoAdicional}
            onChange={(e) => setDescuentoAdicional(parseFloat(e.target.value))}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
            min="0"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Crear Cliente
        </button>
      </form>
    </div>
  );
};

export default CreateClient;
