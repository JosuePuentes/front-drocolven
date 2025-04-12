import { FileUp, SquareChartGantt } from "lucide-react";
import CardModule from "../components/Compuestos/CardModule";

const InventarioPage = () => {
    return (
        <div>
            <h1>Inventario</h1>
            <div className="flex flex-row gap-5 items-center justify-center h-screen bg-gray-100">
                <CardModule
                    bottomText="Cargar Inventario"
                    topText=""
                    onClick={() => { }}
                    logo={<FileUp size={64} />}
                />
                <CardModule
                    bottomText="Ver Inventario"
                    topText=""
                    onClick={() => { }}
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