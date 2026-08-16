import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Eye, Heart, MessageSquare, Trash2, Info, ExternalLink, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ApprovalInfoModal from './ApprovalInfoModal';
import { forumService } from '../services/forumService';

export default function MyPostCard({ post, onDelete }) {
  const { t } = useTranslation(['forum']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalInfo, setApprovalInfo] = useState(post.approvalInfo || null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleOpenInfo = async () => {
    if (!approvalInfo) {
      setLoadingDetails(true);
      try {
        const detail = await forumService.getMyPost(post.id);
        if (detail.approvalInfo) {
          setApprovalInfo(detail.approvalInfo);
        }
      } catch (err) {
        console.error('Failed to load post approval details', err);
      } finally {
        setLoadingDetails(false);
      }
    }
    setIsModalOpen(true);
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-inter font-bold uppercase tracking-widest text-[10px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('forum:approved')}
          </span>
        );
      case 'DENIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border bg-red-500/10 text-red-500 border-red-500/20 font-inter font-bold uppercase tracking-widest text-[10px]">
            <AlertCircle className="w-3.5 h-3.5" />
            {t('forum:denied')}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border bg-yellow-500/10 text-yellow-500 border-yellow-500/20 font-inter font-bold uppercase tracking-widest text-[10px]">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            {t('forum:pending')}
          </span>
        );
    }
  };

  const formattedDate = new Date(post.createdAt || new Date().toISOString()).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <div className="bg-chess-surface border border-chess-border rounded-lg p-5 hover:border-chess-gold shadow-sm transition-colors flex flex-col justify-between gap-4">
        <div>
          {/* Header row: status + date */}
          <div className="flex items-center justify-between mb-2">
            <div>{getStatusBadge(post.status)}</div>
            <span className="font-inter text-xs font-semibold text-chess-muted">{formattedDate}</span>
          </div>

          {/* Title */}
          <h3 className="font-playfair text-lg font-bold text-chess-text line-clamp-2 hover:text-chess-gold transition-colors">
            {post.status === 'APPROVED' ? (
              <RouterLink to={`/forum/posts/${post.id}`}>{post.title}</RouterLink>
            ) : (
              <span>{post.title}</span>
            )}
          </h3>
        </div>

        {/* Footer row: metrics & actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-chess-border font-inter text-xs text-chess-muted font-semibold">
          {/* Metrics */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5" title={t('forum:views')}>
              <Eye className="w-4 h-4 text-chess-muted" />
              {post.viewCount ?? 0}
            </span>
            <span className="flex items-center gap-1.5" title={t('forum:likes')}>
              <Heart className="w-4 h-4 text-chess-muted" />
              {post.likeCount ?? 0}
            </span>
            <span className="flex items-center gap-1.5" title={t('forum:comment')}>
              <MessageSquare className="w-4 h-4 text-chess-muted" />
              {post.commentCount ?? 0}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              id={`approval-info-btn-${post.id}`}
              onClick={handleOpenInfo}
              disabled={loadingDetails}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-chess-border bg-chess-dark hover:bg-chess-border/50 text-chess-text font-inter font-bold transition-colors disabled:opacity-50 focus:outline-none"
              title={t('forum:view_moderation_info')}
            >
              <Info className="w-3.5 h-3.5 text-chess-gold" />
              {t('forum:moderation')}
            </button>

            {post.status === 'APPROVED' && (
              <RouterLink
                id={`view-public-post-${post.id}`}
                to={`/forum/posts/${post.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-chess-border bg-chess-dark hover:bg-chess-border/50 text-chess-text font-inter font-bold transition-colors focus:outline-none"
                title={t('forum:view_post')}
              >
                <ExternalLink className="w-3.5 h-3.5 text-chess-muted" />
                {t('forum:view')}
              </RouterLink>
            )}

            <button
              id={`delete-post-btn-${post.id}`}
              onClick={() => onDelete(post.id, post.title)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-inter font-bold transition-colors focus:outline-none"
              title={t('forum:delete_post')}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('forum:delete')}
            </button>
          </div>
        </div>
      </div>

      <ApprovalInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        status={post.status}
        approvalInfo={approvalInfo}
        title={post.title}
      />
    </>
  );
}
