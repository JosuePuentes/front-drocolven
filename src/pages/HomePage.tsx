function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-400 flex flex-col items-center justify-center">
      <section className="h-screen pt-24">
        <div className="flex flex-row bg-white shadow-lg rounded-2xl max-w-4xl text-center">
          <div className="flex flex-col justify-center ">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Bienvenido a Drocolven
            </h1>
            <p className="text-gray-600">
              Estamos aquí para ofrecerte los medicamentos al mejor precio del
              mercado.
            </p>
          </div>
          <div className=" w-60 sm:w-96 h-auto mx-auto flex">
            <img
              className="w-full h-full object-cover rounded-lg shadow-md"
              src="./farmacia-inicio.jpg"
              alt="Farmacéutica sosteniendo medicamento"
            />
          </div>
        </div>
      </section>
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Sobre Nosotros
        </h2>
        <p className="text-gray-600">
          En <span className="font-semibold text-blue-600">Drocolven</span>, nos
          dedicamos a proporcionar medicamentos de alta calidad al mejor precio
          del mercado. Nuestra misión es mejorar la salud y el bienestar de
          nuestra comunidad con productos confiables y accesibles.
        </p>
        <div className="mt-6 w-40 h-40 mx-auto">
          <img
            className="w-full h-full object-cover rounded-lg shadow-md"
            src="./farmacia-sobre-nosotros.jpg"
            alt="Farmacéutico organizando medicamentos"
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
