import ProductTable from "../components/ProductsTable";

function ProductsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-400 flex flex-col items-center justify-center">
      <h1 className="text-center text-3xl">Products</h1>
      <ProductTable />
    </div>
  );
}

export default ProductsPage;
