// src/components/CreateClient.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CreateClient = () => {
  // Estado para los datos del cliente
  const [rif, setRif] = useState('');
  const [encargado, setEncargado] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [diasCredito, setDiasCredito] = useState(0);
  const [limiteCredito, setLimiteCredito] = useState(0);
  const [descuento1, setDescuento1] = useState(0);
  const [descuento2, setDescuento2] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Validación de campos
  const validateForm = () => {
    if (!rif || !encargado || !direccion || !telefono || !email || !password || !descripcion) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    if (descuento1 < 0 || descuento2 < 0 || diasCredito < 0 || limiteCredito < 0) {
      setError('Los descuentos, días de crédito y límite de crédito no pueden ser negativos');
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
        descripcion,
        dias_credito: diasCredito,
        limite_credito: limiteCredito,
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
      setDescripcion('');
      setDiasCredito(0);
      setLimiteCredito(0);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">RIF</label>
          <Input
            type="text"
            value={rif}
            onChange={(e) => setRif(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Encargado</label>
          <Input
            type="text"
            value={encargado}
            onChange={(e) => setEncargado(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <Input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <Input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <Input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Días de Crédito</label>
          <Input
            type="number"
            value={diasCredito}
            onChange={(e) => setDiasCredito(parseInt(e.target.value))}
            required
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Límite de Crédito ($)</label>
          <Input
            type="number"
            value={limiteCredito}
            onChange={(e) => setLimiteCredito(parseFloat(e.target.value))}
            required
            min={0}
            step={0.01}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descuento Comercial (%)</label>
          <Input
            type="number"
            value={descuento1}
            onChange={(e) => setDescuento1(parseFloat(e.target.value))}
            required
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descuento Pronto Pago (%)</label>
          <Input
            type="number"
            value={descuento2}
            onChange={(e) => setDescuento2(parseFloat(e.target.value))}
            required
            min={0}
          />
        </div>
        <Button type="submit" className="w-full">Crear Cliente</Button>
      </form>
    </div>
  );
};

export default CreateClient;
