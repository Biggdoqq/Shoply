import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const khrSubtotal = (Math.round(subtotal * 4100)).toLocaleString();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md flex pl-4 sm:pl-10">
        <div className="w-full min-w-0 bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-gray-900 text-base">
                {t('cart')} ({totalItems})
              </h3>
            </div>
            <button
              onClick={closeCart}
              className="w-11 h-11 shrink-0 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label={lang === 'km' ? 'បិទកន្ត្រក' : 'Close cart'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-base">
                    {t('cart_empty')}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {lang === 'km'
                      ? 'សូមជ្រើសរើសទំនិញដែលអ្នកពេញចិត្តបន្ថែមចូលក្នុងកន្ត្រក'
                      : 'Add items you like to your shopping bag to continue.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  {t('start_shopping')}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemTitle = lang === 'km' ? item.nameKh || item.name : item.nameEn || item.name;
                const variantsText = item.selectedVariant
                  ? typeof item.selectedVariant === 'object'
                    ? Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(' | ')
                    : item.selectedVariant
                  : null;

                return (
                  <div key={item.cartItemId} className="pt-4 first:pt-0 flex gap-3">
                    <img
                      src={item.image}
                      alt={itemTitle}
                      className="w-18 h-18 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900 text-sm truncate leading-snug">
                          {itemTitle}
                        </h5>
                        {variantsText && (
                          <span className="text-[11px] text-indigo-600 font-medium inline-block mt-0.5">
                            {variantsText}
                          </span>
                        )}
                        <div className="text-sm font-bold text-gray-900 mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                          {item.quantity > 1 && (
                            <span className="text-xs font-normal text-gray-400 ml-1">
                              (${item.price.toFixed(2)} / ea)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-11 h-11 flex items-center justify-center hover:bg-gray-200 text-gray-600 transition-colors"
                            aria-label={lang === 'km' ? 'បន្ថយចំនួន' : 'Decrease quantity'}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-11 h-11 flex items-center justify-center hover:bg-gray-200 text-gray-600 transition-colors"
                            aria-label={lang === 'km' ? 'បន្ថែមចំនួន' : 'Increase quantity'}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="w-11 h-11 shrink-0 flex items-center justify-center text-gray-500 hover:text-rose-500 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-gray-100 bg-gray-50 space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{t('subtotal')}</span>
                  <span className="font-bold text-base text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-end text-xs text-gray-500">
                  ≈ {khrSubtotal} ៛
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
