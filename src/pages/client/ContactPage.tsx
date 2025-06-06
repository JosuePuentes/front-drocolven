import React, { useState, useRef, useEffect } from 'react';
import { animate } from 'animejs';

function ContactPage() {
  const [nombre, setNombre] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telefono, setTelefono] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedback && feedbackRef.current) {
      animate(feedbackRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutQuad',
      });
    }
  }, [feedback]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    if (!nombre.trim() || !email.trim() || !telefono.trim() || !mensaje.trim()) {
      setFeedback({ type: 'error', message: 'Por favor, completa todos los campos.' });
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono, mensaje }),
      });
      if (response.ok) {
        setFeedback({ type: 'success', message: '¡Mensaje enviado correctamente! Pronto nos pondremos en contacto.' });
        setNombre('');
        setEmail('');
        setTelefono('');
        setMensaje('');
      } else {
        setFeedback({ type: 'error', message: 'Ocurrió un error al enviar el mensaje. Intenta nuevamente.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'No se pudo conectar con el servidor.' });
    }
  };

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
        <form className="bg-gray-50 p-8 rounded-xl shadow-md space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre completo o razón social"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="tel"
              placeholder="Ej: 0412-1234567"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea
              rows={5}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-md shadow hover:bg-green-700 transition"
          >
            Enviar Mensaje
          </button>
          {feedback && (
            <div
              ref={feedbackRef}
              className={`mt-4 text-center rounded-md px-4 py-2 text-sm font-medium ${feedback.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}
              role="alert"
              aria-live="polite"
            >
              {feedback.message}
            </div>
          )}
        </form>

        {/* Información de contacto */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Información de contacto</h2>
            <p className="text-gray-600">Puedes comunicarte con nosotros a través de los siguientes medios:</p>
          </div>
          <div className="space-y-2">
            <p><strong className="pr-4">Teléfono Telemarketing:</strong> +58 412 2838933</p>
            <p><strong className="pr-4">Teléfono Credito y Cobranza:</strong> +58 412 2839191</p>
            <p><strong className="pr-4">Correo:</strong> administracion@drocolven.com</p>
            <p><strong className="pr-4">Dirección:</strong> Av. 7 #123, Maracaibo, Venezuela</p>
            <p><strong className="pr-4">Horario:</strong> Lun - Vie: 8am - 5pm / Sab: 9am - 2pm </p>
          </div>
          <div className="w-full h-64 rounded-md overflow-hidden shadow">
            <iframe
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5093.934629707462!2d-71.61213806341786!3d10.70322066423674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e899f00711ff43b%3A0x6f4077d44aa7ab3d!2sDROCOLVEN!5e0!3m2!1ses!2sve!4v1749214924803!5m2!1ses!2sve"
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
