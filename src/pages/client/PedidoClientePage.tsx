import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  CheckCircle, Truck, Box, XCircle, // Lucide Icons for specific states
  User, DollarSign, Calendar, Info, ListOrdered, // General Lucide Icons
  Loader2, // For loading spinner
  ClipboardX, // For no orders found
  AlertCircle, // For error messages
  Clock, // Alternative for pending/new
  RotateCw, // Alternative for in progress
  Tag, // For discounts
  PackagePlus, // Alternative for "Armado"
} from 'lucide-react';

// Refinición de ESTADOS con colores y clases Tailwind específicos para los badges
const ESTADOS = {
  pedido_creado: {
    label: 'Pendiente',
    icon: <Clock className="h-4 w-4" />,
    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  en_proceso: {
    label: 'En Proceso',
    icon: <RotateCw className="h-4 w-4" />,
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  pedido_armado: {
    label: 'Armado',
    icon: <PackagePlus className="h-4 w-4" />, // Cambiado a PackagePlus
    badgeClass: 'bg-green-100 text-green-800 border-green-200',
  },
  enviado: {
    label: 'Enviado',
    icon: <Truck className="h-4 w-4" />,
    badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  entregado: {
    label: 'Entregado',
    icon: <CheckCircle className="h-4 w-4" />,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  cancelado: {
    label: 'Cancelado',
    icon: <XCircle className="h-4 w-4" />,
    badgeClass: 'bg-red-100 text-red-800 border-red-200',
  },
};

type EstadoPedidoKey = keyof typeof ESTADOS;

interface ProductoPedido {
  id: string;
  descripcion: string;
  cantidad_pedida: number;
  precio: number;
  descuento1?: number;
  descuento2?: number;
  descuento3?: number;
  descuento4?: number;
}

interface Pedido {
  _id: string;
  fecha: string;
  total: number;
  estado: string;
  observacion?: string;
  productos?: ProductoPedido[];
  cliente: string;
}

const PedidoClientePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!user || !isAuthenticated) {
        setError('Debes iniciar sesión para ver tus pedidos.');
        setLoading(false);
        return;
      }

      if (!user.rif || typeof user.rif !== 'string' || user.rif.trim() === '') {
        setError('No se encontró un RIF válido en tu perfil. Por favor, revisa tus datos o contacta soporte.');
        setLoading(false);
        return;
      }

      setError('');
      setLoading(true);
      try {
        const res = await axios.get<Pedido[]>(`${import.meta.env.VITE_API_URL}/pedidos/por_cliente/${user.rif}`);
        if (Array.isArray(res.data)) {
          setPedidos(res.data);
          if (res.data.length === 0) {
            // No need to set error if no orders, the dedicated "no orders" card handles this
          }
        } else {
          setError('Respuesta inesperada del servidor.');
        }
      } catch (err: any) {
        let errorMessage = 'No se pudieron cargar los pedidos. Intenta nuevamente.';
        if (axios.isAxiosError(err)) {
          if (err.response) {
            if (err.response.status === 404) {
              errorMessage = 'No se encontraron pedidos para tu RIF.';
            } else if (err.response.data && err.response.data.detail) {
              errorMessage = `Error: ${err.response.data.detail}`;
            } else {
              errorMessage = `Error del servidor: ${err.response.status}`;
            }
          } else if (err.request) {
            errorMessage = 'Error de red: No se pudo conectar al servidor.';
          } else {
            errorMessage = `Error: ${err.message}`;
          }
        }
        setError(errorMessage);
        toast.error("Error al cargar pedidos", { description: errorMessage });
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-sm text-center p-6 shadow-lg border-red-200 bg-red-50 animate-in fade-in zoom-in-95 duration-500">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-700">Acceso Denegado</CardTitle>
            <CardDescription className="text-red-600">Debes iniciar sesión para ver tus pedidos.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <div className="text-center mb-10 animate-in fade-in slide-in-from-top-6 duration-700">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight flex items-center justify-center gap-4">
          <ListOrdered className="h-10 w-10 text-blue-600" /> Mis Pedidos
        </h1>
        {user?.rif && (
          <p className="text-lg text-gray-600 mt-2 flex items-center justify-center gap-2">
            <User className="h-5 w-5" /> RIF: <span className="font-semibold text-blue-700">{user.rif}</span>
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-lg">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mb-4" />
          <p>Cargando tus pedidos...</p>
        </div>
      )}

      {/* Error State (only show if there's an actual error, not just no orders) */}
      {error && !loading && pedidos.length === 0 && ( // Ensure it only shows for actual errors, not for "no orders"
        <Card className="w-full max-w-md mx-auto text-center p-6 shadow-lg border-red-200 bg-red-50 animate-in fade-in zoom-in-95 duration-500">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-red-700">¡Ups, un problema!</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* No Orders State */}
      {!loading && !error && pedidos.length === 0 && (
        <Card className="w-full max-w-md mx-auto text-center p-6 shadow-lg border-dashed border-2 border-gray-300 bg-white animate-in fade-in zoom-in-95 duration-500">
          <CardHeader>
            <ClipboardX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-2xl font-semibold text-gray-700">No tienes pedidos registrados.</CardTitle>
            <CardDescription className="text-gray-500">
              Cuando realices tu primer pedido, aparecerá aquí. ¡Estamos listos para atenderte!
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Orders List */}
      {!loading && !error && pedidos.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {pedidos.map((pedido) => {
            const estadoData = ESTADOS[pedido.estado as EstadoPedidoKey] || {
              label: pedido.estado,
              icon: <Box className="h-4 w-4" />, // Fallback icon size
              badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
            };

            return (
              <Card key={pedido._id} className="border border-gray-200 rounded-xl shadow-md p-5 bg-white
                                                transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardHeader className="p-0 pb-3 border-b border-gray-100 mb-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                      <span className="text-2xl text-blue-600">
                        {estadoData.icon}
                      </span>
                      Pedido #<span className="font-bold">{pedido._id.substring(0, 8)}</span>
                    </CardTitle>
                    <Badge className={`${estadoData.badgeClass} text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1.5`}>
                        {estadoData.icon} {estadoData.label}
                    </Badge>
                  </div>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 mt-2">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(pedido.fecha).toLocaleString()}</span>
                    <span className="flex items-center gap-1.5 font-bold text-gray-800 mt-1 sm:mt-0">
                      <DollarSign className="h-4 w-4" /> Total: ${pedido.total?.toFixed(2) || 'N/A'}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {pedido.observacion && (
                    <div className="mb-3 text-gray-600 text-sm flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p><span className="font-medium">Observación:</span> {pedido.observacion}</p>
                    </div>
                  )}

                  <details className="mt-4 group">
                    <summary className="cursor-pointer text-blue-700 font-medium flex items-center justify-between transition-all duration-200 group-open:text-blue-800 group-open:font-semibold">
                      <span>Ver productos ({pedido.productos?.length || 0})</span>
                      <svg className="h-5 w-5 transform transition-transform duration-200 group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </summary>
                    <ul className="mt-3 space-y-2 border-t pt-3 border-gray-100">
                      {pedido.productos && pedido.productos.length > 0 ? (
                        pedido.productos.map((prod: ProductoPedido, idx: number) => {
                          const hasDiscounts = typeof prod.descuento1 === 'number' && prod.descuento1 > 0 ||
                                               typeof prod.descuento2 === 'number' && prod.descuento2 > 0 ||
                                               typeof prod.descuento3 === 'number' && prod.descuento3 > 0 ||
                                               typeof prod.descuento4 === 'number' && prod.descuento4 > 0;

                          let precioConDesc = prod.precio;
                          if (typeof prod.descuento1 === 'number') precioConDesc *= (1 - prod.descuento1 / 100);
                          if (typeof prod.descuento2 === 'number') precioConDesc *= (1 - prod.descuento2 / 100);
                          if (typeof prod.descuento3 === 'number') precioConDesc *= (1 - prod.descuento3 / 100);
                          if (typeof prod.descuento4 === 'number') precioConDesc *= (1 - prod.descuento4 / 100);

                          return (
                            <li key={prod.id || idx} className="text-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4
                                                                border-b last:border-b-0 pb-2 last:pb-0 pt-1">
                              <div className="flex-1">
                                <span className="font-medium text-gray-800">{prod.descripcion}</span>
                                <div className="flex flex-wrap items-center gap-x-3 text-gray-600 mt-0.5">
                                  <span>Cant: <span className="font-semibold">{prod.cantidad_pedida}</span></span>
                                  <span>Precio: <span className="font-semibold">${prod.precio?.toFixed(2) || 'N/A'}</span></span>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-0 sm:justify-end">
                                {typeof prod.descuento1 === 'number' && prod.descuento1 > 0 && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5 text-xs font-normal">DL: {prod.descuento1}%</Badge>
                                )}
                                {typeof prod.descuento2 === 'number' && prod.descuento2 > 0 && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-2 py-0.5 text-xs font-normal">DE: {prod.descuento2}%</Badge>
                                )}
                                {typeof prod.descuento3 === 'number' && prod.descuento3 > 0 && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-0.5 text-xs font-normal">DC: {prod.descuento3}%</Badge>
                                )}
                                {typeof prod.descuento4 === 'number' && prod.descuento4 > 0 && (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-0.5 text-xs font-normal">PP: {prod.descuento4}%</Badge>
                                )}
                                {hasDiscounts && (
                                  <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold bg-emerald-100 rounded-full px-2.5 py-0.5 ml-1">
                                    <Tag className="h-3 w-3" />
                                    <span>${precioConDesc.toFixed(2)}</span>
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <li className="text-sm text-gray-500 text-center py-2">No hay productos en este pedido.</li>
                      )}
                    </ul>
                  </details>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PedidoClientePage;