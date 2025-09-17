import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { 
  Shield, 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Stethoscope,
  Activity,
  Plus
} from 'lucide-react'
import logoSolo from '../assets/LOGOSolo.png'

function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Construye la URL completa usando la variable de entorno
      const backendUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${backendUrl}/login/admin`, { // Ahora el endpoint es /login/admin
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        // Aquí puedes guardar el token de autenticación si tu backend lo devuelve
        // Por ejemplo: localStorage.setItem('token', data.token);
        console.log('Login exitoso:', data);
        window.location.href = '/admin'; // Redirigir al dashboard
      } else {
        const errorData = await response.json();
        console.error('Error en el login:', errorData.message || 'Credenciales inválidas');
        alert(errorData.message || 'Credenciales inválidas'); // Mostrar un mensaje de error al usuario
      }
    } catch (error) {
      console.error('Error de red o del servidor:', error);
      alert('Error de conexión. Inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary/90 to-primary/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 geometric-lines opacity-20"></div>
      
      {/* Floating Medical Icons */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center hologram-glow floating-animation">
        <Stethoscope className="h-8 w-8 text-accent" />
      </div>
      <div className="absolute top-40 right-32 w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center hologram-glow floating-animation" style={{animationDelay: '1s'}}>
        <Activity className="h-6 w-6 text-primary" />
      </div>
      <div className="absolute bottom-32 left-32 w-14 h-14 bg-secondary/30 rounded-2xl flex items-center justify-center hologram-glow floating-animation" style={{animationDelay: '2s'}}>
        <Plus className="h-7 w-7 text-secondary-foreground" />
      </div>

      {/* Back to Home Button */}
      <Button 
        variant="ghost" 
        className="absolute top-6 left-6 text-white hover:bg-white/10"
        onClick={() => window.location.href = '/'}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Inicio
      </Button>

      {/* Login Card */}
      <Card className="w-full max-w-md glass-effect border-0 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center hologram-glow">
              <Shield className="h-10 w-10 text-accent" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-3">
              <img src={logoSolo} alt="Drocolven Logo" className="h-8 w-auto" />
              <div>
                <CardTitle className="text-2xl text-white">DROCOLVEN</CardTitle>
                <CardDescription className="text-white/80 text-sm">
                  Panel Administrativo
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                <Input
                  id="username"
                  name="usuario"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={formData.usuario}
                  onChange={handleInputChange}
                  className="pl-10 bg-white/10 border-white/20 text-gray-900 placeholder:text-white/60 focus:border-accent futuristic-border"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-gray-900 placeholder:text-white/60 focus:border-accent futuristic-border"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 text-white hologram-glow"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Cargando...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-white/60 text-sm">
              ¿Olvidaste tu contraseña?{' '}
              <a href="#" className="text-accent hover:text-accent/80 underline">
                Recuperar acceso
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Info */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-white/60 text-sm">
          Servicio, compromiso y calidad
        </p>
        <p className="text-white/40 text-xs mt-1">
          © 2024 Drocolven. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}

export default AdminLogin

