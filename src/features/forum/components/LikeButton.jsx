import React from 'react';
import { Heart } from 'lucide-react';

/**
 * Reusable like button with optimistic UI support.
 * Parent must handle the actual mutation and pass current `liked`/`likeCount`.
 */
export default function LikeButton({ liked, count, onClick, className = '', size = 'sm', disabled = false }) {
  const iconCls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textCls = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${textCls} ${
        liked ? 'text-[#d4af37]' : 'text-[#9ca3af] hover:text-[#d4af37]'
      } ${className}`}
      aria-label={liked ? 'Bỏ thích' : 'Thích'}
      aria-pressed={liked}
    >
      <Heart className={`${iconCls} transition-transform ${liked ? 'fill-[#d4af37] scale-110' : ''}`} />
      <span>{count ?? 0}</span>
    </button>
  );
}
