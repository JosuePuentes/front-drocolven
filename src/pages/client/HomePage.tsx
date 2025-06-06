import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate } from 'animejs';
import CardHomePage from "../../components/card/Card";

function HomePage() {
  const navigate = useNavigate();
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (heroTitleRef.current) {
      animate(heroTitleRef.current, {
        opacity: [0, 1],
        translateY: [-40, 0],
        duration: 900,
        easing: 'easeOutCubic',
      });
    }
    if (heroDescRef.current) {
      animate(heroDescRef.current, {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 900,
        delay: 200,
        easing: 'easeOutCubic',
      });
    }
    if (ctaBtnRef.current) {
      animate(ctaBtnRef.current, {
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 700,
        delay: 400,
        easing: 'easeOutBack',
      });
    }
  }, []);

  // Animación de hover para el botón CTA
  const handleBtnMouseEnter = () => {
    if (ctaBtnRef.current) {
      animate(ctaBtnRef.current, {
        scale: 1.07,
        duration: 200,
        easing: 'easeOutCubic',
      });
    }
  };
  const handleBtnMouseLeave = () => {
    if (ctaBtnRef.current) {
      animate(ctaBtnRef.current, {
        scale: 1,
        duration: 200,
        easing: 'easeOutCubic',
      });
    }
  };

  return (
    <div className="bg-white text-gray-800">
      {/* HERO PRINCIPAL */}
      <section className="relative h-screen bg-black">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
          src="./video-presentacion.webm"
          autoPlay
          loop
          muted
        ></video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1
            ref={heroTitleRef}
            className="text-4xl sm:text-6xl md:text-8xl font-bold text-white drop-shadow mb-4 tracking-tight"
          >
            Bienvenido a Drocolven
          </h1>
          <p
            ref={heroDescRef}
            className="text-xl sm:text-2xl text-white max-w-xl mx-auto"
          >
            Los mejores precios en medicamentos y productos farmacéuticos.
          </p>
        </div>
      </section>

      {/* CTA REGISTRO */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6 px-4">
          Contáctanos y aprovecha nuestros beneficios exclusivos
        </h2>
        <button
          ref={ctaBtnRef}
          onClick={() => navigate('/contact')}
          onMouseEnter={handleBtnMouseEnter}
          onMouseLeave={handleBtnMouseLeave}
          className="bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:bg-green-700 transition-colors duration-200 text-lg"
        >
          Suscríbete
        </button>
      </section>

      {/* SECCIÓN DESTACADOS / SERVICIOS */}
      <section className="py-20 bg-green-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">Nuestros Productos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CardHomePage
              title="Medicamentos"
              content="Variedad para todas tus necesidades de salud."
              imgSrc="./medicina-1.jpg"
            />
            <CardHomePage
              title="Suplementos"
              content="Suplementos nutricionales de alta calidad."
              imgSrc="./medicina-1.jpg"
            />
            <CardHomePage
              title="Cuidado personal"
              content="Productos para tu bienestar diario."
              imgSrc="./medicina-1.jpg"
            />
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
          <p className="text-gray-600 mb-6">
            En <span className="font-semibold text-green-600">Drocolven</span>,
            nos dedicamos a proporcionar medicamentos de alta calidad al mejor precio.
            Nuestra misión es mejorar la salud de nuestra comunidad con productos confiables y accesibles.
          </p>
          <div className="w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-md">
            <img
              src="./img.jpg"
              alt="Farmacéutico organizando medicamentos"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIOS O EXTRAS (ESPACIO PARA AGREGAR MÁS INFO) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-700 mb-4">"Servicio excelente y precios muy competitivos."</p>
              <span className="text-green-700 font-semibold">– María G.</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-700 mb-4">"Siempre encuentro lo que necesito para mi familia."</p>
              <span className="text-green-700 font-semibold">– Juan P.</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-700 mb-4">"Recomiendo Drocolven a todos mis conocidos."</p>
              <span className="text-green-700 font-semibold">– Ana M.</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="py-10 bg-green-700 text-white text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Drocolven. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;
