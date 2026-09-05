import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Send, Phone, MapPin, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function Footer() {
  const { t, lang } = useLanguage();
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features badges row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-gray-800">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                {lang === 'km' ? 'ដឹកជញ្ជូនរហ័ស' : 'Fast Delivery'}
              </h4>
              <p className="text-xs text-gray-400">
                {lang === 'km' ? 'ភ្នំពេញ និងគ្រប់ខេត្តក្រុង' : 'Phnom Penh & all provinces'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                {lang === 'km' ? 'Telegram Order Alerts' : 'Instant Telegram Alerts'}
              </h4>
              <p className="text-xs text-gray-400">
                {lang === 'km' ? 'ការជូនដំណឹងភ្លាមៗពេលមានការកុម្ម៉ង់' : 'Real-time notification on each order'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                {lang === 'km' ? 'ទូទាត់ប្រាក់មានសុវត្ថិភាព' : 'Secure Payments'}
              </h4>
              <p className="text-xs text-gray-400">
                {lang === 'km' ? 'Cash on Delivery ឬ KHQR' : 'COD or Bakong KHQR'}
              </p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {settings.store_logo ? (
                <img 
                  src={settings.store_logo} 
                  alt={settings.store_name || 'Store Logo'} 
                  className="w-8 h-8 rounded-lg object-contain bg-white/10 p-0.5 border border-gray-700" 
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              )}
              <span className="font-bold text-xl text-white">{settings.store_name || 'Shoply'}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {(lang === 'km' ? settings.store_desc_km : settings.store_desc_en) || (
                lang === 'km'
                  ? 'វេទិកាលក់ទំនិញអនឡាញទំនើប ផ្តល់ជូននូវផលិតផលសម្បូរបែប គុណភាពខ្ពស់ និងតម្លៃសមរម្យ។'
                  : 'Modern multi-purpose e-commerce store with rich categories, quality items, and seamless Telegram updates.'
              )}
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-white text-sm mb-3">
              {lang === 'km' ? 'តំណភ្ជាប់រហ័ស' : 'Quick Links'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-indigo-400 transition-colors">
                  {t('shop')}
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-indigo-400 transition-colors">
                  {lang === 'km' ? 'តាមដានការកុម្ម៉ង់' : 'Track Order'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-sm mb-3">
              {lang === 'km' ? 'ប្រភេទផលិតផល' : 'Categories'}
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=clothing" className="hover:text-indigo-400 transition-colors">
                  {lang === 'km' ? 'សម្លៀកបំពាក់' : 'Clothing'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=shoes" className="hover:text-indigo-400 transition-colors">
                  {lang === 'km' ? 'ស្បែកជើង' : 'Shoes'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electronics" className="hover:text-indigo-400 transition-colors">
                  {lang === 'km' ? 'គ្រឿងអេឡិចត្រូនិច' : 'Electronics'}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=accessories" className="hover:text-indigo-400 transition-colors">
                  {lang === 'km' ? 'កាបូប & គ្រឿងតុបតែង' : 'Accessories'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white text-sm mb-3">
              {lang === 'km' ? 'ទំនាក់ទំនង' : 'Contact Us'}
            </h5>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{settings.phone_number || '+855 12 345 678'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{settings.store_address || 'Phnom Penh, Cambodia'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Telegram: {settings.telegram_handle || '@ShoplySupport'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {settings.store_name || 'Shoply'} Store. All rights reserved. Built with React & Node.js.</p>
        </div>

      </div>
    </footer>
  );
}
