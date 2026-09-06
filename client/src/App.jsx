import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CartToast from './components/CartToast';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import TrackOrderPage from './pages/TrackOrderPage';
import FloatingTelegramButton from './components/FloatingTelegramButton';
import MobileBottomNav from './components/MobileBottomNav';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans selection:bg-indigo-500 selection:text-white pb-20 md:pb-0">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
        </Routes>
      </main>

      <CartDrawer />
      <CartToast />
      <FloatingTelegramButton />
      <MobileBottomNav />
      <Footer />
    </div>
  );
}
