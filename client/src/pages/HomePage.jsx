import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Send, 
  Star, 
  Users, 
  Truck, 
  Flame, 
  CheckCircle,
  MessageCircle,
  Clock
} from 'lucide-react';
import { getProducts, getCategories, getSettings } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import ProductCard from '../components/ProductCard';
import CountdownTimer from '../components/CountdownTimer';
import HeroBannerSlider from '../components/HeroBannerSlider';

export default function HomePage() {
  const { lang, t, getLocalized } = useLanguage();
  const { settings: globalSettings } = useSettings();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [storeSettings, setStoreSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (globalSettings && Object.keys(globalSettings).length > 0) {
      setStoreSettings(globalSettings);
    }
  }, [globalSettings]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, settingsRes] = await Promise.all([
          getCategories(),
          getProducts(),
          getSettings(),
        ]);
        setCategories(catRes.data || []);
        if (settingsRes.data) {
          setStoreSettings(settingsRes.data);
        }
        
        const allProds = prodRes.data || [];
        setFeaturedProducts(allProds.filter(p => p.isFeatured));
        setNewArrivals(allProds.slice(0, 8));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const DEFAULT_STATS = [
    {
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      value: '15,000+',
      labelKm: 'អតិថិជនពេញចិត្ត',
      labelEn: 'Happy Customers',
    },
    {
      icon: ShieldCheck,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      value: '100%',
      labelKm: 'គុណភាពធានាត្រឹមត្រូវ',
      labelEn: 'Authentic & Quality',
    },
    {
      icon: Truck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      value: '45 Mins',
      labelKm: 'ដឹកជញ្ជូនរហ័ស (ភ្នំពេញ)',
      labelEn: 'Express Delivery (PP)',
    },
    {
      icon: Send,
      color: 'text-sky-600 bg-sky-50 border-sky-100',
      value: '24/7',
      labelKm: 'Telegram Bot ដំណឹងភ្លាមៗ',
      labelEn: 'Instant Bot Alerts',
    },
  ];

  const DEFAULT_TESTIMONIALS = [
    {
      id: 1,
      nameKm: 'ចាន់ សុខា',
      nameEn: 'Sokha Chan',
      locationKm: 'រាជធានីភ្នំពេញ',
      locationEn: 'Phnom Penh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
      rating: 5,
      commentKm: 'ទំនិញមានគុណភាពល្អលើសពីការរំពឹងទុក! ដឹកជញ្ជូនលឿនមែនទែន ហើយបង់ប្រាក់តាម KHQR ងាយស្រួល ថែមទាំងមាន Telegram Bot ផ្ញើសារប្រាប់ភ្លាមៗទៀត។',
      commentEn: 'The quality exceeded my expectations! Super fast delivery, seamless KHQR payment, and instant Telegram notification right after ordering.',
    },
    {
      id: 2,
      nameKm: 'ដេវីដ គីម',
      nameEn: 'David Kim',
      locationKm: 'ខេត្តសៀមរាប',
      locationEn: 'Siem Reap',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
      rating: 5,
      commentKm: 'សេវាកម្មល្អឥតខ្ចោះ! រូបភាពនិងទំនិញពិតដូចគ្នាបេះបិទ។ ការឆ្លើយតបលើ Telegram លឿន និងគួរឱ្យទុកចិត្ត។ ឲ្យពិន្ទុ 10/10!',
      commentEn: 'Exceptional shopping experience! The item is 100% as pictured. Fast customer support response on Telegram. 10/10 recommend!',
    },
    {
      id: 3,
      nameKm: 'រិន បុប្ផា',
      nameEn: 'Bopha Rin',
      locationKm: 'ខេត្តបាត់ដំបង',
      locationEn: 'Battambang',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face',
      rating: 5,
      commentKm: 'សាច់ក្រណាត់ស្អាត និងម៉ូតទាន់សម័យខ្លាំងណាស់។ កុម្ម៉ង់ ២ លើកហើយ មិនដែលខកបំណងទេ។ Admin រួសរាយឆ្លើយតបរហ័ស!',
      commentEn: 'Super trendy styles and premium fabric. Ordered twice already, never disappointed. Very friendly and polite customer service!',
    },
  ];

  const stats = React.useMemo(() => {
    if (storeSettings.store_stats) {
      try {
        const parsed = typeof storeSettings.store_stats === 'string'
          ? JSON.parse(storeSettings.store_stats)
          : storeSettings.store_stats;
        if (Array.isArray(parsed) && parsed.length > 0) {
          const iconMap = { users: Users, shield: ShieldCheck, truck: Truck, send: Send };
          const colors = [
            'text-indigo-600 bg-indigo-50 border-indigo-100',
            'text-amber-600 bg-amber-50 border-amber-100',
            'text-emerald-600 bg-emerald-50 border-emerald-100',
            'text-sky-600 bg-sky-50 border-sky-100',
          ];
          return parsed.map((item, i) => ({
            icon: iconMap[item.icon] || Users,
            color: colors[i % colors.length],
            value: item.value || '100%',
            labelKm: item.labelKm || item.label,
            labelEn: item.labelEn || item.label,
          }));
        }
      } catch (e) {}
    }
    return DEFAULT_STATS;
  }, [storeSettings.store_stats]);

  const testimonials = React.useMemo(() => {
    if (storeSettings.customer_testimonials) {
      try {
        const parsed = typeof storeSettings.customer_testimonials === 'string'
          ? JSON.parse(storeSettings.customer_testimonials)
          : storeSettings.customer_testimonials;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {}
    }
    return DEFAULT_TESTIMONIALS;
  }, [storeSettings.customer_testimonials]);

  // Flash Sale Settings
  const flashSaleEnabled = storeSettings.flash_sale_enabled !== 'false';
  const flashSaleTitle = lang === 'km'
    ? (storeSettings.flash_sale_title_km || 'ការលក់បញ្ចុះតម្លៃពិសេសប្រចាំថ្ងៃ')
    : (storeSettings.flash_sale_title_en || 'Today\'s Limited Flash Deals');
  const flashSaleSubtitle = lang === 'km'
    ? (storeSettings.flash_sale_subtitle_km || 'បញ្ចុះតម្លៃពិសេសមានកំណត់! កុម្ម៉ង់ឱ្យទាន់ពេលមុនទំនិញលក់អស់')
    : (storeSettings.flash_sale_subtitle_en || 'Hurry! Limited stock at special promotional prices');
  const flashHours = parseInt(storeSettings.flash_sale_hours || '8', 10);
  const flashMinutes = parseInt(storeSettings.flash_sale_minutes || '34', 10);

  // Promo Banner Settings
  const promoTitle = lang === 'km'
    ? (storeSettings.promo_title_km || 'បញ្ចុះតម្លៃពិសេសរហូតដល់ ២៥% លើទំនិញជ្រើសរើស')
    : (storeSettings.promo_title_en || 'Get Up To 25% Off On Selected Products');
  const promoSubtitle = lang === 'km'
    ? (storeSettings.promo_subtitle_km || 'កុម្ម៉ង់ឥឡូវនេះដើម្បីទទួលបានការដឹកជញ្ជូនរហ័ស និងការបញ្ចុះតម្លៃបន្ថែម!')
    : (storeSettings.promo_subtitle_en || 'Order today for rapid doorstep delivery and exclusive deals!');
  const promoButtonText = lang === 'km'
    ? (storeSettings.promo_button_km || t('shop_now'))
    : (storeSettings.promo_button_en || t('shop_now'));
  const promoLink = storeSettings.promo_link || '/shop';



  return (
    <div className="space-y-16 pb-16">
      
      {/* Dynamic Animated Multi-Image Hero Banner */}
      <HeroBannerSlider storeSettings={storeSettings} />

      {/* Trust & Stats Showcase Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5 group"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-koulen text-lg sm:text-xl text-gray-900 leading-tight">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500 font-medium truncate mt-0.5">
                    {lang === 'km' ? item.labelKm : item.labelEn}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Flash Sale Section with Countdown Timer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-rose-50 via-amber-50/60 to-indigo-50/50 rounded-3xl p-6 sm:p-8 border border-rose-200/70 shadow-sm relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-rose-200/50">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{lang === 'km' ? 'ប្រូម៉ូសិនពិសេស' : 'Flash Sale'}</span>
              </div>
              <h2 className="font-koulen text-2xl sm:text-3xl text-gray-900 tracking-wide flex items-center gap-2">
                <Zap className="w-6 h-6 text-amber-500 fill-amber-400 shrink-0" />
                <span>{lang === 'km' ? 'ការលក់បញ្ចុះតម្លៃពិសេសប្រចាំថ្ងៃ' : 'Today\'s Limited Flash Deals'}</span>
              </h2>
              <p className="text-xs text-gray-600">
                {lang === 'km' ? 'បញ្ចុះតម្លៃពិសេសមានកំណត់! កុម្ម៉ង់ឱ្យទាន់ពេលមុនទំនិញលក់អស់' : 'Hurry! Limited stock at special promotional prices'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CountdownTimer hours={8} minutes={34} seconds={20} />
              <Link
                to="/shop"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-white px-4 py-2.5 rounded-xl border border-rose-200 shadow-xs hover:shadow-sm transition-all"
              >
                <span>{t('view_all')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Flash Sale Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
            {(featuredProducts.length > 0 ? featuredProducts : newArrivals).slice(0, 4).map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} />
                {/* Sale progress badge */}
                <div className="mt-2 px-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-semibold mb-1">
                    <span className="text-rose-600 flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-rose-500 text-rose-500" />
                      {lang === 'km' ? 'លក់អស់ 75%' : '75% Claimed'}
                    </span>
                    <span>{lang === 'km' ? 'នៅសល់តិច' : 'Fast selling'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-amber-500 to-rose-500 rounded-full w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-koulen text-2xl sm:text-3xl text-gray-900 tracking-wide">
              {t('categories_title')}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'km' ? 'ជ្រើសរើសប្រភេទផលិតផលដែលអ្នកចង់ទិញ' : 'Browse our versatile collections'}
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>{t('view_all')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-gray-100 border border-gray-100 shadow-xs hover:shadow-xl transition-all"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400'}
                alt={cat.nameEn}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-gray-950/80 via-gray-950/30 to-transparent flex flex-col justify-end p-3.5">
                <span className="text-white font-bold text-sm sm:text-base leading-tight">
                  {getLocalized(cat, 'name')}
                </span>
                <span className="text-[11px] text-gray-300 font-medium">
                  {cat._count?.products || 0} {lang === 'km' ? 'ទំនិញ' : 'items'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-koulen text-2xl sm:text-3xl text-gray-900 tracking-wide">
                {t('featured_products')}
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
            >
              <span>{t('view_all')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-purple-700 via-indigo-600 to-blue-600 p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          {storeSettings.promo_banner_image && (
            <div className="absolute inset-0 z-0">
              <img
                src={storeSettings.promo_banner_image}
                alt="Promo Banner"
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-linear-to-r from-purple-950/85 via-indigo-950/75 to-blue-950/60" />
            </div>
          )}
          
          <div className="relative z-10 space-y-3 text-center sm:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              Special Discount
            </div>
            <h3 className="font-koulen text-3xl sm:text-4xl text-white tracking-wide">
              {lang === 'km' ? 'បញ្ចុះតម្លៃពិសេសរហូតដល់ ២៥% លើទំនិញជ្រើសរើស' : 'Get Up To 25% Off On Selected Products'}
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-lg">
              {lang === 'km' ? 'កុម្ម៉ង់ឥឡូវនេះដើម្បីទទួលបានការដឹកជញ្ជូនរហ័ស និងការបញ្ចុះតម្លៃបន្ថែម!' : 'Order today for rapid doorstep delivery and exclusive deals!'}
            </p>
          </div>
          <Link
            to="/shop"
            className="shrink-0 px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold text-sm shadow-lg hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {t('shop_now')}
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="font-koulen text-2xl sm:text-3xl text-gray-900 tracking-wide">
              {t('new_arrivals')}
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
          >
            <span>{t('view_all')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Customer Reviews & Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-3 border border-indigo-100">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{lang === 'km' ? 'មតិកែលម្អពីអតិថិជន' : 'Customer Reviews'}</span>
          </div>
          <h2 className="font-koulen text-3xl sm:text-4xl text-gray-900 tracking-wide">
            {lang === 'km' ? 'អតិថិជនពេញចិត្ត 5 ផ្កាយ' : 'Loved by Happy Shoppers'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            {lang === 'km' ? 'ស្ដាប់មតិយោបល់ពិតប្រាកដពីអតិថិជនដែលបានទិញទំនិញពី Shoply' : 'Read genuine feedback from shoppers who trust Shoply every day'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                  "{lang === 'km' ? item.commentKm : item.commentEn}"
                </p>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <img
                  src={item.avatar}
                  alt={item.nameEn}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                      {lang === 'km' ? item.nameKm : item.nameEn}
                    </span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </div>
                  <span className="text-[11px] text-gray-400 block truncate">
                    {lang === 'km' ? item.locationKm : item.locationEn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>



    </div>
  );
}
