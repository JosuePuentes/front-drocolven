import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';

interface EditAdminUserProps {
  userId: string;
  onSuccess?: () => void;
}

const EditAdminUser: React.FC<EditAdminUserProps> = ({ userId, onSuccess }) => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');
  const [modulos, setModulos] = useState<string[]>([]);
  const [modulosDisponibles, setModulosDisponibles] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, modulosRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/admin/${userId}`),
          axios.get(`${import.meta.env.VITE_API_URL}/modulos/`)
        ]);
        const user = userRes.data;
        setUsuario(user.usuario || '');
        setRol(user.rol || '');
        setModulos(user.modulos || []);
        setNombreCompleto(user.nombreCompleto || '');
        setIdentificador(user.identificador || '');
        setModulosDisponibles(modulosRes.data.map((m: any) => m.name || m.nombre || m));
      } catch (err) {
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

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
    if (!usuario || !rol || modulos.length === 0 || !nombreCompleto || !identificador) {
      setError('Todos los campos son obligatorios');
      return;
    }
    try {
      const updateUser: any = {
        usuario,
        rol,
        modulos,
        nombreCompleto,
        identificador
      };
      if (password) updateUser.password = password;
      await axios.put(`${import.meta.env.VITE_API_URL}/admin/${userId}`, updateUser);
      setSuccess('Usuario actualizado correctamente');
      setPassword('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al actualizar el usuario');
    }
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl mt-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Editar Usuario Administrativo</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-500 mb-3">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Usuario</label>
          <input type="text" value={usuario} onChange={e => setUsuario(e.target.value)} className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Dejar vacío para no cambiar" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <input type="text" value={rol} onChange={e => setRol(e.target.value)} className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input type="text" value={nombreCompleto} onChange={e => setNombreCompleto(e.target.value)} className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Identificador</label>
          <input type="text" value={identificador} onChange={e => setIdentificador(e.target.value)} className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Módulos Permitidos</label>
          <div className="flex flex-wrap gap-2">
            {modulosDisponibles.map((modulo: any, idx) => {
              const key = typeof modulo === 'object' && modulo !== null && modulo._id ? modulo._id : (typeof modulo === 'object' ? JSON.stringify(modulo) : modulo);
              const nombreModulo = typeof modulo === 'object' && modulo !== null ? (modulo.name || modulo.nombre || modulo._id || idx) : modulo;
              const selected = modulos.includes(nombreModulo);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleModulo(nombreModulo)}
                  className={`px-3 py-1 rounded-full border transition-all flex items-center gap-1 ${selected ? 'bg-blue-500 text-white border-blue-600 shadow' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                >
                  {selected ? <Check size={16} /> : <X size={16} className="opacity-40" />}
                  <span className="text-sm">{nombreModulo}</span>
                </button>
              );
            })}
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">Actualizar Usuario</button>
      </form>
    </div>
  );
};

export default EditAdminUser;
