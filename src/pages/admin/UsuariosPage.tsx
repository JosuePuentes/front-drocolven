import { useNavigate } from "react-router-dom";
import { User, UserPlus } from "lucide-react"; // Import more specific icons for user actions
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"; // Import Shadcn Card components
import HasModule from "../../components/auth/HasModule";

// Re-defining CardModule here for self-containment and clarity.
// In your actual project, this should be a single, shared component.
interface CardModuleProps {
    bottomText: string;
    topText?: string;
    onClick: () => void;
    logo: React.ReactNode;
    description?: string;
    logoColorClass?: string;
}

const CardModule: React.FC<CardModuleProps> = ({
    bottomText,
    topText,
    onClick,
    logo,
    description,
    logoColorClass = "text-blue-600",
}) => {
    return (
        <Card
            className="w-full sm:w-[280px] h-[180px] flex flex-col items-center justify-center text-center p-6
                       bg-white rounded-2xl shadow-xl border border-gray-100
                       cursor-pointer transform transition-all duration-300
                       hover:shadow-2xl hover:-translate-y-1 hover:border-blue-400
                       group relative overflow-hidden"
            onClick={onClick}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

            <CardContent className="relative z-10 flex flex-col items-center justify-center p-0 space-y-3">
                <div className={`${logoColorClass} group-hover:text-blue-700 transition-colors duration-300`}>
                    {logo}
                </div>
                {topText && <CardDescription className="text-sm text-gray-500">{topText}</CardDescription>}
                <CardTitle className="text-xl font-semibold text-gray-800 group-hover:text-blue-800 transition-colors duration-300">
                    {bottomText}
                </CardTitle>
                {description && <CardDescription className="text-xs text-gray-500 mt-1">{description}</CardDescription>}
            </CardContent>
        </Card>
    );
};


const UsuariosPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 sm:p-10 lg:p-16 flex flex-col items-center">
            {/* Title Section */}
            <div className="text-center mb-12 mt-8 animate-in fade-in slide-in-from-top-6 duration-700">
                <User className="w-24 h-24 text-indigo-700 mx-auto mb-4 drop-shadow-md" />
                <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 drop-shadow-sm leading-tight">
                    Gestión de <span className="text-indigo-600">Usuarios</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mt-4 max-w-xl mx-auto">
                    Administra y controla el acceso y los datos de usuarios y clientes.
                </p>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full">
                <HasModule module="usuarios">
                    <CardModule
                        bottomText="Crear Usuario"
                        description="Registra nuevos usuarios del sistema."
                        onClick={() => navigate("create")}
                        logo={<UserPlus size={48} />} // Changed to UserPlus for "create"
                        logoColorClass="text-green-600"
                    />
                </HasModule>

                <HasModule module="crear-cliente">
                    <CardModule
                        bottomText="Crear Cliente"
                        description="Registra nuevos clientes para el sistema de ventas."
                        onClick={() => navigate("crearcliente")}
                        logo={<UserPlus size={48} />} // UserPlus also fits here
                        logoColorClass="text-purple-600"
                    />
                </HasModule>
            </div>
        </div>
    );
}

export default UsuariosPage;