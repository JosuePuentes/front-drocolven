import React from "react";
import { Card } from "@/components/ui/card";
import {
    AiOutlineUser,
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlineHome,
    AiOutlinePercentage,
    AiOutlineCreditCard,
    AiOutlineCheckCircle,
    AiOutlineInfoCircle,
} from "react-icons/ai";
import { MdOutlineDescription, MdOutlineCalendarToday } from "react-icons/md";
import { FaRegIdCard } from "react-icons/fa";
import { animate } from "animejs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

interface ClienteInfo {
    rif: string;
    encargado: string;
    direccion: string;
    telefono: string;
    email: string;
    descripcion: string;
    dias_credito: number;
    limite_credito: number;
    activo: boolean;
    descuento1: number;
    descuento2: number;
    descuento3: number;
}

const cliente: ClienteInfo = {
    rif: "VADMIN",
    encargado: "ADMIN",
    direccion: "ADMIN",
    telefono: "ADMIN",
    email: "admin@gmail.com",
    descripcion: "admin",
    dias_credito: 10,
    limite_credito: 10.0,
    activo: true,
    descuento1: 10.0,
    descuento2: 10.0,
    descuento3: 0.0,
};

const summaryData = [
    {
        value: "1,951",
        label: "Catálogo",
        icon: (
            <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /></svg>
        ),
        color: "bg-cyan-100",
        info: "El catálogo contiene todos los productos disponibles para compra."
    },
    {
        value: "0",
        label: "Pedidos",
        icon: (
            <svg className="w-10 h-10 text-cyan-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 6h18M3 6l1.5 13a2 2 0 002 2h11a2 2 0 002-2L21 6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
        ),
        color: "bg-cyan-200",
        info: "Aquí verás el total de pedidos realizados."
    },
    {
        value: "0",
        label: "Reclamos",
        icon: (
            <svg className="w-10 h-10 text-blue-900" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" /><path d="M12 8v4" /><circle cx="12" cy="16" r="1" /></svg>
        ),
        color: "bg-blue-100",
        info: "Reclamos o incidencias reportadas por el cliente."
    },
    {
        value: "0",
        label: "Pagos",
        icon: (
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2" /><path d="M6 11h.01" /><path d="M18 13h.01" /></svg>
        ),
        color: "bg-blue-200",
        info: "Pagos realizados y registrados en el sistema."
    }
];

