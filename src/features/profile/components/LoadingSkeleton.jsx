import React from 'react';

/**
 * LoadingSkeleton displays animated pulsing blocks representing
 * profile components during loading states.
 */
export const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
      {/* Profile Card Skeleton */}
      <div className="md:col-span-5 bg-[#1a1d24] border border-[#2d323f] p-6 rounded-xl flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-[#2d323f] mb-4" />
        <div className="h-6 w-36 bg-[#2d323f] rounded mb-2" />
        <div className="h-4 w-48 bg-[#2d323f] rounded mb-6" />
        <div className="w-full border-t border-[#2d323f] pt-6 grid grid-cols-3 gap-2">
          <div className="bg-[#0d0e12]/40 h-16 rounded border border-[#2d323f]/60" />
          <div className="bg-[#0d0e12]/40 h-16 rounded border border-[#2d323f]/60" />
          <div className="bg-[#0d0e12]/40 h-16 rounded border border-[#2d323f]/60" />
        </div>
      </div>

      {/* Profile Form Skeleton */}
      <div className="md:col-span-7 bg-[#1a1d24] border border-[#2d323f] p-6 rounded-xl space-y-5">
        <div className="h-6 w-48 bg-[#2d323f] rounded mb-6" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-[#2d323f] rounded" />
              <div className="h-10 bg-[#0d0e12] rounded border border-[#2d323f]" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 bg-[#2d323f] rounded" />
              <div className="h-10 bg-[#0d0e12] rounded border border-[#2d323f]" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-[#2d323f] rounded" />
            <div className="h-10 bg-[#0d0e12] rounded border border-[#2d323f]" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-[#2d323f] rounded" />
            <div className="h-10 bg-[#0d0e12] rounded border border-[#2d323f]" />
          </div>
        </div>
        <div className="h-11 w-32 bg-[#2d323f] rounded-lg mt-6" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
