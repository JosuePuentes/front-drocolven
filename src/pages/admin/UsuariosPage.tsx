import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import CardModule from "../../components/card/CardModule";
import HasModule from "../../components/auth/HasModule";
import { AiOutlineUserAdd } from "react-icons/ai"; // Importa un icono minimalista para crear cliente

const UsuariosPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-row gap-5 items-center justify-center h-screen bg-gray-100">
            <HasModule module="usuarios">
                <CardModule
                    bottomText="Crear Usuario"
                    topText=""
                    onClick={() => navigate("create")}
                    logo={<User size={64} />}
                />
            </HasModule>
            <HasModule module="usuarios">
                <CardModule
                    bottomText="Editar Usuario"
                    topText=""
                    onClick={() => navigate("editar")}
                    logo={<User size={64} />}
                />
            </HasModule>
            <HasModule module="usuarios">
                <CardModule
                    bottomText="Crear Cliente"
                    topText=""
                    onClick={() => navigate("crearcliente")}
                    logo={<AiOutlineUserAdd className="w-16 h-16 text-gray-700" />}
                />
            </HasModule>
        </div>
    );
}

export default UsuariosPage;