const InfoClientePage: React.FC = () => {
    const card1Ref = React.useRef<HTMLDivElement | null>(null);
    const card2Ref = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (card1Ref.current) {
            animate(card1Ref.current, {
                opacity: [0, 1],
                y: [40, 0],
                duration: 600,
                easing: "outCubic",
            });
        }
        if (card2Ref.current) {
            animate(card2Ref.current, {
                opacity: [0, 1],
                y: [40, 0],
                duration: 600,
                delay: 150,
                easing: "outCubic",
            });
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-2 py-8 lg:pl-56 pl-16">
            {/* Información del Cliente y Condiciones Comerciales */}
            <div className="flex flex-col gap-6 mb-10 w-full max-w-6xl mx-auto md:flex-row md:items-stretch md:justify-center">
                {/* Card 1: Información del Cliente */}
                <Card
                    ref={card1Ref}
                    className="w-full max-w-xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-xl rounded-2xl border border-blue-100 flex-1 min-h-[340px]"
                >
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <AiOutlineUser className="w-8 h-8 text-blue-600" />
                        <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                            Información del Cliente
                        </h2>
                        {cliente.activo && (
                            <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-medium">
                                <AiOutlineCheckCircle className="w-4 h-4" /> Activo
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-4 sm:gap-5">
                        <div className="flex items-center gap-3 flex-wrap">
                            <FaRegIdCard className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">RIF:</span>
                            <span className="font-bold text-blue-700 text-xs xs:text-sm sm:text-base md:text-lg tracking-wide">{cliente.rif}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <AiOutlineUser className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">Encargado:</span>
                            <span className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base">{cliente.encargado}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <AiOutlineMail className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">Correo electrónico:</span>
                            <span className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base">{cliente.email}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <AiOutlinePhone className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">Teléfono:</span>
                            <span className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base">{cliente.telefono}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <AiOutlineHome className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">Dirección:</span>
                            <span className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base">{cliente.direccion}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <MdOutlineDescription className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">Descripción:</span>
                            <span className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base">{cliente.descripcion}</span>
                        </div>
                    </div>
                </Card>
                {/* Card 2: Condiciones Comerciales */}
                <Card
                    ref={card2Ref}
                    className="w-full max-w-xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-xl rounded-2xl border border-blue-100 flex-1 min-h-[340px]"
                >
                    <div className="flex items-center gap-3 mb-6 flex-wrap">
                        <AiOutlineInfoCircle className="w-8 h-8 text-blue-600" />
                        <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                            Condiciones Comerciales
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 sm:gap-5">
                        <div className="flex items-center gap-3 flex-wrap">
                            <AiOutlineCreditCard className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">Límite de crédito:</span>
                            <span className="font-bold text-blue-700 text-xs xs:text-sm sm:text-base md:text-lg">${cliente.limite_credito.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <MdOutlineCalendarToday className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">Días de crédito:</span>
                            <span className="font-semibold text-gray-800 text-xs xs:text-sm sm:text-base">{cliente.dias_credito} días</span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <AiOutlinePercentage className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">Descuentos:</span>
                            <span className="flex flex-row gap-1 flex-wrap">
                                {cliente.descuento1 > 0 && (
                                    <span className="flex flex-col">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs xs:text-sm sm:text-base font-semibold shadow-sm border border-green-200">
                                            {cliente.descuento1}%
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">Descuento comercial</span>
                                    </span>
                                )}
                                {cliente.descuento2 > 0 && (
                                    <span className="flex flex-col">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs xs:text-sm sm:text-base font-semibold shadow-sm border border-green-200">
                                            {cliente.descuento2}%
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">Descuento por prontopago</span>
                                    </span>
                                )}
                                {cliente.descuento3 > 0 && (
                                    <span className="flex flex-col">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs xs:text-sm sm:text-base font-semibold shadow-sm border border-green-200">
                                            {cliente.descuento3}%
                                        </span>
                                        <span className="text-xs text-gray-500 ml-1">Descuento adicional</span>
                                    </span>
                                )}
                                {(cliente.descuento1 <= 0 && cliente.descuento2 <= 0 && cliente.descuento3 <= 0) && (
                                    <span className="text-gray-400 text-xs xs:text-sm sm:text-base">Sin descuentos</span>
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <AiOutlineInfoCircle className="w-6 h-6 text-blue-500" />
                            <span className="text-gray-500 text-xs xs:text-sm sm:text-base font-medium">Estado de la cuenta:</span>
                            <span className={`font-bold text-xs xs:text-sm sm:text-base ${cliente.activo ? "text-green-600" : "text-red-600"}`}>
                                {cliente.activo ? "Activa" : "Inactiva"}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
            {/* Grid de tarjetas resumen al final */}
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                {summaryData.map((item) => (
                    <SummaryCard key={item.label} {...item} />
                ))}
            </div>
        </div>
    );
};

// Tarjeta resumen reutilizable
interface SummaryCardProps {
    value: string;
    label: string;
    icon: React.ReactNode;
    color: string; // tailwind gradient
    info: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ value, label, icon, color, info }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition cursor-pointer group min-h-[140px]">
                    <div className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full ${color} mb-2 group-hover:scale-105 transition-transform`}>
                        {icon}
                    </div>
                    <span className="text-xs xs:text-sm sm:text-base font-medium text-gray-700 mt-1 text-center">{label}</span>
                    <span className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 drop-shadow-sm">{value}</span>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-xs">
                <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                </DialogHeader>
                <DialogDescription>{info}</DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default InfoClientePage;