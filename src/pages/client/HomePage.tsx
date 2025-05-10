import CardHomePage from "../../components/card/Card";

function HomePage() {
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
        <div className="relative z-10 flex flex-col items-center justify-center h-full  text-center px-4">
          <h1 className="text-5xl font-bold text-white drop-shadow mb-4">
            Bienvenido a Drocolven
          </h1>
          <p className="text-xl text-white max-w-xl">
            Los mejores precios en medicamentos y productos farmacéuticos.
          </p>
        </div>
      </section>

      {/* CTA REGISTRO */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50 text-center">
        <h2 className="text-4xl font-semibold mb-6 px-4">
          Regístrate y aprovecha nuestros beneficios exclusivos
        </h2>
        <button className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300">
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
