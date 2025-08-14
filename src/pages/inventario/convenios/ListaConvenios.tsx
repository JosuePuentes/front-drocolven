import React, { useState, useEffect } from 'react';

// 1. Preparación: Definimos la interfaz que coincide con tus datos
interface Convenio {
    _id: string;
    fecha: string;
    usuario: string;
    descripcion: string;
    estado: string;
    clientes: string[];
    productos: Record<string, number>; // { codigo: precio }
    fecha_carga_utc: string;
}

const ListaConvenios: React.FC = () => {
    // 3. Vuelo: Almacenamos los datos, carga y errores en el estado
    const [convenios, setConvenios] = useState<Convenio[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Despegue: Obtenemos los datos cuando el componente se monta
    useEffect(() => {
        const fetchConvenios = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/convenios`);
                if (!response.ok) {
                    throw new Error('No se pudo obtener la lista de convenios.');
                }
                const data: Convenio[] = await response.json();
                setConvenios(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConvenios();
    }, []); // El array vacío asegura que se ejecute solo una vez

    // 4. Aterrizaje: Mostramos los datos en la pantalla
    if (loading) {
        return <div className="text-center p-8">Cargando convenios...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Lista de Convenios</h2>
            <div className="space-y-4">
                {convenios.length > 0 ? (
                    convenios.map((convenio) => (
                        <div key={convenio._id} className="bg-white p-4 rounded-lg shadow-md border flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-lg text-indigo-700">{convenio.descripcion}</p>
                                <p className="text-sm text-gray-600">
                                    Válido desde: {new Date(convenio.fecha).toLocaleDateString()}
                                </p>
                                <div className="text-xs text-gray-500 mt-2">
                                    <span>Clientes: {convenio.clientes.length}</span> | <span>Productos: {Object.keys(convenio.productos).length}</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                convenio.estado === 'activo' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                                {convenio.estado}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No hay convenios para mostrar.</p>
                )}
            </div>
        </div>
    );
};

export default ListaConvenios;