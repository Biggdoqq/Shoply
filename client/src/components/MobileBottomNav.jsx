import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function MobileBottomNav() {
  const { totalItems, openCart } = useCart();
  const { lang } = useLanguage();

  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] safe-area-pb"
    >
      <div className="grid grid-cols-4 h-14 items-center max-w-md mx-auto">
        {/* Home */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-all ${
              isActive ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Home className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-xs mt-0.5 tracking-tight">
                {lang === 'km' ? 'ដើម' : 'Home'}
              </span>
              {isActive && <span className="w-1 h-1 bg-indigo-600 rounded-full mt-0.5" />}
            </>
          )}
        </NavLink>

        {/* Shop */}
        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-all ${
              isActive ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ShoppingBag className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-xs mt-0.5 tracking-tight">
                {lang === 'km' ? 'ទំនិញ' : 'Shop'}
              </span>
              {isActive && <span className="w-1 h-1 bg-indigo-600 rounded-full mt-0.5" />}
            </>
          )}
        </NavLink>

        {/* Track Order */}
        <NavLink
          to="/track-order"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-all ${
              isActive ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Truck className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-xs mt-0.5 tracking-tight">
                {lang === 'km' ? 'តាមដាន' : 'Track'}
              </span>
              {isActive && <span className="w-1 h-1 bg-indigo-600 rounded-full mt-0.5" />}
            </>
          )}
        </NavLink>

        {/* Cart Trigger */}
        <button
          type="button"
          onClick={openCart}
          className="flex flex-col items-center justify-center py-1 text-gray-500 hover:text-gray-700 font-medium transition-colors relative cursor-pointer"
          aria-label="View Cart"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 stroke-2" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>
          <span className="text-xs mt-0.5 tracking-tight">
            {lang === 'km' ? 'កន្ត្រក' : 'Cart'}
          </span>
        </button>
      </div>
    </nav>
  );
}
