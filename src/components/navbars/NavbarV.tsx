import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AiOutlineHome, AiOutlineShoppingCart, AiOutlineUser, AiOutlineLogout, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { MdOutlineCategory, MdSupportAgent, MdInfoOutline, MdReceiptLong, MdPayment, MdAccountBalance, MdReportProblem } from 'react-icons/md';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { animate, stagger } from 'animejs';

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { label: 'Inicio', href: '/', icon: <AiOutlineHome className="w-5 h-5" /> },
  { label: 'Pedidos', href: '/mispedidos', icon: <AiOutlineShoppingCart className="w-5 h-5" /> },
  { label: 'Perfil', href: '/perfil', icon: <AiOutlineUser className="w-5 h-5" /> },
  { label: 'Catálogo', href: '/catalogo', icon: <MdOutlineCategory className="w-5 h-5" /> },
  { label: 'Reclamos', href: '/reclamos', icon: <MdReportProblem className="w-5 h-5" /> },
  { label: 'Pagos', href: '/pagos', icon: <MdPayment className="w-5 h-5" /> },
  { label: 'Cuentas x Pagar', href: '/cuentasxpagar', icon: <MdAccountBalance className="w-5 h-5" /> },
  { label: 'Facturas', href: '/facturas', icon: <MdReceiptLong className="w-5 h-5" /> },
  { label: 'Información', href: '/informacion', icon: <MdInfoOutline className="w-5 h-5" /> },
  { label: 'Soporte', href: '/soporte', icon: <MdSupportAgent className="w-5 h-5" /> },
];

const NavbarV: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [showLabels, setShowLabels] = React.useState(true);
  const labelsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (navRef.current) {
      animate(navRef.current, {
        width: showLabels ? '12rem' : '3.5rem', // 14rem = w-56, 3rem = w-12
        duration: 400,
        easing: showLabels ? 'outCubic' : 'inCubic',
      });
    }
    if (showLabels) {
      animate(labelsRef.current.filter(Boolean), {
        opacity: [0, 1],
        x: [-24, 0],
        duration: 400,
        delay: stagger(40),
        easing: 'outCubic',
      });
    } else {
      animate(labelsRef.current.filter(Boolean), {
        opacity: [1, 0],
        x: [0, -24],
        duration: 300,
        delay: stagger(30, { reversed: true }),
        easing: 'inCubic',
      });
    }
  }, [showLabels]);

  const handleNav = (href: string) => {
    if (location.pathname !== href) {
      setLoading(true);
      navigate(href);
      setTimeout(() => setLoading(false), 400); // Simula un loading breve
    }
  };

  return (
    <nav
      ref={navRef}
      className={`h-full min-h-screen w-56 bg-white border-r border-gray-100 shadow-sm flex flex-col items-center py-6 fixed left-0 top-0 z-50 transition-all duration-300`}
      style={{ width: showLabels ? '14rem' : '4rem', transition: 'width 0.4s cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      {/* Logo y Toggle */}
      <div className="flex flex-row items-center gap-2 mb-8 w-full px-2 relative">
        <span className="text-xl font-semibold text-gray-900 hidden md:block mx-auto absolute left-1/2 -translate-x-1/2">DROCOLVEN</span>
        <button
          aria-label={showLabels ? 'Ocultar descripciones' : 'Mostrar descripciones'}
          className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors md:hidden ml-auto"
          onClick={() => setShowLabels((v) => !v)}
        >
          {showLabels ? <AiOutlineClose className="w-5 h-5" /> : <AiOutlineMenu className="w-5 h-5" />}
        </button>
      </div>
      {/* Nav links vertical */}
      <div className="flex flex-col gap-4 w-full items-start px-2">
        {navLinks.map((link, idx) => (
          <button
            key={link.href}
            onClick={() => handleNav(link.href)}
            className={`flex flex-row items-center gap-2 text-gray-700 hover:text-primary transition-colors text-xs md:text-sm font-medium px-2 py-2 rounded-md w-full justify-start ${location.pathname === link.href ? 'bg-gray-100 font-semibold text-primary' : ''}`}
            aria-current={location.pathname === link.href ? 'page' : undefined}
            disabled={loading}
          >
            {link.icon}
            <span
              ref={el => { labelsRef.current[idx] = el; }}
              style={{ display: showLabels ? 'inline' : 'none', minWidth: 0 }}
              className="overflow-hidden whitespace-nowrap transition-all duration-300"
            >
              {link.label}
            </span>
          </button>
        ))}
        {loading && (
          <div className="flex items-center gap-2 mt-4 animate-pulse">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Cargando...</span>
          </div>
        )}
      </div>
      <div className="mt-auto flex flex-col items-center w-full">
        <Button
          variant="ghost"
          className="flex flex-row items-center gap-1 text-gray-700 hover:text-red-500 px-2 py-2 text-xs md:text-sm font-medium w-full justify-start"
          onClick={() => logout(navigate)}
        >
          <AiOutlineLogout className="w-5 h-5" />
          <span
            ref={el => { labelsRef.current[navLinks.length] = el; }}
            style={{ display: showLabels ? 'inline' : 'none', minWidth: 0 }}
            className="overflow-hidden whitespace-nowrap transition-all duration-300"
          >
            Salir
          </span>
        </Button>
      </div>
    </nav>
  );
};

export default NavbarV;
