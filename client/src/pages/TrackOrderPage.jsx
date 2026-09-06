import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Send, 
  AlertCircle, 
  ArrowLeft,
  XCircle,
  FileText
} from 'lucide-react';
import { trackOrder, getOrderById } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

export default function TrackOrderPage() {
  const { lang, t } = useLanguage();
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('order') || searchParams.get('id') || '';

  const [searchInput, setSearchInput] = useState(queryParam);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (queryParam) {
      handleSearchOrder(queryParam);
    }
  }, [queryParam]);

  const handleSearchOrder = async (searchTerm) => {
    const term = (searchTerm || searchInput).trim();
    if (!term) return;

    setLoading(true);
    setErrorMsg('');
    setSearched(true);

    try {
      // First try fetching directly by order ID or Order Number
      try {
        const directRes = await getOrderById(term);
        if (directRes.data && directRes.data.id) {
          setOrder(directRes.data);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback to searching by phone or partial match
      }

      // Fallback: search across orders
      const res = await trackOrder(term);
      const list = res.data || [];
      if (list.length > 0) {
        setOrder(list[0]);
      } else {
        setOrder(null);
        setErrorMsg(lang === 'km' 
          ? 'រកមិនឃើញការកុម្ម៉ង់ដែលត្រូវនឹងលេខនេះឡើយ។ សូមពិនិត្យលេខបញ្ជាទិញ ឬលេខទូរស័ព្ទឡើងវិញ។' 
          : 'No order found matching this reference. Please check your order number or phone number.');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setErrorMsg(lang === 'km' ? 'មានបញ្ហាក្នុងការស្វែងរក សូមព្យាយាមម្តងទៀត។' : 'Error searching for order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ order: searchInput.trim() });
      handleSearchOrder(searchInput.trim());
    }
  };

  // Timeline Step calculation
  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 1;
      case 'CONFIRMED': return 2;
      case 'SHIPPED': return 3;
      case 'DELIVERED': return 4;
      case 'CANCELLED': return -1;
      default: return 1;
    }
  };

  const steps = [
    { key: 'PENDING', labelKm: 'រង់ចាំការបញ្ជាក់', labelEn: 'Order Placed', descKm: 'ហាងបានទទួល Order រួចរាល់', descEn: 'Order received by store' },
    { key: 'CONFIRMED', labelKm: 'បានបញ្ជាក់ Order', labelEn: 'Confirmed', descKm: 'ហាងបានត្រួតពិនិត្យ និងវេចខ្ចប់', descEn: 'Packed and verified' },
    { key: 'SHIPPED', labelKm: 'កំពុងដឹកជញ្ជូន', labelEn: 'Out for Delivery', descKm: 'ទំនិញត្រូវបានប្រគល់ជូនអ្នកដឹក', descEn: 'Handed to delivery rider' },
    { key: 'DELIVERED', labelKm: 'បានប្រគល់ទំនិញ', labelEn: 'Delivered', descKm: 'អតិថិជនបានទទួលទំនិញជោគជ័យ', descEn: 'Package delivered successfully' },
  ];

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isCancelled = order?.status === 'CANCELLED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
          <Truck className="w-4 h-4 text-indigo-600" />
          <span>{lang === 'km' ? 'ប្រព័ន្ធតាមដានទំនិញ' : 'Live Order Tracker'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {lang === 'km' ? 'តាមដានការកុម្ម៉ង់ទំនិញរបស់អ្នក' : 'Track Your Order Status'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          {lang === 'km' 
            ? 'បញ្ចូលលេខកូដបញ្ជាទិញ (ឧ. SH-260905-XXXX) ឬលេខទូរស័ព្ទរបស់អ្នក ដើម្បីពិនិត្យមើលដំណាក់កាលដឹកជញ្ជូន' 
            : 'Enter your order number (e.g. SH-260905-XXXX) or phone number to see real-time delivery progress.'}
        </p>
      </div>

      {/* Search Bar Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              placeholder={lang === 'km' ? 'លេខ Order (SH-...) ឬលេខទូរស័ព្ទ...' : 'Order Number (SH-...) or Phone...'}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 hover:bg-gray-100/70 focus:bg-white text-xs sm:text-sm rounded-2xl border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-hidden font-medium transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? (lang === 'km' ? 'កំពុងស្វែងរក...' : 'Tracking...') : (lang === 'km' ? 'តាមដាន' : 'Track Order')}</span>
          </button>
        </form>
      </div>

      {/* Error / Not Found Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center text-xs text-rose-700 font-medium max-w-2xl mx-auto flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Result Details */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-8">
          
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-gray-400 font-semibold">{t('order_number')}:</span>
                <span className="font-mono font-black text-indigo-600 text-base sm:text-lg">{order.orderNumber}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {lang === 'km' ? 'កាលបរិច្ឆេទកុម្ម៉ង់៖' : 'Ordered on:'} {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {t(order.status) || order.status}
              </span>
            </div>
          </div>

          {/* Cancelled Banner */}
          {isCancelled ? (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-center space-y-1">
              <XCircle className="w-8 h-8 text-rose-500 mx-auto" />
              <h3 className="font-bold text-rose-900 text-sm">{lang === 'km' ? 'ការកុម្ម៉ង់នេះត្រូវបានបោះបង់' : 'This Order Has Been Cancelled'}</h3>
              <p className="text-xs text-rose-600">
                {lang === 'km' ? 'ប្រសិនបើមានចម្ងល់ សូមទាក់ទងមកកាន់ហាងតាម Telegram ឬទូរស័ព្ទ។' : 'If you have any questions, please contact our support team.'}
              </p>
            </div>
          ) : (
            /* Visual Progress Timeline (Steps) */
            <div className="space-y-4">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                {lang === 'km' ? 'ដំណើរការនៃការដឹកជញ្ជូន' : 'Delivery Progress'}
              </span>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {steps.map((s, idx) => {
                  const stepNum = idx + 1;
                  const isDone = currentStep >= stepNum;
                  const isCurrent = currentStep === stepNum;
                  return (
                    <div
                      key={s.key}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200'
                          : isDone
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-gray-50/50 border-gray-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-gray-900 leading-tight">
                        {lang === 'km' ? s.labelKm : s.labelEn}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 leading-snug">
                        {lang === 'km' ? s.descKm : s.descEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customer & Shipping Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
            <div className="space-y-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="font-bold text-gray-900 text-sm block">
                {lang === 'km' ? 'ព័ត៌មានអតិថិជន & អាសយដ្ឋាន' : 'Customer & Delivery Info'}
              </span>
              <div className="space-y-1.5 text-gray-600">
                <div><span className="text-gray-400">Name:</span> <b className="text-gray-800">{order.customerName}</b></div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="text-gray-400">Phone:</span> 
                  <a href={`tel:${order.customerPhone}`} className="font-bold text-indigo-600 hover:underline">{order.customerPhone}</a>
                </div>
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400">Address:</span> <span className="font-medium text-gray-800">{order.cityProvince}, {order.address}</span>
                  </div>
                </div>
                {order.notes && (
                  <div className="pt-1 text-[11px] text-gray-500 italic">
                    Note: "{order.notes}"
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <span className="font-bold text-gray-900 text-sm block">
                {lang === 'km' ? 'វិធីសាស្ត្រទូទាត់ប្រាក់' : 'Payment Information'}
              </span>
              <div className="space-y-1.5 text-gray-600">
                <div>
                  <span className="text-gray-400">Method:</span>{' '}
                  <span className="font-bold text-gray-800 uppercase">
                    {order.paymentMethod === 'khqr' ? 'Bakong KHQR' : 'Cash On Delivery (COD)'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Delivery Fee:</span>{' '}
                  <span className="font-semibold text-gray-800">${Number(order.deliveryFee || 1.5).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200/80 flex items-baseline justify-between">
                  <span className="font-bold text-gray-900 text-xs uppercase">Total Amount:</span>
                  <div className="text-right">
                    <span className="font-black text-indigo-600 text-base">${Number(order.totalAmount).toFixed(2)}</span>
                    <span className="text-[11px] text-gray-400 block">≈ {(Math.round(order.totalAmount * 4100)).toLocaleString()} ៛</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items List */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {lang === 'km' ? 'ទំនិញដែលបានកុម្ម៉ង់' : 'Items Ordered'} ({(order.items || []).length})
            </span>

            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {(order.items || []).map((it, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-gray-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xs">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-gray-900 text-xs block truncate">{it.name}</span>
                      {it.selectedVariant && (
                        <span className="text-[11px] text-indigo-600 block">
                          {typeof it.selectedVariant === 'object' ? Object.entries(it.selectedVariant).map(([k,v])=>`${k}: ${v}`).join(', ') : it.selectedVariant}
                        </span>
                      )}
                      <span className="text-[11px] text-gray-400">Qty: {it.quantity} × ${Number(it.price).toFixed(2)}</span>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 text-xs shrink-0">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Support Strip */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-indigo-950 block">
                {lang === 'km' ? 'ត្រូវការជំនួយ ឬចង់សាកសួរព័ត៌មានបន្ថែម?' : 'Need Help With This Order?'}
              </span>
              <span className="text-indigo-700 text-[11px]">
                {lang === 'km' ? 'ទាក់ទងមកកាន់ម្ចាស់ហាងផ្ទាល់តាមរយៈ Telegram ឬទូរស័ព្ទ' : 'Contact our store manager directly via Telegram or Phone'}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {(settings.telegram_link || settings.telegram_handle || settings.telegram_chat_id) ? (
                <a
                  href={(() => {
                    const raw = (settings.telegram_link || settings.telegram_handle || settings.telegram_chat_id || '').trim();
                    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
                    if (raw.startsWith('t.me/')) return `https://${raw}`;
                    if (raw.startsWith('@')) return `https://t.me/${raw.slice(1)}`;
                    return `https://t.me/${raw}`;
                  })()}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram Support</span>
                </a>
              ) : null}
              {settings.phone_number ? (
                <a
                  href={`tel:${settings.phone_number}`}
                  className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 font-bold text-xs flex items-center gap-1.5 hover:bg-gray-50 transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{settings.phone_number}</span>
                </a>
              ) : null}
            </div>
          </div>

        </div>
      )}

      {/* Back to Home / Shop Links */}
      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'km' ? 'ត្រឡប់ទៅទំព័រទំនិញ' : 'Continue Shopping'}</span>
        </Link>
      </div>

    </div>
  );
}
