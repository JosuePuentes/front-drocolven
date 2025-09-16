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
import ParticleField from './components/ParticleField.jsx'
import HolographicIcon from './components/HolographicIcon.jsx'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={logoSolo} alt="Drocolven Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-xl font-bold text-primary">DROCOLVEN</h1>
                <p className="text-xs text-muted-foreground">Servicio, compromiso y calidad</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-primary transition-colors">Inicio</a>
              <a href="#productos" className="text-gray-700 hover:text-primary transition-colors">Productos</a>
              <a href="#sobre-nosotros" className="text-gray-700 hover:text-primary transition-colors">Sobre Nosotros</a>
              <a href="#contacto" className="text-gray-700 hover:text-primary transition-colors">Contacto</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Iniciar Sesión
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = '/adminlogin'}>
                Panel Admin
              </Button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              <a href="#inicio" className="block py-2 text-gray-700 hover:text-primary">Inicio</a>
              <a href="#productos" className="block py-2 text-gray-700 hover:text-primary">Productos</a>
              <a href="#sobre-nosotros" className="block py-2 text-gray-700 hover:text-primary">Sobre Nosotros</a>
              <a href="#contacto" className="block py-2 text-gray-700 hover:text-primary">Contacto</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden neural-network">
        <ParticleField density={15} />
        <div className="absolute inset-0 medical-grid opacity-20"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-accent/20 text-accent-foreground border-accent/30 holographic-border">
                  Droguería Digital Avanzada
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Bienvenido a{' '}
                  <span className="hologram-text">Drocolven</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Los mejores precios en medicamentos y productos farmacéuticos con la más alta calidad y servicio profesional.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 hologram-glow medical-pulse">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Explorar Catálogo
                </Button>
                <Button variant="outline" size="lg" className="holographic-border">
                  <Heart className="mr-2 h-5 w-5" />
                  Conocer Más
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <HolographicIcon icon={Shield} size={48} className="mx-auto mb-2" />
                  <p className="text-sm font-medium">Calidad Garantizada</p>
                </div>
                <div className="text-center">
                  <HolographicIcon icon={Truck} size={48} color="text-secondary" className="mx-auto mb-2" />
                  <p className="text-sm font-medium">Envío Rápido</p>
                </div>
                <div className="text-center">
                  <HolographicIcon icon={Clock} size={48} color="text-accent" className="mx-auto mb-2" />
                  <p className="text-sm font-medium">24/7 Disponible</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="futuristic-card rounded-3xl p-8 floating-animation quantum-effect">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <HolographicIcon icon={Pill} size={64} />
                    <HolographicIcon icon={Stethoscope} size={64} color="text-secondary" />
                  </div>
                  <div className="space-y-4">
                    <HolographicIcon icon={Activity} size={64} color="text-accent" />
                    <HolographicIcon icon={Plus} size={64} />
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
          <div className="futuristic-card rounded-2xl p-8 medical-scanner">
            <h2 className="text-2xl font-bold text-center mb-6 hologram-text">Busca tu medicamento</h2>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Buscar medicamentos, vitaminas, productos..." 
                  className="pl-10 h-12 holographic-border data-stream"
                />
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary/90 hologram-glow">
                Buscar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Promociones Destacadas</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Aprovecha nuestras ofertas especiales en medicamentos y productos de alta calidad
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="futuristic-card hover-lift border-0 overflow-hidden quantum-effect">
                <CardHeader className="p-0">
                  <div className="relative medical-scanner">
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <HolographicIcon icon={Pill} size={64} animate={false} />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white hologram-glow">
                      -{product.discount}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs holographic-border">
                      {product.category}
                    </Badge>
                    <CardTitle className="text-lg hologram-text">{product.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{product.price}</span>
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
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90 hologram-glow medical-pulse">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Ver Oferta
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Verse Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5 relative neural-network">
        <ParticleField density={8} />
        <div className="max-w-4xl mx-auto text-center">
          <div className="futuristic-card rounded-2xl p-8 quantum-effect">
            <h3 className="text-xl font-semibold mb-4 hologram-text">Versículo del Día</h3>
            <blockquote className="text-lg italic text-gray-700 mb-2">
              "{currentVerse.text}"
            </blockquote>
            <cite className="text-sm text-muted-foreground">- {currentVerse.reference}</cite>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img src={logoSolo} alt="Drocolven Logo" className="h-8 w-auto" />
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
                <li><a href="#" className="hover:opacity-100 transition-opacity">Medicamentos</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Vitaminas</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Cuidado Personal</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Primeros Auxilios</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Consulta Farmacéutica</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Entrega a Domicilio</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Programa de Fidelidad</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Atención 24/7</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>📞 +58 (212) 555-0123</li>
                <li>📧 info@drocolven.com</li>
                <li>📍 Caracas, Venezuela</li>
                <li>🕒 Lun - Dom: 24 horas</li>
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

