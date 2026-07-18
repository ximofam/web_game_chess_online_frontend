import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { ArrowLeft, Eye, User, Calendar, RefreshCw, Lock } from 'lucide-react';
import { forumService } from '../services/forumService';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import LikeButton from '../components/LikeButton';
import { useAuth } from '../../auth/context/AuthContext';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

/**
 * Render Tiptap JSON doc as readable HTML.
 * ponytail: basic node-to-html mapper; upgrade to @tiptap/html if more nodes needed.
 */
function TiptapRender({ content }) {
  if (!content) return null;
  let doc;
  try {
    doc = typeof content === 'string' ? JSON.parse(content) : content;
  } catch {
    return <p className="text-[#d1d5db] whitespace-pre-wrap">{content}</p>;
  }

  const renderNode = (node, idx) => {
    if (!node) return null;
    const children = node.content?.map((c, i) => renderNode(c, i));
    switch (node.type) {
      case 'doc': return <>{children}</>;
      case 'paragraph': return <p key={idx} className="mb-3 text-[#d1d5db] leading-relaxed">{children}</p>;
      case 'heading': return React.createElement(`h${node.attrs?.level ?? 2}`, { key: idx, className: 'font-playfair font-bold text-[#f3f4f6] mt-5 mb-2 text-xl' }, children);
      case 'bulletList': return <ul key={idx} className="list-disc pl-5 mb-3 text-[#d1d5db] space-y-1">{children}</ul>;
      case 'orderedList': return <ol key={idx} className="list-decimal pl-5 mb-3 text-[#d1d5db] space-y-1">{children}</ol>;
      case 'listItem': return <li key={idx}>{children}</li>;
      case 'blockquote': return <blockquote key={idx} className="border-l-4 border-[#d4af37]/50 pl-4 italic text-[#9ca3af] my-3">{children}</blockquote>;
      case 'hardBreak': return <br key={idx} />;
      case 'image': return (
        <img key={idx} src={node.attrs?.src} alt={node.attrs?.alt ?? ''} className="max-w-full rounded-lg my-4 border border-[#2d323f]" />
      );
      case 'text': {
        let el = <>{node.text}</>;
        (node.marks ?? []).forEach(mark => {
          if (mark.type === 'bold') el = <strong className="font-bold text-[#f3f4f6]">{el}</strong>;
          if (mark.type === 'italic') el = <em>{el}</em>;
          if (mark.type === 'strike') el = <s>{el}</s>;
          if (mark.type === 'code') el = <code className="bg-[#0d0e12] px-1 py-0.5 rounded text-[#d4af37] font-mono text-sm">{el}</code>;
        });
        return <React.Fragment key={idx}>{el}</React.Fragment>;
      }
      default: return <React.Fragment key={idx}>{children}</React.Fragment>;
    }
  };

  return <div>{renderNode(doc)}</div>;
}

const STATUS_BADGE = {
  PENDING: { label: 'Đang duyệt', cls: 'bg-yellow-900/50 text-yellow-300 border-yellow-600/40' },
  APPROVED: { label: 'Đã duyệt', cls: 'bg-emerald-900/50 text-emerald-300 border-emerald-600/40' },
  DENIED: { label: 'Từ chối', cls: 'bg-red-900/50 text-red-300 border-red-600/40' },
};

/**
 * PostDetailPage — chi tiết bài viết + comments + replies.
 * Layout Header & Footer được đảm nhận bởi PublicLayout.
 */
