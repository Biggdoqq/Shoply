import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Sparkles, Star, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { lang, getLocalized, t } = useLanguage();
  const { addToCart } = useCart();

  const name = getLocalized(product, 'name');
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const currentPrice = hasDiscount ? product.salePrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const image = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';

  const khrPrice = (Math.round(currentPrice * 4100)).toLocaleString();

  // Pseudo-deterministic rating based on product id for consistent aesthetic reviews
  const ratingScore = 4.8 + ((product.id?.charCodeAt(0) || 5) % 3) * 0.1;
  const reviewCount = 28 + ((product.id?.charCodeAt(1) || 12) % 45);

  // Check variants info
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const variantSummary = variants.length > 0
    ? `${variants.reduce((acc, v) => acc + (v.options?.length || 0), 0)} ${lang === 'km' ? 'ជម្រើស' : 'options'}`
    : null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let defaultVariants = null;
    if (variants.length > 0) {
      defaultVariants = {};
      variants.forEach(v => {
        if (v.options && v.options.length > 0) {
          defaultVariants[v.name] = v.options[0];
        }
      });
    }

    addToCart(product, 1, defaultVariants, false);
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden shadow-xs hover:shadow-2xl hover:border-indigo-100 hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative">
      
      {/* Product Image Box */}
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-gray-100 block">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Badges Stack */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10">
          {hasDiscount && (
            <span className="bg-linear-to-r from-rose-500 to-pink-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-md">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{lang === 'km' ? 'ទំនិញពេញនិយម' : 'Popular'}</span>
            </span>
          )}
        </div>

        {/* Low stock alert badge */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="bg-black/75 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Flame className="w-3 h-3 text-rose-500" />
              <span>{lang === 'km' ? `នៅសល់ ${product.stock} ទៀត!` : `Only ${product.stock} left!`}</span>
            </span>
          </div>
        )}

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="bg-white/95 text-gray-900 text-xs font-bold px-3.5 py-2 rounded-full shadow-xl backdrop-blur-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'km' ? 'មើលលម្អិត' : 'Quick View'}</span>
          </span>
        </div>

        {/* Out of stock overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/85 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-gray-900 text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              {t('out_of_stock')}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* Category & Variant info */}
        <div className="flex items-center justify-between gap-2 mb-1.5 min-h-[18px]">
          {product.category && (
            <span className="text-xs font-bold text-indigo-600 truncate">
              {getLocalized(product.category, 'name')}
            </span>
          )}
          {variantSummary && (
            <span className="text-[10px] text-gray-400 font-medium shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-md">
              {variantSummary}
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.id}`}
          className="font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2 text-sm leading-relaxed mb-1.5 flex-1 min-h-[44px]"
          title={name}
        >
          {name}
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[11px] font-bold text-gray-700 ml-0.5">
            {ratingScore.toFixed(1)}
          </span>
          <span className="text-[10px] text-gray-400">
            ({reviewCount})
          </span>
        </div>

        {/* Price and Cart Button */}
        <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-gray-900">
                ${currentPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through font-normal">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-400 font-medium block -mt-0.5">
              ≈ {khrPrice} ៛
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-600/20 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed active:scale-90 transition-all cursor-pointer"
            title={t('add_to_cart')}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
