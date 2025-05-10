import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LogoutButton = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <button
            onClick={() => logout(navigate)}
            className="text-red-500 hover:underline"
        >
            Cerrar sesión
        </button>
    );
};

export default LogoutButton;
