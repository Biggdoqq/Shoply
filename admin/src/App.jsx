import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Package,
  Layers,
  ShoppingBag,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  Send,
  Check,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  ExternalLink,
  Eye,
  RefreshCw,
  X,
  Lock,
  LogOut,
  Upload,
  Phone,
  Store,
  Image as ImageIcon,
  QrCode,
  Sparkles,
  Star,
  Users,
  Truck,
  ShieldCheck,
  Flame,
  Zap,
  Clock,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Globe,
  MapPin,
  Sliders,
  Search,
  Filter,
  Grid,
  List,
  ArrowUpDown,
  Tag,
  ChevronRight,
  Home,
  Bookmark,
  Bell,
  Mail,
  Maximize2,
  Power,
  Info,
  ChevronDown,
  Printer,
  Download,
  FileText,
  Copy,
  EyeOff,
  CreditCard,
  Menu
} from 'lucide-react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getSettings,
  updateSettings,
  testTelegram,
  uploadImage,
  loginAdmin,
  checkAdminSession
} from './api';

const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL?.replace(/\/$/, '')
  || (typeof window !== 'undefined' ? window.location.origin : '/');

const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/$/, '')
  || (typeof window !== 'undefined' ? window.location.origin : '');

const DEFAULT_HERO_SLIDES = [
  {
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

const DEFAULT_STORE_STATS = [
  {
    icon: 'users',
    value: '15,000+',
    labelKm: 'អតិថិជនពេញចិត្ត',
    labelEn: 'Happy Customers',
  },
  {
    icon: 'shield',
    value: '100%',
    labelKm: 'គុណភាពធានាត្រឹមត្រូវ',
    labelEn: 'Authentic & Quality',
  },
  {
    icon: 'truck',
    value: '45 Mins',
    labelKm: 'ដឹកជញ្ជូនរហ័ស (ភ្នំពេញ)',
    labelEn: 'Express Delivery (PP)',
  },
  {
    icon: 'send',
    value: '24/7',
    labelKm: 'Telegram Bot ដំណឹងភ្លាមៗ',
    labelEn: 'Instant Bot Alerts',
  },
];

const DEFAULT_TESTIMONIALS = [
  {
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

const initialSlideForm = {
  image: '',
  badgeKm: '',
  badgeEn: '',
  tabKm: '',
  tabEn: '',
  titleKm: '',
  highlightKm: '',
  titleEn: '',
  highlightEn: '',
  subtitleKm: '',
  subtitleEn: '',
  link: '/shop',
  buttonTextKm: 'ទិញឥឡូវនេះ',
  buttonTextEn: 'Shop Now',
};

const initialTestimonialForm = {
  nameKm: '',
  nameEn: '',
  locationKm: '',
  locationEn: '',
  avatar: '',
  rating: 5,
  commentKm: '',
  commentEn: '',
};

// Concentric circles watermark matching the Purple Admin gradient card design
function CircleWatermark() {
  return (
    <svg
      className="absolute -right-6 -bottom-6 w-44 h-44 pointer-events-none opacity-20 text-white select-none"
      viewBox="0 0 200 200"
      fill="none"
    >
      <circle cx="120" cy="120" r="100" stroke="currentColor" strokeWidth="24" />
      <circle cx="120" cy="120" r="62" stroke="currentColor" strokeWidth="20" />
      <circle cx="120" cy="120" r="28" stroke="currentColor" strokeWidth="16" />
    </svg>
  );
}

// Visit and Sales Multi-Bar Chart matching screenshot
function VisitAndSalesChart({ orders }) {
  const chartData = React.useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return {
        date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: 0,
        pending: 0,
        shipped: 0,
      };
    });

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const bucket = days.find(({ date }) => (
        orderDate.getFullYear() === date.getFullYear()
        && orderDate.getMonth() === date.getMonth()
        && orderDate.getDate() === date.getDate()
      ));
      if (!bucket) return;

      if (order.status === 'DELIVERED') bucket.completed += 1;
      else if (order.status === 'SHIPPED') bucket.shipped += 1;
      else if (order.status !== 'CANCELLED') bucket.pending += 1;
    });

    return days;
  }, [orders]);

  const maxCount = Math.max(1, ...chartData.flatMap(item => [item.completed, item.pending, item.shipped]));
  const barHeight = (value) => value === 0 ? 0 : Math.max(8, (value / maxCount) * 100);

  return (
    <div className="w-full h-64 relative flex flex-col justify-between pt-4">
      {/* Background horizontal grid lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
        <div className="border-b border-gray-100 w-full" />
        <div className="border-b border-gray-100 w-full" />
        <div className="border-b border-gray-100 w-full" />
        <div className="border-b border-gray-100 w-full" />
      </div>

      {/* Bars */}
      <div className="relative z-10 flex-1 flex items-end justify-between px-2 sm:px-4">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
            <div className="flex items-end gap-1 sm:gap-1.5 h-44">
              {/* Purple Bar: Completed / Revenue */}
              <div
                style={{ height: `${barHeight(item.completed)}%` }}
                className="w-1.5 sm:w-2.5 bg-[#b66dff] rounded-t-sm"
                title={`Delivered: ${item.completed}`}
              />
              {/* Pink Bar: Pending */}
              <div
                style={{ height: `${barHeight(item.pending)}%` }}
                className="w-1.5 sm:w-2.5 bg-[#fe7096] rounded-t-sm"
                title={`Open: ${item.pending}`}
              />
              {/* Cyan Bar: Shipped / Total */}
              <div
                style={{ height: `${barHeight(item.shipped)}%` }}
                className="w-1.5 sm:w-2.5 bg-[#047edf] rounded-t-sm"
                title={`Shipped: ${item.shipped}`}
              />
            </div>
            <span className="text-[11px] font-semibold text-gray-400">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderStatusChart({ orders }) {
  const groups = [
    {
      label: 'Open orders',
      count: orders.filter(order => ['PENDING', 'CONFIRMED'].includes(order.status)).length,
      color: '#fe7096',
    },
    { label: 'Shipped', count: orders.filter(order => order.status === 'SHIPPED').length, color: '#047edf' },
    { label: 'Delivered', count: orders.filter(order => order.status === 'DELIVERED').length, color: '#07cdae' },
    { label: 'Cancelled', count: orders.filter(order => order.status === 'CANCELLED').length, color: '#94a3b8' },
  ];
  const total = orders.length;
  let offset = 0;
  const stops = groups.map((group) => {
    const start = offset;
    offset += total ? (group.count / total) * 100 : 0;
    return `${group.color} ${start}% ${offset}%`;
  }).join(', ');

  return (
    <div className="flex flex-col items-center justify-between flex-1 py-1">
      <div
        className="relative w-40 h-40 rounded-full flex items-center justify-center my-auto"
        style={{ background: total ? `conic-gradient(${stops})` : '#e5e7eb' }}
      >
        <div className="absolute inset-[18px] rounded-full bg-white flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-bold text-gray-400">Total</span>
          <span className="text-base font-black text-gray-900">{total}</span>
        </div>
      </div>

      <div className="w-full space-y-2 pt-4 border-t border-gray-100 text-xs">
        {groups.map(group => (
          <div key={group.label} className="flex items-center justify-between text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }} />
              <span>{group.label}</span>
            </div>
            <span className="font-bold text-gray-800">
              {group.count} {total ? `(${Math.round((group.count / total) * 100)}%)` : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  // Security PIN lock
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(sessionStorage.getItem('shoply_admin_token'));
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview');

  // Main data state
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettingsState] = useState({});
  const [loading, setLoading] = useState(false);

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [orderDetailModal, setOrderDetailModal] = useState(null);

  // Image upload loading indicators
  const [uploadingProductImg, setUploadingProductImg] = useState(false);
  const [uploadingCategoryImg, setUploadingCategoryImg] = useState(false);
  const [uploadingMediaKey, setUploadingMediaKey] = useState(null);
  const [heroSlideUrlInput, setHeroSlideUrlInput] = useState('');

  // Settings sub-navigation
  const [settingsSubTab, setSettingsSubTab] = useState('hero');

  // Hero Slide Modal state
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [editingSlideIndex, setEditingSlideIndex] = useState(null);
  const [slideForm, setSlideForm] = useState(initialSlideForm);

  // Customer Testimonial Modal state
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState(initialTestimonialForm);

  // Admin Profile Modal state
  const [adminProfileModalOpen, setAdminProfileModalOpen] = useState(false);
  const [adminProfileForm, setAdminProfileForm] = useState({
    name: '',
    role: '',
    avatar: '',
    avatarUrlInput: '',
  });
  const [uploadingAdminAvatar, setUploadingAdminAvatar] = useState(false);

  // Feedbacks
  const [telegramStatus, setTelegramStatus] = useState(null);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [showKhqrSecret, setShowKhqrSecret] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [orderFilterStatus, setOrderFilterStatus] = useState('ALL');
  const [orderSearch, setOrderSearch] = useState('');

  // Product Search, Filtering, and Sorting State
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [productStockFilter, setProductStockFilter] = useState('ALL'); // ALL, IN_STOCK, LOW_STOCK, OUT_OF_STOCK
  const [productFeaturedFilter, setProductFeaturedFilter] = useState('ALL'); // ALL, FEATURED, REGULAR
  const [productSortBy, setProductSortBy] = useState('NEWEST'); // NEWEST, PRICE_ASC, PRICE_DESC, STOCK_ASC, STOCK_DESC, NAME_ASC
  const [productViewMode, setProductViewMode] = useState('table'); // 'table' or 'grid'

  // Category Search State
  const [categorySearch, setCategorySearch] = useState('');

  // Form states
  const [productForm, setProductForm] = useState({
    nameKh: '',
    nameEn: '',
    descriptionKh: '',
    descriptionEn: '',
    price: '',
    salePrice: '',
    stock: 10,
    categoryId: '',
    isFeatured: false,
    images: [], // array of string URLs
    urlInput: '',
    variantsText: '',
  });

  const [categoryForm, setCategoryForm] = useState({
    nameKh: '',
    nameEn: '',
    slug: '',
    image: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      checkAdminSession()
        .then(fetchData)
        .catch(() => {
          sessionStorage.removeItem('shoply_admin_token');
          setIsAuthenticated(false);
        });
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes, ordersRes, settingsRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders(),
        getSettings(),
      ]);
      setProducts(Array.isArray(prodsRes?.data) ? prodsRes.data : []);
      setCategories(Array.isArray(catsRes?.data) ? catsRes.data : []);
      setOrders(Array.isArray(ordersRes?.data) ? ordersRes.data : []);
      setSettingsState(typeof settingsRes?.data === 'object' && !Array.isArray(settingsRes.data) ? settingsRes.data : {});
    } catch (err) {
      console.warn('Error fetching admin data:', err.message);
      if (err.response?.status === 401) {
        sessionStorage.removeItem('shoply_admin_token');
        setIsAuthenticated(false);
      }
      setProducts([]);
      setCategories([]);
      setOrders([]);
      setSettingsState({});
    } finally {
      setLoading(false);
    }
  };

  // ---------------- AUTHENTICATION ----------------
  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setLoginLoading(true);
    setPinError(false);
    try {
      const response = await loginAdmin(pinInput.trim());
      sessionStorage.setItem('shoply_admin_token', response.data.token);
      setIsAuthenticated(true);
      setPinInput('');
    } catch (error) {
      setPinError(true);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('shoply_admin_token');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // ---------------- PRODUCT ACTIONS ----------------
  const openNewProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      nameKh: '',
      nameEn: '',
      descriptionKh: '',
      descriptionEn: '',
      price: '',
      salePrice: '',
      stock: 10,
      categoryId: categories[0]?.id || '',
      isFeatured: false,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      urlInput: '',
      variantsText: 'Size: S, M, L, XL\nColor: Black, White',
    });
    setProductModalOpen(true);
  };

  const openEditProductModal = (prod) => {
    setEditingProduct(prod);
    let variantsStr = '';
    if (Array.isArray(prod.variants)) {
      variantsStr = prod.variants
        .map(v => `${v.name}: ${(v.options || []).join(', ')}`)
        .join('\n');
    }

    const imgs = Array.isArray(prod.images) ? prod.images : [];

    setProductForm({
      nameKh: prod.nameKh || '',
      nameEn: prod.nameEn || '',
      descriptionKh: prod.descriptionKh || '',
      descriptionEn: prod.descriptionEn || '',
      price: prod.price || '',
      salePrice: prod.salePrice || '',
      stock: prod.stock ?? 10,
      categoryId: prod.categoryId || categories[0]?.id || '',
      isFeatured: Boolean(prod.isFeatured),
      images: imgs,
      urlInput: '',
      variantsText: variantsStr,
    });
    setProductModalOpen(true);
  };

  const handleProductImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingProductImg(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await uploadImage(formData);
        if (res.data?.url) {
          setProductForm(prev => ({
            ...prev,
            images: [...prev.images, res.data.url]
          }));
        }
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingProductImg(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (productForm.urlInput?.trim()) {
      setProductForm(prev => ({
        ...prev,
        images: [...prev.images, prev.urlInput.trim()],
        urlInput: '',
      }));
    }
  };

  const handleRemoveProductImage = (indexToRemove) => {
    setProductForm(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const variantsArr = productForm.variantsText
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const name = parts[0].trim();
            const options = parts[1].split(',').map(o => o.trim()).filter(Boolean);
            return { name, options };
          }
          return null;
        })
        .filter(Boolean);

      const payload = {
        nameKh: productForm.nameKh,
        nameEn: productForm.nameEn,
        descriptionKh: productForm.descriptionKh,
        descriptionEn: productForm.descriptionEn,
        price: parseFloat(productForm.price),
        salePrice: productForm.salePrice ? parseFloat(productForm.salePrice) : null,
        stock: parseInt(productForm.stock, 10),
        categoryId: productForm.categoryId,
        isFeatured: productForm.isFeatured,
        images: productForm.images,
        variants: variantsArr,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }

      setProductModalOpen(false);
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      alert('Error saving product: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('តើអ្នកប្រាកដជាចង់លុបទំនិញនេះ? / Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (err) {
        alert('Error deleting product: ' + err.message);
      }
    }
  };

  const handleToggleFeatured = async (productId, currentStatus) => {
    try {
      const nextStatus = !currentStatus;
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, isFeatured: nextStatus } : p));
      await updateProduct(productId, { isFeatured: nextStatus });
    } catch (err) {
      alert('Failed to update featured status: ' + (err.response?.data?.error || err.message));
      fetchData();
    }
  };

  const handleQuickStockAdjust = async (productId, delta) => {
    try {
      const prod = products.find(p => p.id === productId);
      if (!prod) return;
      const newStock = Math.max(0, (prod.stock || 0) + delta);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
      await updateProduct(productId, { stock: newStock });
    } catch (err) {
      alert('Failed to update stock: ' + (err.response?.data?.error || err.message));
      fetchData();
    }
  };

  // Memoized filtered products list
  const filteredProducts = React.useMemo(() => {
    return products.filter((prod) => {
      // Search by name (Khmer or English), category, or ID
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase().trim();
        const matchesNameEn = prod.nameEn?.toLowerCase().includes(q);
        const matchesNameKh = prod.nameKh?.toLowerCase().includes(q);
        const matchesCat = prod.category?.nameEn?.toLowerCase().includes(q) || prod.category?.nameKh?.toLowerCase().includes(q);
        const matchesId = String(prod.id).toLowerCase().includes(q);
        if (!matchesNameEn && !matchesNameKh && !matchesCat && !matchesId) return false;
      }

      // Filter by category
      if (productCategoryFilter !== 'ALL' && prod.categoryId !== productCategoryFilter) {
        return false;
      }

      // Filter by stock
      if (productStockFilter === 'IN_STOCK' && (prod.stock || 0) <= 5) return false;
      if (productStockFilter === 'LOW_STOCK' && ((prod.stock || 0) === 0 || (prod.stock || 0) > 5)) return false;
      if (productStockFilter === 'OUT_OF_STOCK' && (prod.stock || 0) > 0) return false;

      // Filter by featured
      if (productFeaturedFilter === 'FEATURED' && !prod.isFeatured) return false;
      if (productFeaturedFilter === 'REGULAR' && prod.isFeatured) return false;

      return true;
    }).sort((a, b) => {
      if (productSortBy === 'PRICE_ASC') return a.price - b.price;
      if (productSortBy === 'PRICE_DESC') return b.price - a.price;
      if (productSortBy === 'STOCK_ASC') return (a.stock || 0) - (b.stock || 0);
      if (productSortBy === 'STOCK_DESC') return (b.stock || 0) - (a.stock || 0);
      if (productSortBy === 'NAME_ASC') return (a.nameEn || '').localeCompare(b.nameEn || '');
      return b.id - a.id;
    });
  }, [products, productSearch, productCategoryFilter, productStockFilter, productFeaturedFilter, productSortBy]);

  const filteredCategories = React.useMemo(() => {
    if (!categorySearch.trim()) return categories;
    const q = categorySearch.toLowerCase().trim();
    return categories.filter(c => 
      c.nameEn?.toLowerCase().includes(q) || c.nameKh?.toLowerCase().includes(q)
    );
  }, [categories, categorySearch]);

  const lowStockProducts = React.useMemo(() => {
    return products.filter(p => (p.stock || 0) <= 5);
  }, [products]);

  // ---------------- CATEGORY ACTIONS ----------------
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ nameKh: '', nameEn: '', slug: '', image: '' });
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      nameKh: cat.nameKh || '',
      nameEn: cat.nameEn || '',
      slug: cat.slug || '',
      image: cat.image || '',
    });
    setCategoryModalOpen(true);
  };

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCategoryImg(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImage(formData);
      if (res.data?.url) {
        setCategoryForm(prev => ({ ...prev, image: res.data.url }));
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingCategoryImg(false);
      e.target.value = '';
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
      } else {
        await createCategory(categoryForm);
      }
      setCategoryModalOpen(false);
      setCategoryForm({ nameKh: '', nameEn: '', slug: '', image: '' });
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      alert('Error saving category: ' + err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('តើអ្នកប្រាកដជាចង់លុបប្រភេទនេះ? / Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        alert('Error deleting category: ' + err.message);
      }
    }
  };

  // ---------------- ORDER ACTIONS ----------------
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (orderDetailModal && orderDetailModal.id === orderId) {
        setOrderDetailModal(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert('Error updating order status: ' + err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('តើអ្នកពិតជាចង់លុបការកុម្ម៉ង់នេះមែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ! (Are you sure you want to delete this order?)')) {
      return;
    }
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (orderDetailModal && orderDetailModal.id === orderId) {
        setOrderDetailModal(null);
      }
    } catch (err) {
      alert('Error deleting order: ' + err.message);
    }
  };

  const handlePrintInvoice = (order) => {
    if (!order) return;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to print the invoice');
      return;
    }
    const itemsHtml = (order.items || []).map(it => `
      <tr>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb;">
          <strong>${it.name}</strong>
          ${it.selectedVariant ? `<div style="font-size: 11px; color: #4f46e5; margin-top: 2px;">${typeof it.selectedVariant === 'object' ? Object.entries(it.selectedVariant).map(([k,v])=>`${k}: ${v}`).join(', ') : it.selectedVariant}</div>` : ''}
        </td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${it.quantity}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${Number(it.price).toFixed(2)}</td>
        <td style="padding: 10px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold;">$${(it.price * it.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #${order.orderNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 28px; color: #1f2937; margin: 0; line-height: 1.5; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 900; color: #4f46e5; }
          .title { font-size: 18px; font-weight: bold; text-align: right; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size: 13px; }
          .box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th { background: #f3f4f6; padding: 10px 8px; text-align: left; font-weight: 600; }
          .total-box { margin-left: auto; width: 280px; font-size: 14px; }
          .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .total-grand { border-top: 2px solid #1f2937; margin-top: 8px; padding-top: 8px; font-size: 16px; font-weight: bold; color: #4f46e5; }
          .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">${settings.store_name || 'Shoply Store'}</div>
            <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">${settings.phone_number || ''} ${settings.store_address ? '• ' + settings.store_address : ''}</div>
          </div>
          <div class="title">
            <div>DELIVERY SLIP / INVOICE</div>
            <div style="font-size: 13px; font-family: monospace; color: #4f46e5; margin-top: 4px;">#${order.orderNumber}</div>
            <div style="font-size: 11px; color: #6b7280; font-weight: normal;">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="grid">
          <div class="box">
            <div style="font-weight: bold; margin-bottom: 6px; color: #374151; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Customer Information</div>
            <div><strong>Name:</strong> ${order.customerName}</div>
            <div><strong>Phone:</strong> ${order.customerPhone}</div>
            ${order.customerTelegram ? `<div><strong>Telegram:</strong> ${order.customerTelegram}</div>` : ''}
            <div><strong>Address:</strong> ${order.cityProvince}, ${order.address}</div>
            ${order.notes ? `<div style="margin-top: 4px;"><strong>Notes:</strong> <em>${order.notes}</em></div>` : ''}
          </div>
          <div class="box">
            <div style="font-weight: bold; margin-bottom: 6px; color: #374151; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Order Details</div>
            <div><strong>Status:</strong> ${order.status}</div>
            <div><strong>Payment:</strong> ${order.paymentMethod}</div>
            <div><strong>Shipping:</strong> Standard Delivery</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Description</th>
              <th style="text-align: center;">Qty</th>
              <th style="text-align: right;">Price</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total-box">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>$${Number(order.totalAmount).toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Delivery:</span>
            <span style="color: #059669; font-weight: bold;">FREE</span>
          </div>
          <div class="total-row total-grand">
            <span>Total Payable:</span>
            <span>$${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for shopping with ${settings.store_name || 'Shoply Store'}! For inquiries, call ${settings.phone_number || ''}</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  const exportOrdersToCSV = () => {
    if (!filteredOrders.length) {
      alert('គ្មានទិន្នន័យសម្រាប់ទាញយកទេ (No orders to export)');
      return;
    }
    const headers = ['Order Number', 'Date', 'Customer Name', 'Phone', 'Telegram', 'City/Province', 'Address', 'Payment Method', 'Status', 'Total Amount ($)', 'Items'];
    const rows = filteredOrders.map(o => [
      `"${o.orderNumber || ''}"`,
      `"${new Date(o.createdAt).toLocaleString()}"`,
      `"${(o.customerName || '').replace(/"/g, '""')}"`,
      `"${o.customerPhone || ''}"`,
      `"${(o.customerTelegram || '').replace(/"/g, '""')}"`,
      `"${(o.cityProvince || '').replace(/"/g, '""')}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${o.paymentMethod || ''}"`,
      `"${o.status || ''}"`,
      `"${Number(o.totalAmount || 0).toFixed(2)}"`,
      `"${(o.items || []).map(i => `${i.name} (x${i.quantity})`).join('; ').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Shoply_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------------- SETTINGS & MEDIA ACTIONS ----------------
  const handleMediaUpload = async (key, file) => {
    if (!file) return;
    setUploadingMediaKey(key);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImage(formData);
      if (res.data?.url) {
        const nextSettings = { ...settings, [key]: res.data.url };
        setSettingsState(nextSettings);
        // Auto-save setting to DB
        await updateSettings({ [key]: res.data.url });
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingMediaKey(null);
    }
  };

  // ---------------- HERO BANNER SLIDES MANAGEMENT ----------------
  const getHeroSlides = () => {
    try {
      const parsed = typeof settings.hero_banners === 'string' 
        ? JSON.parse(settings.hero_banners) 
        : settings.hero_banners;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => {
          if (typeof item === 'string') {
            const tpl = DEFAULT_HERO_SLIDES[idx % DEFAULT_HERO_SLIDES.length];
            return {
              ...tpl,
              image: item,
              tabKm: `ស្លាយទី ${idx + 1}`,
              tabEn: `Slide #${idx + 1}`,
            };
          }
          return {
            image: item.image || '',
            badgeKm: item.badgeKm || '',
            badgeEn: item.badgeEn || '',
            tabKm: item.tabKm || `ស្លាយទី ${idx + 1}`,
            tabEn: item.tabEn || `Slide #${idx + 1}`,
            titleKm: item.titleKm || '',
            highlightKm: item.highlightKm || '',
            titleEn: item.titleEn || '',
            highlightEn: item.highlightEn || '',
            subtitleKm: item.subtitleKm || '',
            subtitleEn: item.subtitleEn || '',
            link: item.link || '/shop',
            buttonTextKm: item.buttonTextKm || 'ទិញឥឡូវនេះ',
            buttonTextEn: item.buttonTextEn || 'Shop Now',
          };
        });
      }
    } catch (e) {}
    if (settings.hero_banner_image) {
      return [{
        ...DEFAULT_HERO_SLIDES[0],
        image: settings.hero_banner_image,
      }];
    }
    return DEFAULT_HERO_SLIDES;
  };

  const saveHeroSlides = async (newSlides) => {
    const nextSettings = {
      ...settings,
      hero_banners: JSON.stringify(newSlides),
      hero_banner_image: newSlides[0]?.image || '',
    };
    setSettingsState(nextSettings);
    await updateSettings({
      hero_banners: JSON.stringify(newSlides),
      hero_banner_image: newSlides[0]?.image || '',
    });
  };

  const handleResetHeroSlides = async () => {
    if (!window.confirm('Reset all Hero Slides to default? / កំណត់ស្លាយឡើងវិញជាលំនាំដើម?')) return;
    await saveHeroSlides(DEFAULT_HERO_SLIDES);
  };

  const handleMoveHeroSlide = async (index, direction) => {
    const slides = [...getHeroSlides()];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= slides.length) return;
    const temp = slides[index];
    slides[index] = slides[targetIdx];
    slides[targetIdx] = temp;
    await saveHeroSlides(slides);
  };

  const handleRemoveHeroSlide = async (indexToRemove) => {
    if (!window.confirm('Delete this slide? / លុបស្លាយនេះចោល?')) return;
    const current = getHeroSlides();
    const nextSlides = current.filter((_, idx) => idx !== indexToRemove);
    await saveHeroSlides(nextSlides.length > 0 ? nextSlides : DEFAULT_HERO_SLIDES);
  };

  const handleHeroBannersUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploadingMediaKey('hero_banners');
    try {
      const uploadedUrls = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await uploadImage(formData);
        if (res.data?.url) {
          uploadedUrls.push(res.data.url);
        }
      }
      if (uploadedUrls.length > 0) {
        const current = getHeroSlides();
        const newItems = uploadedUrls.map((url, i) => {
          const tpl = DEFAULT_HERO_SLIDES[(current.length + i) % DEFAULT_HERO_SLIDES.length];
          return {
            ...tpl,
            image: url,
            tabKm: `ស្លាយទី ${current.length + i + 1}`,
            tabEn: `Slide #${current.length + i + 1}`,
          };
        });
        await saveHeroSlides([...current, ...newItems]);
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingMediaKey(null);
    }
  };

  const handleAddHeroSlideUrl = async (url) => {
    if (!url || !url.trim()) return;
    const current = getHeroSlides();
    const tpl = DEFAULT_HERO_SLIDES[current.length % DEFAULT_HERO_SLIDES.length];
    const newSlide = {
      ...tpl,
      image: url.trim(),
      tabKm: `ស្លាយទី ${current.length + 1}`,
      tabEn: `Slide #${current.length + 1}`,
    };
    await saveHeroSlides([...current, newSlide]);
    setHeroSlideUrlInput('');
  };

  const openAddSlideModal = () => {
    setEditingSlideIndex(null);
    setSlideForm({
      ...initialSlideForm,
      tabKm: `ស្លាយទី ${getHeroSlides().length + 1}`,
      tabEn: `Slide #${getHeroSlides().length + 1}`,
    });
    setSlideModalOpen(true);
  };

  const openEditSlideModal = (index) => {
    const slides = getHeroSlides();
    setEditingSlideIndex(index);
    setSlideForm({ ...slides[index] });
    setSlideModalOpen(true);
  };

  const handleSaveSlideSubmit = async (e) => {
    e.preventDefault();
    if (!slideForm.image.trim()) {
      alert('Please upload or enter an image URL for the slide.');
      return;
    }
    const current = [...getHeroSlides()];
    if (editingSlideIndex !== null) {
      current[editingSlideIndex] = { ...slideForm };
    } else {
      current.push({ ...slideForm });
    }
    await saveHeroSlides(current);
    setSlideModalOpen(false);
  };

  const handleSlideModalImageUpload = async (file) => {
    if (!file) return;
    setUploadingMediaKey('slide_form_img');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImage(formData);
      if (res.data?.url) {
        setSlideForm(prev => ({ ...prev, image: res.data.url }));
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingMediaKey(null);
    }
  };

  // ---------------- STORE STATS (4 HIGHLIGHT CARDS) ----------------
  const getStoreStats = () => {
    try {
      const parsed = typeof settings.store_stats === 'string'
        ? JSON.parse(settings.store_stats)
        : settings.store_stats;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
    return DEFAULT_STORE_STATS;
  };

  const handleStoreStatChange = (idx, field, value) => {
    const currentStats = [...getStoreStats()];
    currentStats[idx] = { ...currentStats[idx], [field]: value };
    setSettingsState(prev => ({ ...prev, store_stats: JSON.stringify(currentStats) }));
  };

  const handleSaveStoreStats = async () => {
    const statsToSave = getStoreStats();
    setSavingSettings(true);
    try {
      await updateSettings({ store_stats: JSON.stringify(statsToSave) });
      alert('Store Stats saved successfully! / បានរក្សាទុកកាតស្ថិតិជោគជ័យ!');
    } catch (err) {
      alert('Error saving stats: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleResetStoreStats = async () => {
    if (!window.confirm('Reset Store Stats to defaults? / កំណត់កាតស្ថិតិឡើងវិញជាលំនាំដើម?')) return;
    setSettingsState(prev => ({ ...prev, store_stats: JSON.stringify(DEFAULT_STORE_STATS) }));
    await updateSettings({ store_stats: JSON.stringify(DEFAULT_STORE_STATS) });
  };

  // ---------------- CUSTOMER REVIEWS / TESTIMONIALS ----------------
  const getTestimonials = () => {
    try {
      const parsed = typeof settings.customer_testimonials === 'string'
        ? JSON.parse(settings.customer_testimonials)
        : settings.customer_testimonials;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
    return DEFAULT_TESTIMONIALS;
  };

  const saveTestimonials = async (list) => {
    const nextSettings = {
      ...settings,
      customer_testimonials: JSON.stringify(list),
    };
    setSettingsState(nextSettings);
    await updateSettings({ customer_testimonials: JSON.stringify(list) });
  };

  const openAddTestimonial = () => {
    setEditingTestimonialIndex(null);
    setTestimonialForm(initialTestimonialForm);
    setTestimonialModalOpen(true);
  };

  const openEditTestimonial = (index) => {
    const list = getTestimonials();
    setEditingTestimonialIndex(index);
    setTestimonialForm({ ...list[index] });
    setTestimonialModalOpen(true);
  };

  const handleSaveTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialForm.nameKm.trim() && !testimonialForm.nameEn.trim()) {
      alert('Please enter customer name');
      return;
    }
    const list = [...getTestimonials()];
    if (editingTestimonialIndex !== null) {
      list[editingTestimonialIndex] = { ...testimonialForm };
    } else {
      list.push({ ...testimonialForm, id: Date.now() });
    }
    await saveTestimonials(list);
    setTestimonialModalOpen(false);
  };

  const handleDeleteTestimonial = async (index) => {
    if (!window.confirm('Delete this customer review? / លុបមតិយោបល់នេះ?')) return;
    const list = getTestimonials().filter((_, i) => i !== index);
    await saveTestimonials(list);
  };

  const handleResetTestimonials = async () => {
    if (!window.confirm('Reset reviews to default? / កំណត់មតិឡើងវិញជាលំនាំដើម?')) return;
    await saveTestimonials(DEFAULT_TESTIMONIALS);
  };

  const handleTestimonialAvatarUpload = async (file) => {
    if (!file) return;
    setUploadingMediaKey('testimonial_avatar');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImage(formData);
      if (res.data?.url) {
        setTestimonialForm(prev => ({ ...prev, avatar: res.data.url }));
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingMediaKey(null);
    }
  };

  // ---------------- ADMIN PROFILE HANDLERS ----------------
  const openEditAdminProfile = () => {
    setAdminProfileForm({
      name: settings.admin_name || 'David Greymaax',
      role: settings.admin_role || 'Store Administrator',
      avatar: settings.admin_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      avatarUrlInput: '',
    });
    setAdminProfileModalOpen(true);
  };

  const handleAdminAvatarUpload = async (file) => {
    if (!file) return;
    setUploadingAdminAvatar(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await uploadImage(formData);
      if (res.data?.url) {
        setAdminProfileForm(prev => ({ ...prev, avatar: res.data.url, avatarUrlInput: '' }));
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setUploadingAdminAvatar(false);
    }
  };

  const handleSaveAdminProfile = async (e) => {
    if (e) e.preventDefault();
    if (!adminProfileForm.name.trim()) {
      alert('Please enter an admin name / សូមបញ្ចូលឈ្មោះ Admin');
      return;
    }
    const finalAvatar = adminProfileForm.avatarUrlInput.trim() || adminProfileForm.avatar;
    const payload = {
      admin_name: adminProfileForm.name.trim(),
      admin_role: adminProfileForm.role.trim() || 'Store Administrator',
      admin_avatar: finalAvatar,
    };
    try {
      await updateSettings(payload);
      setSettingsState(prev => ({ ...prev, ...payload }));
      setAdminProfileModalOpen(false);
      alert('Admin Profile updated successfully! / បានកែប្រែព័ត៌មាន Admin ជោគជ័យ!');
    } catch (err) {
      alert('Error updating profile: ' + err.message);
    }
  };

  // ---------------- GENERAL SETTINGS SAVE ----------------
  const handleSavePartialSettings = async (keys, successMsg) => {
    setSavingSettings(true);
    try {
      const payload = {};
      keys.forEach(k => {
        if (settings[k] !== undefined) payload[k] = settings[k];
      });
      await updateSettings(payload);
      alert(successMsg || 'Settings saved successfully! / បានរក្សាទុកជោគជ័យ!');
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSettingsSave = async (e) => {
    if (e) e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSettings(settings);
      alert('Settings saved successfully! / បានរក្សាទុកការកំណត់ជោគជ័យ!');
    } catch (err) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setTelegramStatus(null);
    try {
      const res = await testTelegram({
        token: settings.telegram_bot_token,
        chatId: settings.telegram_chat_id,
      });
      setTelegramStatus({ success: true, message: res.data.message });
    } catch (err) {
      setTelegramStatus({
        success: false,
        message: err.response?.data?.error || err.message || 'Connection failed',
      });
    } finally {
      setTestingTelegram(false);
    }
  };

  // Stats calculation
  const weekCutoff = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const weeklyOrders = orders.filter(order => new Date(order.createdAt).getTime() >= weekCutoff);
  const weeklySales = weeklyOrders.reduce((sum, order) => (
    sum + (order.status !== 'CANCELLED' ? Number(order.totalAmount || 0) : 0)
  ), 0);
  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
  const weeklyPendingOrders = weeklyOrders.filter(order => order.status === 'PENDING').length;
  const deliveredOrders = weeklyOrders.filter(order => order.status === 'DELIVERED').length;
  const paymentWebhookUrl = `${API_ORIGIN}/api/payments/khqrcc/webhook`;
  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderFilterStatus === 'ALL' || o.status === orderFilterStatus;
    if (!matchesStatus) return false;
    if (!orderSearch.trim()) return true;
    const query = orderSearch.toLowerCase().trim();
    const orderNum = (o.orderNumber || '').toLowerCase();
    const custName = (o.customerName || '').toLowerCase();
    const custPhone = (o.customerPhone || '').toLowerCase();
    const custTelegram = (o.customerTelegram || '').toLowerCase();
    const custAddress = (o.address || '').toLowerCase();
    const custCity = (o.cityProvince || '').toLowerCase();
    return (
      orderNum.includes(query) ||
      custName.includes(query) ||
      custPhone.includes(query) ||
      custTelegram.includes(query) ||
      custAddress.includes(query) ||
      custCity.includes(query)
    );
  });

  // ---------------- RENDER LOGIN IF NOT AUTHENTICATED ----------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900">Shoply Admin Portal</h1>
            <p className="text-xs text-gray-500 mt-1">
              សូមបញ្ចូលលេខកូដសម្ងាត់របស់អ្នក ដើម្បីចូលផ្ទាំងគ្រប់គ្រង
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter admin PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full text-center text-xl tracking-widest font-mono py-3 px-4 rounded-xl border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden"
              />
              {pinError && (
                <span className="text-xs text-rose-500 font-medium block mt-1.5">
                  លេខកូដមិនត្រឹមត្រូវ ឬ server មិនទាន់បានកំណត់ Admin PIN។
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-wait text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer"
            >
              {loginLoading ? 'កំពុងពិនិត្យ...' : 'ចូលផ្ទាំងគ្រប់គ្រង / Unlock Dashboard'}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 text-xs text-gray-400">
            Dedicated Store Management System
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN DASHBOARD LAYOUT ----------------
  return (
    <div className="min-h-screen flex overflow-x-hidden bg-[#f2edf3] text-gray-800 font-sans">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[1px] lg:hidden"
        />
      )}
      
      {/* 1. SIDEBAR: FULL HEIGHT COLUMN ON THE LEFT */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[86vw] bg-white border-r border-gray-200/80 flex flex-col shrink-0 h-screen transition-transform duration-200 lg:sticky lg:top-0 lg:w-64 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        {/* Scrollable Sidebar Nav Content */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
          {/* Profile Card */}
          <div className="p-5 pr-14 lg:pr-5 flex items-center justify-between border-b border-gray-100 group">
            <div
              onClick={openEditAdminProfile}
              className="flex items-center gap-3 cursor-pointer min-w-0"
              title="Click to edit profile / ចុចដើម្បីកែប្រែរូប & ឈ្មោះ"
            >
              <div className="relative shrink-0">
                <img
                  src={settings.admin_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt={settings.admin_name || "Admin"}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs group-hover:ring-2 group-hover:ring-[#b66dff] transition-all"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-gray-900 leading-tight truncate group-hover:text-[#b66dff] transition-colors">
                  {settings.admin_name || 'David Grey. H'}
                </div>
                <div className="text-[11px] text-gray-400 truncate">
                  {settings.admin_role || 'Store Administrator'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={openEditAdminProfile}
              title="Change Photo & Name / កែប្រែរូប & ឈ្មោះ"
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#b66dff] hover:bg-purple-50 transition-colors cursor-pointer shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 flex-1">
            {[
              { id: 'overview', label: 'Dashboard', khmer: 'ផ្ទាំងគ្រប់គ្រង', icon: Home },
              { id: 'products', label: 'Products', khmer: 'ទំនិញ', icon: Package, count: products.length },
              { id: 'categories', label: 'Categories', khmer: 'ប្រភេទ', icon: Layers, count: categories.length },
              { id: 'orders', label: 'Orders', khmer: 'ការកុម្ម៉ង់', icon: ShoppingBag, count: pendingOrders, isBadge: true },
              { id: 'settings', label: 'Settings & Media', khmer: 'ការកំណត់ & រូបភាព', icon: SettingsIcon },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs transition-all cursor-pointer ${
                    active
                      ? 'text-[#b66dff] font-bold bg-purple-50/70 border-l-4 border-[#b66dff]'
                      : 'text-gray-600 hover:text-[#b66dff] hover:bg-gray-50 font-medium border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-[#b66dff]' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <span className="block leading-tight">{item.label}</span>
                      <span className="text-[10px] text-gray-400 font-normal">{item.khmer}</span>
                    </div>
                  </div>
                  {item.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.isBadge && item.count > 0
                        ? 'bg-rose-500 text-white'
                        : active
                          ? 'bg-purple-200/60 text-[#b66dff]'
                          : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>


        </div>
      </aside>

      {/* 2. RIGHT SIDE WRAPPER: TOP NAVBAR + MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR (ONLY OVER MAIN CONTENT AREA) */}
        <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-6 lg:px-8 shadow-2xs">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
            className="mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          {/* Search Input */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, orders, categories..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  if (activeTab !== 'products' && e.target.value) {
                    setActiveTab('products');
                  }
                }}
                className="w-full pl-10 pr-4 py-2 bg-gray-50/80 hover:bg-gray-100/80 focus:bg-white rounded-lg border border-gray-200 text-xs focus:border-[#b66dff] focus:ring-2 focus:ring-purple-100 outline-hidden transition-all text-gray-700"
              />
            </div>
          </div>

          {/* Right Top Controls */}
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-4 shrink-0 ml-2 sm:ml-4">
            {/* Admin Profile Dropdown */}
            <button
              type="button"
              onClick={openEditAdminProfile}
              title="Edit Admin Profile (កែប្រែរូប & ឈ្មោះ)"
              className="hidden sm:flex items-center gap-2.5 p-1 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer text-left group"
            >
              <div className="relative shrink-0">
                <img
                  src={settings.admin_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                  alt={settings.admin_name || "Admin"}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-2xs group-hover:border-[#b66dff] transition-all"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
              </div>
              <div className="hidden md:block text-left min-w-0">
                <span className="text-xs font-bold text-gray-700 block leading-tight truncate group-hover:text-[#b66dff] transition-colors">
                  {settings.admin_name || 'David Greymaax'}
                </span>
                <span className="text-[10px] text-gray-400 block truncate">
                  {settings.admin_role || 'Store Administrator'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden md:block group-hover:text-[#b66dff]" />
            </button>

            <div className="h-5 w-px bg-gray-200 hidden sm:block" />

            {/* Action Icons */}
            <a
              href={STOREFRONT_URL}
              target="_blank"
              rel="noreferrer"
              title="Open Storefront"
              className="hidden md:block p-2 text-gray-500 hover:text-[#b66dff] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </a>

            <button
              onClick={() => { setActiveTab('settings'); setSettingsSubTab('telegram'); }}
              title="Telegram Bot Status"
              className="relative p-2 text-gray-500 hover:text-[#b66dff] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${settings.telegram_chat_id ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              title="Orders & Notifications"
              className="relative p-2 text-gray-500 hover:text-[#b66dff] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {pendingOrders > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              onClick={handleLogout}
              title="Sign Out / Logout"
              className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 min-w-0">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
                
                {/* Announcement Banner */}
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-[#b66dff] uppercase tracking-wider block">Shoply Store Management</span>
                    <h2 className="text-base font-bold text-gray-800">
                      Everything you need to manage your store, track sales, and update catalog live!
                    </h2>
                    <p className="text-xs text-gray-500">
                      Full control over hero banners, instant inventory updates, KHQR payments, and Telegram alerts.
                    </p>
                  </div>
                  <div className="flex w-full flex-col sm:w-auto sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                    <button
                      onClick={fetchData}
                      disabled={loading}
                      className="px-3.5 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>Sync Data</span>
                    </button>
                    <a
                      href={STOREFRONT_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#da8cff] to-[#9a55ff] text-white text-xs font-bold shadow-xs hover:opacity-95 flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Visit Store</span>
                    </a>
                  </div>
                </div>

                {/* Breadcrumbs Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#b66dff] text-white flex items-center justify-center shadow-xs">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-lg font-bold text-gray-800 leading-tight">Dashboard</h1>
                      <span className="text-[11px] text-gray-400">Store Performance & Activity Monitor</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white px-3.5 py-2 rounded-lg border border-gray-200/80 shadow-2xs">
                    <span>Overview</span>
                    <Info className="w-3.5 h-3.5 text-[#b66dff]" />
                  </div>
                </div>

                {/* 3 Gradient Metric Cards (Coral Pink, Sky Blue, Mint Teal with Concentric Watermark) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1: Weekly Sales (Coral/Pink Gradient) */}
                  <div className="bg-gradient-to-r from-[#ffbf96] to-[#fe7096] text-white rounded-xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[160px]">
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-sm font-semibold text-white/90">Order Value (7 days)</span>
                      <TrendingUp className="w-5 h-5 text-white/90" />
                    </div>
                    <div className="relative z-10 my-2">
                      <div className="text-3xl font-black tracking-tight">${weeklySales.toFixed(2)}</div>
                    </div>
                    <div className="text-xs text-white/90 font-medium relative z-10 flex items-center justify-between">
                      <span>Last 7 days</span>
                      <span className="text-[11px] text-white/80">≈ {(Math.round(weeklySales * 4100)).toLocaleString()} ៛</span>
                    </div>
                    <CircleWatermark />
                  </div>

                  {/* Card 2: Weekly Orders (Sky Blue Gradient) */}
                  <div className="bg-gradient-to-r from-[#90caf9] to-[#047edf] text-white rounded-xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[160px]">
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-sm font-semibold text-white/90">Weekly Orders</span>
                      <ShoppingBag className="w-5 h-5 text-white/90" />
                    </div>
                    <div className="relative z-10 my-2">
                      <div className="text-3xl font-black tracking-tight">{weeklyOrders.length}</div>
                    </div>
                    <div className="text-xs text-white/90 font-medium relative z-10 flex items-center justify-between">
                      <span>{weeklyPendingOrders} awaiting confirmation</span>
                      <span className="text-[11px] text-white/80">{deliveredOrders} delivered</span>
                    </div>
                    <CircleWatermark />
                  </div>

                  {/* Card 3: Visitors & Inventory (Mint/Teal Aqua Gradient) */}
                  <div className="bg-gradient-to-r from-[#84d9d2] to-[#07cdae] text-white rounded-xl p-6 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[160px]">
                    <div className="flex items-center justify-between relative z-10">
                      <span className="text-sm font-semibold text-white/90">Catalog & Inventory</span>
                      <Package className="w-5 h-5 text-white/90" />
                    </div>
                    <div className="relative z-10 my-2">
                      <div className="text-3xl font-black tracking-tight">{products.length} Products</div>
                    </div>
                    <div className="text-xs text-white/90 font-medium relative z-10 flex items-center justify-between">
                      <span>{lowStockProducts.length} need restock</span>
                      <span className="text-[11px] text-white/80">{categories.length} Categories</span>
                    </div>
                    <CircleWatermark />
                  </div>
                </div>

                {/* Charts Row: Visit & Sales Bar Chart (col-span-8) + Traffic Sources Donut Chart (col-span-4) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <VisitAndSalesChart orders={orders} />
                  </div>
                  <div className="lg:col-span-4">
                    <OrderStatusChart orders={orders} />
                  </div>
                </div>



                {/* Two-Column Bottom Row: Left: Recent Orders, Right: Low Stock & Health */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Recent Orders (8 cols) */}
                  <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-gray-100 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">Recent Orders (ការកុម្ម៉ង់ចុងក្រោយ)</h3>
                        <p className="text-xs text-gray-400">Latest customer purchases and requests</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-[#b66dff] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View all ({orders.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 space-y-2">
                        <ShoppingBag className="w-8 h-8 mx-auto text-gray-300" />
                        <p className="text-xs">No customer orders recorded yet.</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-600">
                          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                            <tr>
                              <th className="p-3">Order Number</th>
                              <th className="p-3">Customer</th>
                              <th className="p-3">Items</th>
                              <th className="p-3">Total</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {orders.slice(0, 6).map((ord) => (
                              <tr key={ord.id} className="hover:bg-gray-50/60">
                                <td className="p-3 font-mono font-bold text-[#b66dff]">
                                  {ord.orderNumber}
                                </td>
                                <td className="p-3">
                                  <span className="font-semibold text-gray-900 block">{ord.customerName}</span>
                                  <span className="text-gray-400 text-[11px]">{ord.customerPhone}</span>
                                </td>
                                <td className="p-3">{ord.items?.length || 0} items</td>
                                <td className="p-3 font-bold text-gray-900">${Number(ord.totalAmount).toFixed(2)}</td>
                                <td className="p-3">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    ord.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                    ord.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                    ord.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                                    ord.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                                    'bg-rose-100 text-rose-800'
                                  }`}>
                                    {ord.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => setOrderDetailModal(ord)}
                                    className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-purple-50 text-gray-700 hover:text-[#b66dff] font-semibold text-[11px] transition-colors cursor-pointer"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Inventory Watchlist & Store Status (4 cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Low Stock Watchlist */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                          <h4 className="font-bold text-gray-900 text-sm">Low Stock Watchlist</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {lowStockProducts.length} items
                        </span>
                      </div>

                      {lowStockProducts.length === 0 ? (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                          <p className="text-xs font-bold text-emerald-800">All Products Well Stocked!</p>
                          <p className="text-[11px] text-emerald-600">No products have 5 or fewer items remaining.</p>
                        </div>
                      ) : (
                        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                          {lowStockProducts.slice(0, 6).map((prod) => {
                            const img = Array.isArray(prod.images) ? prod.images[0] : '';
                            return (
                              <div key={prod.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                                    alt=""
                                    className="w-10 h-10 rounded-lg object-cover bg-white border border-gray-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <span className="text-xs font-bold text-gray-900 block truncate">{prod.nameEn}</span>
                                    <span className="text-[10px] text-gray-400 block truncate">{prod.nameKh}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    prod.stock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {prod.stock === 0 ? 'Out of stock' : `${prod.stock} left`}
                                  </span>
                                  <button
                                    onClick={() => handleQuickStockAdjust(prod.id, 5)}
                                    title="Add +5 units to stock"
                                    className="px-2 py-1 rounded-lg bg-[#b66dff] hover:bg-[#9a55ff] text-white text-[10px] font-bold transition-colors cursor-pointer"
                                  >
                                    +5
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setActiveTab('products');
                          setProductStockFilter('LOW_STOCK');
                        }}
                        className="w-full py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 text-center transition-colors cursor-pointer block"
                      >
                        Manage All Low Stock Products →
                      </button>
                    </div>

                    {/* Storefront Health */}
                    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs space-y-3">
                      <h4 className="font-bold text-gray-900 text-sm">Store Configuration</h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                          <span className="text-gray-600">Featured Products</span>
                          <span className="font-bold text-[#b66dff]">
                            {products.filter(p => p.isFeatured).length} items
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                          <span className="text-gray-600">KHQR Payment</span>
                          <span className="font-bold text-emerald-600">
                            {settings.payment_qr_image ? 'Configured' : 'Default QR'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                          <span className="text-gray-600">Telegram Bot</span>
                          <span className={`font-bold ${settings.telegram_chat_id ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {settings.telegram_chat_id ? 'Active' : 'Setup Required'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* 2. PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Top Title & Add Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-indigo-600" />
                    <span>Product Catalog & Inventory (គ្រប់គ្រងទំនិញ)</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Search, filter, adjust stock directly, and upload photos freely.
                  </p>
                </div>
                <button
                  onClick={openNewProductModal}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product (បន្ថែមទំនិញ)</span>
                </button>
              </div>

              {/* Quick Status Ribbon (Pill Filters) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button
                  onClick={() => {
                    setProductStockFilter('ALL');
                    setProductFeaturedFilter('ALL');
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    productStockFilter === 'ALL' && productFeaturedFilter === 'ALL'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold block opacity-80">All Products</span>
                  <span className="text-lg font-black block">{products.length}</span>
                </button>

                <button
                  onClick={() => setProductStockFilter(productStockFilter === 'IN_STOCK' ? 'ALL' : 'IN_STOCK')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    productStockFilter === 'IN_STOCK'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold block opacity-80">In Stock (&gt;5)</span>
                  <span className={`text-lg font-black block ${productStockFilter === 'IN_STOCK' ? 'text-white' : 'text-emerald-600'}`}>
                    {products.filter(p => (p.stock || 0) > 5).length}
                  </span>
                </button>

                <button
                  onClick={() => setProductStockFilter(productStockFilter === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    productStockFilter === 'LOW_STOCK'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold block opacity-80">Low Stock (1-5)</span>
                  <span className={`text-lg font-black block ${productStockFilter === 'LOW_STOCK' ? 'text-white' : 'text-amber-500'}`}>
                    {products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length}
                  </span>
                </button>

                <button
                  onClick={() => setProductStockFilter(productStockFilter === 'OUT_OF_STOCK' ? 'ALL' : 'OUT_OF_STOCK')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    productStockFilter === 'OUT_OF_STOCK'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold block opacity-80">Out of Stock (0)</span>
                  <span className={`text-lg font-black block ${productStockFilter === 'OUT_OF_STOCK' ? 'text-white' : 'text-rose-600'}`}>
                    {products.filter(p => (p.stock || 0) === 0).length}
                  </span>
                </button>

                <button
                  onClick={() => setProductFeaturedFilter(productFeaturedFilter === 'FEATURED' ? 'ALL' : 'FEATURED')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    productFeaturedFilter === 'FEATURED'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-[11px] font-semibold block opacity-80">Featured on Home</span>
                  <span className={`text-lg font-black block ${productFeaturedFilter === 'FEATURED' ? 'text-white' : 'text-purple-600'}`}>
                    {products.filter(p => p.isFeatured).length}
                  </span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Search Input (5 cols) */}
                  <div className="sm:col-span-5 relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search product (English / ខ្មែរ), ID, or category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all"
                    />
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter (3 cols) */}
                  <div className="sm:col-span-3">
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all font-medium text-gray-700 cursor-pointer"
                    >
                      <option value="ALL">All Categories (គ្រប់ប្រភេទ)</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.nameEn} ({c.nameKh})</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By (2 cols) */}
                  <div className="sm:col-span-2">
                    <select
                      value={productSortBy}
                      onChange={(e) => setProductSortBy(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all font-medium text-gray-700 cursor-pointer"
                    >
                      <option value="NEWEST">Newest First</option>
                      <option value="PRICE_ASC">Price: Low to High</option>
                      <option value="PRICE_DESC">Price: High to Low</option>
                      <option value="STOCK_ASC">Stock: Low to High</option>
                      <option value="STOCK_DESC">Stock: High to Low</option>
                      <option value="NAME_ASC">Name: A to Z</option>
                    </select>
                  </div>

                  {/* View Mode Switcher (2 cols) */}
                  <div className="sm:col-span-2 flex items-center justify-end gap-1.5">
                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                      <button
                        onClick={() => setProductViewMode('table')}
                        title="Table View"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          productViewMode === 'table'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProductViewMode('grid')}
                        title="Grid View"
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          productViewMode === 'grid'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Active Filter Indicators & Reset Button */}
                {(productSearch || productCategoryFilter !== 'ALL' || productStockFilter !== 'ALL' || productFeaturedFilter !== 'ALL') && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-400 font-medium">Active filters:</span>
                      {productSearch && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1">
                          Query: "{productSearch}"
                          <button onClick={() => setProductSearch('')} className="cursor-pointer"><X className="w-3 h-3" /></button>
                        </span>
                      )}
                      {productCategoryFilter !== 'ALL' && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1">
                          Category: {categories.find(c => c.id === productCategoryFilter)?.nameEn || productCategoryFilter}
                          <button onClick={() => setProductCategoryFilter('ALL')} className="cursor-pointer"><X className="w-3 h-3" /></button>
                        </span>
                      )}
                      {productStockFilter !== 'ALL' && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1">
                          Stock: {productStockFilter}
                          <button onClick={() => setProductStockFilter('ALL')} className="cursor-pointer"><X className="w-3 h-3" /></button>
                        </span>
                      )}
                      {productFeaturedFilter !== 'ALL' && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1">
                          Featured: {productFeaturedFilter}
                          <button onClick={() => setProductFeaturedFilter('ALL')} className="cursor-pointer"><X className="w-3 h-3" /></button>
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setProductSearch('');
                        setProductCategoryFilter('ALL');
                        setProductStockFilter('ALL');
                        setProductFeaturedFilter('ALL');
                      }}
                      className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline shrink-0 cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Products Count Indicator */}
              <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <span>
                  Showing <b className="text-gray-900">{filteredProducts.length}</b> of <b className="text-gray-900">{products.length}</b> products
                </span>
                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  Tip: Click Star icon to toggle Featured; use -1 / +5 for instant stock updates.
                </span>
              </div>

              {/* EMPTY STATE */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900">No products match your criteria</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Try searching with different keywords or clearing active category and stock filters.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setProductSearch('');
                      setProductCategoryFilter('ALL');
                      setProductStockFilter('ALL');
                      setProductFeaturedFilter('ALL');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : productViewMode === 'table' ? (
                /* TABLE VIEW */
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                      <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-[11px] border-b border-gray-100">
                        <tr>
                          <th className="p-4">Product Details</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Pricing</th>
                          <th className="p-4">Stock & Quick Adjust</th>
                          <th className="p-4">Featured</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((prod) => {
                          const img = Array.isArray(prod.images) ? prod.images[0] : '';
                          const imgCount = Array.isArray(prod.images) ? prod.images.length : 0;
                          const discount = prod.salePrice && prod.price > prod.salePrice
                            ? Math.round(((prod.price - prod.salePrice) / prod.price) * 100)
                            : 0;

                          return (
                            <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                              {/* Product Info */}
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative shrink-0">
                                    <img
                                      src={img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                                      alt=""
                                      className="w-14 h-14 rounded-xl object-cover bg-gray-100 border border-gray-200"
                                    />
                                    {imgCount > 1 && (
                                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                                        +{imgCount - 1}
                                      </span>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-bold text-gray-900 text-sm">{prod.nameEn}</span>
                                      <span className="text-[10px] text-gray-400 font-mono">#{prod.id}</span>
                                    </div>
                                    <span className="text-gray-500 block text-xs">{prod.nameKh}</span>
                                    <span className="text-[10px] text-gray-400">{imgCount} photos attached</span>
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td className="p-4">
                                <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-semibold text-[11px] inline-block">
                                  {prod.category?.nameEn || 'Uncategorized'}
                                </span>
                              </td>

                              {/* Price & Discount */}
                              <td className="p-4">
                                <div className="space-y-0.5">
                                  <span className={`font-bold text-sm ${prod.salePrice ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                    ${prod.price.toFixed(2)}
                                  </span>
                                  {prod.salePrice && (
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-rose-600 font-black text-sm">
                                        ${prod.salePrice.toFixed(2)}
                                      </span>
                                      {discount > 0 && (
                                        <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold text-[10px]">
                                          -{discount}%
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Stock & Quick Adjust */}
                              <td className="p-4">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 border ${
                                      (prod.stock || 0) === 0
                                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                                        : (prod.stock || 0) <= 5
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    }`}>
                                      {(prod.stock || 0) === 0
                                        ? 'Out of stock (0)'
                                        : `${prod.stock} units left`}
                                    </span>
                                  </div>
                                  {/* Fast stock adjustments */}
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleQuickStockAdjust(prod.id, -1)}
                                      disabled={(prod.stock || 0) <= 0}
                                      title="Decrease stock by 1"
                                      className="px-2 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-[10px] font-bold transition-colors cursor-pointer"
                                    >
                                      -1
                                    </button>
                                    <button
                                      onClick={() => handleQuickStockAdjust(prod.id, 5)}
                                      title="Restock +5 units"
                                      className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-colors cursor-pointer"
                                    >
                                      +5
                                    </button>
                                    <button
                                      onClick={() => handleQuickStockAdjust(prod.id, 20)}
                                      title="Restock +20 units"
                                      className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-colors cursor-pointer"
                                    >
                                      +20
                                    </button>
                                  </div>
                                </div>
                              </td>

                              {/* Featured Toggle */}
                              <td className="p-4">
                                <button
                                  onClick={() => handleToggleFeatured(prod.id, prod.isFeatured)}
                                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                    prod.isFeatured
                                      ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-2xs'
                                      : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
                                  }`}
                                  title={prod.isFeatured ? 'Featured on Homepage (Click to remove)' : 'Standard (Click to feature)'}
                                >
                                  <Star className={`w-3.5 h-3.5 ${prod.isFeatured ? 'fill-amber-400 text-amber-500' : ''}`} />
                                  <span>{prod.isFeatured ? 'Featured' : 'Standard'}</span>
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="p-4 text-right space-x-1.5">
                                <button
                                  onClick={() => openEditProductModal(prod)}
                                  className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors inline-block cursor-pointer"
                                  title="Edit Product & Photos"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors inline-block cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* GRID VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((prod) => {
                    const img = Array.isArray(prod.images) ? prod.images[0] : '';
                    const imgCount = Array.isArray(prod.images) ? prod.images.length : 0;
                    const discount = prod.salePrice && prod.price > prod.salePrice
                      ? Math.round(((prod.price - prod.salePrice) / prod.price) * 100)
                      : 0;

                    return (
                      <div key={prod.id} className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden flex flex-col justify-between group">
                        <div>
                          {/* Image Container */}
                          <div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
                            <img
                              src={img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1">
                              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                                {prod.category?.nameEn || 'General'}
                              </span>
                              {discount > 0 && (
                                <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold">
                                  -{discount}% OFF
                                </span>
                              )}
                            </div>
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggleFeatured(prod.id, prod.isFeatured)}
                                className={`p-2 rounded-xl backdrop-blur-xs transition-colors cursor-pointer ${
                                  prod.isFeatured
                                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                                    : 'bg-black/40 text-white hover:bg-black/60'
                                }`}
                                title="Toggle Featured"
                              >
                                <Star className={`w-3.5 h-3.5 ${prod.isFeatured ? 'fill-amber-950' : ''}`} />
                              </button>
                            </div>
                            {imgCount > 1 && (
                              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                                {imgCount} photos
                              </span>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-bold text-sm text-gray-900">{prod.nameEn}</h4>
                                <span className="text-xs text-gray-500 block">{prod.nameKh}</span>
                              </div>
                              <span className="text-[10px] font-mono text-gray-400">#{prod.id}</span>
                            </div>

                            <div className="flex items-baseline gap-2">
                              <span className="font-black text-base text-gray-900">
                                ${prod.salePrice ? prod.salePrice.toFixed(2) : prod.price.toFixed(2)}
                              </span>
                              {prod.salePrice && (
                                <span className="text-xs text-gray-400 line-through">
                                  ${prod.price.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                (prod.stock || 0) === 0
                                  ? 'bg-rose-100 text-rose-700'
                                  : (prod.stock || 0) <= 5
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}>
                                {prod.stock || 0} units left
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleQuickStockAdjust(prod.id, -1)}
                                  disabled={(prod.stock || 0) <= 0}
                                  className="px-1.5 py-0.5 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 text-[10px] font-bold cursor-pointer"
                                >
                                  -1
                                </button>
                                <button
                                  onClick={() => handleQuickStockAdjust(prod.id, 5)}
                                  className="px-1.5 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold cursor-pointer"
                                >
                                  +5
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-4 pt-0 flex gap-2">
                          <button
                            onClick={() => openEditProductModal(prod)}
                            className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    <span>Store Categories (គ្រប់គ្រងប្រភេទ)</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Organize catalog categories and upload custom cover images.
                  </p>
                </div>
                <button
                  onClick={openNewCategoryModal}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category (បន្ថែមប្រភេទ)</span>
                </button>
              </div>

              {/* Search Bar & Category Count */}
              <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search category name (EN / KH)..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200 text-xs bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all"
                  />
                  {categorySearch && (
                    <button
                      onClick={() => setCategorySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  Showing <b className="text-gray-900">{filteredCategories.length}</b> of <b className="text-gray-900">{categories.length}</b> categories
                </div>
              </div>

              {/* Grid of Categories */}
              {filteredCategories.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-3">
                  <Layers className="w-8 h-8 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-500">No categories found matching "{categorySearch}".</p>
                  <button
                    onClick={() => setCategorySearch('')}
                    className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCategories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between gap-4 group hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={cat.image || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200'}
                            alt=""
                            className="w-16 h-16 rounded-2xl object-cover bg-gray-100 border border-gray-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-sm text-gray-900 truncate">{cat.nameEn}</h4>
                            <span className="text-xs text-gray-500 block truncate">{cat.nameKh}</span>
                            <span className="text-[10px] text-gray-400 font-mono">slug: {cat.slug || cat.nameEn?.toLowerCase()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => openEditCategoryModal(cat)}
                            className="p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="Edit Category & Cover Photo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700">
                          {cat._count?.products || products.filter(p => p.categoryId === cat.id).length} products
                        </span>
                        <button
                          onClick={() => {
                            setProductCategoryFilter(cat.id);
                            setActiveTab('products');
                          }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Filter Products</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Header & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-indigo-600" />
                    <span>Customer Orders ({orders.length})</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    គ្រប់គ្រងការកុម្ម៉ង់, ឆែកវិក្កយបត្រ KHQR, ផ្លាស់ប្តូរស្ថានភាព, និងទាញយករបាយការណ៍
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ស្វែងរកតាម ID, ឈ្មោះ, លេខទូរស័ព្ទ..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                    {orderSearch && (
                      <button
                        type="button"
                        onClick={() => setOrderSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Export CSV */}
                  <button
                    type="button"
                    onClick={exportOrdersToCSV}
                    className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
                    title="ទាញយកទិន្នន័យជាឯកសារ Excel / CSV"
                  >
                    <Download className="w-4 h-4" />
                    <span>ទាញយក CSV</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'ALL', label: 'ទាំងអស់ (ALL)', count: orders.length },
                  { id: 'PENDING', label: 'រង់ចាំ (Pending)', count: orders.filter(o => o.status === 'PENDING').length },
                  { id: 'CONFIRMED', label: 'បានបញ្ជាក់ (Confirmed)', count: orders.filter(o => o.status === 'CONFIRMED').length },
                  { id: 'SHIPPED', label: 'កំពុងដឹក (Shipped)', count: orders.filter(o => o.status === 'SHIPPED').length },
                  { id: 'DELIVERED', label: 'បានទទួល (Delivered)', count: orders.filter(o => o.status === 'DELIVERED').length },
                  { id: 'CANCELLED', label: 'បានបោះបង់ (Cancelled)', count: orders.filter(o => o.status === 'CANCELLED').length },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderFilterStatus(st.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      orderFilterStatus === st.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      orderFilterStatus === st.id ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
                      <tr>
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Address</th>
                        <th className="p-4">Items</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="p-12 text-center text-gray-400">
                            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            <p className="font-semibold">គ្មានការកុម្ម៉ង់ត្រូវបានរកឃើញទេ (No orders found)</p>
                            {orderSearch && (
                              <p className="text-[11px] mt-1 text-gray-400">
                                គ្មានលទ្ធផលត្រូវគ្នានឹង "{orderSearch}" ឡើយ
                              </p>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50">
                            <td className="p-4">
                              <span className="font-mono font-bold text-indigo-600 block">
                                {order.orderNumber}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-gray-900 block">{order.customerName}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <a
                                  href={`tel:${order.customerPhone}`}
                                  className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{order.customerPhone}</span>
                                </a>
                                {order.customerTelegram && (
                                  <a
                                    href={`https://t.me/${order.customerTelegram.replace(/^@/, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sky-600 hover:text-sky-700 inline-flex items-center gap-0.5"
                                    title={`Telegram: ${order.customerTelegram}`}
                                  >
                                    <Send className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </td>
                            <td className="p-4 max-w-xs truncate" title={`${order.cityProvince}, ${order.address}`}>
                              <span className="font-medium text-gray-800">{order.cityProvince}</span>
                              <span className="text-gray-400 block truncate">{order.address}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-semibold text-gray-800">{order.items?.length || 0} items</span>
                            </td>
                            <td className="p-4 font-bold text-gray-900">
                              ${Number(order.totalAmount).toFixed(2)}
                            </td>
                            <td className="p-4">
                              <span className="uppercase text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                                {order.paymentMethod}
                              </span>
                              {order.paymentProof && (
                                <span className="block mt-1 text-[10px] font-semibold text-rose-600">
                                  + Receipt
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`text-xs font-bold rounded-lg border p-1.5 cursor-pointer ${
                                  order.status === 'DELIVERED'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : order.status === 'SHIPPED'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : order.status === 'CONFIRMED'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : order.status === 'CANCELLED'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                <option value="PENDING">PENDING</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="SHIPPED">SHIPPED</option>
                                <option value="DELIVERED">DELIVERED</option>
                                <option value="CANCELLED">CANCELLED</option>
                              </select>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setOrderDetailModal(order)}
                                  className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                  title="View Order Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePrintInvoice(order)}
                                  className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                                  title="Print Delivery Slip / Invoice"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. FULL STORE MANAGEMENT & SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-5xl space-y-6">
              
              {/* Settings Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                <div>
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5 text-indigo-600" />
                    <span>Store Customization & System Control (គ្រប់គ្រងនិងកំណត់ហាង)</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    គ្រប់គ្រង Hero Slides, Flash Sale, ស្ថិតិហាង, មតិអតិថិជន, ព័ត៌មានហាង, KHQR និង Telegram Bot បានទាំងអស់
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSettingsSave}
                  disabled={savingSettings}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving...' : 'Save All Settings'}</span>
                </button>
              </div>

              {/* Sub-navigation pill buttons */}
              <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-xs">
                {[
                  { id: 'admin_profile', label: 'Admin Profile (គណនី Admin)', icon: Users },
                  { id: 'hero', label: 'Hero Slides & Banners', icon: ImageIcon, count: getHeroSlides().length },
                  { id: 'flash_stats', label: 'Flash Sale & Store Stats', icon: Flame },
                  { id: 'reviews_community', label: 'Customer Reviews & VIP Community', icon: Star, count: getTestimonials().length },
                  { id: 'store_payment', label: 'Store Identity & KHQR Payment', icon: Store },
                  { id: 'telegram', label: 'Telegram Chat & Bot', icon: Send },
                ].map((sub) => {
                  const active = settingsSubTab === sub.id;
                  const Icon = sub.icon;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        setSettingsSubTab(sub.id);
                        if (sub.id === 'admin_profile') {
                          setAdminProfileForm({
                            name: settings.admin_name || 'David Greymaax',
                            role: settings.admin_role || 'Store Administrator',
                            avatar: settings.admin_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                            avatarUrlInput: '',
                          });
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-transparent hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sub.label}</span>
                      {sub.count !== undefined && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                          active ? 'bg-indigo-700 text-white' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {sub.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* ======================================================== */}
              {/* SUB-TAB 0: ADMIN PROFILE (PHOTO & NAME)                  */}
              {/* ======================================================== */}
              {settingsSubTab === 'admin_profile' && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#b66dff]" />
                      <span>Admin Account Profile (កែប្រែរូបភាព និងឈ្មោះ Admin)</span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      ផ្លាស់ប្តូររូបថត Profile, ឈ្មោះ និងតួនាទីរបស់អ្នកគ្រប់គ្រងដែលបង្ហាញលើរបារ Header និង Sidebar។
                    </p>
                  </div>

                  <form onSubmit={handleSaveAdminProfile} className="space-y-6 max-w-xl">
                    {/* Avatar Preview & Upload */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="relative shrink-0">
                        <img
                          src={adminProfileForm.avatar || settings.admin_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt="Avatar Preview"
                          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-800 block">Admin Profile Picture (រូបថតផ្ទាល់ខ្លួន)</span>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className={`px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#da8cff] to-[#9a55ff] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs ${uploadingAdminAvatar ? 'opacity-60 pointer-events-none' : ''}`}>
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingAdminAvatar ? 'Uploading...' : 'Upload Image (ផ្ទុករូបពីម៉ាស៊ីន)'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) handleAdminAvatarUpload(e.target.files[0]);
                              }}
                            />
                          </label>
                        </div>
                        <span className="text-[11px] text-gray-400 block">Recommended: Square image (JPG, PNG, WebP)</span>
                      </div>
                    </div>

                    {/* Or Paste Avatar URL */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Or Image URL (ឬបិទភ្ជាប់តំណរូបភាព)
                      </label>
                      <input
                        type="url"
                        placeholder="https://example.com/avatar.jpg"
                        value={adminProfileForm.avatarUrlInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          setAdminProfileForm(prev => ({
                            ...prev,
                            avatarUrlInput: val,
                            avatar: val.trim() || prev.avatar,
                          }));
                        }}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#b66dff] focus:ring-2 focus:ring-purple-100 outline-hidden"
                      />
                    </div>

                    {/* Admin Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Admin Name (ឈ្មោះ Admin) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Heang, David Greymaax, Admin..."
                        value={adminProfileForm.name}
                        onChange={(e) => setAdminProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#b66dff] focus:ring-2 focus:ring-purple-100 outline-hidden font-medium"
                      />
                    </div>

                    {/* Admin Role / Subtitle */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Role / Title (តួនាទីសម្គាល់)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Store Administrator, Shop Owner, Manager..."
                        value={adminProfileForm.role}
                        onChange={(e) => setAdminProfileForm(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#b66dff] focus:ring-2 focus:ring-purple-100 outline-hidden"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#da8cff] to-[#9a55ff] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Admin Profile (រក្សាទុកព័ត៌មាន)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-TAB 1: HERO BANNER SLIDER & PROMO BANNER             */}
              {/* ======================================================== */}
              {settingsSubTab === 'hero' && (
                <div className="space-y-6">
                  
                  {/* Hero Banner Slideshow Manager */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-base">
                            Hero Banner Slideshow (ផ្ទាំងស្លាយធំខាងលើគេហទំព័រ)
                          </h3>
                          <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                            {getHeroSlides().length} Slides Active
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          ដាក់រូបបានច្រើនសន្លឹក រត់ស្លាយស្វ័យប្រវត្តរៀងរាល់ 5 វិនាទី (Auto-rotation) និងអាចកែប្រែចំណងជើង អក្សរពណ៌ លីង បានគ្រប់ស្លាយទាំងអស់។
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={openAddSlideModal}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Slide</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetHeroSlides}
                          className="px-3 py-2 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Reset Defaults
                        </button>
                      </div>
                    </div>

                    {/* Fast Upload & URL Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <label className="cursor-pointer py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0">
                        <Upload className="w-4 h-4" />
                        <span>
                          {uploadingMediaKey === 'hero_banners' 
                            ? 'Uploading Photos...' 
                            : 'Upload Photos From PC (ជ្រើសរូបច្រើន)'}
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleHeroBannersUpload(e.target.files)}
                        />
                      </label>

                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Or paste banner image URL (https://...)"
                          value={heroSlideUrlInput}
                          onChange={(e) => setHeroSlideUrlInput(e.target.value)}
                          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:border-indigo-600 outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddHeroSlideUrl(heroSlideUrlInput)}
                          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                        >
                          Add Slide
                        </button>
                      </div>
                    </div>

                    {/* Slides Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {getHeroSlides().map((slide, sIdx) => (
                        <div 
                          key={sIdx} 
                          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs flex flex-col justify-between h-full"
                        >
                          {/* Slide Image Preview */}
                          <div className="relative aspect-16/9 bg-gray-100 border-b border-gray-100 overflow-hidden group shrink-0">
                            <img 
                              src={slide.image} 
                              alt={`Slide ${sIdx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                              <span className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
                                #{sIdx + 1}
                              </span>
                              {slide.badgeKm && (
                                <span className="bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md truncate max-w-[140px]">
                                  {slide.badgeKm}
                                </span>
                              )}
                            </div>
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-lg text-white">
                              <button
                                type="button"
                                onClick={() => handleMoveHeroSlide(sIdx, -1)}
                                disabled={sIdx === 0}
                                className="p-1 hover:bg-white/20 rounded-md disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveHeroSlide(sIdx, 1)}
                                disabled={sIdx === getHeroSlides().length - 1}
                                className="p-1 hover:bg-white/20 rounded-md disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Slide Details Preview */}
                          <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                                <span className="font-semibold text-gray-500">Tab Label:</span>
                                <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md text-[11px] truncate max-w-[150px]">
                                  {slide.tabKm || `ស្លាយទី ${sIdx + 1}`}
                                </span>
                              </div>

                              <div className="space-y-0.5 mb-1.5">
                                <div className="text-xs font-bold text-gray-900 leading-snug line-clamp-1">
                                  {slide.titleKm || 'No Khmer Title'}
                                  {slide.highlightKm && <span className="text-indigo-600 ml-1">[{slide.highlightKm}]</span>}
                                </div>
                                <div className="text-[11px] font-medium text-gray-500 leading-snug line-clamp-1">
                                  {slide.titleEn || 'No English Title'}
                                  {slide.highlightEn && <span className="text-indigo-500 ml-1">[{slide.highlightEn}]</span>}
                                </div>
                              </div>

                              <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed min-h-[32px]">
                                {slide.subtitleKm || 'No description provided.'}
                              </p>
                            </div>

                            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                              <span className="truncate max-w-[130px]">Link: <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-mono">{slide.link || '/shop'}</code></span>
                              <span className="truncate max-w-[120px]">Btn: <b>{slide.buttonTextKm || 'ទិញឥឡូវនេះ'}</b></span>
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => openEditSlideModal(sIdx)}
                              className="flex-1 py-1.5 px-3 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Edit Slide Details</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveHeroSlide(sIdx)}
                              className="p-2 bg-white hover:bg-rose-50 border border-gray-200 hover:border-rose-200 rounded-xl text-rose-600 transition-colors cursor-pointer"
                              title="Delete Slide"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Promo Banner Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          Middle Promo Banner (ផ្ទាំងផ្សព្វផ្សាយកណ្តាលទំព័រ)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ផ្ទាំងផ្សព្វផ្សាយបញ្ចុះតម្លៃធំនៅកណ្តាល HomePage (រូបភាព, ចំណងជើង, និងប៊ូតុងចុច)
                        </p>
                      </div>
                      {settings.promo_banner_image && (
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsState(s => ({ ...s, promo_banner_image: '' }));
                            updateSettings({ promo_banner_image: '' });
                          }}
                          className="text-xs text-rose-500 hover:underline cursor-pointer"
                        >
                          Reset Image
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="aspect-16/9 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                          {settings.promo_banner_image ? (
                            <img src={settings.promo_banner_image} alt="Promo Banner" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs gap-1.5 p-4 text-center">
                              <ImageIcon className="w-8 h-8 text-gray-300" />
                              <span className="font-semibold text-gray-600">Default Gradient Banner Active</span>
                              <span className="text-[10px] text-gray-400">អ្នកអាច Upload រូបភាពផ្ទាល់ខ្លួនដើម្បីជំនួស</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <label className="flex-1 cursor-pointer py-2.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{uploadingMediaKey === 'promo_banner_image' ? 'Uploading...' : 'Upload Banner Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleMediaUpload('promo_banner_image', e.target.files?.[0])}
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="Or paste image URL..."
                          value={settings.promo_banner_image || ''}
                          onChange={(e) => setSettingsState({ ...settings, promo_banner_image: e.target.value })}
                          className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200"
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Promo Title (Khmer)</label>
                          <input
                            type="text"
                            placeholder="e.g. បញ្ចុះតម្លៃពិសេសរហូតដល់ ២៥%"
                            value={settings.promo_title_km || ''}
                            onChange={(e) => setSettingsState({ ...settings, promo_title_km: e.target.value })}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Promo Title (English)</label>
                          <input
                            type="text"
                            placeholder="e.g. Get Up To 25% Off On Selected Products"
                            value={settings.promo_title_en || ''}
                            onChange={(e) => setSettingsState({ ...settings, promo_title_en: e.target.value })}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Promo Subtitle (Khmer)</label>
                          <input
                            type="text"
                            placeholder="e.g. កុម្ម៉ង់ឥឡូវនេះដើម្បីទទួលបានការដឹកជញ្ជូនរហ័ស..."
                            value={settings.promo_subtitle_km || ''}
                            onChange={(e) => setSettingsState({ ...settings, promo_subtitle_km: e.target.value })}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Target Link URL</label>
                          <input
                            type="text"
                            placeholder="e.g. /shop or /shop?category=clothing"
                            value={settings.promo_link || ''}
                            onChange={(e) => setSettingsState({ ...settings, promo_link: e.target.value })}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden font-mono"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => handleSavePartialSettings([
                              'promo_banner_image',
                              'promo_title_km',
                              'promo_title_en',
                              'promo_subtitle_km',
                              'promo_subtitle_en',
                              'promo_link'
                            ], 'Promo Banner saved successfully!')}
                            disabled={savingSettings}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            Save Promo Banner (រក្សាទុក Promo Banner)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-TAB 2: FLASH SALE & STORE STATS                      */}
              {/* ======================================================== */}
              {settingsSubTab === 'flash_stats' && (
                <div className="space-y-6">
                  
                  {/* Flash Sale Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                          <Flame className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">
                            Flash Sale Deals (ការលក់បញ្ចុះតម្លៃពិសេសប្រចាំថ្ងៃ)
                          </h3>
                          <p className="text-xs text-gray-500">
                            បើក/បិទ Flash Sale, កែសម្រួលចំណងជើង និងកំណត់ម៉ោងរាប់ថយក្រោយ (Countdown Hours & Minutes)
                          </p>
                        </div>
                      </div>

                      {/* Enable / Disable Switch */}
                      <label className="flex items-center gap-2 cursor-pointer select-none bg-gray-50 px-3 py-2 rounded-2xl border border-gray-200">
                        <input
                          type="checkbox"
                          checked={settings.flash_sale_enabled !== 'false'}
                          onChange={(e) => setSettingsState({
                            ...settings,
                            flash_sale_enabled: e.target.checked ? 'true' : 'false'
                          })}
                          className="w-4 h-4 text-indigo-600 rounded-md"
                        />
                        <span className={`text-xs font-bold ${
                          settings.flash_sale_enabled !== 'false' ? 'text-emerald-600' : 'text-gray-400'
                        }`}>
                          {settings.flash_sale_enabled !== 'false' ? 'Active (បង្ហាញ)' : 'Hidden (លាក់)'}
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Flash Sale Title (Khmer)</label>
                        <input
                          type="text"
                          placeholder="e.g. ការលក់បញ្ចុះតម្លៃពិសេសប្រចាំថ្ងៃ"
                          value={settings.flash_sale_title_km || ''}
                          onChange={(e) => setSettingsState({ ...settings, flash_sale_title_km: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Flash Sale Title (English)</label>
                        <input
                          type="text"
                          placeholder="e.g. Today's Limited Flash Deals"
                          value={settings.flash_sale_title_en || ''}
                          onChange={(e) => setSettingsState({ ...settings, flash_sale_title_en: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Flash Sale Subtitle (Khmer)</label>
                        <input
                          type="text"
                          placeholder="e.g. បញ្ចុះតម្លៃពិសេសមានកំណត់! កុម្ម៉ង់ឱ្យទាន់ពេលមុនទំនិញលក់អស់"
                          value={settings.flash_sale_subtitle_km || ''}
                          onChange={(e) => setSettingsState({ ...settings, flash_sale_subtitle_km: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Flash Sale Subtitle (English)</label>
                        <input
                          type="text"
                          placeholder="e.g. Hurry! Limited stock at special promotional prices"
                          value={settings.flash_sale_subtitle_en || ''}
                          onChange={(e) => setSettingsState({ ...settings, flash_sale_subtitle_en: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>

                      {/* Countdown Duration */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Countdown Hours (ម៉ោងរាប់ថយក្រោយ)</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="72"
                          value={settings.flash_sale_hours || '8'}
                          onChange={(e) => setSettingsState({ ...settings, flash_sale_hours: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Countdown Minutes (នាទី)</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={settings.flash_sale_minutes || '34'}
                          onChange={(e) => setSettingsState({ ...settings, flash_sale_minutes: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleSavePartialSettings([
                          'flash_sale_enabled',
                          'flash_sale_title_km',
                          'flash_sale_title_en',
                          'flash_sale_subtitle_km',
                          'flash_sale_subtitle_en',
                          'flash_sale_hours',
                          'flash_sale_minutes'
                        ], 'Flash Sale settings saved!')}
                        disabled={savingSettings}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Save Flash Sale Settings (រក្សាទុក Flash Sale)
                      </button>
                    </div>
                  </div>

                  {/* Store Stats (4 Cards) Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                          <span>Store Stats & Trust Badges (កាតទំនុកចិត្តទាំង ៤ លើគេហទំព័រ)</span>
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          កាតស្ថិតិ 15,000+ អតិថិជន, 100% ធានា, 45 Mins ដឹកជញ្ជូន, និង 24/7 Telegram Alert
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetStoreStats}
                        className="text-xs text-rose-500 hover:underline font-semibold cursor-pointer"
                      >
                        Reset Defaults (កំណត់ឡើងវិញ)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getStoreStats().map((stat, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-indigo-700 uppercase tracking-wider">
                              Card #{idx + 1}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <span>Icon:</span>
                              <select
                                value={stat.icon || 'users'}
                                onChange={(e) => handleStoreStatChange(idx, 'icon', e.target.value)}
                                className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-xs font-semibold"
                              >
                                <option value="users">Users (អតិថិជន)</option>
                                <option value="shield">Shield (ធានាគុណភាព)</option>
                                <option value="truck">Truck (ដឹកជញ្ជូន)</option>
                                <option value="send">Send (Telegram)</option>
                                <option value="star">Star (ផ្កាយ)</option>
                                <option value="zap">Zap (រហ័ស)</option>
                                <option value="clock">Clock (ពេលវេលា)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Display Value (ឧទាហរណ៍: 15,000+, 100%, 45 Mins, 24/7)
                            </label>
                            <input
                              type="text"
                              value={stat.value || ''}
                              onChange={(e) => handleStoreStatChange(idx, 'value', e.target.value)}
                              className="w-full text-xs font-bold px-3 py-2 rounded-xl border border-gray-300 bg-white focus:border-indigo-600 outline-hidden"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Label (Khmer)</label>
                              <input
                                type="text"
                                value={stat.labelKm || ''}
                                onChange={(e) => handleStoreStatChange(idx, 'labelKm', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 bg-white focus:border-indigo-600 outline-hidden"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-gray-600 mb-1">Label (English)</label>
                              <input
                                type="text"
                                value={stat.labelEn || ''}
                                onChange={(e) => handleStoreStatChange(idx, 'labelEn', e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 bg-white focus:border-indigo-600 outline-hidden"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleSaveStoreStats}
                        disabled={savingSettings}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Save Store Stats (រក្សាទុកកាតស្ថិតិ)
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-TAB 3: CUSTOMER REVIEWS & VIP TELEGRAM COMMUNITY     */}
              {/* ======================================================== */}
              {settingsSubTab === 'reviews_community' && (
                <div className="space-y-6">
                  
                  {/* Testimonials Manager Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-base">
                            Customer Reviews & Testimonials (មតិយោបល់អតិថិជនពិត)
                          </h3>
                          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                            {getTestimonials().length} Reviews
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          បន្ថែម កែប្រែ ឬលុបមតិយោបល់អតិថិជន រូបថត Avatar និងពិន្ទុផ្កាយ 1-5
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={openAddTestimonial}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Review</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetTestimonials}
                          className="px-3 py-2 bg-gray-100 hover:bg-rose-50 text-gray-600 hover:text-rose-600 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Reset Defaults
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getTestimonials().map((rev, rIdx) => (
                        <div key={rIdx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face'}
                                alt={rev.nameEn || 'Customer'}
                                className="w-10 h-10 rounded-full object-cover border border-white shadow-2xs"
                              />
                              <div>
                                <h4 className="font-bold text-xs text-gray-900 leading-tight">
                                  {rev.nameKm || rev.nameEn}
                                </h4>
                                <span className="text-[10px] text-gray-500 block">
                                  {rev.locationKm || rev.locationEn}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-0.5 text-amber-400">
                              {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>

                            <p className="text-[11px] text-gray-600 line-clamp-3 leading-relaxed">
                              "{rev.commentKm || rev.commentEn}"
                            </p>
                          </div>

                          <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => openEditTestimonial(rIdx)}
                              className="flex-1 py-1.5 px-2.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3 text-indigo-600" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTestimonial(rIdx)}
                              className="p-1.5 bg-white hover:bg-rose-50 border border-gray-300 hover:border-rose-200 text-rose-600 rounded-xl transition-colors cursor-pointer"
                              title="Delete review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* VIP Telegram Community Banner */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                        <Send className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          VIP Telegram Community Banner (ផ្ទាំងសហគមន៍ Telegram VIP)
                        </h3>
                        <p className="text-xs text-gray-500">
                          បដាអញ្ជើញអតិថិជនចូលរួម Telegram Channel ឬ Group ផ្លូវការរបស់ហាង
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Title (Khmer)</label>
                        <input
                          type="text"
                          placeholder="e.g. ចូលរួម Telegram Channel ផ្លូវការ"
                          value={settings.community_title_km || ''}
                          onChange={(e) => setSettingsState({ ...settings, community_title_km: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Title (English)</label>
                        <input
                          type="text"
                          placeholder="e.g. Join Our Official Telegram Community"
                          value={settings.community_title_en || ''}
                          onChange={(e) => setSettingsState({ ...settings, community_title_en: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Subtitle (Khmer)</label>
                        <input
                          type="text"
                          placeholder="e.g. ទទួលបានព័ត៌មានទំនិញថ្មីៗ គូប៉ុងបញ្ចុះតម្លៃពិសេស..."
                          value={settings.community_subtitle_km || ''}
                          onChange={(e) => setSettingsState({ ...settings, community_subtitle_km: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Banner Subtitle (English)</label>
                        <input
                          type="text"
                          placeholder="e.g. Get early access to flash sales, exclusive discount vouchers..."
                          value={settings.community_subtitle_en || ''}
                          onChange={(e) => setSettingsState({ ...settings, community_subtitle_en: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Button Text (Khmer)</label>
                        <input
                          type="text"
                          placeholder="e.g. ចូលរួមឥឡូវនេះ (Free)"
                          value={settings.community_button_km || ''}
                          onChange={(e) => setSettingsState({ ...settings, community_button_km: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Telegram Channel / Invite Link</label>
                        <input
                          type="text"
                          placeholder="e.g. https://t.me/ShoplyStore"
                          value={settings.community_link || ''}
                          onChange={(e) => setSettingsState({ ...settings, community_link: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleSavePartialSettings([
                          'community_title_km',
                          'community_title_en',
                          'community_subtitle_km',
                          'community_subtitle_en',
                          'community_button_km',
                          'community_link'
                        ], 'VIP Telegram Banner saved!')}
                        disabled={savingSettings}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Save Community Banner (រក្សាទុកបដា Telegram)
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ======================================================== */}
              {/* SUB-TAB 4: STORE IDENTITY & BAKONG KHQR PAYMENT          */}
              {/* ======================================================== */}
              {settingsSubTab === 'store_payment' && (
                <div className="space-y-6">
                  
                  {/* Store Identity & Contact Form */}
                  <form onSubmit={handleSettingsSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          Store Identity & Brand Information (ព័ត៌មាននិងអត្តសញ្ញាណហាង)
                        </h3>
                        <p className="text-xs text-gray-500">
                          ឈ្មោះហាង, ឡូហ្គោ, លេខទូរស័ព្ទជំនួយ, ទីតាំង, ថ្លៃដឹកជញ្ជូន, និងសារផ្សាយដំណឹងខាងលើ
                        </p>
                      </div>
                    </div>

                    {/* Store Logo Section */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 p-2 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                        {settings.store_logo ? (
                          <img src={settings.store_logo} alt="Store Logo" className="w-full h-full object-contain" />
                        ) : (
                          <Store className="w-8 h-8 text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <span className="font-bold text-xs text-gray-900 block">Store Logo (ឡូហ្គោហាង)</span>
                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                          <label className="cursor-pointer py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs">
                            <Upload className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{uploadingMediaKey === 'store_logo' ? 'Uploading...' : 'Upload Logo From PC'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleMediaUpload('store_logo', e.target.files?.[0])}
                            />
                          </label>
                          {settings.store_logo && (
                            <button
                              type="button"
                              onClick={() => {
                                setSettingsState(s => ({ ...s, store_logo: '' }));
                                updateSettings({ store_logo: '' });
                              }}
                              className="text-xs text-rose-500 hover:underline px-2 py-1"
                            >
                              Reset Logo
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Or paste logo image URL..."
                          value={settings.store_logo || ''}
                          onChange={(e) => setSettingsState({ ...settings, store_logo: e.target.value })}
                          className="w-full text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Store Name (ឈ្មោះហាង)</label>
                        <input
                          type="text"
                          value={settings.store_name || ''}
                          onChange={(e) => setSettingsState({ ...settings, store_name: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Support Phone (លេខទូរស័ព្ទ)</label>
                        <input
                          type="text"
                          value={settings.phone_number || ''}
                          onChange={(e) => setSettingsState({ ...settings, phone_number: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Store Location / City (ទីតាំង)</label>
                        <input
                          type="text"
                          placeholder="e.g. Phnom Penh, Cambodia"
                          value={settings.store_address || ''}
                          onChange={(e) => setSettingsState({ ...settings, store_address: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Telegram Support Chat Link / Username (តំណភ្ជាប់ឆាត Telegram)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. https://t.me/ShoplySupport ឬ @ShoplySupport"
                          value={settings.telegram_handle || settings.telegram_link || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSettingsState({ ...settings, telegram_handle: val, telegram_link: val });
                          }}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden font-mono"
                        />
                        <span className="text-[11px] text-gray-400 block mt-1">
                          កំណត់ Link សម្រាប់ប៊ូតុងអណ្តែតទឹក "ឆាត Telegram" លើ Storefront
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Standard Delivery Fee ($)</label>
                        <input
                          type="number"
                          step="0.25"
                          placeholder="1.50"
                          value={settings.delivery_fee || '1.50'}
                          onChange={(e) => setSettingsState({ ...settings, delivery_fee: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Top Bar Announcement (Khmer)</label>
                        <input
                          type="text"
                          placeholder="e.g. ដឹកជញ្ជូនរហ័ស 25 ខេត្ត/ក្រុង • បញ្ចុះតម្លៃពិសេស"
                          value={settings.announcement_km || ''}
                          onChange={(e) => setSettingsState({ ...settings, announcement_km: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Official Bakong KHQR Payment Box */}
                    <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-5 h-5 text-rose-600" />
                          <span className="font-bold text-xs text-rose-900 uppercase tracking-wider">
                            Official Bakong KHQR Payment (ការទូទាត់ប្រាក់ KHQR)
                          </span>
                        </div>
                        {settings.khqr_image && (
                          <button
                            type="button"
                            onClick={() => {
                              setSettingsState(s => ({ ...s, khqr_image: '' }));
                              updateSettings({ khqr_image: '' });
                            }}
                            className="text-xs text-rose-600 hover:underline cursor-pointer"
                          >
                            Reset QR
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                        <div className="aspect-square max-h-36 mx-auto rounded-xl overflow-hidden bg-white border border-rose-200 p-2 flex items-center justify-center shadow-xs">
                          {settings.khqr_image ? (
                            <img src={settings.khqr_image} alt="Bakong KHQR" className="w-full h-full object-contain" />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-rose-400 text-xs gap-1 text-center p-2">
                              <QrCode className="w-8 h-8" />
                              <span className="text-[10px] text-gray-500">Auto generated QR used</span>
                            </div>
                          )}
                        </div>

                        <div className="sm:col-span-2 space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">KHQR Account Name</label>
                            <input
                              type="text"
                              placeholder="e.g. SHOPLY STORE (ABA BANK)"
                              value={settings.khqr_name || ''}
                              onChange={(e) => setSettingsState({ ...settings, khqr_name: e.target.value })}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 bg-white focus:border-indigo-600 outline-hidden font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">KHQR / ABA Account Number</label>
                            <input
                              type="text"
                              placeholder="e.g. 001 568 992"
                              value={settings.khqr_account || ''}
                              onChange={(e) => setSettingsState({ ...settings, khqr_account: e.target.value })}
                              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-300 bg-white focus:border-indigo-600 outline-hidden font-mono font-bold"
                            />
                          </div>

                          <label className="cursor-pointer py-2 px-3 bg-white border border-rose-300 hover:bg-rose-100 rounded-xl text-xs font-bold text-rose-700 flex items-center justify-center gap-1.5 shadow-2xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploadingMediaKey === 'khqr_image' ? 'Uploading...' : 'Upload Actual Bank KHQR Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleMediaUpload('khqr_image', e.target.files?.[0])}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* ======================================================== */}
                    {/* KHQRPay (Auto ABA KHQR) Gateway Integration Card         */}
                    {/* ======================================================== */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-100/80">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-gray-900">
                              KHQRPay Automatic Payment (ប្រព័ន្ធទូទាត់ស្វ័យប្រវត្តិតាម ABA Bank / KHQR)
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              តភ្ជាប់ជាមួយសេវាកម្ម KHQRPay (khqr.cc) ដើម្បីបង្កើត Dynamic KHQR និងផ្ទៀងផ្ទាត់ការទូទាត់ដោយស្វ័យប្រវត្តិ
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            settings.khqrcc_enabled === 'true'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {settings.khqrcc_enabled === 'true' ? 'ACTIVE (កំពុងដំណើរការ)' : 'DISABLED (បិទ)'}
                          </span>
                        </div>
                      </div>

                      {/* Enable Toggle */}
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-blue-200/70 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.khqrcc_enabled === 'true'}
                          onChange={(e) => {
                            const val = e.target.checked ? 'true' : 'false';
                            setSettingsState({ ...settings, khqrcc_enabled: val });
                          }}
                          className="w-4 h-4 text-blue-600 rounded-md border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-gray-900 block">
                            បើកដំណើរការទូទាត់ស្វ័យប្រវត្តិ (Enable KHQRPay Auto Payment)
                          </span>
                          <span className="text-[11px] text-gray-500">
                            នៅពេលបើក អតិថិជននឹងទទួលបាន Dynamic QR តាមទំហំទឹកប្រាក់ជាក់ស្តែង និងប៊ូតុង Pay with ABA Mobile ព្រមទាំងបញ្ជាក់ការទូទាត់ស្វ័យប្រវត្តិតាម Real-time
                          </span>
                        </div>
                      </label>

                      {/* API Credentials */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            KHQRPay Profile ID
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 10852"
                            value={settings.khqrcc_profile_id || ''}
                            onChange={(e) => setSettingsState({ ...settings, khqrcc_profile_id: e.target.value })}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:border-blue-600 outline-hidden font-mono"
                          />
                          <span className="text-[11px] text-gray-400 block mt-1">
                            ទទួលបានពីគណនី Merchant របស់អ្នកនៅលើ khqr.cc
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-bold text-gray-700">
                              API Secret Key / Merchant Key
                            </label>
                            {settings.khqrcc_has_env_secret === 'true' && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Protected via .env</span>
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <input
                              type={showKhqrSecret ? 'text' : 'password'}
                              placeholder={settings.khqrcc_has_env_secret === 'true' ? '•••••••••••••••• (Configured via .env)' : '••••••••••••••••••••••••••••••'}
                              value={settings.khqrcc_secret_key || ''}
                              onChange={(e) => setSettingsState({ ...settings, khqrcc_secret_key: e.target.value })}
                              className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl border border-gray-300 bg-white focus:border-blue-600 outline-hidden font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowKhqrSecret(!showKhqrSecret)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                              title={showKhqrSecret ? 'Hide Secret' : 'Show Secret'}
                            >
                              {showKhqrSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <span className="text-[11px] text-gray-400 block mt-1">
                            {settings.khqrcc_has_env_secret === 'true'
                              ? 'Secret Key ត្រូវបានរក្សាទុកដោយសុវត្ថិភាពក្នុង server/.env (KHQRPAY_SECRET_KEY)'
                              : 'ណែនាំឱ្យដាក់ក្នុង server/.env (KHQRPAY_SECRET_KEY) ដើម្បីសុវត្ថិភាពខ្ពស់ ឬវាយបញ្ចូលនៅទីនេះ'}
                          </span>
                        </div>
                      </div>

                      {/* Custom Endpoint */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          API Endpoint URL (ស្រេចចិត្ត - Custom Endpoint)
                        </label>
                        <input
                          type="text"
                          placeholder="https://khqr.cc/{profileId}/payment-gateway/v1/payments/qr-api-khqr"
                          value={settings.khqrcc_endpoint || ''}
                          onChange={(e) => setSettingsState({ ...settings, khqrcc_endpoint: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white focus:border-blue-600 outline-hidden font-mono text-gray-700"
                        />
                        <span className="text-[11px] text-gray-400 block mt-1">
                          ទុកឱ្យនៅទទេដើម្បីឱ្យប្រព័ន្ធប្រើប្រាស់ Default Endpoint ដោយស្វ័យប្រវត្តិ
                        </span>
                      </div>

                      {/* Webhook Callback Display */}
                      <div className="p-3.5 rounded-xl bg-white border border-blue-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800">
                            Webhook Callback URL (សម្រាប់បិទភ្ជាប់ក្នុង khqr.cc)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(paymentWebhookUrl);
                              setCopiedWebhook(true);
                              setTimeout(() => setCopiedWebhook(false), 2500);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                          >
                            {copiedWebhook ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600">បានចម្លងរួចរាល់!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>ចម្លង Webhook URL</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 font-mono text-[11px] text-gray-700 border border-gray-200 select-all overflow-x-auto">
                          {paymentWebhookUrl}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          ចម្លងតំណ Webhook នេះទៅដាក់ក្នុងផ្ទាំងគណនី Merchant លើ khqr.cc ដើម្បីឱ្យប្រព័ន្ធទទួលដំណឹងទូទាត់ភ្លាមៗនៅពេលអតិថិជនបានផ្ទេរប្រាក់ជោគជ័យ។
                        </p>
                      </div>

                    </div>

                    <button
                      type="submit"
                      disabled={savingSettings}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                      {savingSettings ? 'Saving...' : 'Save Store & Payment Settings (រក្សាទុក)'}
                    </button>
                  </form>

                </div>
              )}

              {/* ======================================================== */}
              {/* ======================================================== */}
              {/* SUB-TAB 5: TELEGRAM CHAT & BOT NOTIFICATIONS             */}
              {/* ======================================================== */}
              {settingsSubTab === 'telegram' && (
                <div className="space-y-6">

                  {/* 1. STOREFRONT FLOATING TELEGRAM CHAT LINK */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-2xl bg-[#229ED9]/15 text-[#229ED9] flex items-center justify-center">
                        <Send className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          Storefront Floating Telegram Chat (ប៊ូតុងឆាត Telegram លើ Storefront)
                        </h3>
                        <p className="text-xs text-gray-500">
                          កំណត់តំណភ្ជាប់ (Link) ឬ Username សម្រាប់ប៊ូតុងអណ្តែតទឹក "ឆាត Telegram" នៅជ្រុងខាងស្តាំក្រោមនៃគេហទំព័រ Storefront
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                      {/* Left: Input Form */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Telegram Link or Username (តំណភ្ជាប់ Telegram ផ្ទាល់ខ្លួន) *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. https://t.me/ShoplySupport ឬ @ShoplySupport"
                            value={settings.telegram_handle || settings.telegram_link || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSettingsState({
                                ...settings,
                                telegram_handle: val,
                                telegram_link: val
                              });
                            }}
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-[#229ED9] focus:ring-2 focus:ring-sky-100 outline-hidden font-mono"
                          />
                          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
                            អ្នកអាចបញ្ចូលជា Username ដូចជា <code>@yourusername</code> ឬ Link ពេញលេញដូចជា <code>https://t.me/yourusername</code>។ នៅពេលអតិថិជនចុចលើប៊ូតុង "ឆាត Telegram" លើ Storefront វានឹងបើកចូលទៅកាន់គណនី Telegram របស់អ្នកភ្លាមៗ។
                          </p>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleSavePartialSettings([
                              'telegram_handle',
                              'telegram_link'
                            ], 'Telegram Support Chat link saved successfully! / បានរក្សាទុកតំណភ្ជាប់ Telegram ជោគជ័យ!')}
                            disabled={savingSettings}
                            className="px-5 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                          >
                            {savingSettings ? 'Saving...' : 'Save Telegram Link (រក្សាទុកតំណភ្ជាប់)'}
                          </button>

                          {(() => {
                            const raw = (settings.telegram_handle || settings.telegram_link || '').trim();
                            if (!raw) return null;
                            const targetUrl = raw.startsWith('http://') || raw.startsWith('https://')
                              ? raw
                              : raw.startsWith('t.me/')
                              ? `https://${raw}`
                              : `https://t.me/${raw.replace('@', '')}`;
                            return (
                              <a
                                href={targetUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                                <span>Test Link (សាកល្បងចុចបើក)</span>
                              </a>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Right: Live Preview of Storefront Floating Button */}
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                        <div className="text-xs font-bold text-gray-700">
                          Live Preview (ការបង្ហាញលើ Storefront)
                        </div>
                        <div className="p-4 rounded-xl bg-white border border-gray-100 flex items-center justify-center min-h-[90px]">
                          <div className="flex items-center gap-2 bg-[#229ED9] text-white px-3.5 py-2 rounded-full shadow-md">
                            <Send className="w-4 h-4 -rotate-12 translate-x-0.5" />
                            <span className="text-xs font-semibold">ឆាត Telegram</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-gray-500 leading-snug">
                          គោលដៅ Link៖ <code className="text-[#229ED9] bg-sky-50 px-1 py-0.5 rounded break-all">
                            {(() => {
                              const raw = (settings.telegram_handle || settings.telegram_link || '').trim();
                              if (!raw) return 'https://t.me/ShoplySupport';
                              if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
                              if (raw.startsWith('t.me/')) return `https://${raw}`;
                              return `https://t.me/${raw.replace('@', '')}`;
                            })()}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. TELEGRAM BOT NOTIFICATION SETTINGS (ORDER ALERTS) */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
                        <Send className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          Telegram Bot Notification Settings (ការតភ្ជាប់ Telegram Bot)
                        </h3>
                        <p className="text-xs text-gray-500">
                          តភ្ជាប់ Telegram Bot ដើម្បីទទួលបានសារដំណឹងភ្លាមៗនៅពេលមានការកុម្ម៉ង់ទំនិញថ្មី
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-2">
                      <div className="font-bold flex items-center gap-1.5 text-indigo-800">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>របៀបបង្កើត Telegram Bot ងាយៗ៖</span>
                      </div>
                      <ol className="list-decimal pl-4 space-y-1 text-indigo-800/90 leading-relaxed">
                        <li>បើក Telegram ស្វែងរក <b>@BotFather</b> ចុច <code>/newbot</code> រួចចម្លងយក HTTP API Token ដាក់ខាងក្រោម។</li>
                        <li>ស្វែងរក <b>@userinfobot</b> ឬ add Bot ចូលក្នុង Telegram Group ហើយយក Chat ID មកដាក់។</li>
                        <li>ចុចប៊ូតុង <b>"Send Test Telegram Message"</b> ដើម្បីសាកល្បងការតភ្ជាប់។</li>
                      </ol>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Telegram Bot Token *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 7123456789:AAHq_bX98..."
                          value={settings.telegram_bot_token || ''}
                          onChange={(e) => setSettingsState({ ...settings, telegram_bot_token: e.target.value })}
                          className="w-full text-sm font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Telegram Chat ID or Group ID *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 123456789 or -100123456789"
                          value={settings.telegram_chat_id || ''}
                          onChange={(e) => setSettingsState({ ...settings, telegram_chat_id: e.target.value })}
                          className="w-full text-sm font-mono px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                        />
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={handleTestTelegram}
                          disabled={testingTelegram || !settings.telegram_bot_token || !settings.telegram_chat_id}
                          className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{testingTelegram ? 'Sending Test...' : 'Send Test Telegram Message'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSavePartialSettings([
                            'telegram_bot_token',
                            'telegram_chat_id'
                          ], 'Telegram config saved successfully!')}
                          disabled={savingSettings}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Save Bot Config
                        </button>

                        {telegramStatus && (
                          <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                            telegramStatus.success ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {telegramStatus.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span>{telegramStatus.message}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </main>
      </div>

      {/* PRODUCT MODAL WITH IMAGE UPLOAD & GALLERY PREVIEWS */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setProductModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {editingProduct ? 'Edit Product (កែប្រែទំនិញ)' : 'Add New Product (បន្ថែមទំនិញថ្មី)'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Manage product pricing, stock count, photos, and descriptions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-6">
              
              {/* 1. Product Photos Section */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span>Product Photos (រូបភាពទំនិញ)</span>
                  </label>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {productForm.images.length} photos added
                  </span>
                </div>

                {/* Upload from computer button & URL input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingProductImg ? 'Uploading...' : 'Upload From Computer'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleProductImageUpload}
                    />
                  </label>

                  <div className="flex-1 flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Or paste image URL (https://...)"
                      value={productForm.urlInput}
                      onChange={(e) => setProductForm({ ...productForm, urlInput: e.target.value })}
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-300 bg-white focus:border-indigo-500 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Images Thumbnail List with Delete */}
                {productForm.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
                    {productForm.images.map((imgUrl, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-white shadow-2xs">
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveProductImage(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-xs cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Basic Information Card */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Basic Information (ព័ត៌មានទូទៅ)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Name (English) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vintage Denim Jacket"
                      value={productForm.nameEn}
                      onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Name (Khmer ខ្មែរ) *</label>
                    <input
                      type="text"
                      required
                      placeholder="ឧ. អាវខូវប៊យបុរាណ"
                      value={productForm.nameKh}
                      onChange={(e) => setProductForm({ ...productForm, nameKh: e.target.value })}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category (ប្រភេទ) *</label>
                  <select
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.nameEn} ({c.nameKh})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Pricing, Discount & Inventory Card */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Pricing & Inventory (តម្លៃ និងស្តុក)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Regular Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="29.99"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden font-bold"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-gray-700">Sale Price ($)</label>
                      {(() => {
                        const p = parseFloat(productForm.price);
                        const sp = parseFloat(productForm.salePrice);
                        if (!isNaN(p) && !isNaN(sp) && p > sp && sp > 0) {
                          const pct = Math.round(((p - sp) / p) * 100);
                          return (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md">
                              -{pct}%
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Leave blank if no discount"
                      value={productForm.salePrice}
                      onChange={(e) => setProductForm({ ...productForm, salePrice: e.target.value })}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden font-bold text-rose-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Quantity (ចំនួនស្តុក)</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                    <div className="flex items-center gap-1.5">
                      <Star className={`w-4 h-4 ${productForm.isFeatured ? 'fill-amber-400 text-amber-500' : 'text-gray-400'}`} />
                      <span>Featured Product (បង្ហាញលើទំព័រដើម / Homepage)</span>
                    </div>
                  </label>
                  {productForm.isFeatured && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Active on Home
                    </span>
                  )}
                </div>
              </div>

              {/* 4. Variants & Options Card */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Variants & Options (ជម្រើសទំនិញ)
                </span>
                <p className="text-[11px] text-gray-400">
                  Enter one group per line. Format: <code>Group: Option 1, Option 2</code>
                </p>
                <textarea
                  rows="2"
                  value={productForm.variantsText}
                  onChange={(e) => setProductForm({ ...productForm, variantsText: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 resize-none font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                  placeholder="Size: S, M, L, XL&#10;Color: Black, White, Grey"
                />
              </div>

              {/* 5. Descriptions Card */}
              <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Product Descriptions (ការពិពណ៌នាទំនិញ)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description (English)</label>
                    <textarea
                      rows="3"
                      value={productForm.descriptionEn}
                      onChange={(e) => setProductForm({ ...productForm, descriptionEn: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                      placeholder="Product details, material, fit..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Khmer)</label>
                    <textarea
                      rows="3"
                      value={productForm.descriptionKh}
                      onChange={(e) => setProductForm({ ...productForm, descriptionKh: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                      placeholder="ព័ត៌មានលម្អិតអំពីទំនិញ សាច់ក្រណាត់..."
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel (បោះបង់)
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL WITH DIRECT COVER UPLOAD */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setCategoryModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              {editingCategory ? 'Edit Category (កែប្រែប្រភេទ)' : 'Add New Category (បន្ថែមប្រភេទថ្មី)'}
            </h3>
            
            <form onSubmit={handleCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Name (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shoes"
                  value={categoryForm.nameEn}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Name (Khmer) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ស្បែកជើង"
                  value={categoryForm.nameKh}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameKh: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200"
                />
              </div>

              {/* Category Cover Image with Upload & Preview */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-gray-700">Category Cover Image (រូបតំណាងប្រភេទ)</label>
                {categoryForm.image && (
                  <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                    <img src={categoryForm.image} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCategoryForm({ ...categoryForm, image: '' })}
                      className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full hover:bg-rose-700 shadow-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingCategoryImg ? 'Uploading...' : 'Upload Cover'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCategoryImageUpload}
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Or paste cover image URL..."
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-200"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setOrderDetailModal(null)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl z-10 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-base">
                    Order Details #{orderDetailModal.orderNumber}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    orderDetailModal.status === 'DELIVERED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : orderDetailModal.status === 'SHIPPED'
                      ? 'bg-purple-100 text-purple-800'
                      : orderDetailModal.status === 'CONFIRMED'
                      ? 'bg-blue-100 text-blue-800'
                      : orderDetailModal.status === 'CANCELLED'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {orderDetailModal.status}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Placed on {new Date(orderDetailModal.createdAt).toLocaleString()}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setOrderDetailModal(null)} 
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Switcher */}
            <div className="space-y-1.5 bg-gray-50 p-3 rounded-2xl border border-gray-200">
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                Change Status (ប្តូរស្ថានភាពការកុម្ម៉ង់):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(orderDetailModal.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      orderDetailModal.status === st
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Information & Quick Contact */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 text-xs">Customer Information</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${orderDetailModal.customerPhone}`}
                    className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`https://t.me/${(orderDetailModal.customerTelegram || orderDetailModal.customerPhone).replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Name:</span> <b className="text-gray-900">{orderDetailModal.customerName}</b></div>
                <div><span className="text-gray-500">Phone:</span> <a href={`tel:${orderDetailModal.customerPhone}`} className="text-indigo-600 font-bold hover:underline">{orderDetailModal.customerPhone}</a></div>
                {orderDetailModal.customerTelegram && (
                  <div><span className="text-gray-500">Telegram:</span> <b className="text-gray-900">{orderDetailModal.customerTelegram}</b></div>
                )}
                <div><span className="text-gray-500">Payment:</span> <b className="text-gray-900 uppercase">{orderDetailModal.paymentMethod}</b></div>
                <div className="sm:col-span-2"><span className="text-gray-500">Address:</span> <b className="text-gray-900">{orderDetailModal.cityProvince}, {orderDetailModal.address}</b></div>
                {orderDetailModal.notes && (
                  <div className="sm:col-span-2"><span className="text-gray-500">Notes:</span> <i className="text-gray-700">{orderDetailModal.notes}</i></div>
                )}
              </div>
            </div>

            {/* Payment Proof Receipt Screenshot (if attached) */}
            {orderDetailModal.paymentProof && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 space-y-1.5">
                <span className="font-bold text-rose-900 text-xs block">Payment Proof Receipt:</span>
                <a href={orderDetailModal.paymentProof} target="_blank" rel="noreferrer" className="block">
                  <img src={orderDetailModal.paymentProof} alt="Receipt" className="max-h-48 rounded-lg object-contain border border-rose-200 bg-white" />
                </a>
              </div>
            )}

            {/* Items Ordered */}
            <div>
              <h5 className="font-bold text-gray-800 text-xs mb-2">Items Ordered:</h5>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-100 rounded-xl p-3 bg-gray-50/50">
                {(orderDetailModal.items || []).map((it, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-b-0 text-xs">
                    <div>
                      <span className="font-semibold text-gray-900">{it.name}</span>
                      {it.selectedVariant && (
                        <span className="text-[10px] text-indigo-600 block">
                          {typeof it.selectedVariant === 'object' ? Object.entries(it.selectedVariant).map(([k,v])=>`${k}: ${v}`).join(', ') : it.selectedVariant}
                        </span>
                      )}
                      <span className="text-gray-400">Qty: {it.quantity} × ${Number(it.price).toFixed(2)}</span>
                    </div>
                    <span className="font-bold text-gray-900">${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Amount */}
            <div className="pt-2 border-t border-gray-100 flex justify-between items-center font-bold text-sm">
              <span className="text-gray-700">Total Payable:</span>
              <span className="text-indigo-600 text-base">${Number(orderDetailModal.totalAmount).toFixed(2)}</span>
            </div>

            {/* Modal Actions Footer */}
            <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleDeleteOrder(orderDetailModal.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Order</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintInvoice(orderDetailModal)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Delivery Slip / Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderDetailModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO SLIDE DETAILS MODAL */}
      {slideModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setSlideModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingSlideIndex !== null ? `Edit Hero Slide #${editingSlideIndex + 1}` : 'Add New Hero Slide'}
                </h3>
                <p className="text-xs text-gray-500">
                  កែសម្រួលរូបភាព ចំណងជើង អក្សរពណ៌ លីង និងប៊ូតុងសម្រាប់ស្លាយនេះ
                </p>
              </div>
              <button onClick={() => setSlideModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlideSubmit} className="space-y-4">
              {/* Image Preview & Upload */}
              <div className="space-y-2 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-bold text-gray-700">Slide Photo (រូបភាពស្លាយ) *</label>
                <div className="aspect-16/9 rounded-xl overflow-hidden bg-gray-200 border border-gray-200 relative max-h-48">
                  {slideForm.image ? (
                    <img src={slideForm.image} alt="Slide Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs gap-1">
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                      <span>No image selected</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <label className="cursor-pointer py-2 px-3 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5 shadow-2xs">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{uploadingMediaKey === 'slide_form_img' ? 'Uploading...' : 'Upload Image From PC'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSlideModalImageUpload(e.target.files?.[0])}
                    />
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Or paste image URL (https://...)"
                    value={slideForm.image}
                    onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-gray-300 bg-white focus:border-indigo-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Titles & Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Title (Khmer ខ្មែរ) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ទំនិញទាន់សម័យ & គុណភាពខ្ពស់"
                    value={slideForm.titleKm}
                    onChange={(e) => setSlideForm({ ...slideForm, titleKm: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Highlight Word (Khmer)</label>
                  <input
                    type="text"
                    placeholder="e.g. តម្លៃសមរម្យ"
                    value={slideForm.highlightKm}
                    onChange={(e) => setSlideForm({ ...slideForm, highlightKm: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Lifestyle & Premium Quality"
                    value={slideForm.titleEn}
                    onChange={(e) => setSlideForm({ ...slideForm, titleEn: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Highlight Word (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Products"
                    value={slideForm.highlightEn}
                    onChange={(e) => setSlideForm({ ...slideForm, highlightEn: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Subtitles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle (Khmer)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. ជ្រើសរើសទំនិញជាច្រើនប្រភេទ..."
                    value={slideForm.subtitleKm}
                    onChange={(e) => setSlideForm({ ...slideForm, subtitleKm: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Subtitle (English)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Discover an extensive selection..."
                    value={slideForm.subtitleEn}
                    onChange={(e) => setSlideForm({ ...slideForm, subtitleEn: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Badges & Tab Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Badge Tag (Khmer)</label>
                  <input
                    type="text"
                    placeholder="e.g. ការប្រមូលទំនិញថ្មី 2026"
                    value={slideForm.badgeKm}
                    onChange={(e) => setSlideForm({ ...slideForm, badgeKm: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Badge Tag (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. New Collection 2026"
                    value={slideForm.badgeEn}
                    onChange={(e) => setSlideForm({ ...slideForm, badgeEn: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category Tab Label (Khmer)</label>
                  <input
                    type="text"
                    placeholder="e.g. សម្លៀកបំពាក់ទាន់សម័យ"
                    value={slideForm.tabKm}
                    onChange={(e) => setSlideForm({ ...slideForm, tabKm: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category Tab Label (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Fashion Apparel"
                    value={slideForm.tabEn}
                    onChange={(e) => setSlideForm({ ...slideForm, tabEn: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Link & Button Text */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text (Khmer)</label>
                  <input
                    type="text"
                    placeholder="e.g. ទិញឥឡូវនេះ"
                    value={slideForm.buttonTextKm}
                    onChange={(e) => setSlideForm({ ...slideForm, buttonTextKm: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Now"
                    value={slideForm.buttonTextEn}
                    onChange={(e) => setSlideForm({ ...slideForm, buttonTextEn: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Target Link URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /shop or /shop?category=shoes"
                    value={slideForm.link}
                    onChange={(e) => setSlideForm({ ...slideForm, link: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSlideModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Save Slide (រក្សាទុកស្លាយ)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER TESTIMONIAL MODAL */}
      {testimonialModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setTestimonialModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingTestimonialIndex !== null ? 'Edit Customer Review (កែប្រែមតិ)' : 'Add Customer Review (បន្ថែមមតិ)'}
                </h3>
                <p className="text-xs text-gray-500">
                  ឈ្មោះ រូបថត Avatar ផ្កាយ 1-5 និងមតិយោបល់អតិថិជន
                </p>
              </div>
              <button onClick={() => setTestimonialModalOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonialSubmit} className="space-y-4">
              {/* Avatar Photo */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4">
                <img
                  src={testimonialForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face'}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-bold text-gray-700">Customer Avatar Photo</label>
                  <div className="flex gap-2">
                    <label className="cursor-pointer py-1.5 px-3 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{uploadingMediaKey === 'testimonial_avatar' ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleTestimonialAvatarUpload(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Or paste avatar URL..."
                    value={testimonialForm.avatar}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, avatar: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>

              {/* Customer Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Name (Khmer) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ចាន់ សុខា"
                    value={testimonialForm.nameKm}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, nameKm: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Name (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sokha Chan"
                    value={testimonialForm.nameEn}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, nameEn: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location (Khmer)</label>
                  <input
                    type="text"
                    placeholder="e.g. រាជធានីភ្នំពេញ"
                    value={testimonialForm.locationKm}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, locationKm: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Location (English)</label>
                  <input
                    type="text"
                    placeholder="e.g. Phnom Penh"
                    value={testimonialForm.locationEn}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, locationEn: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Rating (ពិន្ទុផ្កាយ)</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= testimonialForm.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-2">
                    {testimonialForm.rating} Stars
                  </span>
                </div>
              </div>

              {/* Comments */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Review Comment (Khmer) *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. ទំនិញមានគុណភាពល្អលើសពីការរំពឹងទុក! ដឹកជញ្ជូនលឿន..."
                  value={testimonialForm.commentKm}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, commentKm: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Review Comment (English)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. The quality exceeded my expectations! Super fast delivery..."
                  value={testimonialForm.commentEn}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, commentEn: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-indigo-600 outline-hidden resize-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTestimonialModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  Save Review (រក្សាទុកមតិ)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADMIN PROFILE MODAL */}
      {adminProfileModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setAdminProfileModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#b66dff] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Edit Admin Profile</h3>
                  <p className="text-xs text-gray-400">កែប្រែរូបភាព និងឈ្មោះអ្នកគ្រប់គ្រង</p>
                </div>
              </div>
              <button
                onClick={() => setAdminProfileModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminProfile} className="space-y-4">
              {/* Avatar Preview & Upload */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="relative shrink-0">
                  <img
                    src={adminProfileForm.avatar || settings.admin_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-xs font-bold text-gray-800 block">Profile Picture (រូបថត)</span>
                  <label className={`inline-flex px-3 py-1.5 rounded-xl bg-[#b66dff] hover:bg-[#9a55ff] text-white text-[11px] font-bold items-center gap-1.5 cursor-pointer shadow-2xs ${uploadingAdminAvatar ? 'opacity-60 pointer-events-none' : ''}`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingAdminAvatar ? 'Uploading...' : 'Upload Image (ផ្ទុករូប)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleAdminAvatarUpload(e.target.files[0]);
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Avatar URL Option */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Or Paste Photo URL (ឬតំណរូបភាព)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={adminProfileForm.avatarUrlInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAdminProfileForm(prev => ({
                      ...prev,
                      avatarUrlInput: val,
                      avatar: val.trim() || prev.avatar,
                    }));
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#b66dff] focus:ring-2 focus:ring-purple-100 outline-hidden"
                />
              </div>

              {/* Admin Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Admin Name (ឈ្មោះ Admin) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heang, David Greymaax..."
                  value={adminProfileForm.name}
                  onChange={(e) => setAdminProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#b66dff] focus:ring-2 focus:ring-purple-100 outline-hidden font-medium"
                />
              </div>

              {/* Admin Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Role / Title (តួនាទី)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Store Administrator, Shop Owner..."
                  value={adminProfileForm.role}
                  onChange={(e) => setAdminProfileForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:border-[#b66dff] focus:ring-2 focus:ring-purple-100 outline-hidden"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdminProfileModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#da8cff] to-[#9a55ff] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Profile (រក្សាទុក)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
