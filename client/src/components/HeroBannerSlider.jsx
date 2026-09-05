import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Send, 
  ChevronLeft, 
  ChevronRight,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1800&q=85',
    badgeKm: 'ការប្រមូលទំនិញថ្មី 2026',
    badgeEn: 'New Collection 2026',
    tabKm: 'សម្លៀកបំពាក់ទាន់សម័យ',
    tabEn: 'Fashion Apparel',
    titleKm: 'ទំនិញទាន់សម័យ & គុណភាពខ្ពស់',
    highlightKm: 'តម្លៃសមរម្យ',
    titleEn: 'Modern Lifestyle & Premium Quality',
    highlightEn: 'Products',
    subtitleKm: 'ជ្រើសរើសទំនិញជាច្រើនប្រភេទ ចាប់ពីសម្លៀកបំពាក់ ស្បែកជើង រហូតដល់គ្រឿងអេឡិចត្រូនិច និងគ្រឿងតុបតែង។',
    subtitleEn: 'Discover an extensive selection from apparel and footwear to electronics and lifestyle accessories.',
    link: '/shop',
    buttonTextKm: 'ទិញឥឡូវនេះ',
    buttonTextEn: 'Shop Now',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=1800&q=85',
    badgeKm: 'បច្ចេកវិទ្យា & ឧបករណ៍ទំនើប',
    badgeEn: 'Smart Tech & Gadgets',
    tabKm: 'គ្រឿងអេឡិចត្រូនិច',
    tabEn: 'Smart Gadgets',
    titleKm: 'ឧបករណ៍ទំនើបសម្រាប់ជីវិតទាន់សម័យ',
    highlightKm: 'ធានាគុណភាព',
    titleEn: 'Smart Accessories & Modern Living',
    highlightEn: 'Top Gear',
    subtitleKm: 'បង្កើនភាពងាយស្រួលប្រចាំថ្ងៃជាមួយឧបករណ៍បច្ចេកវិទ្យាទំនើប គុណភាពខ្ពស់ និងការធានាត្រឹមត្រូវ។',
    subtitleEn: 'Upgrade your everyday lifestyle with high quality gadgets, accessories, and fast doorstep delivery.',
    link: '/shop?category=electronics',
    buttonTextKm: 'ស្វែងរកឧបករណ៍',
    buttonTextEn: 'Explore Tech',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1800&q=85',
    badgeKm: 'ស្បែកជើងម៉ូតថ្មីៗ',
    badgeEn: 'Trending Footwear',
    tabKm: 'ស្បែកជើង & គ្រឿងតុបតែង',
    tabEn: 'Kicks & Footwear',
    titleKm: 'ស្បែកជើងទាន់សម័យ ផាសុកភាពខ្ពស់',
    highlightKm: 'បញ្ចុះតម្លៃពិសេស',
    titleEn: 'Step In Comfort & Unmatched Style',
    highlightEn: 'Special Deals',
    subtitleKm: 'ម៉ូតពេញនិយមបំផុតប្រចាំឆ្នាំ សក្តិសមសម្រាប់គ្រប់កាលៈទេសៈ ទាំងដើរលេង និងធ្វើការងារ។',
    subtitleEn: 'Popular stylish kicks engineered for maximum comfort, street style, and daily wear.',
    link: '/shop?category=shoes',
    buttonTextKm: 'មើលស្បែកជើង',
    buttonTextEn: 'View Footwear',
  }
];

