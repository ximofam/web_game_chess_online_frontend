import React, { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { forumService } from '../services/forumService';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * ForumListPage — danh sách bài viết APPROVED, phân trang load-more.
 * Layout Header & Footer được đảm nhận bởi PublicLayout.
 */
export default function ForumListPage() {
  const { isAuthenticated, currentUser } = useAuth();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => forumService.getPosts(pageParam, 20),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number, totalPages } = lastPage.page ?? {};
      return number < totalPages - 1 ? number + 1 : undefined;
    },
  });

  const likeMutation = useMutation({
    mutationFn: ({ postId, isLike }) => forumService.likePost(postId, isLike),
    onMutate: async ({ postId, isLike }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      const prev = queryClient.getQueryData(['posts']);
      queryClient.setQueryData(['posts'], (old) => ({
        ...old,
        pages: old.pages.map(page => ({
          ...page,
          content: page.content.map(p =>
            p.id === postId
              ? { ...p, liked: isLike, likeCount: p.likeCount + (isLike ? 1 : -1) }
              : p
          ),
        })),
      }));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(['posts'], ctx.prev);
    },
  });

  const allPosts = data?.pages.flatMap(p => p.content) ?? [];
  const canPost = isAuthenticated && currentUser?.role !== 'GUEST';

  return (
    <main className="w-full max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-[#f3f4f6] mb-1">Forum</h1>
          <p className="text-sm text-[#9ca3af]">Thảo luận về cờ vua, chiến thuật, và hơn thế nữa</p>
        </div>
        {canPost && (
          <Link
            id="create-post-btn"
            to="/forum/create"
            className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0d0e12] font-bold text-sm rounded-xl hover:bg-[#f3cd57] hover:shadow-[0_4px_14px_rgba(212,175,55,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo bài viết
          </Link>
        )}
      </div>

      {/* Post list */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => <PostSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-[#9ca3af]">
          <p className="text-lg mb-2">Không thể tải bài viết</p>
          <p className="text-sm">Vui lòng thử lại sau.</p>
        </div>
      ) : allPosts.length === 0 ? (
        <div className="text-center py-16 text-[#9ca3af]">
          <p className="text-lg mb-2">Chưa có bài viết nào</p>
          {canPost && (
            <Link to="/forum/create" className="text-[#d4af37] text-sm hover:underline">
              Hãy là người đầu tiên chia sẻ →
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {allPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={isAuthenticated && currentUser?.role !== 'GUEST'
                  ? (id, isLike) => likeMutation.mutate({ postId: id, isLike })
                  : null}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                id="load-more-posts"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center gap-2 px-6 py-2.5 border border-[#2d323f] rounded-xl text-sm font-semibold text-[#f3f4f6] hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-all disabled:opacity-60"
              >
                {isFetchingNextPage
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Đang tải...</>
                  : 'Xem thêm bài viết'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
