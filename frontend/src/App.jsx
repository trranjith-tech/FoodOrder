import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useAuthStore from './store/useAuthStore';
import Navbar from './components/common/Navbar';
import CartDrawer from './components/cart/CartDrawer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RestaurantDetail from './pages/RestaurantDetail';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import PartnerDashboard from './pages/PartnerDashboard';
import Footer from './components/common/Footer';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

const App = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order/:id/confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
            <Route path="/order/:id/tracking" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/partner-dashboard" element={<ProtectedRoute><PartnerDashboard /></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default App;
