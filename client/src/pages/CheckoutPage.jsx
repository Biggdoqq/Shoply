import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2, ShieldCheck, QrCode, Banknote, Upload, AlertCircle, Check, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { createOrder, uploadPaymentProof, createPaymentSession } from '../api';
import AbaLogo from '../components/AbaLogo';
import KHQRModal from '../components/KHQRModal';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { lang, t } = useLanguage();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerTelegram: '',
    cityProvince: 'Phnom Penh (រាជធានីភ្នំពេញ)',
    address: '',
    notes: '',
    paymentMethod: 'cod', // 'cod' or 'khqr'
  });

  const [paymentProofFile, setPaymentProofFile] = useState(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const deliveryFee = parseFloat(settings.delivery_fee || '1.50');
  const totalAmount = subtotal + (items.length > 0 ? deliveryFee : 0);
  const khrTotal = (Math.round(totalAmount * 4100)).toLocaleString();

  if (items.length === 0 && !createdOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">{t('cart_empty')}</h2>
        <p className="text-xs text-gray-500">
          {lang === 'km' ? 'សូមជ្រើសរើសទំនិញដាក់ចូលកន្ត្រកមុននឹងធ្វើការទូទាត់។' : 'Please add some products to your cart before checking out.'}
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors"
        >
          {t('start_shopping')}
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProofChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentProofFile(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.customerName.trim() || !form.customerPhone.trim() || !form.address.trim()) {
      setErrorMsg(lang === 'km' ? 'សូមបំពេញព័ត៌មានចាំបាច់ (ឈ្មោះ, លេខទូរស័ព្ទ, និងអាសយដ្ឋាន)!' : 'Please fill in all required fields (Name, Phone, Address)!');
      return;
    }

    setSubmitting(true);

    try {
      let uploadedProofUrl = null;
      if (paymentProofFile) {
        const formData = new FormData();
        formData.append('image', paymentProofFile);
        const uploadRes = await uploadPaymentProof(formData);
        uploadedProofUrl = uploadRes.data.url;
      }

      const orderPayload = {
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerTelegram: form.customerTelegram,
        address: form.address,
        cityProvince: form.cityProvince,
        notes: form.notes,
        paymentMethod: form.paymentMethod,
        paymentProof: uploadedProofUrl,
        items: items.map(item => ({
          productId: item.productId,
          name: lang === 'km' ? item.nameKh || item.name : item.nameEn || item.name,
          price: item.price,
          quantity: item.quantity,
          selectedVariant: item.selectedVariant,
          image: item.image,
        })),
        deliveryFee,
      };

      if (form.paymentMethod === 'khqr') {
        if (createdOrder) {
          setShowQRModal(true);
          return;
        }
        const res = await createOrder(orderPayload);
        const created = res.data;
        setCreatedOrder(created);
        setShowQRModal(true);
      } else {
        const res = await createOrder(orderPayload);
        const created = res.data;
        const orderNumber = created.orderNumber || created.id;
        clearCart();
        navigate(`/order-success/${orderNumber}`);
      }
    } catch (err) {
      console.error('Failed to submit order:', err);
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'km' ? 'ត្រឡប់ក្រោយ' : 'Back'}</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            {t('checkout_title')}
          </h1>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {createdOrder && !showQRModal && (
        <div className="mb-6 p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sky-900 text-xs">
            <AbaLogo className="w-5 h-5 shrink-0" />
            <span>
              {lang === 'km' 
                ? `ការកុម្ម៉ង់របស់អ្នក (#${createdOrder.orderNumber || createdOrder.id}) ត្រូវបានបង្កើតរួចរាល់។ អ្នកអាចបង់ប្រាក់ឥឡូវនេះបាន។` 
                : `Your order (#${createdOrder.orderNumber || createdOrder.id}) has been created. You can pay now.`}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowQRModal(true)}
            className="px-4 py-2 rounded-xl bg-[#005377] hover:bg-[#004260] text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            {lang === 'km' ? 'បើក ABA KHQR ឡើងវិញ' : 'Open ABA KHQR Again'}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Shipping & Payment Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Information Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>{t('customer_info')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {t('full_name')} *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="e.g. Sok Heang"
                  value={form.customerName}
                  onChange={handleInputChange}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {t('phone_number')} *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  required
                  placeholder="e.g. 012 345 678"
                  value={form.customerPhone}
                  onChange={handleInputChange}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {t('city_province')}
                </label>
                <select
                  name="cityProvince"
                  value={form.cityProvince}
                  onChange={handleInputChange}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden bg-white"
                >
                  <option value="Phnom Penh (រាជធានីភ្នំពេញ)">Phnom Penh (រាជធានីភ្នំពេញ)</option>
                  <option value="Kandal (ខេត្តកណ្តាល)">Kandal (ខេត្តកណ្តាល)</option>
                  <option value="Siem Reap (ខេត្តសៀមរាប)">Siem Reap (ខេត្តសៀមរាប)</option>
                  <option value="Battambang (ខេត្តបាត់ដំបង)">Battambang (ខេត្តបាត់ដំបង)</option>
                  <option value="Preah Sihanouk (ខេត្តព្រះសីហនុ)">Preah Sihanouk (ខេត្តព្រះសីហនុ)</option>
                  <option value="Kampong Cham (ខេត្តកំពង់ចាម)">Kampong Cham (ខេត្តកំពង់ចាម)</option>
                  <option value="Kampot (ខេត្តកំពត)">Kampot (ខេត្តកំពត)</option>
                  <option value="Other Provinces (ខេត្តផ្សេងទៀត)">Other Provinces (ខេត្តផ្សេងទៀត)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  {t('telegram_username')}
                </label>
                <input
                  type="text"
                  name="customerTelegram"
                  placeholder="@username or phone"
                  value={form.customerTelegram}
                  onChange={handleInputChange}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t('delivery_address')} *
              </label>
              <textarea
                name="address"
                rows="2"
                required
                placeholder="House No, Street No, Sangkat, Khan..."
                value={form.address}
                onChange={handleInputChange}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                {t('order_notes')}
              </label>
              <input
                type="text"
                name="notes"
                placeholder={lang === 'km' ? 'ឧទាហរណ៍៖ សូមហៅមកមុនពេលដឹកជញ្ជូន...' : 'e.g. Please call before arriving...'}
                value={form.notes}
                onChange={handleInputChange}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>{t('payment_method')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* COD Option */}
              <label
                className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  form.paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-600/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={form.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${form.paymentMethod === 'cod' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-gray-900 block leading-snug">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {t('cod_desc')}
                    </span>
                  </div>
                </div>
              </label>

              {/* ABA Pay Option */}
              <label
                className={`relative flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  form.paymentMethod === 'khqr'
                    ? 'border-[#005377] bg-[#005377]/5 ring-2 ring-[#005377]/15'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="khqr"
                  checked={form.paymentMethod === 'khqr'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <AbaLogo className="w-10 h-10 rounded-xl" />
                  <div>
                    <span className="font-bold text-sm text-gray-900 block leading-snug">
                      ABA Pay (ABA Mobile)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {lang === 'km' ? 'ទូទាត់ប្រាក់តាម ABA Mobile ឬ ABA KHQR' : 'Pay via ABA Mobile or ABA KHQR'}
                    </span>
                  </div>
                </div>
              </label>
            </div>

            {/* If ABA Pay selected, display clean automatic payment preview banner */}
            {form.paymentMethod === 'khqr' && (
              <div className="mt-4 p-5 rounded-2xl bg-linear-to-br from-sky-50/70 via-blue-50/40 to-slate-50 border border-blue-200/80 space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-100/80">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#005377] text-white font-black text-[11px] tracking-tight">
                      ABA Pay
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {lang === 'km' ? 'ប្រព័ន្ធទូទាត់ស្វ័យប្រវត្តិតាម ABA Bank / ABA Mobile' : 'Instant Auto Payment via ABA Bank'}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Auto-Verified</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#005377] shrink-0" />
                    <span>{lang === 'km' ? 'ចុចប៊ូតុង "Pay with ABA Mobile" ដើម្បីបើកកម្មវិធី ABA ផ្ទាល់លើទូរស័ព្ទដៃ' : 'Tap "Pay with ABA Mobile" to open ABA app directly on your phone'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#005377] shrink-0" />
                    <span>{lang === 'km' ? 'ស្កេនទូទាត់ជាមួយកម្មវិធី ABA Mobile ឬកម្មវិធី Bakong បានយ៉ាងងាយស្រួល' : 'Scan to pay with ABA Mobile or any Bakong banking app'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#005377] shrink-0" />
                    <span>{lang === 'km' ? 'ប្រព័ន្ធបញ្ជាក់ការទូទាត់ភ្លាមៗដោយស្វ័យប្រវត្តិ មិនចាំបាច់ផ្ញើរូបវិក្កយបត្រឡើយ' : 'Instant real-time verification — no need to upload receipt screenshots'}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-blue-100/70 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">
                    {lang === 'km' ? 'ចំនួនទឹកប្រាក់ត្រូវទូទាត់:' : 'Payable Amount:'}
                  </span>
                  <div className="text-right">
                    <span className="font-mono font-black text-[#005377] text-sm sm:text-base">
                      ${totalAmount.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-gray-400 ml-1.5 font-semibold">
                      (≈ {khrTotal} ៛)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6 sticky top-24">
            <h3 className="font-bold text-gray-900 text-base">
              {t('order_summary')} ({items.length})
            </h3>

            {/* Items list */}
            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-gray-100 pr-1">
              {items.map((item) => {
                const itemTitle = lang === 'km' ? item.nameKh || item.name : item.nameEn || item.name;
                const variantsText = item.selectedVariant
                  ? typeof item.selectedVariant === 'object'
                    ? Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(' | ')
                    : item.selectedVariant
                  : null;

                return (
                  <div key={item.cartItemId} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={itemTitle}
                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
                      />
                      <div className="min-w-0">
                        <span className="font-medium text-gray-800 block truncate">
                          {itemTitle}
                        </span>
                        {variantsText && (
                          <span className="text-[10px] text-indigo-600 block">
                            {variantsText}
                          </span>
                        )}
                        <span className="text-gray-400">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('delivery_fee')}</span>
                <span className="font-bold text-gray-900">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 text-base">
                <span className="font-bold text-gray-900">{t('total_amount')}</span>
                <div className="text-right">
                  <span className="font-black text-xl text-indigo-600">${totalAmount.toFixed(2)}</span>
                  <div className="text-[11px] font-semibold text-gray-500">
                    ≈ {khrTotal} ៛ (KHR)
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 px-4 rounded-2xl text-white font-bold text-sm shadow-xl active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${
                form.paymentMethod === 'khqr'
                  ? 'bg-[#005377] hover:bg-[#004260] shadow-[#005377]/25'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
            >
              {submitting ? (
                <span>{t('placing_order')}</span>
              ) : (
                <>
                  {form.paymentMethod === 'khqr' ? (
                    <>
                      <AbaLogo className="w-5 h-5 rounded-md" />
                      <span>{lang === 'km' ? `បញ្ជាក់ការកុម្ម៉ង់ និងទូទាត់ ABA Pay ($${totalAmount.toFixed(2)})` : `Place Order & Pay via ABA Pay ($${totalAmount.toFixed(2)})`}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('place_order_btn')}</span>
                    </>
                  )}
                </>
              )}
            </button>

            {/* Info guarantee */}
            <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{lang === 'km' ? 'ការជូនដំណឹងនឹងត្រូវផ្ញើទៅ Telegram របស់ហាងភ្លាមៗ' : 'Instant notification will be sent to the store Telegram'}</span>
            </div>

          </div>
        </div>

      </form>

      {/* ABA KHQR Popup Modal */}
      <KHQRModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        amount={createdOrder ? createdOrder.totalAmount : totalAmount}
        orderNumber={createdOrder ? (createdOrder.orderNumber || createdOrder.id) : ''}
        onConfirmPaid={() => {
          clearCart();
          setShowQRModal(false);
          const num = createdOrder ? (createdOrder.orderNumber || createdOrder.id) : '';
          navigate(`/order-success/${num}`);
        }}
      />

    </div>
  );
}
