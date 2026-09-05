export const DEFAULT_SETTINGS = {
  store_name: 'Shoply Store',
  currency: '$',
  delivery_fee: '1.50',
  phone_number: '012 345 678',
  telegram_bot_token: '',
  telegram_chat_id: '',
  khqr_name: 'SHOPLY STORE CO., LTD',
  khqr_account: '001 568 992',
};

export const DEFAULT_CATEGORIES = [
  {
    id: 'cat-clothing',
    nameKh: 'សម្លៀកបំពាក់',
    nameEn: 'Clothing',
    slug: 'clothing',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat-shoes',
    nameKh: 'ស្បែកជើង',
    nameEn: 'Shoes & Footwear',
    slug: 'shoes',
    icon: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat-electronics',
    nameKh: 'គ្រឿងអេឡិចត្រូនិច',
    nameEn: 'Electronics & Gadgets',
    slug: 'electronics',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat-accessories',
    nameKh: 'កាបូប & គ្រឿងតុបតែង',
    nameEn: 'Bags & Accessories',
    slug: 'accessories',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'cat-beauty',
    nameKh: 'គ្រឿងសម្អាង & ថែរក្សាសម្រស់',
    nameEn: 'Beauty & Skincare',
    slug: 'beauty',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
  }
];

export const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    nameKh: 'អាវយឺតដៃខ្លី Oversized Minimalist',
    nameEn: 'Oversized Minimalist Cotton T-Shirt',
    descriptionKh: 'សាច់ក្រណាត់កប្បាស 100% Cotton ទន់ត្រជាក់ ស្រួលពាក់ មិនបែកព្រុយ ស័ក្តិសមសម្រាប់អាកាសធាតុក្តៅ។',
    descriptionEn: 'Premium 100% breathable organic cotton oversized tee. Modern dropped shoulder silhouette.',
    price: 14.50,
    salePrice: 12.00,
    stock: 45,
    categoryId: 'cat-clothing',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['White', 'Black', 'Olive Green', 'Cream'] }
    ]
  },
  {
    id: 'prod-2',
    nameKh: 'អាវក្រៅខូវប៊យ Denim Vintage Jacket',
    nameEn: 'Vintage Washed Denim Jacket',
    descriptionKh: 'អាវខូវប៊យស្ទីល Vintage ពេញនិយម ក្រណាត់ក្រាស់គុណភាពខ្ពស់ ងាយស្រួល Mix & Match ជាមួយខោអាវគ្រប់ប្រភេទ។',
    descriptionEn: 'Heavyweight classic denim jacket with durable metal buttons and vintage washed texture.',
    price: 38.00,
    salePrice: 32.50,
    stock: 20,
    categoryId: 'cat-clothing',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Size', options: ['M', 'L', 'XL'] },
      { name: 'Color', options: ['Classic Blue', 'Vintage Black'] }
    ]
  },
  {
    id: 'prod-3',
    nameKh: 'ស្បែកជើងប៉ាតា Ultra Boost Running Sneakers',
    nameEn: 'Ultra Boost Breathable Running Sneakers',
    descriptionKh: 'ស្បែកជើងប៉ាតាស្រាលស្រួលពាក់ បាតទ្រាប់ទន់កាត់បន្ថយការឈឺជើងពេលដើរ ឬហាត់ប្រាណ។',
    descriptionEn: 'Super light running shoes with ergonomic cushioning foam and mesh upper for maximum ventilation.',
    price: 49.00,
    salePrice: 42.00,
    stock: 15,
    categoryId: 'cat-shoes',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Size (EU)', options: ['39', '40', '41', '42', '43', '44'] },
      { name: 'Color', options: ['Fire Red', 'Triple Black', 'Pure White'] }
    ]
  },
  {
    id: 'prod-4',
    nameKh: 'កាសស្តាប់ត្រចៀក Wireless Noise Cancelling Headphones',
    nameEn: 'Wireless Active Noise Cancelling Headphones',
    descriptionKh: 'កាសប៊្លូធូសសម្លេងច្បាស់ បាសបុកពិរោះ កាត់បន្ថយសម្លេងរំខានខាងក្រៅបានល្អ ថ្មកាន់បាន 40 ម៉ោង។',
    descriptionEn: 'Hi-Res certified over-ear headphones with hybrid ANC and up to 40 hours battery life.',
    price: 79.00,
    salePrice: 69.00,
    stock: 25,
    categoryId: 'cat-electronics',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Matte Black', 'Silver Grey', 'Midnight Blue'] }
    ]
  },
  {
    id: 'prod-5',
    nameKh: 'នាឡិកាឆ្លាតវៃ Smart Fitness Watch Pro',
    nameEn: 'Smart Fitness Watch Series Pro',
    descriptionKh: 'នាឡិកាវៃឆ្លាតតាមដានសុខភាព ចង្វាក់បេះដូង ការគេង ធន់នឹងទឹក AMOLED Display ច្បាស់ត្រជាក់ភ្នែក។',
    descriptionEn: 'Full health tracking smartwatch with blood oxygen monitor, GPS and 5ATM water resistance.',
    price: 55.00,
    salePrice: 48.00,
    stock: 35,
    categoryId: 'cat-electronics',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Band Color', options: ['Black Silicone', 'Orange Sport', 'Leather Brown'] }
    ]
  },
  {
    id: 'prod-6',
    nameKh: 'កាបូបស្ពាយខ្នង Urban Waterproof Backpack',
    nameEn: 'Urban Waterproof Laptop Backpack',
    descriptionKh: 'កាបូបស្ពាយខ្នងមិនជ្រាបទឹក អាចដាក់ Laptop ទំហំ 15.6 អ៊ីញបាន មានប្រឡោះដាក់ឥវ៉ាន់ច្រើន។',
    descriptionEn: 'Minimalist water-repellent urban travel backpack with dedicated laptop sleeve.',
    price: 32.00,
    salePrice: 28.00,
    stock: 40,
    categoryId: 'cat-accessories',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Carbon Black', 'Steel Grey', 'Navy Blue'] }
    ]
  },
  {
    id: 'prod-7',
    nameKh: 'សេរ៉ូមបំប៉នផ្ទៃមុខ Hyaluronic Acid Glow Serum',
    nameEn: 'Hydrating Glow Facial Serum 50ml',
    descriptionKh: 'សេរ៉ូមជំនួយឱ្យស្បែកមុខមានសំណើម ភ្លឺថ្លា បំបាត់ស្នាមអុចខ្មៅ និងជ្រួញលើស្បែក ផលិតពីសារធាតុធម្មជាតិ។',
    descriptionEn: 'Intense hydrating and brightening face serum with hyaluronic acid and vitamin C.',
    price: 22.00,
    salePrice: 19.50,
    stock: 50,
    categoryId: 'cat-beauty',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Size', options: ['30ml', '50ml'] }
    ]
  },
  {
    id: 'prod-8',
    nameKh: 'ខោខូវប៊យជើងវែង Relaxed Fit Jeans',
    nameEn: 'Relaxed Fit Straight Leg Denim Jeans',
    descriptionKh: 'ខោខូវប៊យជើងត្រង់ ផាសុកភាពខ្ពស់ក្នុងការដើរហើរ សាច់ក្រណាត់ស្វិតជាប់បានយូរ។',
    descriptionEn: 'Everyday comfort relaxed fit straight jeans with 5 pockets and reinforced stitching.',
    price: 26.00,
    salePrice: 24.00,
    stock: 30,
    categoryId: 'cat-clothing',
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { name: 'Waist', options: ['29', '30', '31', '32', '34'] }
    ]
  }
];
