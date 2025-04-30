import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductsPage from "./pages/ProductsPage";
import AdminPage from "./pages/AdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Contact from "./components/Contact";
import InventarioPage from "./pages/InventarioPage";
import UsuariosPage from "./pages/UsuariosPage";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import CreateAdminUser from "./components/CreateAdminUser";
import AdminLoginPage from "./components/AdminLoginPage";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UploadInventory from "./components/UploadInventary";
import Inventario from "./components/Inventario";
import { CarritoCompras } from "./components/Compras/CarritoCompras";
import {PedidosOrganizados} from "./components/Pedidos/ArmarPedidos";
import { ListaPedidos } from "./components/Pedidos/ListaPedidos";

function App() {
  return (
    <Router>
      <Routes>
        {/* CLIENT ROUTES */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegisterPage />} />
          <Route path="/productos" element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          } />
          <Route path="/comprar" element={
            <ProtectedRoute>
              <CarritoCompras />
            </ProtectedRoute>
          } />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<AdminPage />} />

          <Route path="inventario" element={<AdminProtectedRoute moduleRequired="inventario"><InventarioPage /></AdminProtectedRoute>} />

          <Route path="usuarios" element={<AdminProtectedRoute moduleRequired="usuarios"><UsuariosPage /></AdminProtectedRoute>} />
          <Route path="usuarios/create" element={<AdminProtectedRoute moduleRequired="usuarios"><CreateAdminUser /></AdminProtectedRoute>} />
          <Route path="usuarios/editar" element={<AdminProtectedRoute moduleRequired="usuarios"><CreateAdminUser /></AdminProtectedRoute>} />
          <Route path="inventario/cargar" element={<AdminProtectedRoute moduleRequired="inventario"><UploadInventory /></AdminProtectedRoute>} />
          <Route path="inventario/ver" element={<AdminProtectedRoute moduleRequired="inventario"><Inventario /></AdminProtectedRoute>} />
          <Route path="comprar" element={<AdminProtectedRoute moduleRequired="compras"><CarritoCompras /></AdminProtectedRoute>} />
          <Route path="pedidos" element={<AdminProtectedRoute moduleRequired="pedidos"><PedidosOrganizados /></AdminProtectedRoute>} />
          <Route path="listapedidos" element={<AdminProtectedRoute moduleRequired="pedidos"><ListaPedidos /></AdminProtectedRoute>} />
          {/* Más rutas administrativas aquí */}
      
        </Route>

        {/* CATCH-ALL */}
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/adminregister" element={<CreateAdminUser />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
