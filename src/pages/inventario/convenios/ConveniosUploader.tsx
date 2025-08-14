// src/components/ConvenioUploader.tsx

import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';

// Importa tus componentes de UI, ajusta la ruta si es necesario
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiOutlineFileDone, AiOutlineWarning } from "react-icons/ai";
import { Terminal } from 'lucide-react';

// Interfaz para el payload que se enviará a la API
interface ConvenioPayload {
    fecha: string;
    usuario: string; // Se enviará el _id del usuario
    descripcion: string;
    estado: string;
    clientes: string[];
    productos: Record<string, number>; // { codigo: precio }
}

const ConvenioUploader: React.FC = () => {
    // Estados para los campos del formulario
    const [productosFile, setProductosFile] = useState<File | null>(null);
    const [clientesFile, setClientesFile] = useState<File | null>(null);
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');

    // Estados para manejar la UI
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    /**
     * Función genérica para leer un archivo CSV.
     */
    const parseCsvFile = <T extends unknown>(file: File): Promise<T[]> => {
        return new Promise((resolve, reject) => {
            Papa.parse<T>(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data),
                error: (err) => reject(err),
            });
        });
    };

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!productosFile || !clientesFile || !descripcion || !fecha) {
            setError('Por favor, completa todos los campos y selecciona ambos archivos.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // 1. Obtener el _id del usuario del localStorage (más seguro y estándar)
            const usuarioStr = localStorage.getItem('usuario');
            if (!usuarioStr) {
                throw new Error('No se encontró información del usuario. Por favor, inicia sesión de nuevo.');
            }
            const usuarioData = JSON.parse(usuarioStr);
            const usuarioId = usuarioData._id; // Usamos el _id
            if (!usuarioId) {
                throw new Error("El objeto de usuario en localStorage no tiene un _id válido.");
            }

            // 2. Procesar archivos en paralelo
            const [productosData, clientesData] = await Promise.all([
                parseCsvFile<{ codigo: string; precio: string }>(productosFile),
                parseCsvFile<{ rif: string }>(clientesFile),
            ]);

            // 3. Transformar datos
            const productosPayload = productosData.reduce((acc, item) => {
                if (item.codigo && item.precio) {
                    acc[item.codigo.trim()] = parseFloat(item.precio.replace(',', '.')); // Reemplaza comas por puntos
                }
                return acc;
            }, {} as Record<string, number>);

            const clientesPayload = clientesData.map(item => item.rif?.trim()).filter(Boolean);

            if (Object.keys(productosPayload).length === 0 || clientesPayload.length === 0) {
                throw new Error('Los archivos CSV no contienen datos válidos o están vacíos.');
            }

            // 4. Construir el payload final usando el _id del usuario
            const payload: ConvenioPayload = {
                fecha,
                usuario: usuarioId, // Enviamos el ID del usuario
                descripcion,
                estado: 'activo',
                clientes: clientesPayload,
                productos: productosPayload,
            };

            // 5. Enviar a la API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/convenios/cargar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.detail || 'Error al cargar el convenio.');
            }

            setSuccessMessage(result.message || 'Convenio cargado con éxito.');
            // Limpiar formulario
            setProductosFile(null);
            setClientesFile(null);
            setDescripcion('');
            setFecha('');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [productosFile, clientesFile, descripcion, fecha]);

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cargar Nuevo Convenio</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción del Convenio</Label>
                    <Input id="descripcion" type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required placeholder="Ej: Convenio Corporativo Enero"/>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha de Inicio</Label>
                    <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
                </div>
                
                {/* Inputs de archivo mejorados */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="productos">Archivo de Productos (.csv)</Label>
                        <Input id="productos" type="file" accept=".csv" onChange={(e) => setProductosFile(e.target.files ? e.target.files[0] : null)} className="file:text-sm file:font-medium" />
                        {productosFile && <p className="text-xs text-gray-500 flex items-center gap-1"><AiOutlineFileDone/> {productosFile.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clientes">Archivo de Clientes (.csv)</Label>
                        <Input id="clientes" type="file" accept=".csv" onChange={(e) => setClientesFile(e.target.files ? e.target.files[0] : null)} className="file:text-sm file:font-medium" />
                        {clientesFile && <p className="text-xs text-gray-500 flex items-center gap-1"><AiOutlineFileDone/> {clientesFile.name}</p>}
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? 'Cargando...' : 'Cargar Convenio'}
                </Button>

                {/* Alertas para notificaciones */}
                {successMessage && (
                     <Alert variant="default" className="bg-green-50 border-green-200">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Éxito</AlertTitle>
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}
                {error && (
                    <Alert variant="destructive">
                        <AiOutlineWarning className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </form>
        </div>
    );
};

export default ConvenioUploader;