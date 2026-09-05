import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function CountdownTimer({ hours = 8, minutes = 45, seconds = 0 }) {
  const { lang } = useLanguage();

  const [timeLeft, setTimeLeft] = useState({
    hours,
    minutes,
    seconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 }; // Loop or reset
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num) => String(num).padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-2 bg-gray-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-2xl shadow-md border border-white/10 text-xs">
      <Clock className="w-3.5 h-3.5 text-rose-400" />
      <span className="font-semibold text-gray-300">
        {lang === 'km' ? 'នៅសល់ពេល៖' : 'Ends in:'}
      </span>
      <div className="flex items-center gap-1 font-mono font-bold text-white">
        <span className="bg-white/15 px-1.5 py-0.5 rounded-md text-amber-300">
          {formatNum(timeLeft.hours)}
        </span>
        <span>:</span>
        <span className="bg-white/15 px-1.5 py-0.5 rounded-md text-amber-300">
          {formatNum(timeLeft.minutes)}
        </span>
        <span>:</span>
        <span className="bg-white/15 px-1.5 py-0.5 rounded-md text-rose-400">
          {formatNum(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
}
