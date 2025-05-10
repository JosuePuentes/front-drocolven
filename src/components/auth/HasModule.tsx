import { useAdminAuth } from "../../context/AuthAdminContext";
import { ReactNode } from "react";

type HasModuleProps = {
  module: string;
  children: ReactNode;
};

const HasModule = ({ module, children }: HasModuleProps) => {
  const { admin, isAuthenticated, hasModule } = useAdminAuth();

  if (!isAuthenticated || !admin) {
    return null;
  }

  return hasModule(module) ? <>{children}</> : null;
};

export default HasModule;
