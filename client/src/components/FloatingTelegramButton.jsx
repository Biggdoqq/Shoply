import React from 'react';
import { Send } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

export default function FloatingTelegramButton() {
  const { settings } = useSettings();
  const { lang } = useLanguage();

  const getTelegramUrl = () => {
    const raw = (settings?.telegram_link || settings?.telegram_handle || '').trim();
    if (!raw) return 'https://t.me/ShoplySupport';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('t.me/')) return `https://${raw}`;
    if (raw.startsWith('@')) return `https://t.me/${raw.slice(1)}`;
    return `https://t.me/${raw}`;
  };

  const telegramUrl = getTelegramUrl();

  return (
    <aside aria-label="Customer Support Contact">
      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on Telegram"
        className="fixed bottom-18 md:bottom-6 right-3.5 sm:right-6 z-30 flex items-center gap-2 bg-[#229ED9] hover:bg-[#1b8ec5] text-white p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-lg shadow-[#229ED9]/30 active:scale-95 transition-all cursor-pointer"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <Send className="w-4 h-4 -rotate-12 translate-x-0.5" />
        </div>
        <span className="hidden sm:inline-block text-xs font-semibold tracking-wide pr-1">
          {lang === 'km' ? 'ឆាត Telegram' : 'Chat Support'}
        </span>
      </a>
    </aside>
  );
}
