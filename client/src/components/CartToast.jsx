import React from 'react';
import { ShoppingBag, CheckCircle, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartToast() {
  const { toast, hideToast, openCart } = useCart();
  const { lang } = useLanguage();

  if (!toast) return null;

  const { item, quantity } = toast;
  const itemTitle = lang === 'km' ? item.nameKh || item.name : item.nameEn || item.name;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 transition-opacity">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        <img
          src={item.image}
          alt={itemTitle}
          className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-200"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'បានដាក់ចូលកន្ត្រក!' : 'Added to Cart!'}</span>
          </div>

          <h5 className="font-semibold text-gray-900 text-xs truncate mt-0.5" title={itemTitle}>
            {itemTitle}
          </h5>

          <p className="text-[11px] text-gray-500">
            {quantity} × ${Number(item.price).toFixed(2)}
          </p>

          <button
            onClick={() => {
              hideToast();
              openCart();
            }}
            className="mt-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{lang === 'km' ? 'មើលកន្ត្រក' : 'View Cart'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={hideToast}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
