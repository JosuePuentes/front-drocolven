import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

function AboutPage() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroDescRef = useRef<HTMLParagraphElement>(null);
  const historiaRef = useRef<HTMLDivElement>(null);
  const historiaImgRef = useRef<HTMLImageElement>(null);
  const valoresTitleRef = useRef<HTMLHeadingElement>(null);
  const valoresCardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (heroTitleRef.current) {
      animate(heroTitleRef.current, {
        opacity: [0, 1],
        translateY: [-30, 0],
        duration: 700,
        easing: 'easeOutCubic',
      });
    }
    if (heroDescRef.current) {
      animate(heroDescRef.current, {
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 700,
        delay: 150,
        easing: 'easeOutCubic',
      });
    }
    if (historiaRef.current) {
      animate(historiaRef.current, {
        opacity: [0, 1],
        translateX: [-40, 0],
        duration: 700,
        delay: 200,
        easing: 'easeOutCubic',
      });
    }
    if (historiaImgRef.current) {
      animate(historiaImgRef.current, {
        opacity: [0, 1],
        translateX: [40, 0],
        duration: 700,
        delay: 300,
        easing: 'easeOutCubic',
      });
    }
    if (valoresTitleRef.current) {
      animate(valoresTitleRef.current, {
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600,
        delay: 200,
        easing: 'easeOutCubic',
      });
    }
    if (valoresCardsRef.current.length) {
      animate(valoresCardsRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        delay: stagger(120),
        easing: 'easeOutCubic',
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-green-100 py-20 px-6 text-center">
        <h1 ref={heroTitleRef} className="text-5xl font-bold mb-4">Sobre Nosotros</h1>
        <p ref={heroDescRef} className="text-lg max-w-2xl mx-auto">
          En <span className="font-semibold text-green-700">Drocolven</span>, estamos comprometidos con tu bienestar, brindando medicamentos de calidad a precios accesibles.
        </p>
      </section>

      {/* Historia y misión */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div ref={historiaRef}>
          <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
          <p className="text-gray-600">
            Fundada en 2010, Drocolven ha crecido hasta convertirse en uno de los distribuidores farmacéuticos más confiables del país. Comenzamos con una simple idea: hacer que los medicamentos esenciales sean accesibles para todos.
          </p>
        </div>
        <img
          ref={historiaImgRef}
          src="./img.jpg"
          alt="Historia de la empresa"
          className="rounded-xl shadow-md w-full h-80 object-cover"
        />
      </section>

      {/* Valores */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 ref={valoresTitleRef} className="text-3xl font-bold mb-6">Nuestros Valores</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Compromiso', 'Calidad', 'Accesibilidad'].map((valor, i) => (
              <div
                key={valor}
                ref={el => { valoresCardsRef.current[i] = el!; }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-semibold mb-2 text-green-700">{valor}</h3>
                <p className="text-gray-600">
                  {valor === 'Compromiso' && 'Nos esforzamos por brindar un servicio excepcional a cada cliente.'}
                  {valor === 'Calidad' && 'Solo trabajamos con productos aprobados y de confianza.'}
                  {valor === 'Accesibilidad' && 'Precios competitivos para que nadie quede sin sus medicamentos.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Imagen final y contacto */}
      <section className="py-20 px-6 flex flex-col md:flex-row items-center justify-center gap-12">
        <img
          src="./img.jpg"
          alt="Farmacéutico organizando"
          className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
        />
        <div className="text-center md:text-left max-w-md">
          <h2 className="text-3xl font-bold mb-4">Conócenos mejor</h2>
          <p className="text-gray-600 mb-6">
            Ya sea que necesites productos al por mayor o asesoría personalizada, estamos aquí para ayudarte.
          </p>
          <button className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 transition">
            Contáctanos
          </button>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
