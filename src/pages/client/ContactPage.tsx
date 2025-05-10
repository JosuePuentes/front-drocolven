function ContactPage() {
    return (
      <div className="min-h-screen bg-white text-gray-800">
        {/* Hero */}
        <section className="bg-green-100 py-16 text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-lg max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o quieres trabajar con nosotros? Completa el formulario o llámanos.
          </p>
        </section>
  
        {/* Formulario y detalles */}
        <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Formulario de contacto */}
          <form className="bg-gray-50 p-8 rounded-xl shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                rows={5}
                placeholder="Escribe tu mensaje aquí..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 transition"
            >
              Enviar Mensaje
            </button>
          </form>
  
          {/* Información de contacto */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Información de contacto</h2>
              <p className="text-gray-600">Puedes comunicarte con nosotros a través de los siguientes medios:</p>
            </div>
            <div className="space-y-2">
              <p><strong>Teléfono:</strong> +58 000 0000000</p>
              <p><strong>Email:</strong> contacto@drocolven.com</p>
              <p><strong>Dirección:</strong> Av. 7 #123, Maracaibo, Venezuela</p>
              <p><strong>Horario:</strong> Lun - Vie: 8am - 5pm / Sab: 8am - 2pm </p>
            </div>
            <div className="w-full h-64 rounded-md overflow-hidden shadow">
              <iframe
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18..."
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Drocolven"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    );
  }
  
  export default ContactPage;
  