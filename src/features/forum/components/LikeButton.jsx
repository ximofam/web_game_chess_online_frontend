import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Reusable like button with optimistic UI support.
 * Parent must handle the actual mutation and pass current `liked`/`likeCount`.
 */
export default function LikeButton({ liked, count, onClick, className = '', size = 'sm', disabled = false }) {
  const { t } = useTranslation(['forum']);
  const iconCls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textCls = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 font-inter font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${textCls} ${
        liked ? 'text-chess-gold' : 'text-chess-muted hover:text-chess-gold'
      } ${className}`}
      aria-label={liked ? t('forum:unlike') : t('forum:like')}
      aria-pressed={liked}
    >
      <Heart className={`${iconCls} transition-transform ${liked ? 'fill-chess-gold scale-110' : ''}`} />
      <span>{count ?? 0}</span>
    </button>
  );
}
