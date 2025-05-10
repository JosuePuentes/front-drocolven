import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BtnBackPage = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="hidden md:flex fixed top-4 left-4 z-50 items-center gap-2 px-4 py-2 bg-white shadow-lg text-gray-700 rounded-xl hover:bg-gray-100 transition"
    >
      <ArrowLeft size={20} />
      Regresar
    </button>
  );
};

export default BtnBackPage;
