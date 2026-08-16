import { useState } from 'react';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LikeButton from './LikeButton';
import CommentForm from './CommentForm';
import { forumService } from '../services/forumService';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * CommentItem — renders one comment with inline like, reply form, and expandable replies.
 */
export default function CommentItem({ comment, postId, isAuth, onLikeComment: _onLikeComment, onAddComment: _onAddComment }) {
  const { t } = useTranslation(['forum']);
  const { id, content, author, likeCount, liked, replyCount, createdAt } = comment;

  const [localLiked, setLocalLiked] = useState(liked);
  const [localCount, setLocalCount] = useState(likeCount);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesPage, setRepliesPage] = useState(0);
  const [replyTotalPages, setReplyTotalPages] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);

  const handleLike = async () => {
    const newLiked = !localLiked;
    setLocalLiked(newLiked);
    setLocalCount(c => newLiked ? c + 1 : Math.max(0, c - 1));
    try {
      await forumService.likeComment(id, newLiked);
    } catch {
      // revert on failure
      setLocalLiked(!newLiked);
      setLocalCount(c => !newLiked ? c + 1 : Math.max(0, c - 1));
    }
  };

  const loadReplies = async (page = 0) => {
    setLoadingReplies(true);
    try {
      const data = await forumService.getReplies(id, page, 10);
      setReplies(prev => page === 0 ? data.content : [...prev, ...data.content]);
      setRepliesPage(data.page.number);
      setReplyTotalPages(data.page.totalPages);
      setExpanded(true);
    } finally {
      setLoadingReplies(false);
    }
  };

  const toggleReplies = () => {
    if (!expanded) {
      loadReplies(0);
    } else {
      setExpanded(false);
    }
  };

  const handleReplySubmit = async (body) => {
    const newComment = await forumService.createComment(body);
    setReplies(prev => [...prev, newComment]);
    setExpanded(true);
    setShowReplyForm(false);
  };

  return (
    <div id={`comment-${id}`} className="py-4">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-md border border-chess-gold bg-chess-dark text-chess-gold flex items-center justify-center font-inter text-xs font-bold shrink-0 overflow-hidden">
          {author?.avatarUrl
            ? <img src={author.avatarUrl} alt={author.username} className="w-full h-full object-cover" />
            : <User className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-inter text-sm font-bold text-chess-text">{author?.username ?? t('forum:anonymous')}</span>
            <span className="font-inter text-[10px] font-semibold text-chess-muted">{createdAt ? fmtDate(createdAt) : ''}</span>
          </div>

          {/* Content */}
          <p className="font-inter text-sm text-chess-text leading-relaxed whitespace-pre-wrap break-words">{content}</p>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-2.5">
            <LikeButton
              liked={localLiked}
              count={localCount}
              onClick={isAuth ? handleLike : undefined}
              disabled={!isAuth}
            />

            {isAuth && (
              <button
                onClick={() => setShowReplyForm(v => !v)}
                className="font-inter text-xs text-chess-muted hover:text-chess-text font-semibold transition-colors focus:outline-none"
              >
                {t('forum:reply')}
              </button>
            )}

            {replyCount > 0 && (
              <button
                id={`toggle-replies-${id}`}
                onClick={toggleReplies}
                disabled={loadingReplies}
                className="flex items-center gap-1 font-inter text-xs text-chess-gold hover:text-chess-gold-hover font-semibold transition-colors focus:outline-none disabled:opacity-60"
              >
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {expanded ? t('forum:hide') : t('forum:replies_count', { count: replyCount })}
              </button>
            )}
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                postId={postId}
                parentId={id}
                onSubmit={handleReplySubmit}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}

          {/* Replies */}
          {expanded && replies.length > 0 && (
            <div className="mt-4 pl-4 border-l-2 border-chess-border flex flex-col gap-3">
              {replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  isAuth={isAuth}
                />
              ))}
              {repliesPage < replyTotalPages - 1 && (
                <button
                  onClick={() => loadReplies(repliesPage + 1)}
                  disabled={loadingReplies}
                  className="font-inter text-xs text-chess-gold hover:text-chess-gold-hover self-start font-semibold focus:outline-none"
                >
                  {loadingReplies ? t('forum:loading') : t('forum:load_more_replies')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
