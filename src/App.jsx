import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  Heart, 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  Star, 
  Shield, 
  Truck, 
  Clock,
  Plus,
  Stethoscope,
  Pill,
  Activity
} from 'lucide-react'
import logoSolo from './assets/LOGOSolo.png'
import AdminLogin from './components/AdminLogin.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import './App.css'

function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentVerse, setCurrentVerse] = useState({
    text: "Todo lo puedo en Cristo que me fortalece.",
    reference: "Filipenses 4:13"
  })

  const featuredProducts = [
    {
      id: 1,
      name: "Paracetamol 500mg",
      price: "$12.50",
      originalPrice: "$15.00",
      discount: "17%",
      image: "/api/placeholder/200/200",
      category: "Analgésicos"
    },
    {
      id: 2,
      name: "Vitamina C 1000mg",
      price: "$8.99",
      originalPrice: "$11.99",
      discount: "25%",
      image: "/api/placeholder/200/200",
      category: "Vitaminas"
    },
    {
      id: 3,
      name: "Ibuprofeno 400mg",
      price: "$18.75",
      originalPrice: "$22.50",
      discount: "17%",
      image: "/api/placeholder/200/200",
      category: "Antiinflamatorios"
    },
    {
      id: 4,
      name: "Omeprazol 20mg",
      price: "$25.00",
      originalPrice: "$30.00",
      discount: "17%",
      image: "/api/placeholder/200/200",
      category: "Digestivos"
    }
  ]

  return (
    <div className="min-h-screen drocolven-bg-futurista">
      {/* Header */}
      <header className="drocolven-header border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={logoSolo} alt="Drocolven Logo" className="h-10 w-auto drocolven-pulse" />
              <div>
                <h1 className="text-xl font-bold drocolven-gradient-text">DROCOLVEN</h1>
                <p className="text-xs text-muted-foreground">Servicio, compromiso y calidad</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="drocolven-nav-link">Inicio</a>
              <a href="#productos" className="drocolven-nav-link">Productos</a>
              <a href="#sobre-nosotros" className="drocolven-nav-link">Sobre Nosotros</a>
              <a href="#contacto" className="drocolven-nav-link">Contacto</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="drocolven-btn-secondary hidden sm:inline-flex">
                Iniciar Sesión
              </button>
              <button className="drocolven-btn" onClick={() => window.location.href = '/adminlogin'}>
                Panel Admin
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 drocolven-icon"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden drocolven-card border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              <a href="#inicio" className="block py-2 drocolven-nav-link">Inicio</a>
              <a href="#productos" className="block py-2 drocolven-nav-link">Productos</a>
              <a href="#sobre-nosotros" className="block py-2 drocolven-nav-link">Sobre Nosotros</a>
              <a href="#contacto" className="block py-2 drocolven-nav-link">Contacto</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="drocolven-badge">
                  Droguería Digital Avanzada
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Bienvenido a{' '}
                  <span className="drocolven-gradient-text">Drocolven</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Los mejores precios en medicamentos y productos farmacéuticos con la más alta calidad y servicio profesional.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="drocolven-btn flex items-center justify-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Explorar Catálogo
                </button>
                <button className="drocolven-btn-secondary flex items-center justify-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Conocer Más
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="drocolven-icon mx-auto mb-2">
                    <Shield size={48} className="text-green-600" />
                  </div>
                  <p className="text-sm font-medium">Calidad Garantizada</p>
                </div>
                <div className="text-center">
                  <div className="drocolven-icon mx-auto mb-2">
                    <Truck size={48} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-medium">Envío Rápido</p>
                </div>
                <div className="text-center">
                  <div className="drocolven-icon mx-auto mb-2">
                    <Clock size={48} className="text-green-600" />
                  </div>
                  <p className="text-sm font-medium">24/7 Disponible</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="drocolven-card rounded-3xl p-8 drocolven-bounce">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="drocolven-icon">
                      <Pill size={64} className="text-green-600" />
                    </div>
                    <div className="drocolven-icon">
                      <Stethoscope size={64} className="text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="drocolven-icon">
                      <Activity size={64} className="text-green-600" />
                    </div>
                    <div className="drocolven-icon">
                      <Plus size={64} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 relative">
        <div className="max-w-4xl mx-auto">
          <div className="drocolven-card rounded-2xl p-8 drocolven-shadow-medium">
            <h2 className="text-2xl font-bold text-center mb-6 drocolven-gradient-text">Busca tu medicamento</h2>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input 
                  placeholder="Buscar medicamentos, vitaminas, productos..." 
                  className="drocolven-input pl-10 h-12 w-full"
                />
              </div>
              <button className="drocolven-btn px-8 h-12">
                Buscar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 drocolven-gradient-text">Promociones Destacadas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Aprovecha nuestras ofertas especiales en medicamentos y productos de alta calidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="drocolven-card border-0 overflow-hidden">
                <div className="p-0">
                  <div className="relative drocolven-loading">
                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                      <div className="drocolven-icon">
                        <Pill size={64} className="text-green-600" />
                      </div>
                    </div>
                    <div className="drocolven-badge absolute top-2 right-2 bg-red-500 text-white">
                      -{product.discount}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="drocolven-badge-outline text-xs">
                      {product.category}
                    </div>
                    <h3 className="text-lg font-semibold drocolven-gradient-text">{product.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-600">{product.price}</span>
                      <span className="text-sm text-muted-foreground line-through">
                        {product.originalPrice}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
                    </div>
                  </div>
                  <button className="drocolven-btn w-full mt-4 flex items-center justify-center">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ver Oferta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Verse Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 to-blue-50 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="drocolven-card rounded-2xl p-8 drocolven-shadow-soft">
            <h3 className="text-xl font-semibold mb-4 drocolven-gradient-text">Versículo del Día</h3>
            <blockquote className="text-lg italic text-gray-700 mb-2">
              "{currentVerse.text}"
            </blockquote>
            <cite className="text-sm text-muted-foreground">- {currentVerse.reference}</cite>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="drocolven-gradient-bg text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={logoSolo} alt="Drocolven Logo" className="h-8 w-auto brightness-0 invert" />
                <div>
                  <h3 className="font-bold">DROCOLVEN</h3>
                  <p className="text-xs opacity-80">Servicio, compromiso y calidad</p>
                </div>
              </div>
              <p className="text-sm opacity-80">
                Tu droguería de confianza con los mejores productos farmacéuticos y atención profesional.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Productos</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100 transition-opacity drocolven-nav-link">Medicamentos</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity drocolven-nav-link">Vitaminas</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity drocolven-nav-link">Cuidado Personal</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity drocolven-nav-link">Primeros Auxilios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100 transition-opacity drocolven-nav-link">Consulta Farmacéutica</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity drocolven-nav-link">Entrega a Domicilio</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity drocolven-nav-link">Programa de Fidelidad</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity drocolven-nav-link">Atención 24/7</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-center">
                  <span className="drocolven-icon mr-2">📞</span>
                  +58 (212) 555-0123
                </li>
                <li className="flex items-center">
                  <span className="drocolven-icon mr-2">📧</span>
                  info@drocolven.com
                </li>
                <li className="flex items-center">
                  <span className="drocolven-icon mr-2">📍</span>
                  Caracas, Venezuela
                </li>
                <li className="flex items-center">
                  <span className="drocolven-icon mr-2">🕒</span>
                  Lun - Dom: 24 horas
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 Drocolven. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
