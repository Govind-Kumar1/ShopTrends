// src/App.jsx

import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // ✅ Import hooks
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Pages & Components
import Home from './pages/Home';
import Collection from './pages/Collection';
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Orders from './pages/Orders';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
 
// ✅ Import Actions
import { fetchProducts } from './slices/features/productsSlice';
import { fetchCart } from './slices/features/cartSlice';

const App = () => { 
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);

  // ✅ Fetch initial data when the app loads
  useEffect(() => {
    dispatch(fetchProducts()); // Fetch all products
    if (token) {
      dispatch(fetchCart()); // Fetch user's cart if logged in
    }
  }, [dispatch, token]); // Rerun if token changes (e.g., on login)

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <NavBar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/list" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId"  element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;