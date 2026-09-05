import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  km: {
    // Navigation
    home: 'ទំព័រដើម',
    shop: 'ទំនិញទាំងអស់',
    categories: 'ប្រភេទទាំងអស់',
    admin: 'ផ្ទាំងគ្រប់គ្រង Admin',
    track_order: 'តាមដានការកុម្ម៉ង់',
    cart: 'កន្ត្រកទំនិញ',
    search_placeholder: 'ស្វែងរកទំនិញ (ខោអាវ, ស្បែកជើង, ឧបករណ៍...).',
    items_in_cart: 'មុខទំនិញក្នុងកន្ត្រក',
    checkout: 'ទូទាត់ប្រាក់',
    view_cart: 'មើលកន្ត្រក',
    cart_empty: 'កន្ត្រកទំនិញរបស់អ្នកនៅទទេ',
    start_shopping: 'ចាប់ផ្តើមទិញទំនិញ',

    // Hero & Home
    hero_badge: 'ការប្រមូលទំនិញថ្មី 2026',
    hero_title: 'ស្ទីលទាន់សម័យ & ផលិតផលគុណភាពខ្ពស់',
    hero_subtitle: 'ជ្រើសរើសទំនិញជាច្រើនប្រភេទ ចាប់ពីសម្លៀកបំពាក់ ស្បែកជើង រហូតដល់គ្រឿងអេឡិចត្រូនិច និងគ្រឿងតុបតែង។',
    shop_now: 'ទិញឥឡូវនេះ',
    explore_catalog: 'ស្វែងរកប្រភេទ',
    featured_products: 'ទំនិញពេញនិយម (Featured)',
    new_arrivals: 'មកដល់ថ្មីៗ (New Arrivals)',
    categories_title: 'រកមើលតាមប្រភេទ',
    view_all: 'មើលទាំងអស់',
    free_delivery_tag: 'ដឹកជញ្ជូនរហ័សទូទាំងប្រទេស',
    telegram_alert_tag: 'ការជូនដំណឹងភ្លាមៗតាម Telegram',
    best_quality_tag: 'ធានាគុណភាព ១០០%',

    // Product Card & Detail
    in_stock: 'មានក្នុងស្តុក',
    out_of_stock: 'អស់ពីស្តុក',
    add_to_cart: 'ដាក់ក្នុងកន្ត្រក',
    added_to_cart: 'បានដាក់ក្នុងកន្ត្រក!',
    buy_now: 'ទិញភ្លាមៗ',
    price: 'តម្លៃ',
    select_variant: 'ជ្រើសរើសជម្រើស',
    quantity: 'ចំនួន',
    description: 'ពិពណ៌នាផលិតផល',
    related_products: 'ទំនិញស្រដៀងគ្នា',
    items_left: 'នៅសល់ {n} ក្នុងស្តុក',

    // Shop page
    filter_by: 'ចម្រាញ់តាម',
    all_categories: 'គ្រប់ប្រភេទ',
    price_range: 'កម្រិតតម្លៃ',
    all_prices: 'តម្លៃទាំងអស់',
    sort_by: 'តម្រៀបតាម',
    sort_newest: 'ថ្មីបំផុត',
    sort_price_low: 'តម្លៃ៖ ទាបទៅខ្ពស់',
    sort_price_high: 'តម្លៃ៖ ខ្ពស់ទៅទាប',
    no_products_found: 'រកមិនឃើញទំនិញណាមួយឡើយ',

    // Checkout
    checkout_title: 'ការទូទាត់ និងបញ្ជាទិញ',
    customer_info: 'ព័ត៌មានអតិថិជន',
    full_name: 'ឈ្មោះពេញ',
    phone_number: 'លេខទូរស័ព្ទ (សំខាន់)',
    telegram_username: 'គណនី Telegram (ស្រេចចិត្ត)',
    delivery_address: 'អាសយដ្ឋានដឹកជញ្ជូនលម្អិត',
    city_province: 'រាជធានី / ខេត្ត',
    order_notes: 'ចំណាំបន្ថែម (ស្រេចចិត្ត)',
    payment_method: 'វិធីសាស្រ្តទូទាត់',
    cod_label: 'ទូទាត់ប្រាក់ពេលទំនិញមកដល់ (Cash on Delivery)',
    cod_desc: 'បង់ប្រាក់ផ្ទាល់ជាមួយអ្នកដឹកជញ្ជូនពេលទទួលបានទំនិញ',
    khqr_label: 'ABA Pay (ABA Mobile)',
    khqr_desc: 'ទូទាត់ប្រាក់តាម ABA Mobile ឬ ABA KHQR',
    khqr_scan_instruction: 'សូមបើកកម្មវិធីធនាគាររបស់អ្នក (ABA, Wing...) ដើម្បីស្កេនទូទាត់ប្រាក់៖',
    order_summary: 'សេចក្តីសង្ខេបការបញ្ជាទិញ',
    subtotal: 'តម្លៃសរុបទំនិញ',
    delivery_fee: 'ថ្លៃដឹកជញ្ជូន',
    total_amount: 'ទឹកប្រាក់សរុប',
    place_order_btn: 'បញ្ជាក់ការកុម្ម៉ង់ទិញឥឡូវនេះ',
    placing_order: 'កំពុងដំណើរការ...',

    // Order Success
    order_success_title: 'ការកុម្ម៉ង់របស់អ្នកទទួលបានជោគជ័យ!',
    order_success_subtitle: 'យើងបានផ្ញើសារជូនដំណឹងទៅកាន់ Telegram របស់ហាងរួចរាល់ហើយ។ ក្រុមការងារយើងនឹងទាក់ទងមកអ្នកឆាប់ៗនេះ។',
    order_number: 'លេខបញ្ជាទិញ',
    order_date: 'កាលបរិច្ឆេទ',
    shipping_to: 'ដឹកជញ្ជូនទៅកាន់',
    continue_shopping: 'បន្តការទិញទំនិញ',
    print_receipt: 'បោះពុម្ពវិក្កយបត្រ',

    // Statuses
    PENDING: 'រង់ចាំការបញ្ជាក់',
    CONFIRMED: 'បានបញ្ជាក់ការកុម្ម៉ង់',
    SHIPPED: 'កំពុងដឹកជញ្ជូន',
    DELIVERED: 'បានប្រគល់ទំនិញ',
    CANCELLED: 'បានបោះបង់',

    // Admin
    admin_title: 'ផ្ទាំងគ្រប់គ្រង Shoply',
    admin_overview: 'ទិដ្ឋភាពទូទៅ',
    admin_products: 'គ្រប់គ្រងផលិតផល',
    admin_categories: 'គ្រប់គ្រងប្រភេទ (Categories)',
    admin_orders: 'ការកុម្ម៉ង់ (Orders)',
    admin_settings: 'ការកំណត់ & Telegram Bot',
    add_new_product: 'បន្ថែមផលិតផលថ្មី',
    add_new_category: 'បន្ថែមប្រភេទថ្មី',
    total_sales: 'ការលក់សរុប',
    total_orders: 'ការកុម្ម៉ង់សរុប',
    telegram_bot_config: 'ការកំណត់ Telegram Bot Notification',
    telegram_token_help: 'យក Bot Token ពី @BotFather ក្នុង Telegram',
    telegram_chat_help: 'យក Chat ID ពី @userinfobot ឬ ID នៃ Telegram Group/Channel របស់អ្នក',
    test_telegram_btn: 'សាកល្បងផ្ញើសារ Test Telegram',
    save_settings: 'រក្សាទុកការកំណត់',
  },
  en: {
    // Navigation
    home: 'Home',
    shop: 'Shop',
    categories: 'Categories',
    admin: 'Admin Panel',
    track_order: 'Track Order',
    cart: 'Cart',
    search_placeholder: 'Search products (clothes, shoes, gadgets...).',
    items_in_cart: 'Items in cart',
    checkout: 'Checkout',
    view_cart: 'View Cart',
    cart_empty: 'Your cart is empty',
    start_shopping: 'Start Shopping',

    // Hero & Home
    hero_badge: 'New Collection 2026',
    hero_title: 'Modern Style & Premium Quality Products',
    hero_subtitle: 'Discover an extensive selection from apparel and footwear to electronics and lifestyle accessories.',
    shop_now: 'Shop Now',
    explore_catalog: 'Explore Categories',
    featured_products: 'Featured Products',
    new_arrivals: 'New Arrivals',
    categories_title: 'Browse By Category',
    view_all: 'View All',
    free_delivery_tag: 'Fast Nationwide Delivery',
    telegram_alert_tag: 'Instant Telegram Order Alerts',
    best_quality_tag: '100% Quality Guaranteed',

    // Product Card & Detail
    in_stock: 'In Stock',
    out_of_stock: 'Out of Stock',
    add_to_cart: 'Add to Cart',
    added_to_cart: 'Added to Cart!',
    buy_now: 'Buy Now',
    price: 'Price',
    select_variant: 'Select Option',
    quantity: 'Quantity',
    description: 'Product Description',
    related_products: 'Related Products',
    items_left: '{n} left in stock',

    // Shop page
    filter_by: 'Filter By',
    all_categories: 'All Categories',
    price_range: 'Price Range',
    all_prices: 'All Prices',
    sort_by: 'Sort By',
    sort_newest: 'Newest',
    sort_price_low: 'Price: Low to High',
    sort_price_high: 'Price: High to Low',
    no_products_found: 'No products found',

    // Checkout
    checkout_title: 'Checkout & Order Confirmation',
    customer_info: 'Customer Information',
    full_name: 'Full Name',
    phone_number: 'Phone Number (Required)',
    telegram_username: 'Telegram Username (Optional)',
    delivery_address: 'Delivery Address',
    city_province: 'City / Province',
    order_notes: 'Order Notes (Optional)',
    payment_method: 'Payment Method',
    cod_label: 'Cash on Delivery (COD)',
    cod_desc: 'Pay with cash upon receipt of your order',
    khqr_label: 'ABA Pay (ABA Mobile)',
    khqr_desc: 'Pay instantly via ABA Mobile or ABA KHQR',
    khqr_scan_instruction: 'Please open your banking app (ABA, Wing, ACLEDA) to scan and pay:',
    order_summary: 'Order Summary',
    subtotal: 'Subtotal',
    delivery_fee: 'Delivery Fee',
    total_amount: 'Total Amount',
    place_order_btn: 'Confirm & Place Order',
    placing_order: 'Processing...',

    // Order Success
    order_success_title: 'Your Order Has Been Placed!',
    order_success_subtitle: 'A notification has been sent to our Telegram channel. Our team will contact you shortly to confirm delivery.',
    order_number: 'Order Number',
    order_date: 'Order Date',
    shipping_to: 'Shipping To',
    continue_shopping: 'Continue Shopping',
    print_receipt: 'Print Receipt',

    // Statuses
    PENDING: 'Pending Confirmation',
    CONFIRMED: 'Order Confirmed',
    SHIPPED: 'Shipped / In Transit',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',

    // Admin
    admin_title: 'Shoply Admin Dashboard',
    admin_overview: 'Overview',
    admin_products: 'Products',
    admin_categories: 'Categories',
    admin_orders: 'Orders',
    admin_settings: 'Settings & Telegram',
    add_new_product: 'Add Product',
    add_new_category: 'Add Category',
    total_sales: 'Total Revenue',
    total_orders: 'Total Orders',
    telegram_bot_config: 'Telegram Bot Notification Settings',
    telegram_token_help: 'Get your Bot Token from @BotFather in Telegram',
    telegram_chat_help: 'Get your Chat ID from @userinfobot or your Telegram Group ID',
    test_telegram_btn: 'Send Test Telegram Message',
    save_settings: 'Save Settings',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('shoply_lang') || 'km';
  });

  useEffect(() => {
    localStorage.setItem('shoply_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'km' ? 'en' : 'km'));
  };

  const t = (key, params = {}) => {
    let str = translations[lang]?.[key] || translations['en']?.[key] || key;
    Object.keys(params).forEach(p => {
      str = str.replace(`{${p}}`, params[p]);
    });
    return str;
  };

  const getLocalized = (obj, field) => {
    if (!obj) return '';
    if (lang === 'km') {
      return obj[`${field}Kh`] || obj[`${field}En`] || obj[field] || '';
    }
    return obj[`${field}En`] || obj[`${field}Kh`] || obj[field] || '';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
