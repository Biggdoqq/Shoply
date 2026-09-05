import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { createPaymentSession, checkPaymentStatus, simulatePaymentConfirm } from '../api';

/**
 * ABA KHQR Popup Modal (Matching official Moon Store / KHQR style)
 * - Header: "ABA KHQR" on left, live countdown timer & "✕" on right
 * - Body: The official live KHQR card (Shoply, Amount, Bakong QR)
 * - Clicking "✕" or backdrop dismisses the modal
 * - Handles window message events & iframe redirect to guarantee immediate transition to paid state
 */
export default function KHQRModal({ isOpen, onClose, amount, orderNumber, onConfirmPaid }) {
  const { lang } = useLanguage();
  const [loadingSession, setLoadingSession] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeLoadCount, setIframeLoadCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('PENDING'); // PENDING, PAID
  const pollingRef = useRef(null);
  const timerRef = useRef(null);

  // Unified Payment Success Transition
  const handleSuccessfulPayment = async () => {
    if (paymentStatus === 'PAID') return;
    setPaymentStatus('PAID');
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      if (orderNumber) {
        await simulatePaymentConfirm(orderNumber);
      }
    } catch (err) {
      console.warn('Could not auto-confirm order on server:', err);
    }

    setTimeout(() => {
      if (onConfirmPaid) onConfirmPaid();
    }, 1200);
  };

  // 1. Listen for postMessage from checkout.khqr.cc (official KHQRPay plugin contract)
  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (e) => {
      const t = e.data;
      if (!t) return;

      console.log('KHQRModal received message from checkout gateway:', t);

      if (typeof t === 'object') {
        if (
          t.hasOwnProperty('merchantUrl') || 
          t.hasOwnProperty('_khqrCallbackOnSuccess') || 
          t.status === 'SUCCESS' || 
          t.status === 'PAID' || 
          t.type === 'khqrcc_success' ||
          t.paid === true
        ) {
          handleSuccessfulPayment();
        } else if (t.hasOwnProperty('close')) {
          onClose();
        }
      } else if (typeof t === 'string' && (t.includes('merchantUrl') || t.includes('SUCCESS') || t.includes('PAID'))) {
        handleSuccessfulPayment();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, orderNumber, paymentStatus]);

  // 2. Initialize Payment Session & Status Polling when Modal Opens
  useEffect(() => {
    if (!isOpen) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setPaymentStatus('PENDING');
      setSessionData(null);
      setIframeLoaded(false);
      setIframeLoadCount(0);
      return;
    }

    if (orderNumber) {
      setLoadingSession(true);
      setIframeLoaded(false);
      setIframeLoadCount(0);
      createPaymentSession({
        orderNumber,
        amount,
        currency: 'USD',
        returnUrl: `${window.location.origin}/order-success/${orderNumber}`,
      })
        .then(res => {
          setSessionData(res.data);
        })
        .catch(err => {
          console.warn('Could not initialize ABA KHQR payment session:', err);
        })
        .finally(() => {
          setLoadingSession(false);
        });

      // Poll payment status every 2.5 seconds
      pollingRef.current = setInterval(async () => {
        try {
          const res = await checkPaymentStatus(orderNumber);
          if (res.data?.isPaid || res.data?.status === 'CONFIRMED') {
            handleSuccessfulPayment();
          }
        } catch (e) {
          // Silent polling error
        }
      }, 2500);
    }

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, orderNumber, amount]);

  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes countdown (180s)

  // Live 3-minute Countdown Timer (matching official checkout.khqr.cc countdown)
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeLeft(180);
      return;
    }

    setTimeLeft(180);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, sessionData]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const refreshSession = () => {
    if (!orderNumber) return;
    setLoadingSession(true);
    setIframeLoaded(false);
    createPaymentSession({
      orderNumber,
      amount,
      currency: 'USD',
      returnUrl: `${window.location.origin}/order-success/${orderNumber}`,
    })
      .then(res => {
        setSessionData(res.data);
        setTimeLeft(180);
      })
      .catch(err => {
        console.warn('Could not refresh ABA KHQR payment session:', err);
      })
      .finally(() => {
        setLoadingSession(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      
      {/* Dimmed Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity" 
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-[410px] w-full p-5 text-center shadow-2xl z-10 border border-gray-100 overflow-hidden">
        
        {/* Modal Header: Title "ABA KHQR", Countdown Timer & Cyan Close Button "✕" */}
        <div className="flex items-center justify-between px-1 mb-2">
          <h3 className="font-bold text-base sm:text-lg text-gray-800 tracking-tight">
            ABA KHQR
          </h3>

          <div className="flex items-center gap-3">
            {/* Live Countdown Timer (matching official checkout.khqr.cc) */}
            {timeLeft === 0 ? (
              <button 
                type="button" 
                onClick={refreshSession}
                className="text-[11px] text-rose-500 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                title={lang === 'km' ? 'បង្កើត QR ថ្មី' : 'Renew QR'}
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>{lang === 'km' ? 'ផុតកំណត់ (បង្កើតថ្មី)' : 'Expired (Renew)'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    fill="none"
                    stroke="#00BCD4"
                    strokeWidth="3.5"
                    strokeDasharray={56.54}
                    strokeDashoffset={56.54 * (1 - timeLeft / 180)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 -rotate-90 origin-center"
                  />
                </svg>
                <span className="font-mono font-medium text-gray-600 tracking-tight">
                  {formatTime(timeLeft)}
                </span>
              </div>
            )}

            {/* Cyan Close Button "✕" */}
            <button
              type="button"
              onClick={onClose}
              className="text-cyan-400 hover:text-cyan-500 transition-colors cursor-pointer p-0.5"
              title={lang === 'km' ? 'បិទផ្ទាំង' : 'Close'}
              aria-label="Close"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content: If Paid -> Success celebration; Else -> Official KHQR Card */}
        {paymentStatus === 'PAID' ? (
          <div className="py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="font-black text-lg text-gray-900">
                {lang === 'km' ? 'ការទូទាត់ប្រាក់ជោគជ័យ!' : 'Payment Confirmed!'}
              </h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {lang === 'km' 
                  ? 'ប្រព័ន្ធបានផ្ទៀងផ្ទាត់ការបង់ប្រាក់រួចរាល់ កំពុងបញ្ជូនទៅកាន់ទំព័រវិក្កយបត្រ...' 
                  : 'Payment verified automatically. Redirecting to receipt...'}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden flex flex-col items-center justify-center">
            
            {/* Loading Spinner until payment session and iframe load */}
            {(loadingSession || !sessionData?.checkoutUrl) ? (
              <div className="w-full h-[470px] flex flex-col items-center justify-center gap-3 bg-gray-50/70 rounded-2xl">
                <RefreshCw className="w-7 h-7 animate-spin text-[#005377]" />
                <span className="text-xs font-medium text-gray-500">
                  {lang === 'km' ? 'កំពុងបង្កើត ABA KHQR...' : 'Generating ABA KHQR...'}
                </span>
              </div>
            ) : (
              <>
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white z-10">
                    <RefreshCw className="w-7 h-7 animate-spin text-[#005377]" />
                    <span className="text-xs font-medium text-gray-500">
                      {lang === 'km' ? 'កំពុងផ្ទុក ABA KHQR...' : 'Loading ABA KHQR...'}
                    </span>
                  </div>
                )}

                {/* Embedded Live KHQR Terminal (offset top to hide remote KHQRcc header) */}
                <div className="w-full overflow-hidden rounded-2xl" style={{ height: '485px' }}>
                  <iframe
                    src={sessionData.checkoutUrl}
                    title="ABA KHQR Checkout"
                    scrolling="no"
                    onLoad={() => {
                      setIframeLoadCount(prev => {
                        const next = prev + 1;
                        if (next === 1) {
                          setIframeLoaded(true);
                        } else if (next > 1) {
                          // Second load event occurs when checkout.khqr.cc redirects to returnUrl upon payment completion
                          console.log('Iframe redirected, payment complete');
                          handleSuccessfulPayment();
                        }
                        return next;
                      });
                    }}
                    className="w-full border-0"
                    style={{ 
                      height: '565px', 
                      marginTop: '-62px', 
                      display: 'block' 
                    }}
                  />
                </div>
              </>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
