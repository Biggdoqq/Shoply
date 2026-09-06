import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Globe, ShoppingCart, Truck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { getProducts } from '../api';

export default function Navbar() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { totalItems, openCart } = useCart();
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    getProducts().then(res => {
      setAllProducts(res.data || []);
    }).catch(err => console.error('Failed to load products for navbar search:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesktop = searchContainerRef.current && searchContainerRef.current.contains(e.target);
      const inMobile = mobileSearchRef.current && mobileSearchRef.current.contains(e.target);
      if (!inDesktop && !inMobile) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim().length >= 1) {
      const q = val.toLowerCase().trim();
      const matches = allProducts.filter(p => 
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        (p.nameKh && p.nameKh.toLowerCase().includes(q)) ||
        (p.category?.nameEn && p.category.nameEn.toLowerCase().includes(q)) ||
        (p.category?.nameKh && p.category.nameKh.toLowerCase().includes(q))
      ).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSelectSuggestion = (prodId) => {
    setShowSuggestions(false);
    setSearchTerm('');
    navigate(`/product/${prodId}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      {/* Top micro bar for announcements & Telegram alert badge */}
      <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="hidden sm:inline-flex items-center">
          <span>{t('telegram_alert_tag')}</span>
        </span>
        <span className="hidden sm:inline opacity-60">•</span>
        <span>
          {(lang === 'km' ? settings.announcement_km : settings.announcement_en) || t('free_delivery_tag')}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2 gap-2 lg:gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex min-w-0 items-center gap-2 group">
            {settings.store_logo ? (
              <img 
                src={settings.store_logo} 
                alt={settings.store_name || 'Store Logo'} 
                className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl object-contain bg-white border border-gray-100 shadow-xs group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
            )}
            <div className="flex min-w-0 flex-col">
              <span className="font-extrabold text-base sm:text-xl whitespace-nowrap truncate tracking-tight text-gray-900">
                {settings.store_name || 'Shoply'}
              </span>
              <span className="text-xs font-medium text-gray-500 truncate">
                {lang === 'km' ? 'ហាងទំនិញអនឡាញ' : 'Online Store'}
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar with Live Suggestions */}
          <div ref={searchContainerRef} className="hidden lg:flex min-w-0 flex-1 max-w-md mx-2 relative">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchTerm.trim().length >= 1) setShowSuggestions(true);
                }}
                className="w-full bg-gray-100 hover:bg-gray-50 focus:bg-white text-sm text-gray-800 rounded-full pl-10 pr-4 py-2 border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            {/* Live Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-2 border-b border-gray-50 flex items-center justify-between text-[11px] font-semibold text-gray-400 px-3">
                  <span>{lang === 'km' ? 'ទំនិញដែលត្រូវគ្នា' : 'Matching Products'}</span>
                  <span className="font-normal">{suggestions.length} results</span>
                </div>
                <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                  {suggestions.map((p) => {
                    const img = Array.isArray(p.images) ? p.images[0] : (p.image || '');
                    const title = lang === 'km' ? p.nameKh || p.nameEn : p.nameEn || p.nameKh;
                    const price = p.salePrice || p.price;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectSuggestion(p.id)}
                        className="p-2.5 flex items-center gap-3 hover:bg-indigo-50/60 transition-colors cursor-pointer"
                      >
                        <img
                          src={img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-900 block truncate">{title}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-indigo-600">${Number(price).toFixed(2)}</span>
                            {p.stock <= 5 && p.stock > 0 && (
                              <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-medium">Low stock</span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      </div>
                    );
                  })}
                </div>
                <div className="p-2 bg-gray-50 border-t border-gray-100 text-center">
                  <button
                    onClick={handleSearch}
                    className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'km' ? 'មើលលទ្ធផលទាំងអស់' : 'View all results for'} "{searchTerm}"</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex shrink-0 items-center gap-4 text-sm font-medium text-gray-600">
            <Link
              to="/"
              className={`hover:text-indigo-600 transition-colors ${isActive('/') ? 'text-indigo-600 font-semibold' : ''}`}
            >
              {t('home')}
            </Link>
            <Link
              to="/shop"
              className={`hover:text-indigo-600 transition-colors ${isActive('/shop') ? 'text-indigo-600 font-semibold' : ''}`}
            >
              {t('shop')}
            </Link>
            <Link
              to="/track-order"
              className={`hover:text-indigo-600 transition-colors flex items-center gap-1.5 ${isActive('/track-order') ? 'text-indigo-600 font-semibold' : ''}`}
            >
              <Truck className="w-4 h-4 text-indigo-500" />
              <span>{t('track_order')}</span>
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="min-w-11 min-h-11 flex items-center justify-center gap-1 px-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Change Language"
            >
              <Globe className="hidden sm:block w-3.5 h-3.5 text-indigo-600" />
              <span className="font-bold tracking-wider">{lang === 'km' ? 'ខ្មែរ' : 'EN'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              type="button"
              className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
              aria-label={lang === 'km' ? 'ម៉ឺនុយ' : 'Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Instant Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-2.5 pt-0.5 border-t border-gray-100/70 bg-white">
        <div ref={mobileSearchRef} className="relative">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchTerm.trim().length >= 1) setShowSuggestions(true);
              }}
              className="w-full min-h-11 bg-gray-100/90 focus:bg-white text-base text-gray-800 rounded-full pl-9 pr-4 py-2 border border-gray-200/70 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all shadow-2xs"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>

          {/* Mobile Live Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {suggestions.map((p) => {
                  const img = Array.isArray(p.images) ? p.images[0] : (p.image || '');
                  const title = lang === 'km' ? p.nameKh || p.nameEn : p.nameEn || p.nameKh;
                  const price = p.salePrice || p.price;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectSuggestion(p.id)}
                      className="p-2.5 flex items-center gap-3 hover:bg-indigo-50/60 transition-colors cursor-pointer"
                    >
                      <img
                        src={img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-gray-900 block truncate">{title}</span>
                        <span className="text-xs font-bold text-indigo-600">${Number(price).toFixed(2)}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-6 space-y-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 text-sm rounded-lg pl-10 pr-4 py-2 border border-transparent focus:border-indigo-500 focus:bg-white outline-hidden"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col space-y-1 pt-2 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${isActive('/') ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-700'}`}
            >
              {t('home')}
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg ${isActive('/shop') ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-700'}`}
            >
              {t('shop')}
            </Link>
            <Link
              to="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg flex items-center gap-2 ${isActive('/track-order') ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-700'}`}
            >
              <Truck className="w-4 h-4 text-indigo-500" />
              <span>{t('track_order')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
