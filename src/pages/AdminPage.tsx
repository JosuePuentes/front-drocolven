import { BookA, ShoppingCart, SquareChartGantt, User } from "lucide-react";
import CardModule from "../components/Compuestos/CardModule";
import { useNavigate } from "react-router-dom";
import HasModule from "../components/HasModule";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row gap-5 items-center justify-center h-screen bg-gray-100">
      <HasModule module="compras">
        <CardModule
          bottomText="Comprar"
          topText=""
          onClick={() => navigate("comprar")}
          logo={<ShoppingCart size={64} />}
        />
      </HasModule>
      <CardModule
        bottomText="Inventario"
        topText=""
        onClick={() => navigate("inventario")}
        logo={<SquareChartGantt size={64} />}
      />
      <CardModule
        bottomText="Pedidos"
        topText=""
        onClick={() => navigate("pedidos")}
        logo={<BookA size={64} />}
      />
      <CardModule
        bottomText="Usuarios"
        topText=""
        onClick={() => navigate("usuarios")}
        logo={<User size={64} />}
      />
    </div>
  );
};

export default AdminPage;
