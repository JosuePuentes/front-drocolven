import { BookA, SquareChartGantt, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CardModule from "../../components/card/CardModule";
import HasModule from "../../components/auth/HasModule";

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center h-screen bg-gray-100 p-4">
      <div className="flex flex-wrap gap-6 justify-center items-center max-w-4xl">

        <HasModule module="inventario">
          <CardModule
            bottomText="Inventario"
            topText=""
            onClick={() => navigate("inventario")}
            logo={<SquareChartGantt size={64} />}
          />
        </HasModule>

        <HasModule module="pedidos">
          <CardModule
            bottomText="Pedidos"
            topText=""
            onClick={() => navigate("pedidos")}
            logo={<BookA size={64} />}
          />
        </HasModule>

        <HasModule module="usuarios">
          <CardModule
            bottomText="Usuarios"
            topText=""
            onClick={() => navigate("usuarios")}
            logo={<User size={64} />}
          />
        </HasModule>
      </div>
    </div>
  );
};

export default AdminPage;
