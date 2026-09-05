import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Send, 
  Printer, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Calendar, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  ExternalLink, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Banknote,
  Copy,
  Check
} from 'lucide-react';
import { getOrderById, checkPaymentStatus, createPaymentSession } from '../api';
import { useLanguage } from '../context/LanguageContext';
import AbaLogo from '../components/AbaLogo';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const { lang, t } = useLanguage();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Embedded Payment Session State
  const [paymentSession, setPaymentSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const pollingRef = useRef(null);

  // 1. Fetch Order Details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // 2. Initialize Embedded ABA Payment Session & Real-time Polling
  useEffect(() => {
    if (!order || order.paymentMethod !== 'khqr') return;

    // If order already confirmed, do nothing
    if (order.status === 'CONFIRMED' || order.paymentProof === 'KHQRPAY_AUTO_CONFIRMED') {
      return;
    }

    const orderNumber = order.orderNumber || orderId;

    // Request KHQR session for embedded checkout
    setLoadingSession(true);
    createPaymentSession({
      orderNumber,
      amount: order.totalAmount,
      currency: 'USD',
      returnUrl: `${window.location.origin}/order-success/${orderNumber}`,
    })
      .then(res => {
        setPaymentSession(res.data);
      })
      .catch(err => {
        console.warn('Could not create embedded KHQR session:', err);
      })
      .finally(() => {
        setLoadingSession(false);
      });

    // Start status polling every 2.5s
    pollingRef.current = setInterval(async () => {
      try {
        const res = await checkPaymentStatus(orderNumber);
        if (res.data?.isPaid || res.data?.status === 'CONFIRMED') {
          setOrder(prev => ({
            ...prev,
            status: 'CONFIRMED',
            paymentProof: 'KHQRPAY_AUTO_CONFIRMED',
          }));
          if (pollingRef.current) clearInterval(pollingRef.current);
        }
      } catch (e) {
        // Silent polling error
      }
    }, 2500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [order?.orderNumber, order?.status, order?.paymentMethod, orderId]);

  const handleCopyOrderNumber = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderNumber || orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
          <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-gray-700">
          {lang === 'km' ? 'កំពុងទាញយកព័ត៌មានការកុម្ម៉ង់...' : 'Loading order details...'}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">
          {lang === 'km' ? 'រកមិនឃើញការកុម្ម៉ង់នេះឡើយ' : 'Order Not Found'}
        </h2>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('continue_shopping')}</span>
        </Link>
      </div>
    );
  }

  const items = order.items || [];
  const totalAmount = order.totalAmount || 0;
  const khrTotal = (Math.round(totalAmount * 4100)).toLocaleString();
  const isPaid = order.status === 'CONFIRMED' || order.paymentProof === 'KHQRPAY_AUTO_CONFIRMED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              {lang === 'km' ? 'ព័ត៌មានការកុម្ម៉ង់ & ការទូទាត់' : 'Order Details & Payment'}
            </h1>
            {isPaid ? (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'km' ? 'បានទូទាត់ជោគជ័យ' : 'Paid & Verified'}</span>
              </span>
            ) : order.paymentMethod === 'khqr' ? (
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#005377] border border-blue-100 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#005377]" />
                <span>{lang === 'km' ? 'រង់ចាំការទូទាត់ ABA' : 'Awaiting ABA Pay'}</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>{lang === 'km' ? 'រង់ចាំការដឹកជញ្ជូន (COD)' : 'Cash on Delivery'}</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
            <span>{lang === 'km' ? 'លេខកុម្ម៉ង់:' : 'Order ID:'}</span>
            <button
              onClick={handleCopyOrderNumber}
              className="font-mono font-bold text-gray-900 hover:text-indigo-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
              title="Copy Order ID"
            >
              <span>{order.orderNumber || orderId}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3 text-gray-400" />}
            </button>
            <span>•</span>
            <span>{new Date(order.createdAt || Date.now()).toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            <span>{t('print_receipt')}</span>
          </button>
          <Link
            to="/shop"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t('continue_shopping')}</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Products (7 cols) + Payment (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Order Status & Products */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Status Notification Banner */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-gray-900 text-base">
                {t('order_success_title')}
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {t('order_success_subtitle')}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>{lang === 'km' ? 'Telegram Bot បានផ្ញើ Order នេះទៅម្ចាស់ហាងរួចរាល់' : 'Telegram Bot sent this order notification to store manager'}</span>
              </div>
            </div>
          </div>

          {/* Purchased Products Itemized List */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>{lang === 'km' ? 'ទំនិញដែលបានកុម្ម៉ង់' : 'Purchased Products'} ({items.length})</span>
              </h3>
              <span className="text-xs text-gray-400 font-mono">
                #{order.orderNumber || orderId}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              {items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover bg-gray-100 shrink-0 border border-gray-100 shadow-2xs"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="font-bold text-gray-900 text-sm block truncate">
                        {item.name}
                      </span>
                      {item.selectedVariant && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-semibold">
                          {typeof item.selectedVariant === 'object'
                            ? Object.entries(item.selectedVariant).map(([k, v]) => `${k}: ${v}`).join(' | ')
                            : item.selectedVariant}
                        </span>
                      )}
                      <span className="text-gray-400 block mt-1 font-medium">
                        {item.quantity} × ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-gray-900 text-sm sm:text-base">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-gray-900">${Number(order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('delivery_fee')}</span>
                <span className="font-bold text-gray-900">${Number(order.deliveryFee || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-gray-100 text-sm">
                <span className="font-bold text-gray-900">{t('total_amount')}</span>
                <div className="text-right">
                  <span className="font-black text-xl text-indigo-600">
                    ${Number(totalAmount).toFixed(2)}
                  </span>
                  <div className="text-[11px] text-gray-400 font-semibold mt-0.5">
                    ≈ {khrTotal} ៛ (KHR)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4 text-xs">
            <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wider pb-3 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>{t('customer_info')} & {t('delivery_address')}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 pt-1">
              <div className="space-y-2">
                <div>
                  <span className="text-gray-400 block text-[11px]">{t('full_name')}:</span>
                  <span className="font-bold text-gray-900 text-sm">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="font-medium">{order.customerPhone}</span>
                </div>
                {order.customerTelegram && (
                  <div className="flex items-center gap-2 text-indigo-600">
                    <Send className="w-3.5 h-3.5" />
                    <span>{order.customerTelegram}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-400 block text-[11px]">{t('delivery_address')}:</span>
                <span className="font-semibold text-gray-800 block">{order.cityProvince}</span>
                <span className="text-gray-600 block leading-relaxed">{order.address}</span>
                {order.notes && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-amber-900 text-[11px] leading-relaxed">
                    <span className="font-bold">{lang === 'km' ? 'ចំណាំពីអតិថិជន: ' : 'Notes: '}</span>
                    {order.notes}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (5 cols): Embedded ABA Payment Station */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          
          {order.paymentMethod === 'khqr' ? (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xl space-y-4">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <AbaLogo className="w-9 h-9 rounded-xl" />
                  <div>
                    <span className="font-black text-sm text-gray-900 block leading-tight">
                      ABA Pay
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      ABA Mobile & Bakong KHQR
                    </span>
                  </div>
                </div>

                {isPaid ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>{lang === 'km' ? 'បានទូទាត់' : 'Paid'}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#005377] font-bold text-xs flex items-center gap-1 border border-blue-100">
                    <span className="w-2 h-2 rounded-full bg-[#005377]"></span>
                    <span>Live QR</span>
                  </span>
                )}
              </div>

              {/* Status Display: CONFIRMED vs PENDING */}
              {isPaid ? (
                /* Payment Confirmed View */
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900">
                      {lang === 'km' ? 'ការទូទាត់ប្រាក់ជោគជ័យ!' : 'Payment Confirmed!'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                      {lang === 'km'
                        ? 'ប្រព័ន្ធបានផ្ទៀងផ្ទាត់ការបង់ប្រាក់តាម ABA Pay រួចរាល់។ ហាងនឹងរៀបចំដឹកជញ្ជូនទំនិញជូនលោកអ្នក។'
                        : 'Payment verified automatically via ABA Pay. Your order is being prepared for dispatch.'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs space-y-2 text-left">
                    <div className="flex justify-between text-gray-500">
                      <span>{lang === 'km' ? 'វិធីសាស្ត្រទូទាត់:' : 'Method:'}</span>
                      <span className="font-bold text-gray-800">ABA Pay (Auto-Verified)</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>{lang === 'km' ? 'ទឹកប្រាក់បានទូទាត់:' : 'Amount Paid:'}</span>
                      <span className="font-black text-emerald-700">${Number(totalAmount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Awaiting Payment: Embedded Live Bakong KHQR Terminal */
                <div className="space-y-4">
                  
                  {/* Amount Pill */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">
                      {lang === 'km' ? 'ទឹកប្រាក់ត្រូវស្កេនបង់:' : 'Payable Amount:'}
                    </span>
                    <div className="text-right">
                      <span className="font-mono font-black text-base text-[#005377]">
                        ${Number(totalAmount).toFixed(2)}
                      </span>
                      <span className="text-[11px] text-gray-400 ml-1.5 font-semibold">
                        (≈ {khrTotal} ៛)
                      </span>
                    </div>
                  </div>

                  {/* Embedded KHQR Live Frame */}
                  <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-white">
                    {loadingSession || !paymentSession?.checkoutUrl ? (
                      <div className="w-full h-[520px] flex flex-col items-center justify-center gap-3 bg-gray-50 text-gray-400">
                        <RefreshCw className="w-7 h-7 animate-spin text-[#005377]" />
                        <span className="text-xs font-medium text-gray-600">
                          {lang === 'km' ? 'កំពុងភ្ជាប់ទៅកាន់ ABA KHQR...' : 'Connecting to ABA KHQR...'}
                        </span>
                      </div>
                    ) : (
                      <>
                        {!iframeLoaded && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50 text-gray-400 z-10">
                            <RefreshCw className="w-7 h-7 animate-spin text-[#005377]" />
                            <span className="text-xs font-medium text-gray-600">
                              {lang === 'km' ? 'កំពុងផ្ទុករូបភាព Bakong KHQR...' : 'Loading Bakong KHQR...'}
                            </span>
                          </div>
                        )}
                        <iframe
                          src={paymentSession.checkoutUrl}
                          title="ABA KHQR Checkout"
                          onLoad={() => setIframeLoaded(true)}
                          className="w-full h-[520px] border-0"
                        />
                      </>
                    )}
                  </div>

                  {/* Direct ABA Mobile Deeplink Button */}
                  {paymentSession?.abapayDeeplink || paymentSession?.checkoutUrl ? (
                    <a
                      href={paymentSession.abapayDeeplink || paymentSession.checkoutUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-[#005377] hover:bg-[#004260] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#005377]/20 transition-colors"
                    >
                      <AbaLogo className="w-4 h-4 rounded-xs" />
                      <span>{lang === 'km' ? 'បើកកម្មវិធី ABA Mobile (Pay with ABA Mobile)' : 'Pay with ABA Mobile'}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>
                  ) : null}

                  {/* Live Auto Verification Notice */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 text-[11px] text-gray-600 space-y-1.5 border border-gray-100">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>{lang === 'km' ? 'ផ្ទៀងផ្ទាត់ស្វ័យប្រវត្តិតាម Real-time' : 'Real-Time Auto Verification'}</span>
                    </div>
                    <p className="text-gray-500 leading-relaxed">
                      {lang === 'km'
                        ? 'ពេលលោកអ្នកស្កេន ឬបង់ប្រាក់តាម ABA Mobile រួចរាល់ ប្រព័ន្ធនឹងបញ្ជាក់ការកុម្ម៉ង់ភ្លាមៗដោយស្វ័យប្រវត្តិ។'
                        : 'Once payment is completed via ABA Mobile, this page will update automatically without reloading.'}
                    </p>
                  </div>

                </div>
              )}

            </div>
          ) : (
            /* Cash on Delivery Card */
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                  <Banknote className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Cash on Delivery (COD)
                  </h4>
                  <span className="text-[11px] text-gray-500">
                    {t('cod_desc')}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {lang === 'km'
                  ? 'អ្នកដឹកជញ្ជូននឹងទាក់ទងមកអ្នកតាមរយៈលេខទូរស័ព្ទមុនពេលមកដល់។ សូមត្រៀមប្រាក់ចំនួន $' + totalAmount.toFixed(2) + ' (≈ ' + khrTotal + ' ៛) ដើម្បីទូទាត់ពេលទទួលបានទំនិញ។'
                  : 'Our courier will call before arriving. Please prepare $' + totalAmount.toFixed(2) + ' (≈ ' + khrTotal + ' KHR) in cash upon delivery.'}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
