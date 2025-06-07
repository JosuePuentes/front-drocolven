import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePedidoArmado, PedidoArmado, ProductoArmado } from "../hooks/usePedidoArmado";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Save, PackageCheck, User, Calendar, DollarSign, Box, Percent, Send } from "lucide-react";
import { toast } from "sonner";
import { animate } from 'animejs';

// Ensure your types are correctly defined or imported
// If usePedidoArmado doesn't export them, define them here:
// type ProductoArmado = { /* ... your type definition */ };
// type PedidoArmado = { /* ... your type definition */ };


const PedidoDetalle: React.FC = () => {
    const { id } = useParams();
    const { pedidos, fetchPedidos, loading, setLoading } = usePedidoArmado();
    const [pedidoDetalle, setPedidoDetalle] = useState<PedidoArmado | null>(null);
    // Estado auxiliar para los inputs de cantidad encontrada - ESTE ES EL QUE MANEJA EL INPUT DIRECTAMENTE
    const [cantidadesInput, setCantidadesInput] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    // Fetch initial pedido data
    useEffect(() => {
        if (!id) return;

        const findAndSetPedido = (data: PedidoArmado[]) => {
            const pedidoEncontrado = data.find((pedido) => pedido._id === id);
            if (pedidoEncontrado) {
                setPedidoDetalle(pedidoEncontrado);
                setLoading(false);

                // Initialize cantidadesInput from the fetched pedidoDetalle
                const initialCantidadesInput: Record<string, string> = {};
                pedidoEncontrado.productos.forEach(prod => {
                    initialCantidadesInput[prod.id] = prod.cantidad_encontrada.toString();
                });
                setCantidadesInput(initialCantidadesInput);

            } else {
                console.warn(`Pedido con ID ${id} no encontrado en la lista.`);
                setLoading(false);
            }
        };

        if (pedidos.length > 0) {
            findAndSetPedido(pedidos);
        } else {
            setLoading(true);
            fetch(`${import.meta.env.VITE_API_URL}/obtener_pedidos/`)
                .then(res => res.json())
                .then((data: PedidoArmado[]) => {
                    findAndSetPedido(data);
                })
                .catch((error) => {
                    console.error("Error fetching pedido details:", error);
                    setPedidoDetalle(null);
                    toast.error("Error al cargar el detalle del pedido.");
                })
                .finally(() => setLoading(false));
        }
    }, [id, pedidos, fetchPedidos, setLoading]);

    // Animation effect
    useEffect(() => {
        const btns = document.querySelectorAll('.pedido-acciones-btn');
        if (btns.length > 0) {
            animate('.pedido-acciones-btn', {
                opacity: [0, 1],
                y: [20, 0],
                duration: 400,
                delay: (_, i) => i * 80,
                ease: 'easeOutQuad',
            });
        }
    }, [pedidoDetalle]);

    // Helper to parse numbers
    const getNumber = (val: any): number => {
        if (typeof val === 'number') return val;
        if (val && typeof val === 'object' && '$numberDouble' in val) return parseFloat(val.$numberDouble);
        if (val && typeof val === 'object' && '$numberInt' in val) return parseInt(val.$numberInt);
        return 0;
    };

    // REMOVE THE useEffect THAT SYNCHRONIZES cantidadesInput WITH pedidoDetalle
    // The initialization is now done directly within the fetch effect.

    // This handler now ONLY updates `cantidadesInput`, which directly controls the input field.
    const handleCantidadEncontradaChange = (productoId: string, value: string) => {
        // Basic validation: allow empty string (for user to clear) or digits only
        if (value === '' || /^\d+$/.test(value)) {
            setCantidadesInput(prev => ({ ...prev, [productoId]: value }));
        } else {
            // Optionally, provide feedback for invalid input
            toast.warning("Por favor, introduce solo números enteros para la cantidad encontrada.");
        }
    };

    // PATCH cantidades encontradas (uses the current local state `cantidadesInput`)
    const handleGuardarCantidades = async () => {
        if (!pedidoDetalle) return;
        setLoading(true);
        try {
            const cantidades: Record<string, number> = {};
            let hasError = false;

            // Iterate over the products in pedidoDetalle to ensure all are covered
            // and parse quantities from cantidadesInput
            pedidoDetalle.productos.forEach((prod) => {
                const val = cantidadesInput[prod.id];
                const parsedCantidad = parseInt(val, 10);

                if (val === '' || isNaN(parsedCantidad) || parsedCantidad < 0) {
                    toast.error(`La cantidad encontrada para "${prod.descripcion}" no es un número válido. Por favor, corrígelo.`);
                    hasError = true;
                } else {
                    cantidades[prod.id] = parsedCantidad;
                }
            });

            if (hasError) {
                setLoading(false);
                return; // Stop the save process if there are validation errors
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_cantidades/${pedidoDetalle._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cantidades }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al guardar cantidades encontradas");
            }
            toast.success("Cantidades encontradas guardadas correctamente");

            // After successful save, update pedidoDetalle state with the new quantities
            setPedidoDetalle(prevDetalle => {
                if (!prevDetalle) return null;
                const updatedProductos = prevDetalle.productos.map(prod => ({
                    ...prod,
                    cantidad_encontrada: cantidades[prod.id] !== undefined ? cantidades[prod.id] : prod.cantidad_encontrada // Use the saved quantity
                }));
                return { ...prevDetalle, productos: updatedProductos };
            });

            fetchPedidos(); // Re-fetch to ensure global state is updated if needed
        } catch (error: any) {
            console.error("Error al guardar cantidades:", error);
            toast.error(`Error al guardar cantidades encontradas: ${error.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    // Packing: guarda cantidades, cambia estado y vuelve a ArmarPedidos
    const handlePacking = async () => {
        if (!pedidoDetalle) return;
        setLoading(true);
        try {
            // Call handleGuardarCantidades to ensure data is saved and valid
            await handleGuardarCantidades();

            // Re-fetch pedidoDetalle to get the latest state after save (optional but safer)
            // If handleGuardarCantidades already updates local pedidoDetalle, this might not be strictly necessary
            // but good for ensuring consistency before changing status.
            // await fetchPedidos(); // You might want to remove this if handleGuardarCantidades updates local state reliably

            // Change status to 'packing'
            const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_estado/${pedidoDetalle._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nuevo_estado: "packing" }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al cambiar a packing");
            }
            toast.success("Pedido procesado y enviado a packing");
            navigate("/admin/armarpedidos");
        } catch (error: any) {
            console.error("Error al procesar el pedido para packing:", error);
            toast.error(`Error al procesar el pedido: ${error.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    // Enviar: guarda cantidades, cambia estado a enviado y vuelve a la lista
    const handleEnviar = async () => {
        if (!pedidoDetalle) return;
        setLoading(true);
        try {
            await handleGuardarCantidades(); // This will re-fetch and update state
            // await fetchPedidos(); // See comment in handlePacking

            const response = await fetch(`${import.meta.env.VITE_API_URL}/pedidos/actualizar_estado/${pedidoDetalle._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nuevo_estado: "enviado" }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al cambiar a enviado");
            }
            toast.success("Pedido marcado como enviado");
            navigate("/admin/armarpedidos");
        } catch (error: any) {
            console.error("Error al marcar como enviado:", error);
            toast.error(`Error al marcar como enviado: ${error.message || 'Error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    // --- Render Logic ---
    if (loading && !pedidoDetalle) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)] text-gray-500 text-lg">
                <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando detalle del pedido...
            </div>
        );
    }

    if (!pedidoDetalle) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-red-500 text-lg p-4 text-center">
                <Terminal className="h-12 w-12 mb-4" />
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Error al cargar el pedido</AlertTitle>
                    <AlertDescription>
                        El pedido con ID "{id}" no fue encontrado o no se pudo cargar. Por favor, verifica el ID o intenta de nuevo más tarde.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Check if the order can be edited based on its status
    const isEditable = pedidoDetalle.estado === 'nuevo' || pedidoDetalle.estado === 'picking';

    if (!isEditable) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8">
                <Alert>
                    <AlertTitle>Acceso restringido</AlertTitle>
                    <AlertDescription>
                        Este pedido está en estado <Badge variant="outline" className="bg-gray-200 text-gray-700">{pedidoDetalle.estado}</Badge> y no puede ser modificado.
                    </AlertDescription>
                </Alert>
                <Button className="mt-6" onClick={() => navigate(-1)}>Volver</Button>
            </div>
        );
    }


    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 leading-tight">
                Detalle del Pedido
                <span className="block text-blue-600 text-2xl font-semibold mt-2">#{pedidoDetalle._id.substring(0, 8)}</span>
            </h1>

            {/* --- Información General del Pedido --- */}
            <Card className="bg-white shadow-lg rounded-xl overflow-hidden animate-in slide-in-from-top-4 duration-700">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 sm:p-6">
                    <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl font-bold">
                        <User className="h-7 w-7 sm:h-8 sm:w-8" /> {pedidoDetalle.cliente}
                    </CardTitle>
                    <CardDescription className="text-blue-100 flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm sm:text-base">
                        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Fecha: {pedidoDetalle.fecha}</span>
                        <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Total: <span className="font-semibold text-white">${pedidoDetalle.total.toFixed(2)}</span></span>
                        <span className="flex items-center gap-1.5"><Box className="h-4 w-4" /> Estado: <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-medium rounded-full">{pedidoDetalle.estado}</Badge></span>
                        {pedidoDetalle.armado_por && (
                            <span className="flex items-center gap-1.5"><PackageCheck className="h-4 w-4" /> Armado por: <span className="font-semibold text-white">{pedidoDetalle.armado_por}</span></span>
                        )}
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* --- Sección de Productos --- */}
            <Card className="bg-white shadow-lg rounded-xl animate-in slide-in-from-bottom-4 duration-700">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Box className="h-6 w-6" /> Productos del Pedido
                    </CardTitle>
                    <CardDescription>Revisa y actualiza las cantidades encontradas para cada producto.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] pr-4">
                        <ul className="space-y-6">
                            {pedidoDetalle.productos.map((producto: ProductoArmado) => {
                                const d1 = getNumber(producto.descuento1);
                                const d2 = getNumber(producto.descuento2);
                                const d3 = getNumber(producto.descuento3);
                                const d4 = getNumber(producto.descuento4);
                                const precioBase = getNumber(producto.precio);
                                const cantidad = getNumber(producto.cantidad_pedida);
                                const precioConDescuentos = precioBase
                                    * (1 - d1 / 100)
                                    * (1 - d2 / 100)
                                    * (1 - d3 / 100)
                                    * (1 - d4 / 100);
                                const subtotalConDescuentos = precioConDescuentos * cantidad;

                                return (
                                    <li
                                        key={producto.id}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-50 even:bg-gray-100"
                                    >
                                        <div className="md:col-span-2">
                                            <div className="font-semibold text-lg text-gray-900 mb-1">{producto.descripcion}</div>
                                            <div className="text-sm text-gray-600 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1">
                                                <span className="flex items-center gap-1.5"><Box className="h-4 w-4 text-blue-500" /> Cant. pedida: <span className="font-medium">{cantidad}</span></span>
                                                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-green-600" /> Precio base: <span className="font-medium">${precioBase.toFixed(2)}</span></span>
                                                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-purple-600" /> Subtotal base: <span className="font-medium">${getNumber(producto.subtotal).toFixed(2)}</span></span>
                                                <span className="flex items-center gap-1.5 text-green-700 font-semibold"><DollarSign className="h-4 w-4 text-green-700" /> Subtotal c/desc: <span className="font-medium">${subtotalConDescuentos.toFixed(2)}</span></span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 text-xs flex items-center gap-1"><Percent className="h-3 w-3" /> DL: {d1.toFixed(2)}%</Badge>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 font-medium px-2 py-0.5 text-xs flex items-center gap-1"><Percent className="h-3 w-3" /> DE: {d2.toFixed(2)}%</Badge>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 font-medium px-2 py-0.5 text-xs flex items-center gap-1"><Percent className="h-3 w-3" /> DC: {d3.toFixed(2)}%</Badge>
                                                <Badge variant="outline" className="bg-green-50 text-green-700 font-medium px-2 py-0.5 text-xs flex items-center gap-1"><Percent className="h-3 w-3" /> PP: {d4.toFixed(2)}%</Badge>
                                            </div>
                                        </div>
                                        <div className="md:col-span-1 flex flex-col justify-center">
                                            <label htmlFor={`cantidad-${producto.id}`} className="block text-sm font-medium text-gray-700 mb-1">Cantidad encontrada:</label>
                                            <Input
                                                id={`cantidad-${producto.id}`}
                                                type="number" // Use type="text" and parse manually for more control over input
                                                inputMode="numeric"
                                                min={0}
                                                // The value now directly comes from cantidadesInput
                                                value={cantidadesInput[producto.id] ?? ''}
                                                onChange={e => handleCantidadEncontradaChange(producto.id, e.target.value)}
                                                className="w-full border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors duration-200"
                                                disabled={!isEditable}
                                                autoComplete="off"
                                                aria-label={`Cantidad encontrada para ${producto.descripcion}`}
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* --- Botones de Acción --- */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                {isEditable && (
                    <Button
                        onClick={handleGuardarCantidades}
                        className="pedido-acciones-btn w-full sm:w-auto px-6 py-2 transition-all duration-300 bg-white border border-gray-300 text-gray-800 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                        disabled={loading}
                    >
                        <Save className="mr-2 h-4 w-4" /> Guardar Cantidades
                    </Button>
                )}

                {pedidoDetalle.estado === "picking" && (
                    <Button
                        onClick={handlePacking}
                        className="pedido-acciones-btn w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 font-medium"
                        disabled={loading}
                    >
                        <PackageCheck className="mr-2 h-4 w-4" /> Pasar a Packing
                    </Button>
                )}
                {pedidoDetalle.estado === "packing" && (
                    <Button
                        onClick={handleEnviar}
                        className="pedido-acciones-btn w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 font-medium"
                        disabled={loading}
                    >
                        <Send className="mr-2 h-4 w-4" /> Marcar como Enviado
                    </Button>
                )}
            </div>
        </div>
    );
};

export default PedidoDetalle;