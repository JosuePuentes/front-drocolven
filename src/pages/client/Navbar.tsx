import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const handleLogout = () => {
        logout(navigate);
        closeMenu();
    };

    const links = [
        { to: "/", label: "Inicio" },
        { to: "/about", label: "Sobre Nosotros" },
        { to: "/contact", label: "Contacto" },
        { to: "/comprar", label: "Comprar" },
    ];

    return (
        <nav className="bg-green-200 text-black p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    Drocolven
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6 items-center">
                    {links.map((link) => (
                        <li key={link.to}>
                            <Link to={link.to} className="hover:text-gray-600">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                    {isAuthenticated ? (
                        <li>
                            <button
                                onClick={handleLogout}
                                className="hover:text-gray-600 font-medium"
                            >
                                Cerrar Sesión
                            </button>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login" className="hover:text-gray-600">
                                Iniciar Sesión
                            </Link>
                        </li>
                    )}
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isOpen}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <ul className="md:hidden bg-white p-4 space-y-4 text-center">
                    {links.map((link) => (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                className="block hover:text-gray-600"
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
                                className="block w-full text-center hover:text-gray-600"
                            >
                                Cerrar Sesión
                            </button>
                        </li>
                    ) : (
                        <li>
                            <Link
                                to="/login"
                                className="block hover:text-gray-600"
                                onClick={closeMenu}
                            >
                                Iniciar Sesión
                            </Link>
                        </li>
                    )}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
