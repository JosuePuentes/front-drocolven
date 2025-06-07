import { FileUp, SquareChartGantt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"; // Import Shadcn Card components

// CardModule component (should be a reusable component, defined here for clarity)
// This is the SAME CardModule as in AdminPage, ensuring consistency
interface CardModuleProps {
    bottomText: string;
    topText?: string;
    onClick: () => void;
    logo: React.ReactNode;
    description?: string;
    logoColorClass?: string; // Optional prop for custom logo color
}

const CardModule: React.FC<CardModuleProps> = ({
    bottomText,
    topText,
    onClick,
    logo,
    description,
    logoColorClass = "text-blue-600", // Default color if not specified
}) => {
    return (
        <Card
            className="w-full sm:w-[280px] h-[180px] flex flex-col items-center justify-center text-center p-6
                       bg-white rounded-2xl shadow-xl border border-gray-100
                       cursor-pointer transform transition-all duration-300
                       hover:shadow-2xl hover:-translate-y-1 hover:border-blue-400
                       group relative overflow-hidden" // Added relative and overflow for subtle background animation
            onClick={onClick}
        >
            {/* Subtle background glow on hover */}
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


const AdminInventarioPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6 sm:p-10 lg:p-16 flex flex-col items-center">
            {/* Title Section */}
            <div className="text-center mb-12 mt-8 animate-in fade-in slide-in-from-top-6 duration-700">
                <SquareChartGantt className="w-24 h-24 text-indigo-700 mx-auto mb-4 drop-shadow-md" />
                <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 drop-shadow-sm leading-tight">
                    Gestión de <span className="text-indigo-600">Inventario</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mt-4 max-w-xl mx-auto">
                    Administra y consulta tu inventario de productos de manera eficiente.
                </p>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full">
                {/* Module: Cargar Inventario */}
                <CardModule
                    bottomText="Cargar Inventario"
                    description="Actualiza tus productos con facilidad."
                    onClick={() => navigate("cargar")}
                    logo={<FileUp size={48} />} // Adjusted size to match AdminPage
                    logoColorClass="text-blue-600" // Specific color for Cargar Inventario
                />

                {/* Module: Ver Inventario */}
                <CardModule
                    bottomText="Ver Inventario"
                    description="Explora y busca en tu catálogo completo."
                    onClick={() => navigate("ver")}
                    logo={<SquareChartGantt size={48} />} // Adjusted size to match AdminPage
                    logoColorClass="text-green-600" // Specific color for Ver Inventario
                />

            </div>
        </div>
    );
}

export default AdminInventarioPage;