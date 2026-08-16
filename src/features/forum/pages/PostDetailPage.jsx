import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { ArrowLeft, Eye, User, Calendar, RefreshCw, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
    return <p className="font-inter text-chess-text whitespace-pre-wrap">{content}</p>;
  }

  const renderNode = (node, idx) => {
    if (!node) return null;
    const children = node.content?.map((c, i) => renderNode(c, i));
    switch (node.type) {
      case 'doc': return <div className="font-inter text-chess-text space-y-4">{children}</div>;
      case 'paragraph': return <p key={idx} className="leading-relaxed">{children}</p>;
      case 'heading': return React.createElement(`h${node.attrs?.level ?? 2}`, { key: idx, className: 'font-playfair font-bold text-chess-text mt-6 mb-3 text-xl' }, children);
      case 'bulletList': return <ul key={idx} className="list-disc pl-5 mb-4 space-y-1.5">{children}</ul>;
      case 'orderedList': return <ol key={idx} className="list-decimal pl-5 mb-4 space-y-1.5">{children}</ol>;
      case 'listItem': return <li key={idx}>{children}</li>;
      case 'blockquote': return <blockquote key={idx} className="border-l-4 border-chess-gold pl-4 italic text-chess-muted my-4">{children}</blockquote>;
      case 'hardBreak': return <br key={idx} />;
      case 'image': return (
        <img key={idx} src={node.attrs?.src} alt={node.attrs?.alt ?? ''} className="max-w-full rounded-lg my-4 border border-chess-border shadow-sm" />
      );
      case 'text': {
        let el = <>{node.text}</>;
        (node.marks ?? []).forEach(mark => {
          if (mark.type === 'bold') el = <strong className="font-bold text-chess-text">{el}</strong>;
          if (mark.type === 'italic') el = <em>{el}</em>;
          if (mark.type === 'strike') el = <s>{el}</s>;
          if (mark.type === 'code') el = <code className="bg-chess-dark px-1.5 py-0.5 rounded text-chess-gold font-mono text-sm">{el}</code>;
        });
        return <React.Fragment key={idx}>{el}</React.Fragment>;
      }
      default: return <React.Fragment key={idx}>{children}</React.Fragment>;
    }
  };

  return <div>{renderNode(doc)}</div>;
}

const STATUS_BADGE = {
  PENDING: { labelKey: 'forum:pending', cls: 'bg-yellow-900/50 text-yellow-500 border-yellow-600/40' },
  APPROVED: { labelKey: 'forum:approved', cls: 'bg-emerald-900/50 text-emerald-500 border-emerald-600/40' },
  DENIED: { labelKey: 'forum:denied', cls: 'bg-red-900/50 text-red-500 border-red-600/40' },
};

/**
 * PostDetailPage — chi tiết bài viết + comments + replies.
 * Layout Header & Footer được đảm nhận bởi PublicLayout.
 */
export default function PostDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation(['forum']);
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
      <RefreshCw className="w-8 h-8 text-chess-gold animate-spin" />
    </div>
  );

  if (postError || !post) return (
    <div className="flex-1 flex flex-col items-center justify-center font-inter text-chess-muted gap-4 py-20">
      <p className="font-playfair text-xl font-bold text-chess-text">{t('forum:post_not_found')}</p>
      <p className="text-sm">{t('forum:post_not_exists')}</p>
      <Link to="/forum" className="text-chess-gold font-semibold text-sm hover:underline hover:text-chess-gold-hover transition-colors">← {t('forum:back_to_forum')}</Link>
    </div>
  );

  const badge = STATUS_BADGE[post.status];

  return (
    <main className="w-full max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        to="/forum"
        className="inline-flex items-center gap-2 text-sm font-inter font-semibold text-chess-muted hover:text-chess-text mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('forum:forum', 'Forum')}
      </Link>

      {/* Article */}
      <article id={`post-detail-${id}`} className="bg-chess-surface border border-chess-border rounded-lg shadow-md p-6 md:p-8 mb-8">
        {/* Status + meta */}
        <div className="flex flex-wrap items-center gap-4 mb-5">
          {badge && (
            <span className={`font-inter uppercase tracking-widest text-[10px] font-bold px-2 py-0.5 rounded border ${badge.cls}`}>
              {t(badge.labelKey)}
            </span>
          )}
          <div className="flex items-center gap-1.5 font-inter font-semibold text-xs text-chess-muted">
            <Calendar className="w-3.5 h-3.5" />
            {post.createdAt ? fmtDate(post.createdAt) : ''}
          </div>
          <div className="flex items-center gap-1.5 font-inter font-semibold text-xs text-chess-muted">
            <Eye className="w-3.5 h-3.5" />
            {post.viewCount ?? 0} {t('forum:views_count_text')}
          </div>
        </div>

        {/* Title */}
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-chess-text mb-5 leading-tight">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-3 pb-6 border-b border-chess-border mb-6">
          <div className="w-10 h-10 rounded-md border border-chess-gold bg-chess-dark flex items-center justify-center overflow-hidden shrink-0">
            {post.author?.avatarUrl
              ? <img src={post.author.avatarUrl} alt={post.author.username} className="w-full h-full object-cover" />
              : <User className="w-5 h-5 text-chess-gold" />}
          </div>
          <span className="text-sm font-inter font-bold text-chess-text">{post.author?.username ?? t('forum:anonymous')}</span>
        </div>

        {/* Content */}
        <div className="mb-8">
          <TiptapRender content={post.content} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-5 border-t border-chess-border">
          {canInteract ? (
            <LikeButton
              liked={liked}
              count={likeCount}
              onClick={handleLikePost}
              size="md"
            />
          ) : (
            <span className="flex items-center gap-1.5 font-inter text-sm font-semibold text-chess-muted">
              <LikeButton liked={liked} count={likeCount} disabled size="md" />
            </span>
          )}
        </div>
      </article>

      {/* Comments section */}
      <section id="comments-section">
        <h2 className="font-playfair text-xl font-bold text-chess-text mb-6">
          {t('forum:comments_title')} {post.commentCount ? `(${post.commentCount})` : ''}
        </h2>

        {/* Comment form */}
        {canInteract ? (
          <div className="mb-6">
            <CommentForm postId={id} onSubmit={handleAddComment} />
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg border border-chess-border bg-chess-surface font-inter text-sm font-semibold text-chess-muted shadow-sm">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              {isAuthenticated
                ? t('forum:guest_cannot_comment')
                : <><Link to="/login" className="text-chess-gold hover:underline hover:text-chess-gold-hover transition-colors mx-1">{t('forum:login')}</Link>{t('forum:to_comment')}</>}
            </span>
          </div>
        )}

        {/* Comments list */}
        {commentsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-md bg-chess-border shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-chess-border rounded" />
                  <div className="h-3 w-full bg-chess-border rounded" />
                  <div className="h-3 w-3/4 bg-chess-border rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : allComments.length === 0 ? (
          <p className="font-inter text-sm font-semibold text-chess-muted text-center py-8">{t('forum:no_comments_yet')}</p>
        ) : (
          <div className="divide-y divide-chess-border">
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
              className="flex items-center gap-2 px-6 py-2.5 border border-chess-border rounded-lg bg-transparent font-inter text-sm font-semibold text-chess-text hover:border-chess-gold hover:text-chess-gold transition-colors disabled:opacity-60 focus:outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold"
            >
              {loadingMoreComments
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> {t('forum:loading')}</>
                : t('forum:load_more_comments')}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
