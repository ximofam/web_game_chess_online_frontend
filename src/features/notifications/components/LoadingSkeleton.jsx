import React from 'react';

/**
 * Shimmering loading skeleton for notification lists.
 */
export const LoadingSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 bg-[#1a1d24] border border-[#2d323f] rounded-xl flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-full bg-[#2d323f]" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="h-3 w-20 bg-[#2d323f] rounded" />
              <div className="h-2 w-12 bg-[#2d323f] rounded" />
            </div>
            <div className="h-3 w-32 bg-[#2d323f] rounded" />
            <div className="h-2.5 w-full bg-[#2d323f] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
