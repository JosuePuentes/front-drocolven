import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const ClientLayout = () => {
  return (
    <>
      <div className="fixed w-screen z-50">
        <Navbar />
      </div>
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );
};

export default ClientLayout;
