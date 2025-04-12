import { useState } from "react";

interface Product {
  descripcion: string;
  dpto: string;
  importado: string;
  laboratorio: string;
  fv: string;
  existencia: number;
  precio: number;
  cantidad: number;
  descuentoPorCantidad: number;
  descuentoLineal: number;
  total: number;
}

const initialProducts: Product[] = [
  {
    descripcion: "AGUA OXIGENADA 40 VOL X 120 ML DIPLONA",
    dpto: "CH-MISCELANEOS CH",
    importado: "Si",
    laboratorio: "DIPLOMA",
    fv: "28/2/2026",
    existencia: 35,
    precio: 1.0,
    cantidad: 0,
    descuentoPorCantidad: 3,
    descuentoLineal: 0,
    total: 0,
  },
];

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");

  const handleQuantityChange = (index: number, value: number) => {
    const newProducts = [...products];
    newProducts[index].cantidad = value;
    newProducts[index].total =
      value * newProducts[index].precio * (1 - newProducts[index].descuentoPorCantidad / 100);
    setProducts(newProducts);
  };

  const filteredProducts = products.filter((product) =>
    product.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Buscar producto..."
        className="mb-4 p-2 border rounded w-full bg-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full border-collapse bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Dpto</th>
            <th className="border p-2">Nacional</th>
            <th className="border p-2">Laboratorio</th>
            <th className="border p-2">F. V.</th>
            <th className="border p-2">Existencia</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Descuento</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index} className="text-center">
              <td className="border p-2">{product.descripcion}</td>
              <td className="border p-2">{product.dpto}</td>
              <td className="border p-2">{product.importado}</td>
              <td className="border p-2">{product.laboratorio}</td>
              <td className="border p-2">{product.fv}</td>
              <td className="border p-2">{product.existencia}</td>
              <td className="border p-2">${product.precio.toFixed(2)}</td>
              <td className="border p-2">
                <input
                  type="number"
                  className="w-16 p-1 border"
                  value={product.cantidad}
                  onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                />
              </td>
              <td className="border p-2">{product.descuentoPorCantidad}%</td>
              <td className="border p-2">${product.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
