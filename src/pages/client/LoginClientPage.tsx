import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/context/AuthContext';

const LoginClientPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login/`, {
        email,
        password,
      });
      // Guardar token y usuario decodificado en localStorage bajo 'cliente'
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('cliente_email', email);
      try {
        const decoded = jwtDecode(response.data.access_token);
        localStorage.setItem('cliente', JSON.stringify(decoded));
      } catch (e) {}
      login(response.data.access_token); // login normal, el contexto detecta 'cliente'
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        {error && (
          <div className="text-red-500 text-center mb-4">
            <p>{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Correo electrónico</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginClientPage;
