import ExcelUploader from "../components/ExcelUploader";

const ProductUploaderPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-amber-50">
        Cargar Productos desde Excel
      </h1>
      <ExcelUploader />
    </div>
  );
};

export default ProductUploaderPage;
