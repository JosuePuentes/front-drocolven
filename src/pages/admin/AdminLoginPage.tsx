import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAdminAuth } from '../../context/AuthAdminContext';
const AdminLoginPage = () => {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { isAuthenticated, login } = useAdminAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login/admin/`, {
                usuario,
                password,
            });
            login({
                access_token: response.data.access_token,
                token_type: response.data.token_type,
                usuario: response.data.usuario,
                modulos: response.data.modulos,
            });
        } catch (err) {
            setError((err as any).response?.data?.detail || 'Error al iniciar sesión como administrador');
            console.error('Error al iniciar sesión:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-slate-100 to-slate-200">
            <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Panel Administrativo</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario</label>
                        <input
                            type="text"
                            id="usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Cargando...
                            </>
                        ) : (
                            'Iniciar sesión'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginPage;
