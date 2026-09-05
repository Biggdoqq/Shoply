import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Zap, Check, ArrowLeft, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { getProductById, getProducts } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { DEFAULT_PRODUCTS } from '../data/defaultData';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t, getLocalized } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const setupProductView = (prod) => {
    if (!prod) return;
    setProduct(prod);

    // Normalize images (can be array or json string)
    let images = [];
    if (Array.isArray(prod.images)) {
      images = prod.images;
    } else if (typeof prod.images === 'string') {
      try { images = JSON.parse(prod.images); } catch { images = [prod.images]; }
    }
    setSelectedImage(images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800');

    // Normalize variants
    let variants = [];
    if (Array.isArray(prod.variants)) {
      variants = prod.variants;
    } else if (typeof prod.variants === 'string') {
      try { variants = JSON.parse(prod.variants); } catch { variants = []; }
    }
    const initialVariants = {};
    variants.forEach(v => {
      if (v.options && v.options.length > 0) {
        initialVariants[v.name] = v.options[0];
      }
    });
    setSelectedVariants(initialVariants);

    // Related products
    const related = DEFAULT_PRODUCTS.filter(p => p.id !== prod.id).slice(0, 4);
    setRelatedProducts(related);
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await getProductById(id);
      if (res?.data && typeof res.data === 'object' && res.data.id) {
        setupProductView(res.data);
      } else {
        const fallback = DEFAULT_PRODUCTS.find(p => p.id === id) || DEFAULT_PRODUCTS[0];
        setupProductView(fallback);
      }
    } catch (err) {
      console.warn('API unavailable, loading local fallback product');
      const fallback = DEFAULT_PRODUCTS.find(p => p.id === id) || DEFAULT_PRODUCTS[0];
      setupProductView(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-6 bg-gray-200 rounded-lg w-1/3" />
            <div className="h-32 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Product not found</h2>
        <Link to="/shop" className="text-sm font-semibold text-indigo-600 hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  const name = getLocalized(product, 'name');
  const description = getLocalized(product, 'description');
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice : product.price;
  const khrPrice = (Math.round(currentPrice * 4100)).toLocaleString();

  const handleVariantSelect = (variantName, option) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariants);
    navigate('/checkout');
  };

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];

  const variants = Array.isArray(product.variants) ? product.variants : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{lang === 'km' ? 'ត្រឡប់ក្រោយ' : 'Back'}</span>
      </button>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-md">
            <img
              src={selectedImage}
              alt={name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-indigo-600 ring-2 ring-indigo-100'
                      : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                {getLocalized(product.category, 'name')}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1 leading-snug">
              {name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-900">
                  ${currentPrice.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                    SAVE ${(product.price - product.salePrice).toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-xs font-semibold text-gray-500 mt-1">
                ≈ {khrPrice} ៛ (KHR)
              </div>
            </div>

            {/* Stock status */}
            <div>
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {t('in_stock')} ({product.stock})
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  {t('out_of_stock')}
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Variants (Multi-purpose e.g. Size, Color, Capacity, etc.) */}
          {variants.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              {variants.map((v, vIdx) => (
                <div key={vIdx} className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {v.name}: <span className="text-indigo-600 font-normal">{selectedVariants[v.name]}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {v.options.map((opt, oIdx) => {
                      const isSelected = selectedVariants[v.name] === opt;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleVariantSelect(v.name, opt)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-600 ring-offset-2'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity selector */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {t('quantity')}
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 hover:bg-gray-100 font-bold text-gray-600 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-sm font-bold text-gray-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3.5 py-2 hover:bg-gray-100 font-bold text-gray-600 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-400">
                {t('items_left', { n: product.stock })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                addedAnimation
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-gray-900 bg-white hover:bg-gray-900 text-gray-900 hover:text-white shadow-xs'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('added_to_cart')}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('add_to_cart')}</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{t('buy_now')}</span>
            </button>
          </div>

          {/* Description */}
          {description && (
            <div className="pt-6 border-t border-gray-100 space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                {t('description')}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>{t('free_delivery_tag')}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('best_quality_tag')}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-10 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            {t('related_products')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
