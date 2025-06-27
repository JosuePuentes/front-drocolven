import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { toast } from "sonner";
import axios from "axios";
import { usePedidosCliente } from "@/components/hooks/usePedidosCliente";
import { useAuth } from "@/context/AuthContext";
import { useReclamosCliente } from "@/components/hooks/useReclamosCliente";
import { ReclamosModal } from "@/components/ClientCompras/ReclamosModal";

const motivos = [
    "MAL ESTADO", "FALTANTE", "SOBRANTE", "VENCIDO", "NO SOLICITADO", "RETIRO DEL MERCADO",
];

const ReclamosClient: React.FC = () => {
    const { pedidos, loading, error } = usePedidosCliente();
    const { user } = useAuth();
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<string>("");
    const [reclamos, setReclamos] = useState<Record<string, { motivo: string; cantidad: number }>>({});
    const [observacion, setObservacion] = useState<string>("");
    const [modalReclamosOpen, setModalReclamosOpen] = useState(false);
    const { reclamos: reclamosList, loading: reclamosLoading, error: reclamosError } = useReclamosCliente();
    const pedido = useMemo(() => pedidos.find((p) => p._id === pedidoSeleccionado), [pedidos, pedidoSeleccionado]);

    const handleMotivo = (prodId: string, motivo: string) => {
        setReclamos((prev) => ({ ...prev, [prodId]: { ...prev[prodId], motivo } }));
    };
    const handleCantidad = (prodId: string, cantidad: number) => {
        setReclamos((prev) => ({ ...prev, [prodId]: { ...prev[prodId], cantidad } }));
    };

    const handleEnviarReclamo = async () => {
        if (!pedido || !user) return;
        const productosReclamo = Object.entries(reclamos)
            .filter(([_, data]) => data.motivo && data.cantidad > 0)
            .map(([prodId, data]) => {
                const producto = pedido.productos?.find((p) => String(p.id) === prodId);
                return {
                    id: producto?.id,
                    descripcion: producto?.descripcion,
                    cantidad: data.cantidad,
                    motivo: data.motivo,
                };
            });
        if (productosReclamo.length === 0) {
            toast.error("Debes seleccionar al menos un producto y motivo para el reclamo.");
            return;
        }
        try {
            const reclamoPayload = {
                pedido_id: pedido._id,
                rif: user.rif,
                cliente: user.email || "",
                productos: productosReclamo,
                observacion,
            };
            await axios.post(`${import.meta.env.VITE_API_URL}/reclamos/cliente`, reclamoPayload);
            toast.success("Reclamo enviado correctamente", { description: "Tu reclamo ha sido registrado." });
            setReclamos({});
            setObservacion("");
            setPedidoSeleccionado("");
        } catch (err: any) {
            toast.error("Error al enviar el reclamo", { description: err?.response?.data?.detail || err.message });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br sm:32 pl-16 from-blue-50 to-indigo-100 px-2 py-8 lg:pl-56 flex flex-col items-center">
            <ReclamosModal
                open={modalReclamosOpen}
                onOpenChange={setModalReclamosOpen}
                reclamos={reclamosList}
                loading={reclamosLoading}
                error={reclamosError}
            />
            <Card className="w-full max-w-2xl mb-8 p-6 bg-white shadow-md rounded-xl relative">
                <button
                    type="button"
                    className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-blue-100 text-gray-700 text-sm font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Ver mis reclamos"
                    onClick={() => setModalReclamosOpen(true)}
                >
                    <AiOutlineUnorderedList className="w-5 h-5" />
                    Mis Reclamos
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Selecciona un pedido</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
                        <label htmlFor="pedido-select" className="text-sm font-medium text-gray-700">Pedido</label>
                        <select
                            id="pedido-select"
                            className="min-w-[180px] rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-200 outline-none bg-white shadow-sm transition-all"
                            value={pedidoSeleccionado}
                            onChange={e => setPedidoSeleccionado(e.target.value)}
                            aria-label="Selecciona un pedido"
                        >
                            <option value="" disabled>Selecciona un pedido...</option>
                            {pedidos.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p._id.slice(-6)} - {new Date(p.fecha).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>
            {/* Card combinado: pedido seleccionado, productos y resumen reclamo */}
            {pedido && (
                <Card className="w-full max-w-5xl mb-8 p-6 bg-white shadow-lg rounded-xl animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Pedido Seleccionado</h3>
                    <div className="flex flex-wrap gap-6 mb-4 text-sm text-gray-700">
                        <span><span className="font-medium">Factura:</span> {pedido._id ? String(pedido._id).slice(-6) : '-'}</span>
                        <span><span className="font-medium">Fecha:</span> {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : '-'}</span>
                        <span><span className="font-medium">Monto:</span> {typeof (pedido as any).monto === 'number' ? ((pedido as any).monto as number).toFixed(2) : '0.00'}</span>
                        <span><span className="font-medium">Reclamo:</span> {typeof (pedido as any).reclamo === 'string' ? (pedido as any).reclamo : 'N/A'}</span>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 mb-6">
                        <table className="min-w-full text-sm text-left">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-2 py-2 font-bold text-gray-700 text-center">#</th>
                                    <th className="px-2 py-2 font-bold text-gray-700">Producto</th>
                                    <th className="px-2 py-2 font-bold text-gray-700 text-center">Código</th>
                                    <th className="px-2 py-2 font-bold text-gray-700 text-center">Cantidad</th>
                                    <th className="px-2 py-2 font-bold text-gray-700 text-center">Precio</th>
                                    <th className="px-2 py-2 font-bold text-gray-700 text-center">Motivo</th>
                                    <th className="px-2 py-2 font-bold text-gray-700 text-center">Reclamo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedido.productos?.map((prod, idx) => {
                                    const codigo = typeof (prod as any).codigo === 'string' ? (prod as any).codigo : String(prod.id);
                                    const cantidad = typeof (prod as any).cantidad === 'number' ? (prod as any).cantidad : '-';
                                    const precio = typeof (prod as any).precio === 'number' ? (prod as any).precio.toFixed(2) : '-';
                                    const maxCantidad = typeof (prod as any).cantidad === 'number' ? (prod as any).cantidad : 999;
                                    return (
                                        <tr key={prod.id} className="border-b last:border-b-0">
                                            <td className="px-2 py-2 text-center text-gray-700">{idx + 1}</td>
                                            <td className="px-2 py-2 text-gray-900">{prod.descripcion}</td>
                                            <td className="px-2 py-2 text-center text-gray-700">{codigo}</td>
                                            <td className="px-2 py-2 text-center text-gray-700">{cantidad}</td>
                                            <td className="px-2 py-2 text-center text-gray-700">{precio}</td>
                                            <td className="px-2 py-2 text-center">
                                                <select
                                                    className="rounded border border-gray-300 px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-200 outline-none"
                                                    value={reclamos[prod.id]?.motivo || ''}
                                                    onChange={e => handleMotivo(String(prod.id), e.target.value)}
                                                >
                                                    <option value="" disabled>Motivo...</option>
                                                    {motivos.map((motivo) => (
                                                        <option key={motivo} value={motivo}>{motivo}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="px-2 py-2 text-center">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={maxCantidad}
                                                    className="w-16 rounded border border-gray-300 px-2 py-1 text-gray-700 focus:ring-2 focus:ring-blue-200 outline-none text-center"
                                                    value={reclamos[prod.id]?.cantidad || ''}
                                                    onChange={e => handleCantidad(String(prod.id), Number(e.target.value))}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Resumen del reclamo */}
                    <div className="mt-6">
                        <h4 className="text-md font-semibold text-blue-900 mb-2">Resumen del Reclamo</h4>
                        <ul className="mb-4 space-y-2">
                            {Object.entries(reclamos)
                                .filter(([_, data]) => data.motivo && data.cantidad > 0)
                                .map(([prodId, data]) => {
                                    const producto = pedido.productos?.find((p) => String(p.id) === prodId);
                                    return (
                                        <li key={prodId} className="flex flex-wrap gap-2 items-center text-sm border-b last:border-b-0 py-1">
                                            <span className="font-medium text-gray-900">{producto?.descripcion}</span>
                                            <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5">Motivo: {data.motivo}</span>
                                            <span className="text-gray-700">Cantidad: {data.cantidad}</span>
                                        </li>
                                    );
                                })}
                        </ul>
                        <div className="flex flex-col gap-2 w-full sm:w-auto mb-4">
                            <textarea
                                className="w-full min-w-[300px] max-w-md rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                                rows={2}
                                placeholder="Agrega una observación opcional..."
                                value={observacion}
                                onChange={e => setObservacion(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium shadow-sm transition-all border border-gray-200"
                                onClick={() => {
                                    setReclamos({});
                                    setObservacion("");
                                    setPedidoSeleccionado("");
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all border border-blue-700"
                                onClick={handleEnviarReclamo}
                            >
                                Enviar Reclamo
                            </button>
                        </div>
                    </div>
                </Card>
            )}
            {loading && (
                <div className="flex items-center justify-center gap-2 mt-6 text-blue-600 animate-pulse">
                    <span className="w-4 h-4 rounded-full bg-blue-300 animate-bounce" />
                </div>
            )}
            {error && !loading && (
                <div className="mt-6 text-red-600 text-sm font-medium text-center">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ReclamosClient;
