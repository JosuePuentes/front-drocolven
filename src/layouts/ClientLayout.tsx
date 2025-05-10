import { Outlet } from "react-router-dom";
import Navbar from "../pages/client/Navbar";

const ClientLayout = () => {
  return (
    <>
      <div className="fixed top-0 w-screen z-50">
        <Navbar />
      </div>
      <div className="pt-14 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </>
  );
};

export default ClientLayout;
