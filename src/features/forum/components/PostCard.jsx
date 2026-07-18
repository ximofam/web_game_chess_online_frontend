import React from 'react';
import { Heart, Eye, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_BADGE = {
  PENDING: { label: 'Đang duyệt', cls: 'bg-yellow-900/50 text-yellow-300 border-yellow-600/40' },
  APPROVED: { label: 'Đã duyệt', cls: 'bg-emerald-900/50 text-emerald-300 border-emerald-600/40' },
  DENIED: { label: 'Từ chối', cls: 'bg-red-900/50 text-red-300 border-red-600/40' },
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * PostCard — bài viết tóm tắt trong danh sách forum.
 */
export default function PostCard({ post, onLike }) {
  const { id, author, title, viewCount, likeCount, commentCount, createdAt, liked, status } = post;
  const badge = STATUS_BADGE[status];
  const initial = author?.username?.charAt(0).toUpperCase() ?? 'U';

  const handleLike = (e) => {
    e.preventDefault();
    onLike?.(id, !liked);
  };

  return (
    <Link
      to={`/forum/posts/${id}`}
      id={`post-card-${id}`}
      className="block bg-[#1a1d24] border border-[#2d323f] rounded-xl p-5 hover:border-[#d4af37]/40 hover:shadow-[0_0_16px_rgba(212,175,55,0.07)] transition-all group"
    >
      {/* Author row */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-full border border-[#d4af37]/30 bg-[#0d0e12] flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0 overflow-hidden">
          {author?.avatarUrl
            ? <img src={author.avatarUrl} alt={author.username} className="w-full h-full object-cover" />
            : <User className="w-4 h-4" />}
        </div>
        <span className="text-xs text-[#9ca3af] font-medium">{author?.username ?? 'Ẩn danh'}</span>
        <span className="text-[#2d323f] select-none">·</span>
        <span className="text-xs text-[#9ca3af]">{createdAt ? fmtDate(createdAt) : ''}</span>
        {badge && (
          <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.cls}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-playfair text-base font-bold text-[#f3f4f6] mb-3 leading-snug group-hover:text-[#d4af37] transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-auto">
        <button
          id={`like-post-${id}`}
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors focus:outline-none ${
            liked ? 'text-[#d4af37]' : 'text-[#9ca3af] hover:text-[#d4af37]'
          }`}
          aria-label={liked ? 'Bỏ thích' : 'Thích bài viết'}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-[#d4af37]' : ''}`} />
          {likeCount ?? 0}
        </button>
        <span className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
          <MessageSquare className="w-3.5 h-3.5" />
          {commentCount ?? 0}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#9ca3af] ml-auto">
          <Eye className="w-3.5 h-3.5" />
          {viewCount ?? 0}
        </span>
      </div>
    </Link>
  );
}
