import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <main className="flex-grow p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
