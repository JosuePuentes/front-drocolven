import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';

const CreateAdminUser = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [modulos, setModulos] = useState<string[]>([]);
  const [modulosDisponibles, setModulosDisponibles] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchModulos = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/modulos/admin/`);
        setModulosDisponibles(response.data);
      } catch (error) {
        setError('No se pudieron cargar los módulos disponibles');
      }
    };
    fetchModulos();
  }, []);

  const toggleModulo = (modulo: string) => {
    setModulos((prev) =>
      prev.includes(modulo)
        ? prev.filter((m) => m !== modulo)
        : [...prev, modulo]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!usuario || !password || !rol || modulos.length === 0) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const newUser = { usuario, password, rol, modulos };
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/register/admin/`, newUser);

      setSuccess(response.data.message);
      setUsuario('');
      setPassword('');
      setRol('');
      setModulos([]);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Error al registrar el usuario');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Registrar Usuario Administrativo</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-500 mb-3">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <input
            type="text"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Módulos Permitidos</label>
          <div className="flex flex-wrap gap-2">
            {modulosDisponibles.map((modulo) => {
              const selected = modulos.includes(modulo);
              return (
                <button
                  type="button"
                  key={modulo}
                  onClick={() => toggleModulo(modulo)}
                  className={`px-3 py-1 rounded-full border transition-all flex items-center gap-1
                    ${selected
                      ? 'bg-blue-500 text-white border-blue-600 shadow'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {selected ? <Check size={16} /> : <X size={16} className="opacity-40" />}
                  <span className="text-sm">{modulo}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default CreateAdminUser;
