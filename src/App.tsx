import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import UploadInventory from "./components/UploadInventary";
import MonitorPedidos from "./components/Pedidos/ListaPedidos";
import HomePage from "./pages/client/HomePage";
import AboutPage from "./pages/client/AboutPage";
import NotFoundPage from "./pages/client/NotFoundPage";
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
import CreateClient from "./components/auth/CreateClient";
import LoginClientPage from "./pages/client/LoginClientPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PackingPedidos from "./components/Pedidos/PackingPedidos";
import PackingDetalle from "./components/Pedidos/PackingDetalle";
import PedidoClientePage from "./pages/client/PedidoClientePage";
import EnviadosPedidos from "./components/Pedidos/EnvioPedidos";
import EnviadoDetalle from "./components/Pedidos/EnvioDetalle";
import PickingDetalle from "./components/Pedidos/PickingDetalle";
import PickingPedidos from "./components/Pedidos/PickingPedidos";
import InfoClientePage from "./pages/client/InfoClientePage";
import ReclamosClient from "./pages/client/ReclamosClient";
import PedidosDashboard from "./pages/admin/PedidosDashboard";
import FacturacionPedidos from "./components/Facturacion/FacturacionPedidos";
import FacturacionDetalle from "./components/Facturacion/FacturacionDetalle";

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


          <Route path="/catalogo" element={
            <ProtectedRoute>
              <ShoppingCartClient />
            </ProtectedRoute>
          } />
          <Route path="/perfil" element={
            <ProtectedRoute>
              <InfoClientePage />
            </ProtectedRoute>
          } />
          <Route path="/reclamos" element={
            <ProtectedRoute>
              <ReclamosClient />
            </ProtectedRoute>
          } />

          {/* Página de pedidos del cliente */}
          <Route path="/mispedidos" element={
            <ProtectedRoute>
              <PedidoClientePage />
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
          <Route path="usuarios/crearcliente" element={<AdminProtectedRoute moduleRequired="crear-cliente"><CreateClient /></AdminProtectedRoute>} />
          <Route path="inventario/cargar" element={<AdminProtectedRoute moduleRequired="inventario"><UploadInventory /></AdminProtectedRoute>} />
          <Route path="inventario/ver" element={<AdminProtectedRoute moduleRequired="inventario"><InventoryList /></AdminProtectedRoute>} />
          <Route path="comprar" element={<AdminProtectedRoute moduleRequired="compras"><AdminCarritoCompras /></AdminProtectedRoute>} />
          <Route path="crear-pedido" element={<AdminProtectedRoute moduleRequired="pedidos"><AdminCarritoCompras /></AdminProtectedRoute>} />
          <Route path="pedidos-dashboard" element={<AdminProtectedRoute moduleRequired="info-pedidos"><PedidosDashboard /></AdminProtectedRoute>} />
          <Route path="pedidos" element={<AdminProtectedRoute moduleRequired="admin-pedidos"><MonitorPedidos /></AdminProtectedRoute>} />
          <Route path="pickingpedidos" element={<AdminProtectedRoute moduleRequired="picking"><PickingPedidos /></AdminProtectedRoute>} />
          <Route path="packingpedidos" element={<AdminProtectedRoute moduleRequired="packing"><PackingPedidos /></AdminProtectedRoute>} />
          <Route path="pedido/:id" element={<AdminProtectedRoute moduleRequired="picking"><PickingDetalle /></AdminProtectedRoute>} />
          <Route path="packing/:id" element={<AdminProtectedRoute moduleRequired="packing"><PackingDetalle /></AdminProtectedRoute>} />
          <Route path="enviadospedidos" element={<AdminProtectedRoute moduleRequired="envios"><EnviadosPedidos /></AdminProtectedRoute>} />
          <Route path="enviado/:id" element={<AdminProtectedRoute moduleRequired="envios"><EnviadoDetalle /></AdminProtectedRoute>} />
          <Route path="facturacionpedidos" element={<AdminProtectedRoute moduleRequired="facturacion"><FacturacionPedidos /></AdminProtectedRoute>} />
          <Route path="facturacion/:id" element={<AdminProtectedRoute moduleRequired="facturacion"><FacturacionDetalle /></AdminProtectedRoute>} />
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
