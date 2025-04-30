import { useNavigate } from "react-router-dom";
import CardModule from "../components/Compuestos/CardModule";
import HasModule from "../components/HasModule";
import { User } from "lucide-react";

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
        </div>
    );
}

export default UsuariosPage;