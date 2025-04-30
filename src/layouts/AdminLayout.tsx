import { Outlet } from "react-router-dom";
import BotonRegresar from "../components/Volver";

const AdminLayout = () => {
  return (
    <div className="flex">
      <main className="flex-grow">
      <BotonRegresar />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
