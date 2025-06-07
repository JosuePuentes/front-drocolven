import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate } from 'animejs';

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
      <section className="relative min-h-[80vh] sm:min-h-[90vh] bg-black flex items-center justify-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-40"
          src="./video-presentacion.webm"
          autoPlay
          loop
          muted
        ></video>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 py-16 sm:py-24">
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
      <section className="py-32 sm:py-40 bg-gradient-to-b from-white to-green-50 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-8 px-4">
          Contáctanos y aprovecha nuestros beneficios exclusivos
        </h2>
        <button
          ref={ctaBtnRef}
          onClick={() => navigate('/contact')}
          onMouseEnter={handleBtnMouseEnter}
          onMouseLeave={handleBtnMouseLeave}
          className="bg-green-600 text-white font-semibold px-10 py-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:bg-green-700 transition-colors duration-200 text-lg"
        >
          Suscríbete
        </button>
      </section>


      <footer className="py-10 bg-green-700 text-white text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Drocolven. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;
