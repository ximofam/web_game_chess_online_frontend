import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, X } from 'lucide-react';

export function CountdownOverlay({ startAt, onCancelReady, isReadyPending }) {
  const { t } = useTranslation(['room']);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!startAt) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const remaining = startAt - Date.now();
      return Math.max(0, Math.ceil(remaining / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const intervalId = setInterval(() => {
      const remainingSeconds = calculateTimeLeft();
      setTimeLeft(remainingSeconds);
      if (remainingSeconds <= 0) {
        clearInterval(intervalId);
      }
    }, 100); // 100ms for smoothness

    return () => clearInterval(intervalId);
  }, [startAt]);

  if (!startAt || timeLeft === null) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0d0e12]/90 backdrop-blur-md transition-all duration-300">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold text-[#f3f4f6] font-playfair tracking-wide animate-pulse">
          {t('room:gameStartsIn', 'Game starts in')}
        </h2>
        
        <div className="relative flex items-center justify-center w-40 h-40">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#d4af37]/20 border-t-[#d4af37] animate-spin" />
          
          {/* Inner pulse ring */}
          <div className="absolute inset-4 rounded-full bg-[#d4af37]/10 animate-ping opacity-50" />
          
          {/* Number */}
          <span className="text-7xl font-black text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
            {timeLeft > 0 ? timeLeft : 0}
          </span>
        </div>

        <p className="text-[#9ca3af] text-sm animate-bounce mt-8">
          {t('room:getReady', 'Get ready!')}
        </p>
        
        {onCancelReady && (
          <div className="pt-4">
            <button
              type="button"
              onClick={onCancelReady}
              disabled={isReadyPending}
              className="bg-[#ef4444]/15 hover:bg-[#ef4444] text-[#ef4444] hover:text-[#f3f4f6] border border-[#ef4444]/40 font-bold text-sm py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isReadyPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
              <span>{t('room:cancelReady', 'Cancel Ready')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
