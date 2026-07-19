import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Eye, Heart, MessageSquare, Trash2, Info, ExternalLink, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import ApprovalInfoModal from './ApprovalInfoModal';
import { forumService } from '../services/forumService';

export default function MyPostCard({ post, onDelete }) {
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã duyệt
          </span>
        );
      case 'DENIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Từ chối
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            Chờ duyệt
          </span>
        );
    }
  };

  const formattedDate = new Date(post.createdAt || Date.now()).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <div className="bg-[#161922] border border-[#2d323f] rounded-2xl p-5 hover:border-[#3b4254] transition-all flex flex-col justify-between gap-4">
        <div>
          {/* Header row: status + date */}
          <div className="flex items-center justify-between mb-2">
            <div>{getStatusBadge(post.status)}</div>
            <span className="text-xs text-[#9ca3af]">{formattedDate}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#f3f4f6] line-clamp-2 hover:text-[#d4af37] transition-colors">
            {post.status === 'APPROVED' ? (
              <RouterLink to={`/forum/posts/${post.id}`}>{post.title}</RouterLink>
            ) : (
              <span>{post.title}</span>
            )}
          </h3>
        </div>

        {/* Footer row: metrics & actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2d323f]/60 text-xs text-[#9ca3af]">
          {/* Metrics */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1" title="Lượt xem">
              <Eye className="w-4 h-4 text-[#9ca3af]" />
              {post.viewCount ?? 0}
            </span>
            <span className="flex items-center gap-1" title="Lượt thích">
              <Heart className="w-4 h-4 text-[#9ca3af]" />
              {post.likeCount ?? 0}
            </span>
            <span className="flex items-center gap-1" title="Bình luận">
              <MessageSquare className="w-4 h-4 text-[#9ca3af]" />
              {post.commentCount ?? 0}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              id={`approval-info-btn-${post.id}`}
              onClick={handleOpenInfo}
              disabled={loadingDetails}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2d323f] bg-[#1a1e29] hover:bg-[#252a36] text-[#e5e7eb] font-medium transition-colors disabled:opacity-50"
              title="Xem thông tin kiểm duyệt"
            >
              <Info className="w-3.5 h-3.5 text-[#d4af37]" />
              Kiểm duyệt
            </button>

            {post.status === 'APPROVED' && (
              <RouterLink
                id={`view-public-post-${post.id}`}
                to={`/forum/posts/${post.id}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2d323f] bg-[#1a1e29] hover:bg-[#252a36] text-[#e5e7eb] font-medium transition-colors"
                title="Xem bài viết"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#9ca3af]" />
                Xem
              </RouterLink>
            )}

            <button
              id={`delete-post-btn-${post.id}`}
              onClick={() => onDelete(post.id, post.title)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium transition-colors"
              title="Xóa bài viết"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa
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
