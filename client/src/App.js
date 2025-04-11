import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProductPage from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetail from './pages/ProductDetail';
function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes> 
        <Route path="/" element={<Home />} />
        <Route path="/products" element={isLoggedIn ? <ProductPage /> : <Navigate to="/login" />} />
        <Route path="/add-product" element={isLoggedIn ? <AddProductPage /> : <Navigate to="/login" />} />
        <Route path="/edit-product/:id" element={isLoggedIn ? <EditProduct /> : <Navigate to="/login" />} />
        <Route path="/productDetail/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;