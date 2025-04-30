import { FileUp, SquareChartGantt } from "lucide-react";
import CardModule from "../components/Compuestos/CardModule";
import { useNavigate } from "react-router-dom";

const InventarioPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex flex-row gap-5 items-center justify-center h-screen bg-gray-100">
                <CardModule
                    bottomText="Cargar Inventario"
                    topText=""
                    onClick={() => navigate("cargar")}
                    logo={<FileUp size={64} />}
                />
                <CardModule
                    bottomText="Ver Inventario"
                    topText=""
                    onClick={() => navigate("ver")}
                    logo={<SquareChartGantt size={64} />}
                />
                {/* <CardModule
                    bottomText="Inventario"
                    topText=""
                    onClick={() => { }}
                    logo={<img src="/path/to/logo.png" alt="Logo" />}
                /> */}
            </div>
        </div>
    );
}
export default InventarioPage;