export default function PostDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated, currentUser } = useAuth();
  const canInteract = isAuthenticated && currentUser?.role !== 'GUEST';

  // Post
  const { data: post, isLoading: postLoading, isError: postError } = useQuery({
    queryKey: ['post', id],
    queryFn: () => forumService.getPost(id),
    retry: false,
  });

  // Local liked/likeCount for optimistic UI
  const [localLiked, setLocalLiked] = useState(null);
  const [localLikeCount, setLocalLikeCount] = useState(null);

  const liked = localLiked ?? post?.liked ?? false;
  const likeCount = localLikeCount ?? post?.likeCount ?? 0;

  const handleLikePost = async () => {
    const newLiked = !liked;
    setLocalLiked(newLiked);
    setLocalLikeCount(c => newLiked ? (c ?? likeCount) + 1 : Math.max(0, (c ?? likeCount) - 1));
    try {
      await forumService.likePost(id, newLiked);
    } catch {
      setLocalLiked(!newLiked);
      setLocalLikeCount(likeCount);
    }
  };

  // Comments (infinite)
  const {
    data: commentsData,
    fetchNextPage: fetchMoreComments,
    hasNextPage: hasMoreComments,
    isFetchingNextPage: loadingMoreComments,
    isLoading: commentsLoading,
  } = useInfiniteQuery({
    queryKey: ['comments', id],
    queryFn: ({ pageParam = 0 }) => forumService.getComments(id, pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (last) => {
      const { number, totalPages } = last.page ?? {};
      return number < totalPages - 1 ? number + 1 : undefined;
    },
    enabled: !!post,
  });

  const allComments = commentsData?.pages.flatMap(p => p.content) ?? [];

  const handleAddComment = async (body) => {
    const newComment = await forumService.createComment(body);
    // Prepend to first page cache
    queryClient.setQueryData(['comments', id], (old) => ({
      ...old,
      pages: old?.pages
        ? [{ ...old.pages[0], content: [newComment, ...old.pages[0].content] }, ...old.pages.slice(1)]
        : old,
    }));
  };

  if (postLoading) return (
    <div className="flex-1 flex items-center justify-center py-20">
      <RefreshCw className="w-8 h-8 text-[#d4af37] animate-spin" />
    </div>
  );

  if (postError || !post) return (
    <div className="flex-1 flex flex-col items-center justify-center text-[#9ca3af] gap-4 py-20">
      <p className="text-lg font-semibold text-[#f3f4f6]">Không tìm thấy bài viết</p>
      <p className="text-sm">Bài viết không tồn tại hoặc chưa được phê duyệt.</p>
      <Link to="/forum" className="text-[#d4af37] text-sm hover:underline">← Quay lại forum</Link>
    </div>
  );

  const badge = STATUS_BADGE[post.status];

  return (
    <main className="w-full max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        to="/forum"
        className="inline-flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#f3f4f6] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Forum
      </Link>

      {/* Article */}
      <article id={`post-detail-${id}`} className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-6 md:p-8 mb-8">
        {/* Status + meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.cls}`}>
              {badge.label}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
            <Calendar className="w-3.5 h-3.5" />
            {post.createdAt ? fmtDate(post.createdAt) : ''}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#9ca3af]">
            <Eye className="w-3.5 h-3.5" />
            {post.viewCount ?? 0} lượt xem
          </div>
        </div>

        {/* Title */}
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#f3f4f6] mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-2.5 pb-6 border-b border-[#2d323f] mb-6">
          <div className="w-9 h-9 rounded-full border border-[#d4af37]/30 bg-[#0d0e12] flex items-center justify-center overflow-hidden shrink-0">
            {post.author?.avatarUrl
              ? <img src={post.author.avatarUrl} alt={post.author.username} className="w-full h-full object-cover" />
              : <User className="w-4 h-4 text-[#d4af37]" />}
          </div>
          <span className="text-sm font-semibold text-[#f3f4f6]">{post.author?.username ?? 'Ẩn danh'}</span>
        </div>

        {/* Content */}
        <div className="mb-6">
          <TiptapRender content={post.content} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-[#2d323f]">
          {canInteract ? (
            <LikeButton
              liked={liked}
              count={likeCount}
              onClick={handleLikePost}
              size="md"
            />
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-[#9ca3af]">
              <LikeButton liked={liked} count={likeCount} disabled size="md" />
            </span>
          )}
        </div>
      </article>

      {/* Comments section */}
      <section id="comments-section">
        <h2 className="font-playfair text-xl font-bold text-[#f3f4f6] mb-5">
          Bình luận {post.commentCount ? `(${post.commentCount})` : ''}
        </h2>

        {/* Comment form */}
        {canInteract ? (
          <div className="mb-6">
            <CommentForm postId={id} onSubmit={handleAddComment} />
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl border border-[#2d323f] bg-[#1a1d24] text-sm text-[#9ca3af]">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              {isAuthenticated
                ? 'Tài khoản GUEST không thể bình luận.'
                : <><Link to="/login" className="text-[#d4af37] hover:underline">Đăng nhập</Link> để bình luận.</>}
            </span>
          </div>
        )}

        {/* Comments list */}
        {commentsLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-[#2d323f] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-[#2d323f] rounded" />
                  <div className="h-3 w-full bg-[#2d323f] rounded" />
                  <div className="h-3 w-3/4 bg-[#2d323f] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : allComments.length === 0 ? (
          <p className="text-sm text-[#9ca3af] text-center py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        ) : (
          <div className="divide-y divide-[#2d323f]">
            {allComments.map(comment => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={id}
                isAuth={canInteract}
                onAddComment={handleAddComment}
              />
            ))}
          </div>
        )}

        {hasMoreComments && (
          <div className="flex justify-center mt-6">
            <button
              id="load-more-comments"
              onClick={() => fetchMoreComments()}
              disabled={loadingMoreComments}
              className="flex items-center gap-2 px-5 py-2 border border-[#2d323f] rounded-xl text-sm text-[#9ca3af] hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-all disabled:opacity-60"
            >
              {loadingMoreComments
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang tải...</>
                : 'Xem thêm bình luận'}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
