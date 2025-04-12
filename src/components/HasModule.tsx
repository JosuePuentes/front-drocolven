import { useAdminAuth } from "../context/AuthAdminContext";

type HasModuleProps = {
  module: string;
  children: JSX.Element;
};

const HasModule = ({ module, children }: HasModuleProps) => {
  const { hasModule, isLoading } = useAdminAuth();

  if (isLoading) return <h1>cargando...</h1>; // añadir un spinner o un mensaje de carga si es necesario

  return hasModule(module) ? children : null;
};

export default HasModule;
