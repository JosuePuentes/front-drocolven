import { useRef, useState } from 'react';
import { AiOutlineBarcode, AiOutlineSearch } from 'react-icons/ai';
import { animate } from 'animejs';

interface BuscarProductoPorCodigoProps {
  productos: { codigo: string; descripcion: string }[];
  onEncontrado: (codigo: string) => void;
  placeholder?: string;
}

export const BuscarProductoPorCodigo: React.FC<BuscarProductoPorCodigoProps> = ({
  productos,
  onEncontrado,
  placeholder = 'Escanea o ingresa el código de barras...',
}) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBuscar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    const prod = productos.find((p) => p.codigo === codigo.trim());
    if (prod) {
      onEncontrado(prod.codigo);
      setCodigo('');
      if (inputRef.current) {
        animate(inputRef.current, { scale: [1, 1.1, 1], duration: 350, ease: 'outCubic' });
      }
    } else {
      setError('Producto no encontrado en el pedido');
      onEncontrado(codigo.trim()); // Selecciona el código introducido aunque no esté en la lista
      if (inputRef.current) {
        inputRef.current.select(); // Subraya el texto del input
        animate(inputRef.current, { scale: [1, 1.05, 1], backgroundColor: ['#fff', '#fee2e2', '#fff'], duration: 500, ease: 'outCubic' });
      }
    }
  };

  return (
    <form onSubmit={handleBuscar} className="flex items-center gap-2 w-full max-w-md mx-auto mb-4">
      <div className="relative flex-1">
        <AiOutlineBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-base bg-gray-50"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="bg-black hover:bg-gray-500 transition-colors text-white px-4 py-2 rounded-lg shadow text-base font-semibold"
        aria-label="Buscar producto por código"
      >
        <AiOutlineSearch className="w-5 h-5" />
      </button>
      {error && (
        <span className="ml-2 text-sm text-red-500 animate-pulse">{error}</span>
      )}
    </form>
  );
};
