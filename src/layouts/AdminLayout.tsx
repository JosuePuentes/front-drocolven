import { Outlet } from "react-router-dom";
import BtnBackPage from "../components/btn/BtnBackPage";

const AdminLayout = () => {
  return (
    <div className="flex">
      <main className="flex-grow">
        <BtnBackPage/>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
