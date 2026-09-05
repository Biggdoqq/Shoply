import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav() {
  const { totalItems, openCart } = useCart();
  const { lang } = useLanguage();
  const location = useLocation();

  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-md safe-area-pb"
    >
      <div className="grid grid-cols-4 h-14 items-center max-w-md mx-auto">
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">
            {lang === 'km' ? 'ដើម' : 'Home'}
          </span>
        </NavLink>

        {/* Shop */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">
            {lang === 'km' ? 'ទំនិញ' : 'Shop'}
          </span>
        </NavLink>

        {/* Track Order */}
        <NavLink
          to="/track-order"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-tight">
            {lang === 'km' ? 'តាមដាន' : 'Track'}
          </span>
        </NavLink>

        {/* Cart Trigger */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-gray-900 transition-colors relative"
          aria-label="View Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">
            {lang === 'km' ? 'កន្ត្រក' : 'Cart'}
          </span>
        </button>
      </div>
    </nav>
  );
}
