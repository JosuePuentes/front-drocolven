// src/components/CreateClient.tsx

import React, { useState } from 'react';
import axios from 'axios';

const CreateClient = () => {
  // Estado para los datos del cliente
  const [rif, setRif] = useState('');
  const [encargado, setEncargado] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [descuento1, setDescuento1] = useState(0);
  const [descuento2, setDescuento2] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validación de campos
  const validateForm = () => {
    if (!rif || !encargado || !direccion || !telefono || !email || !password) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    if (descuento1 < 0 || descuento2 < 0) {
      setError('Los descuentos no pueden ser negativos');
      return false;
    }
    setError('');
    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const newClient = {
        rif,
        encargado,
        direccion,
        telefono,
        email,
        password,
        activo: true,
        descuento1,
        descuento2,
        descuento3: 0,
      };
      // Realizar la solicitud HTTP POST
      await axios.post(`${import.meta.env.VITE_API_URL}/clientes/`, newClient);
      setSuccess('Cliente registrado exitosamente');
      setRif('');
      setEncargado('');
      setDireccion('');
      setTelefono('');
      setEmail('');
      setPassword('');
      setDescuento1(0);
      setDescuento2(0);
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error al crear el cliente');
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
          <label className="block text-sm font-medium text-gray-700">Nombre del Encargado</label>
          <input
            type="text"
            value={encargado}
            onChange={(e) => setEncargado(e.target.value)}
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
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descuento Comercial (%)</label>
          <input
            type="number"
            value={descuento1}
            onChange={(e) => setDescuento1(parseFloat(e.target.value))}
            className="w-full mt-2 p-2 border border-gray-300 rounded-md"
            required
            min="0"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descuento Pronto Pago (%)</label>
          <input
            type="number"
            value={descuento2}
            onChange={(e) => setDescuento2(parseFloat(e.target.value))}
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
