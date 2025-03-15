import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import ProductUploaderPage from "./pages/ProductUploaderPage";

function App() {
  return (
    <Router>
      <div className="fixed w-screen">
        <Navbar />
      </div>
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/upprodutos" element={<ProductUploaderPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
