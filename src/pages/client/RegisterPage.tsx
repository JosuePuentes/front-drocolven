import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rif, setRif] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [encargado, setEncargado] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:8000/register/', {
                email,
                password,
                rif,
                direccion,
                telefono,
                encargado,
            });

            console.log('Registro exitoso:', response.data);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Error al registrar el usuario');
            console.error('Error de registro:', err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Registro</h2>

                {error && (
                    <div className="text-red-500 text-center mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Correo electrónico</label>
                        <input type="email" id="email" className="w-full p-2 mt-2 border border-gray-300 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Contraseña</label>
                        <input type="password" id="password" className="w-full p-2 mt-2 border border-gray-300 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="rif" className="block text-sm font-semibold text-gray-700">RIF</label>
                        <input type="text" id="rif" className="w-full p-2 mt-2 border border-gray-300 rounded-md" value={rif} onChange={(e) => setRif(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="direccion" className="block text-sm font-semibold text-gray-700">Dirección</label>
                        <input type="text" id="direccion" className="w-full p-2 mt-2 border border-gray-300 rounded-md" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700">Teléfono</label>
                        <input type="text" id="telefono" className="w-full p-2 mt-2 border border-gray-300 rounded-md" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="encargado" className="block text-sm font-semibold text-gray-700">Encargado</label>
                        <input type="text" id="encargado" className="w-full p-2 mt-2 border border-gray-300 rounded-md" value={encargado} onChange={(e) => setEncargado(e.target.value)} required />
                    </div>

                    <button type="submit" className="w-full py-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-md">Registrarse</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;