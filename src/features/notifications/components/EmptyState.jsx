import React from 'react';
import { BellOff } from 'lucide-react';

/**
 * EmptyState for empty notifications page view.
 */
export const EmptyState = () => {
  return (
    <div className="w-full bg-[#1a1d24] border border-[#2d323f] rounded-xl py-16 px-6 flex flex-col items-center justify-center text-center shadow-lg select-none animate-fade-in">
      <div className="w-16 h-16 bg-[#0d0e12] rounded-full flex items-center justify-center border border-[#2d323f] text-[#d4af37] mb-4 animate-pulse">
        <BellOff className="w-6 h-6 text-[#9ca3af]/80" />
      </div>
      <h3 className="font-playfair text-xl font-bold text-[#f3f4f6] mb-2">
        Peace on the Board
      </h3>
      <p className="text-sm text-[#9ca3af] leading-relaxed max-w-sm">
        You don't have any notifications right now. Invite some players or post a blog game analysis to make your first move!
      </p>
    </div>
  );
};

export default EmptyState;
