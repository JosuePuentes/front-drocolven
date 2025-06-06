import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import UploadInventory from "./components/UploadInventary";
import MonitorPedidos from "./components/Pedidos/ListaPedidos";
import PedidosArmados from "./components/Pedidos/PedidosArmados";
import HomePage from "./pages/client/HomePage";
import AboutPage from "./pages/client/AboutPage";
import NotFoundPage from "./pages/client/NotFoundPage";
import RegisterPage from "./pages/client/RegisterPage";
import ContactPage from "./pages/client/ContactPage";
import AdminPage from "./pages/admin/AdminPage";
import UsuariosPage from "./pages/admin/UsuariosPage";
import AdminInventarioPage from "./pages/admin/AdminInventarioPage";
import { InventoryList } from "./components/InventarioList";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import { ShoppingCartClient } from "./components/ClientCompras/CarritoComprasCliente";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import { AdminCarritoCompras } from "./components/AdminCompras/AdminCarritoCompras";
import CreateAdminUser from "./components/auth/CreateAdminUser";
import PedidoDetalle from "./components/Pedidos/PedidoDetalle";
import CreateClient from "./components/auth/CreateClient";
import LoginClientPage from "./pages/client/LoginClientPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* CLIENT ROUTES */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginClientPage />} />
          <Route path="/registrar" element={<RegisterPage />} />


          <Route path="/comprar" element={
            <ProtectedRoute>
              <ShoppingCartClient />
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
          <Route path="inventario" element={<AdminProtectedRoute moduleRequired="inventario"><AdminInventarioPage /></AdminProtectedRoute>} />

          <Route path="usuarios" element={<AdminProtectedRoute moduleRequired="usuarios"><UsuariosPage /></AdminProtectedRoute>} />
          <Route path="usuarios/create" element={<AdminProtectedRoute moduleRequired="usuarios"><CreateAdminUser /></AdminProtectedRoute>} />
          <Route path="usuarios/editar" element={<AdminProtectedRoute moduleRequired="usuarios"><CreateAdminUser /></AdminProtectedRoute>} />
          <Route path="usuarios/crearcliente" element={<AdminProtectedRoute moduleRequired="clientes"><CreateClient /></AdminProtectedRoute>} />
          <Route path="inventario/cargar" element={<AdminProtectedRoute moduleRequired="inventario"><UploadInventory /></AdminProtectedRoute>} />
          <Route path="inventario/ver" element={<AdminProtectedRoute moduleRequired="inventario"><InventoryList /></AdminProtectedRoute>} />
          <Route path="comprar" element={<AdminProtectedRoute moduleRequired="compras"><AdminCarritoCompras /></AdminProtectedRoute>} />
          <Route path="pedidos" element={<AdminProtectedRoute moduleRequired="pedidos"><MonitorPedidos /></AdminProtectedRoute>} />
          <Route path="listapedidos" element={<AdminProtectedRoute moduleRequired="pedidos"><MonitorPedidos /></AdminProtectedRoute>} />
          <Route path="pedidosarmados" element={<AdminProtectedRoute moduleRequired="pedidos"><PedidosArmados /></AdminProtectedRoute>} />
          <Route path="pedido/:id" element={<AdminProtectedRoute moduleRequired="pedidos"><PedidoDetalle /></AdminProtectedRoute>} />
          <Route path="unauthorized" element={<AdminProtectedRoute moduleRequired=""><div>no estas autorizado para realizar esta operacion</div></AdminProtectedRoute>} />
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