export default function HeroBannerSlider({ storeSettings = {} }) {
  const { lang, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Parse slides from settings if available
  const slides = React.useMemo(() => {
    let custom = [];
    if (storeSettings.hero_banners) {
      try {
        const parsed = typeof storeSettings.hero_banners === 'string' 
          ? JSON.parse(storeSettings.hero_banners) 
          : storeSettings.hero_banners;
        if (Array.isArray(parsed) && parsed.length > 0) {
          custom = parsed.map((item, idx) => {
            if (typeof item === 'string') {
              const defaultTemplate = DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length];
              return {
                id: idx + 1,
                image: item,
                badgeKm: defaultTemplate.badgeKm,
                badgeEn: defaultTemplate.badgeEn,
                tabKm: `ស្លាយទី ${idx + 1}`,
                tabEn: `Slide #${idx + 1}`,
                titleKm: defaultTemplate.titleKm,
                highlightKm: defaultTemplate.highlightKm,
                titleEn: defaultTemplate.titleEn,
                highlightEn: defaultTemplate.highlightEn,
                subtitleKm: defaultTemplate.subtitleKm,
                subtitleEn: defaultTemplate.subtitleEn,
                link: '/shop',
                buttonTextKm: 'ទិញឥឡូវនេះ',
                buttonTextEn: 'Shop Now',
              };
            }
            return {
              id: idx + 1,
              tabKm: item.tabKm || `ស្លាយទី ${idx + 1}`,
              tabEn: item.tabEn || `Slide #${idx + 1}`,
              ...item,
            };
          });
        }
      } catch (e) {
        console.error('Error parsing hero_banners setting:', e);
      }
    }

    if (custom.length > 0) return custom;

    // Fallback: If single hero_banner_image is provided
    if (storeSettings.hero_banner_image) {
      return [
        {
          ...DEFAULT_SLIDES[0],
          image: storeSettings.hero_banner_image,
        },
        ...DEFAULT_SLIDES.slice(1)
      ];
    }

    return DEFAULT_SLIDES;
  }, [storeSettings.hero_banners, storeSettings.hero_banner_image]);

  // Clean auto-switch every 5 seconds (Zero animation)
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentSlide] || slides[0];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl h-[520px] sm:h-[560px] lg:h-[600px] flex flex-col justify-between select-none">
      
      {/* Slide Background Image (Static, Clean, No Animation) */}
      <div className="absolute inset-0 z-0">
        <img
          src={activeSlide.image}
          alt={lang === 'km' ? activeSlide.titleKm : activeSlide.titleEn}
          className="w-full h-full object-cover object-center"
        />
        {/* Dark Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/75 to-indigo-950/50" />
        <div className="absolute inset-0 bg-radial-to-c from-transparent via-slate-950/40 to-slate-950/80" />
      </div>

      {/* Decorative subtle dot pattern (Static) */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-1" />

      {/* Slide Content - Uniform Vertically Centered Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-6 sm:py-8 lg:py-10 flex-1 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/25 border border-indigo-400/35 text-indigo-200 text-xs font-semibold mb-4 backdrop-blur-md shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'km' ? activeSlide.badgeKm : activeSlide.badgeEn}</span>
        </div>

        {/* Headline */}
        <h1 className="font-koulen text-3xl sm:text-5xl lg:text-6xl font-normal tracking-wide max-w-3xl leading-tight line-clamp-2">
          {lang === 'km' ? (
            <>
              {activeSlide.titleKm}{' '}
              <span className="bg-linear-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                {activeSlide.highlightKm}
              </span>
            </>
          ) : (
            <>
              {activeSlide.titleEn}{' '}
              <span className="bg-linear-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                {activeSlide.highlightEn}
              </span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-indigo-100/90 max-w-2xl leading-relaxed line-clamp-2 sm:line-clamp-3">
          {lang === 'km' ? activeSlide.subtitleKm : activeSlide.subtitleEn}
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 shrink-0">
          <Link
            to={activeSlide.link || '/shop'}
            className="px-7 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-sm shadow-xl hover:bg-indigo-50 active:scale-95 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <span>{lang === 'km' ? activeSlide.buttonTextKm : activeSlide.buttonTextEn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#categories-section"
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-sm backdrop-blur-md transition-colors"
          >
            {t('explore_catalog')}
          </a>
        </div>

        {/* Telegram Bot Notice Tag */}
        <div className="mt-5 sm:mt-6 flex items-center gap-2 text-xs text-indigo-200 bg-white/10 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/15 shrink-0">
          <Send className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            {lang === 'km' 
              ? 'ភ្ជាប់ជាមួយ Telegram Bot ជូនដំណឹងដល់ហាងភ្លាមៗ' 
              : 'Connected with Telegram Bot for instant store notifications'}
          </span>
        </div>
      </div>

      {/* Navigation Controls: Previous / Next Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-2xl bg-black/50 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md flex items-center justify-center cursor-pointer shadow-md transition-colors"
            aria-label="Previous Slide"
            title="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-2xl bg-black/50 hover:bg-black/80 border border-white/20 text-white backdrop-blur-md flex items-center justify-center cursor-pointer shadow-md transition-colors"
            aria-label="Next Slide"
            title="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Bottom Controls Bar */}
      {slides.length > 1 && (
        <div className="relative z-20 pb-5 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-linear-to-t from-slate-950/90 to-transparent shrink-0">
          
          {/* Slide Category Tabs */}
          <div className="hidden md:flex items-center gap-2">
            {slides.map((s, idx) => {
              const isCurrent = idx === currentSlide;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-white text-indigo-950 font-bold shadow-sm'
                      : 'bg-black/40 hover:bg-black/60 text-gray-300 border border-white/10'
                  }`}
                >
                  <Layers className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span>{lang === 'km' ? s.tabKm : s.tabEn}</span>
                </button>
              );
            })}
          </div>

          {/* Dots Indicator & Counter */}
          <div className="flex items-center gap-3 mx-auto md:mx-0">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`rounded-full cursor-pointer ${
                    idx === currentSlide 
                      ? 'w-6 h-2 bg-white' 
                      : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <span className="text-[11px] font-mono font-bold text-white/80 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              0{currentSlide + 1} / 0{slides.length}
            </span>
          </div>

        </div>
      )}
    </section>
  );
}
