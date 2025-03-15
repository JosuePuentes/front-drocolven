import { useState } from "react";
import { Products } from "./ProductsData"; // Importa tus productos

function ProductCard({ product }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-64">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h3 className="text-lg font-semibold text-gray-800 mt-2">
        {product.name}
      </h3>
      <p className="text-gray-600 text-sm">{product.description}</p>
      <p className="text-blue-600 font-bold mt-2">${product.price.toFixed(2)}</p>
      <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        Agregar al carrito
      </button>
    </div>
  );
}

function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra los productos por nombre
  const filteredProducts = Products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Nuestros Productos
      </h2>

      {/* Campo de búsqueda */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full max-w-md p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No se encontraron productos
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
