# 🛍️ Shoply - Fullstack Multi-Purpose E-Commerce Platform

Shoply គឺជាប្រព័ន្ធគេហទំព័រលក់ទំនិញអនឡាញពេញលេញ (Fullstack E-Commerce Platform) ទំនើប និងមានសុវត្ថិភាពខ្ពស់ ដែលត្រូវបានរចនាឡើងជា ៣ ផ្នែកដាច់ដោយឡែកពីគ្នា (Decoupled Architecture)៖
1. **Storefront (`client/`)**: សម្រាប់អតិថិជនទិញទំនិញ (Port `5173`)
2. **Admin Portal (`admin/`)**: ផ្ទាំងគ្រប់គ្រងដាច់ដោយឡែកសម្រាប់ម្ចាស់ហាង (Port `5174`)
3. **Backend API (`server/`)**: Express API, Prisma ORM, Telegram Bot & ABA KHQR Integration (Port `5000`)

---

## 🌟 លក្ខណៈពិសេសចម្បងៗ (Key Features)

- 🌐 **ទ្វេភាសា (Bilingual Support)**: គាំទ្រភាសាខ្មែរ 🇰🇭 និងភាសាអង់គ្លេស 🇬🇧 ពេញលេញ។
- 💳 **ទូទាត់ប្រាក់ ABA KHQR ស្វ័យប្រវត្តិ (Automatic KHQR Checkout)**:
  - ផ្ទាំង Popup Modal ផ្លូវការ (ABA KHQR) បង្ហាញ Bakong QR code ជាមួយនាទីរាប់ថយក្រោយ។
  - ស្កេនបង់ប្រាក់ពី ABA Mobile ភ្លាម ប្រព័ន្ធផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិ (Real-time Auto Verification) និងបញ្ជូនទៅកាន់វិក្កយបត្រភ្លាមៗ។
- 🤖 **ការជូនដំណឹងតាម Telegram Bot (Instant Telegram Alerts)**:
  - ផ្ញើសារជូនដំណឹងភ្លាមៗនៅពេលមាន Order ថ្មី។
  - ផ្ញើសារបញ្ជាក់ភ្លាមៗនៅពេលអតិថិជនបង់ប្រាក់ជោគជ័យ។
- 🛡️ **Admin Portal មានសុវត្ថិភាពខ្ពស់ (PIN Security Lock)**:
  - ចាក់សោដោយលេខកូដសម្ងាត់ PIN (លំនាំដើម: `1234`)។
  - ផ្ទាំង Dashboard បង្ហាញស្ថិតិប្រាក់ចំណូលសរុប និងចំនួន Orders។
  - គ្រប់គ្រងទំនិញ (បន្ថែម, កែប្រែ, លុប, គ្រប់គ្រង Stock, រូបភាព, និង Variants/Options)។
  - គ្រប់គ្រង Orders (ផ្លាស់ប្តូរ Status: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)។
  - ផ្ទាំងកំណត់ Telegram Bot & KHQRPay Gateway យ៉ាងងាយស្រួល។

---

## 🏗️ រចនាសម្ព័ន្ធប្រព័ន្ធ (Project Architecture)

```
Shoply/
├── client/          # Storefront (React 19 + Vite + Tailwind CSS) ── Port 5173
│   ├── src/components/   # Header, CartDrawer, KHQRModal, ProductCard, etc.
│   ├── src/pages/        # HomePage, ShopPage, ProductDetailPage, CheckoutPage, OrderSuccessPage
│   └── src/context/      # CartContext, LanguageContext, SettingsContext
│
├── admin/           # Admin Portal (React 19 + Vite + Tailwind CSS) ── Port 5174
│   ├── src/App.jsx       # Complete Dashboard, Orders, Products, Categories, Settings
│   └── src/components/   # PinLock Modal & Admin Controls
│
└── server/          # Backend API (Node.js + Express + Prisma) ── Port 5000
    ├── src/controllers/  # product, category, order, settings, upload
    ├── src/services/     # telegramBot, khqrccService (ABA KHQR)
    ├── src/routes/       # REST API endpoints
    └── prisma/           # schema.prisma & SQLite/PostgreSQL migrations
```

---

## 🚀 របៀបដំឡើង និងដំណើរការ (Quick Start Guide)

### ១. ទាញយក Repository (Clone)
```bash
git clone https://github.com/Biggdoqq/Shoply.git
cd Shoply
```

### ២. ដំឡើង Dependencies ទាំងអស់
```bash
npm run install:all
```

### ៣. កំណត់ Environment Variables
ចូលទៅកាន់ Folder `server/` ហើយចម្លង File `.env.example` ទៅជា `.env`៖
```bash
cd server
copy .env.example .env
```
*(បើកកែ `.env` បញ្ចូល TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, និង KHQRPAY_PROFILE_ID / SECRET_KEY របស់អ្នក)*

### ៤. បង្កើត Database និងដាក់ទិន្នន័យគំរូ (Seed Database)
```bash
npm run prisma:push
npm run seed
cd ..
```

### ៥. ដំណើរការប្រព័ន្ធទាំងអស់ (Run Everything)
នៅ Folder មេ `Shoply/` គ្រាន់តែវាយ៖
```bash
npm run dev
```

ពេលដំណើរការជោគជ័យ លោកអ្នកអាចចូលទៅកាន់៖
- 🛒 **Storefront (សម្រាប់អតិថិជន)**: [http://localhost:5173](http://localhost:5173)
- 🛡️ **Admin Portal (សម្រាប់ម្ចាស់ហាង)**: [http://localhost:5174](http://localhost:5174) *(PIN: `1234`)*
- ⚙️ **Backend API**: [http://localhost:5000/api/settings](http://localhost:5000/api/settings)

---

## 🤖 ការភ្ជាប់ Telegram Bot
1. ស្វែងរក [@BotFather](https://t.me/BotFather) លើ Telegram រួចវាយ `/newbot` ដើម្បីយក **Bot Token**
2. ស្វែងរក [@userinfobot](https://t.me/userinfobot) ដើម្បីយក **Chat ID** របស់អ្នក (ឬ Invite Bot ចូល Group រួចយក Group ID)
3. ចូលទៅ **Admin Portal** -> **Telegram & Settings** រួចបំពេញ Bot Token និង Chat ID ហើយចុច **Send Test Message** ដើម្បីផ្ទៀងផ្ទាត់។

---

## 💳 ការភ្ជាប់ ABA KHQR Gateway (KHQRPay)
1. ចុះឈ្មោះគណនីនៅលើ [KHQRcc Gateway](https://khqr.cc)
2. ចម្លងយក **Profile ID** និង **Secret Key** ដាក់ក្នុង `server/.env`
3. រាល់ពេលអតិថិជនកុម្ម៉ង់ទំនិញ ផ្ទាំង ABA KHQR នឹងលោតចេញមកស្វ័យប្រវត្តិ។

---

## 📜 អាជ្ញាប័ណ្ណ (License)
MIT License © 2026 Shoply. All rights reserved.
