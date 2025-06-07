import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Importar useLocation para resaltar el link activo
import { Menu, X } from "lucide-react"; // Importamos los íconos directamente
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Hook para obtener la ruta actual
    const mobileMenuRef = useRef<HTMLUListElement>(null); // Ref para el menú móvil

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLogout = () => {
        logout(navigate);
        closeMenu();
    };

    // Cerrar el menú móvil al hacer clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                if (isOpen) { // Solo cerrar si está abierto
                    setIsOpen(false);
                }
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Ocultar menú móvil al cambiar de ruta
    useEffect(() => {
        closeMenu();
    }, [location.pathname]);


    const links = [
        { to: "/", label: "Inicio" },
        { to: "/about", label: "Sobre Nosotros" },
        { to: "/contact", label: "Contacto" },
    ];
    const privateLinks = [
        { to: "/comprar", label: "Comprar" },
        { to: "/mispedidos", label: "Mis Pedidos" },
    ];

    const getLinkClasses = (path: string) => {
        const isActive = location.pathname === path;
        return `
            relative
            inline-flex items-center
            text-base font-medium
            hover:text-green-700
            transition-colors duration-200
            ${isActive ? 'text-green-800 font-semibold' : 'text-gray-700'}
            after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:bg-green-600 after:w-0 after:transition-all after:duration-300
            ${isActive ? 'after:w-full' : 'hover:after:w-full'}
        `;
    };

    const getMobileLinkClasses = (path: string) => {
        const isActive = location.pathname === path;
        return `
            block w-full text-center
            py-3 px-4 rounded-lg
            text-lg font-medium
            transition-colors duration-200
            ${isActive
                ? 'bg-green-100 text-green-800'
                : 'text-gray-800 hover:bg-gray-50 hover:text-green-700'
            }
        `;
    };


    return (
        <nav className="bg-white text-gray-800 p-4 shadow-lg sticky top-0 z-50 border-b border-gray-100">
            <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
                {/* Logo / Nombre de la Marca */}
                <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-green-600 hover:text-green-700 transition-colors duration-200 tracking-tight">
                    Drocolven
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-8 items-center">
                    {links.map((link) => (
                        <li key={link.to}>
                            <Link to={link.to} className={getLinkClasses(link.to)}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    {isAuthenticated && privateLinks.map((link) => (
                        <li key={link.to}>
                            <Link to={link.to} className={getLinkClasses(link.to)}>
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    {isAuthenticated ? (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-200 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Cerrar Sesión
                            </button>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login" className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                Iniciar Sesión
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden animate-fade-in" onClick={closeMenu}></div>
            )}

            {/* Mobile Menu Content */}
            <ul
                ref={mobileMenuRef}
                className={`
                    md:hidden
                    fixed top-0 right-0 h-full w-64
                    bg-white shadow-xl p-6
                    transform transition-transform duration-300 ease-in-out
                    flex flex-col space-y-4
                    z-50
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-bold text-green-600">Menú</span>
                    <button
                        className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors duration-200"
                        onClick={closeMenu}
                        aria-label="Cerrar menú"
                    >
                        <X size={28} strokeWidth={2.5} />
                    </button>
                </div>

                {links.map((link) => (
                    <li key={link.to}>
                        <Link
                            to={link.to}
                            className={getMobileLinkClasses(link.to)}
                            onClick={closeMenu}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
                {isAuthenticated && privateLinks.map((link) => (
                    <li key={link.to}>
                        <Link
                            to={link.to}
                            className={getMobileLinkClasses(link.to)}
                            onClick={closeMenu}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
                {isAuthenticated ? (
                    <li>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-center
                                py-3 px-4 rounded-lg
                                text-lg font-medium
                                bg-red-500 text-white
                                hover:bg-red-600 transition-colors duration-200
                                shadow-sm"
                        >
                            Cerrar Sesión
                        </button>
                    </li>
                ) : (
                    <li>
                        <Link
                            to="/login"
                            className="block w-full text-center
                                py-3 px-4 rounded-lg
                                text-lg font-medium
                                bg-blue-600 text-white
                                hover:bg-blue-700 transition-colors duration-200
                                shadow-sm"
                            onClick={closeMenu}
                        >
                            Iniciar Sesión
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;