import { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AiOutlineUser, AiOutlineIdcard, AiOutlineShoppingCart, AiOutlinePlus, AiOutlineDelete, AiOutlineMinus } from 'react-icons/ai';
import { useClientes } from './useClientes';
import { useNuevoPedido } from './useNuevoPedido';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { animate } from 'animejs';

// Utilidad de filtrado por múltiples palabras
function filtrarPorMultiplesPalabrasAND<T>(
  data: T[],
  textoBusqueda: string,
  campos: (keyof T)[]
): T[] {
  const palabras = textoBusqueda.toLowerCase().split(' ').filter(Boolean);
  return data.filter((item) =>
    palabras.every((palabra) =>
      campos.some((campo) =>
        String(item[campo]).toLowerCase().includes(palabra)
      )
    )
  );
}

interface PedidoForm {
  cliente: string;
  usuario: string;
}

const initialForm: PedidoForm = {
  cliente: '',
  usuario: '',
};

const CrearPedidoPage: React.FC = () => {
  const [form, setForm] = useState<PedidoForm>(initialForm);
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState<any[]>([]); // inventario
  const [carrito, setCarrito] = useState<any[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const { clientes, loading: loadingClientes, error: errorClientes } = useClientes();
  const {
    createPedido,
    loading,
    error,
    success,
    reset,
    getInventario,
  } = useNuevoPedido();

  // Cargar inventario al montar
  useEffect(() => {
    (async () => {
      const data = await getInventario?.();
      if (data && Array.isArray(data)) setProductos(data);
    })();
  }, [getInventario]);

  // Animación de entrada
  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [0, 1],
        y: [40, 0],
        duration: 600,
        ease: 'outCubic',
      });
    }
  }, []);

  // Filtrado de productos
  const productosFiltrados = useMemo(
    () => filtrarPorMultiplesPalabrasAND(productos, busqueda, ['descripcion', 'id']),
    [productos, busqueda]
  );

  // Carrito: agregar producto
  const agregarProducto = (producto: any) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  // Carrito: quitar producto
  const quitarProducto = (id: any) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  // Carrito: cambiar cantidad
  const cambiarCantidad = (id: any, cantidad: number) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, cantidad) } : p
      )
    );
  };

  const handleChange = (value: string) => {
    setForm({ ...form, cliente: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carrito.length) return;
    await createPedido({ ...form, productos: carrito });
    setForm(initialForm);
    setCarrito([]);
    setTimeout(() => reset(), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card ref={cardRef} className="w-full max-w-2xl mx-auto p-6 shadow-md bg-white">
        <CardContent>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Crear Pedido</h2>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex items-center gap-3">
              <AiOutlineIdcard className="w-6 h-6 text-green-600" />
              <Select
                value={form.cliente}
                onValueChange={handleChange}
                disabled={loadingClientes}
                required
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={loadingClientes ? 'Cargando clientes...' : 'Selecciona un cliente'} />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((c) => (
                    <SelectItem key={c._id} value={c.rif}>
                      {c.encargado} ({c.rif})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <AiOutlineUser className="w-6 h-6 text-blue-600" />
              <Input
                name="usuario"
                placeholder="Usuario responsable"
                value={form.usuario}
                onChange={handleInputChange}
                required
                className="flex-1"
              />
            </div>
            {/* Catálogo de productos */}
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-2">
                <AiOutlineShoppingCart className="w-6 h-6 text-gray-500" />
                <Input
                  placeholder="Buscar producto por nombre o ID"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="flex-1 text-sm"
                />
              </div>
              <div className="max-h-40 overflow-y-auto border rounded-md bg-gray-50 p-2">
                {productosFiltrados.length === 0 ? (
                  <div className="text-gray-400 text-sm text-center py-4">Sin productos</div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {productosFiltrados.slice(0, 10).map((prod) => (
                      <li key={prod.id} className="flex items-center justify-between py-2 px-1">
                        <span className="text-gray-700 text-sm font-medium flex-1 truncate">{prod.descripcion}</span>
                        <span className="text-xs text-gray-400 ml-2">{prod.id}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={() => agregarProducto(prod)}
                          aria-label="Agregar al carrito"
                        >
                          <AiOutlinePlus className="w-5 h-5 text-green-600" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Carrito */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <AiOutlineShoppingCart className="w-5 h-5 text-gray-700" /> Carrito
              </h3>
              {carrito.length === 0 ? (
                <div className="text-gray-400 text-sm text-center py-2">Agrega productos al carrito</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {carrito.map((item) => (
                    <li key={item.id} className="flex items-center justify-between py-2 px-1">
                      <span className="text-gray-700 text-sm flex-1 truncate">{item.descripcion}</span>
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="p-1"
                          onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          aria-label="Disminuir cantidad"
                        >
                          <AiOutlineMinus className="w-4 h-4 text-gray-500" />
                        </Button>
                        <span className="text-xs w-6 text-center">{item.cantidad}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="p-1"
                          onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                          aria-label="Aumentar cantidad"
                        >
                          <AiOutlinePlus className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={() => quitarProducto(item.id)}
                          aria-label="Quitar del carrito"
                        >
                          <AiOutlineDelete className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={loading || loadingClientes || !carrito.length || !form.cliente || !form.usuario}
            >
              {loading ? 'Creando...' : 'Crear Pedido'}
            </Button>
            {success && <div className="text-green-600 text-center mt-2">¡Pedido creado!</div>}
            {error && <div className="text-red-600 text-center mt-2">{error}</div>}
            {errorClientes && <div className="text-red-600 text-center mt-2">{errorClientes}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrearPedidoPage;
