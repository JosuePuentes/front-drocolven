import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white text-black p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold">
                    Drocolven
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-6">
                    <li>
                        <Link to="/" className="hover:text-gray-300">Inicio</Link>
                    </li>
                    <li>
                        <Link to="/about" className="hover:text-gray-300">Sobre Nosotros</Link>
                    </li>
                    <li>
                        <Link to="/contact" className="hover:text-gray-300">Contacto</Link>
                    </li>
                </ul>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <ul className="md:hidden bg-white p-4 space-y-4 text-center">
                    <li>
                        <Link to="/" className="block hover:text-gray-300" onClick={() => setIsOpen(false)}>
                            Inicio
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className="block hover:text-gray-300" onClick={() => setIsOpen(false)}>
                            Sobre Nosotros
                        </Link>
                    </li>
                    <li>
                        <Link to="/productos" className="block hover:text-gray-300" onClick={() => setIsOpen(false)}>
                            Nuestros Productos
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="block hover:text-gray-300" onClick={() => setIsOpen(false)}>
                            Contacto
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
