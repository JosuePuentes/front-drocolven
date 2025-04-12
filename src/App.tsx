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
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<AdminPage />} />

          <Route path="inventario" element={<AdminProtectedRoute moduleRequired="inventario"><InventarioPage /></AdminProtectedRoute>} />

          <Route path="usuarios" element={<UsuariosPage />} />
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
