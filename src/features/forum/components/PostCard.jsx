import { Heart, Eye, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const STATUS_BADGE = {
  PENDING: { labelKey: 'forum:pending', cls: 'bg-yellow-900/50 text-yellow-300 border-yellow-600/40' },
  APPROVED: { labelKey: 'forum:approved', cls: 'bg-emerald-900/50 text-emerald-300 border-emerald-600/40' },
  DENIED: { labelKey: 'forum:denied', cls: 'bg-red-900/50 text-red-300 border-red-600/40' },
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * PostCard — bài viết tóm tắt trong danh sách forum.
 */
export default function PostCard({ post, onLike }) {
  const { t } = useTranslation(['forum']);
  const { id, author, title, viewCount, likeCount, commentCount, createdAt, liked, status } = post;
  const badge = STATUS_BADGE[status];

  const handleLike = (e) => {
    e.preventDefault();
    onLike?.(id, !liked);
  };

  return (
    <Link
      to={`/forum/posts/${id}`}
      id={`post-card-${id}`}
      className="block bg-chess-surface border border-chess-border rounded-lg p-5 hover:border-chess-gold transition-colors group shadow-sm"
    >
      {/* Author row */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-md border border-chess-gold bg-chess-dark flex items-center justify-center text-chess-gold font-inter text-xs font-bold shrink-0 overflow-hidden">
          {author?.avatarUrl
            ? <img src={author.avatarUrl} alt={author.username} className="w-full h-full object-cover" />
            : <User className="w-4 h-4" />}
        </div>
        <span className="text-xs font-inter text-chess-muted font-semibold">{author?.username ?? t('forum:anonymous')}</span>
        <span className="text-chess-border select-none">·</span>
        <span className="text-xs font-inter text-chess-muted">{createdAt ? fmtDate(createdAt) : ''}</span>
        {badge && (
          <span className={`ml-auto font-inter uppercase tracking-widest text-[10px] font-bold px-2 py-0.5 rounded border ${badge.cls}`}>
            {t(badge.labelKey)}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-playfair text-lg font-bold text-chess-text mb-3 leading-snug group-hover:text-chess-gold transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-auto">
        <button
          id={`like-post-${id}`}
          onClick={handleLike}
          className={`flex items-center gap-1.5 font-inter text-xs font-semibold transition-colors focus:outline-none ${
            liked ? 'text-chess-gold' : 'text-chess-muted hover:text-chess-gold'
          }`}
          aria-label={liked ? t('forum:unlike') : t('forum:like_post')}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-chess-gold' : ''}`} />
          {likeCount ?? 0}
        </button>
        <span className="flex items-center gap-1.5 font-inter text-xs font-semibold text-chess-muted">
          <MessageSquare className="w-3.5 h-3.5" />
          {commentCount ?? 0}
        </span>
        <span className="flex items-center gap-1.5 font-inter text-xs font-semibold text-chess-muted ml-auto">
          <Eye className="w-3.5 h-3.5" />
          {viewCount ?? 0}
        </span>
      </div>
    </Link>
  );
}
