import React from 'react';

export default function PostSkeleton() {
  return (
    <div className="bg-[#1a1d24] border border-[#2d323f] rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#2d323f]" />
        <div className="h-3 w-24 bg-[#2d323f] rounded" />
        <div className="h-3 w-16 bg-[#2d323f] rounded ml-auto" />
      </div>
      <div className="h-4 w-3/4 bg-[#2d323f] rounded mb-2" />
      <div className="h-4 w-1/2 bg-[#2d323f] rounded mb-4" />
      <div className="flex gap-4">
        <div className="h-3 w-8 bg-[#2d323f] rounded" />
        <div className="h-3 w-8 bg-[#2d323f] rounded" />
        <div className="h-3 w-8 bg-[#2d323f] rounded ml-auto" />
      </div>
    </div>
  );
}
