import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

/**
 * ErrorState visualizes query failures and offers a retry trigger.
 */
export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="w-full max-w-lg bg-[#1a1d24] border border-red-500/30 p-8 rounded-xl flex flex-col items-center text-center shadow-lg select-none">
      <div className="w-12 h-12 bg-red-950/40 rounded-full flex items-center justify-center border border-red-500/40 text-red-400 mb-4 animate-bounce">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-playfair text-xl font-bold text-[#f3f4f6] mb-2">
        Tactical Error Encountered
      </h3>
      <p className="text-sm text-[#9ca3af] mb-6 leading-relaxed max-w-sm">
        {message || 'Failed to fetch player details from the server.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-[#d4af37] text-[#0d0e12] font-bold py-2.5 px-5 rounded-lg hover:bg-[#f3cd57] hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>RETRY ACTION</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
