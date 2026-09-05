import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { getProducts, getCategories } from '../api';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from '../data/defaultData';

export default function ShopPage() {
  const { lang, t, getLocalized } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(false);

  // Filters state
  const selectedCategory = searchParams.get('category') || 'all';
  const searchTerm = searchParams.get('search') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const isFeaturedOnly = searchParams.get('featured') === 'true';

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFilteredProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (Array.isArray(res?.data) && res.data.length > 0) {
        setCategories(res.data);
      }
    } catch (e) {
      console.warn('Using default categories');
    }
  };

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'all') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      if (selectedSort) {
        params.sort = selectedSort;
      }
      if (isFeaturedOnly) {
        params.featured = 'true';
      }

      const res = await getProducts(params);
      if (Array.isArray(res?.data) && res.data.length > 0) {
        setProducts(res.data);
      } else {
        applyLocalFilter();
      }
    } catch (err) {
      console.warn('API unavailable, applying local filter on default products');
      applyLocalFilter();
    } finally {
      setLoading(false);
    }
  };

  const applyLocalFilter = () => {
    let prods = [...DEFAULT_PRODUCTS];
    if (selectedCategory && selectedCategory !== 'all') {
      const cat = DEFAULT_CATEGORIES.find(c => c.slug === selectedCategory);
      if (cat) {
        prods = prods.filter(p => p.categoryId === cat.id);
      }
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      prods = prods.filter(p => 
        p.nameKh.toLowerCase().includes(term) || 
        p.nameEn.toLowerCase().includes(term)
      );
    }
    if (isFeaturedOnly) {
      prods = prods.filter(p => p.isFeatured);
    }
    if (selectedSort === 'price_asc') {
      prods.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (selectedSort === 'price_desc') {
      prods.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    }
    setProducts(prods);
  };

  const handleCategoryChange = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') {
      next.delete('category');
    } else {
      next.set('category', slug);
    }
    setSearchParams(next);
  };

  const handleSortChange = (e) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', e.target.value);
    setSearchParams(next);
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            {t('shop')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {products.length} {lang === 'km' ? 'ទំនិញត្រូវបានរកឃើញ' : 'products found'}
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Term Badge if active */}
          {searchTerm && (
            <div className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full border border-indigo-200">
              <span>{lang === 'km' ? 'ស្វែងរក:' : 'Search:'} "{searchTerm}"</span>
              <button onClick={clearSearch} className="hover:text-indigo-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="relative inline-block">
            <select
              value={selectedSort}
              onChange={handleSortChange}
              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-xs font-semibold text-gray-700 hover:border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-xs"
            >
              <option value="newest">{t('sort_newest')}</option>
              <option value="price_asc">{t('sort_price_low')}</option>
              <option value="price_desc">{t('sort_price_high')}</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Pills (Dynamic & Multi-purpose) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {t('all_categories')}
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {getLocalized(cat, 'name')}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
              <div className="bg-gray-200 aspect-square rounded-xl" />
              <div className="h-4 bg-gray-200 rounded-md w-3/4" />
              <div className="h-4 bg-gray-200 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {t('no_products_found')}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {lang === 'km'
              ? 'សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬប្រភេទផលិតផលផ្សេងទៀត។'
              : 'Try adjusting your filters or search keywords to find what you are looking for.'}
          </p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            {t('all_categories')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}
