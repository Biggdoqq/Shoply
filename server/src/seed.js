import prisma from './prisma.js';

async function main() {
  console.log('🌱 Clearing existing database records...');
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.setting.deleteMany({});

  console.log('🌱 Seeding default settings...');
  const settings = [
    { key: 'store_name', value: 'Shoply Store' },
    { key: 'currency', value: '$' },
    { key: 'delivery_fee', value: '1.50' },
    { key: 'phone_number', value: '012 345 678' },
    { key: 'telegram_bot_token', value: '' },
    { key: 'telegram_chat_id', value: '' },
    { key: 'khqr_name', value: 'SHOPLY STORE CO., LTD' },
    { key: 'khqr_account', value: '001 568 992' },
  ];

  for (const s of settings) {
    await prisma.setting.create({ data: s });
  }

  console.log('🌱 Seeding categories...');
  const categoriesData = [
    {
      nameKh: 'សម្លៀកបំពាក់',
      nameEn: 'Clothing',
      slug: 'clothing',
      icon: 'Shirt',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    },
    {
      nameKh: 'ស្បែកជើង',
      nameEn: 'Shoes & Footwear',
      slug: 'shoes',
      icon: 'Footprints',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    },
    {
      nameKh: 'គ្រឿងអេឡិចត្រូនិច',
      nameEn: 'Electronics & Gadgets',
      slug: 'electronics',
      icon: 'Smartphone',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    },
    {
      nameKh: 'កាបូប & គ្រឿងតុបតែង',
      nameEn: 'Bags & Accessories',
      slug: 'accessories',
      icon: 'Watch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    },
    {
      nameKh: 'គ្រឿងសម្អាង & ថែរក្សាសម្រស់',
      nameEn: 'Beauty & Skincare',
      slug: 'beauty',
      icon: 'Sparkles',
      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    }
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created.id;
  }

  console.log('🌱 Seeding products...');
  const products = [
    // Clothing
    {
      nameKh: 'អាវយឺតដៃខ្លី Oversized Minimalist',
      nameEn: 'Oversized Minimalist Cotton T-Shirt',
      descriptionKh: 'សាច់ក្រណាត់កប្បាស 100% Cotton ទន់ត្រជាក់ ស្រួលពាក់ មិនបែកព្រុយ ស័ក្តិសមសម្រាប់អាកាសធាតុក្តៅ។',
      descriptionEn: 'Premium 100% breathable organic cotton oversized tee. Modern dropped shoulder silhouette.',
      price: 14.50,
      salePrice: 12.00,
      stock: 45,
      categoryId: categories['clothing'],
      isFeatured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
        { name: 'Color', options: ['White', 'Black', 'Olive Green', 'Cream'] }
      ])
    },
    {
      nameKh: 'អាវក្រៅខូវប៊យ Denim Vintage Jacket',
      nameEn: 'Vintage Washed Denim Jacket',
      descriptionKh: 'អាវខូវប៊យស្ទីល Vintage ពេញនិយម ក្រណាត់ក្រាស់គុណភាពខ្ពស់ ងាយស្រួល Mix & Match ជាមួយខោអាវគ្រប់ប្រភេទ។',
      descriptionEn: 'Heavyweight classic denim jacket with durable metal buttons and vintage washed texture.',
      price: 38.00,
      salePrice: 32.50,
      stock: 20,
      categoryId: categories['clothing'],
      isFeatured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Size', options: ['M', 'L', 'XL'] },
        { name: 'Color', options: ['Classic Blue', 'Vintage Black'] }
      ])
    },
    {
      nameKh: 'ខោខូវប៊យជើងវែង Relaxed Fit Jeans',
      nameEn: 'Relaxed Fit Straight Leg Denim Jeans',
      descriptionKh: 'ខោខូវប៊យជើងត្រង់ ផាសុកភាពខ្ពស់ក្នុងការដើរហើរ សាច់ក្រណាត់ស្វិតជាប់បានយូរ។',
      descriptionEn: 'Everyday comfort relaxed fit straight jeans with 5 pockets and reinforced stitching.',
      price: 26.00,
      salePrice: null,
      stock: 30,
      categoryId: categories['clothing'],
      isFeatured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Waist', options: ['29', '30', '31', '32', '34'] }
      ])
    },

    // Shoes
    {
      nameKh: 'ស្បែកជើងប៉ាតា Ultra Boost Running Sneakers',
      nameEn: 'Ultra Boost Breathable Running Sneakers',
      descriptionKh: 'ស្បែកជើងប៉ាតាស្រាលស្រួលពាក់ បាតទ្រាប់ទន់កាត់បន្ថយការឈឺជើងពេលដើរ ឬហាត់ប្រាណ។',
      descriptionEn: 'Super light running shoes with ergonomic cushioning foam and mesh upper for maximum ventilation.',
      price: 49.00,
      salePrice: 42.00,
      stock: 15,
      categoryId: categories['shoes'],
      isFeatured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Size (EU)', options: ['39', '40', '41', '42', '43', '44'] },
        { name: 'Color', options: ['Fire Red', 'Triple Black', 'Pure White'] }
      ])
    },
    {
      nameKh: 'ស្បែកជើងស្បែក Chelsea Boots',
      nameEn: 'Classic Leather Chelsea Boots',
      descriptionKh: 'ស្បែកជើងកវែងម៉ូត Chelsea ស្បែកសុទ្ធ ភាពថ្លៃថ្នូរ និងទាន់សម័យ។',
      descriptionEn: 'Genuine leather ankle boots with elastic side gusset and slip-resistant rubber sole.',
      price: 65.00,
      salePrice: null,
      stock: 12,
      categoryId: categories['shoes'],
      isFeatured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Size (EU)', options: ['40', '41', '42', '43'] },
        { name: 'Color', options: ['Dark Brown', 'Black'] }
      ])
    },

    // Electronics & Gadgets
    {
      nameKh: 'កាសឥតខ្សែ Wireless ANC Headphones',
      nameEn: 'Pro Wireless Active Noise Cancelling Headphones',
      descriptionKh: 'កាសបំពាក់ប្រព័ន្ធកាត់បន្ថយសម្លេងរំខាន ANC សំឡេងបាសធ្ងន់ច្បាស់ល្អ ថ្មកាន់បាន 40 ម៉ោង។',
      descriptionEn: 'Premium high-resolution sound with 40-hour battery life, hybrid ANC, and fast USB-C charging.',
      price: 59.00,
      salePrice: 49.00,
      stock: 25,
      categoryId: categories['electronics'],
      isFeatured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Color', options: ['Matte Black', 'Silver Grey', 'Midnight Blue'] }
      ])
    },
    {
      nameKh: 'នាឡិកាវៃឆ្លាត Smart Watch Ultra Fit',
      nameEn: 'Ultra Fit GPS Smart Watch',
      descriptionKh: 'នាឡិកាវៃឆ្លាតវាស់ចង្វាក់បេះដូង ការគេង ជំហានដើរ ការពារជម្រាបទឹកកម្រិត 50M និងថ្មកាន់បាន 10 ថ្ងៃ។',
      descriptionEn: 'AMOLED touch display, heart rate & SpO2 tracking, 100+ workout modes, 5ATM water resistance.',
      price: 45.00,
      salePrice: 38.00,
      stock: 18,
      categoryId: categories['electronics'],
      isFeatured: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Strap Color', options: ['Black Silicone', 'Orange Sport', 'Titanium Silver'] }
      ])
    },

    // Bags & Accessories
    {
      nameKh: 'កាបូបស្ពាយខ្នង Minimalist Waterproof Backpack',
      nameEn: 'Minimalist Waterproof Laptop Backpack (15.6")',
      descriptionKh: 'កាបូបស្ពាយការពារជ្រាបទឹក មានថតដាក់ Laptop 15.6" សុវត្ថិភាព និងងាយស្រួលយកតាមខ្លួនពេលធ្វើដំណើរ។',
      descriptionEn: 'Sleek weather-proof everyday backpack with dedicated padded laptop compartment and hidden anti-theft pocket.',
      price: 29.50,
      salePrice: 25.00,
      stock: 35,
      categoryId: categories['accessories'],
      isFeatured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Color', options: ['Charcoal Black', 'Heather Grey', 'Olive'] }
      ])
    },

    // Beauty & Skincare
    {
      nameKh: 'សេរ៉ូមផ្តល់សំណើម Hyaluronic Hydrating Serum',
      nameEn: 'Organic Hyaluronic Acid Hydrating Serum (50ml)',
      descriptionKh: 'សេរ៉ូមធម្មជាតិជួយបំប៉នស្បែកមុខឱ្យមានសំណើម ភ្លឺថ្លា និងកាត់បន្ថយភាពជ្រីវជ្រួញ។',
      descriptionEn: 'Deep hydration serum infused with 2% pure hyaluronic acid, Vitamin B5, and botanical extracts.',
      price: 18.00,
      salePrice: 15.00,
      stock: 50,
      categoryId: categories['beauty'],
      isFeatured: false,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80'
      ]),
      variants: JSON.stringify([
        { name: 'Volume', options: ['30ml', '50ml'] }
      ])
    }
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('✅ Database seeded successfully with multi-category store products & settings!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
