import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { 
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Upload,
  Activity,
  DollarSign,
  AlertTriangle
} from 'lucide-react'
import logoSolo from '../assets/LOGOSolo.png'

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')

  const stats = [
    {
      title: "Ventas Totales",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Pedidos Pendientes",
      value: "23",
      change: "+5",
      trend: "up",
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Productos en Stock",
      value: "1,234",
      change: "-12",
      trend: "down",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Clientes Activos",
      value: "573",
      change: "+15",
      trend: "up",
      icon: Users,
      color: "text-orange-600"
    }
  ]

  const recentOrders = [
    { id: "ORD-001", customer: "María González", product: "Paracetamol 500mg", amount: "$12.50", status: "Completado" },
    { id: "ORD-002", customer: "Carlos Rodríguez", product: "Vitamina C 1000mg", amount: "$8.99", status: "Pendiente" },
    { id: "ORD-003", customer: "Ana Martínez", product: "Ibuprofeno 400mg", amount: "$18.75", status: "En Proceso" },
    { id: "ORD-004", customer: "Luis Pérez", product: "Omeprazol 20mg", amount: "$25.00", status: "Completado" },
  ]

  const lowStockProducts = [
    { name: "Aspirina 100mg", stock: 5, minStock: 20 },
    { name: "Amoxicilina 500mg", stock: 8, minStock: 25 },
    { name: "Loratadina 10mg", stock: 3, minStock: 15 },
  ]

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'analytics', label: 'Analíticas', icon: TrendingUp },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completado': return 'bg-green-100 text-green-800'
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800'
      case 'En Proceso': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-secondary text-secondary-foreground flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <img src={logoSolo} alt="Drocolven Logo" className="h-8 w-auto" />
            {isSidebarOpen && (
              <div>
                <h2 className="font-bold text-lg">DROCOLVEN</h2>
                <p className="text-xs opacity-80">Panel Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? 'bg-accent text-accent-foreground' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-secondary-foreground hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Cerrar Sesión</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Buscar..." 
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="glass-effect border-0 hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change} desde el mes pasado
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pedidos Recientes</CardTitle>
                    <CardDescription>Últimas transacciones del sistema</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.product}</p>
                        <p className="text-xs text-muted-foreground">{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{order.amount}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            <Card className="glass-effect border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                      Stock Bajo
                    </CardTitle>
                    <CardDescription>Productos que requieren reabastecimiento</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Reabastecer
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Stock mínimo: {product.minStock}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">{product.stock}</p>
                        <p className="text-xs text-muted-foreground">unidades</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="glass-effect border-0">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Operaciones frecuentes del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col space-y-2 bg-primary hover:bg-primary/90">
                  <Plus className="h-6 w-6" />
                  <span>Nuevo Producto</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Upload className="h-6 w-6" />
                  <span>Importar Inventario</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Download className="h-6 w-6" />
                  <span>Exportar Reportes</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Users className="h-6 w-6" />
                  <span>Gestionar Usuarios</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard

