// pages/clientes/index.tsx

import ListaClientes from "./ListaClientes";

const EdicionClientePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        {/* Aquí podrías agregar un botón para crear un nuevo cliente */}
        <ListaClientes />
      </div>
    </div>
  );
};

export default EdicionClientePage;