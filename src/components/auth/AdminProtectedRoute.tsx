import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AuthAdminContext";

type Props = {
  children: JSX.Element;
  moduleRequired?: string;
};

const AdminProtectedRoute = ({ children, moduleRequired }: Props) => {
  const { isAuthenticated, isLoading, hasModule } = useAdminAuth();

  if (isLoading) {
    return <div className="p-4">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/adminlogin" replace />;
  }

  if (moduleRequired && !hasModule(moduleRequired)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
