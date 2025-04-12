import UploadInventory from "../components/UploadInventary";

const ProductUploaderPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ">
        Cargar Productos desde Excel
      </h1>
      <UploadInventory />
    </div>
  );
};

export default ProductUploaderPage;
