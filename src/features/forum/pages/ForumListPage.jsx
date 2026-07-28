import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Search, ArrowUpDown, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { forumService } from '../services/forumService';
import PostCard from '../components/PostCard';
import PostSkeleton from '../components/PostSkeleton';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * ForumListPage — danh sách bài viết APPROVED, hỗ trợ tìm kiếm, sắp xếp và phân trang.
 */
export default function ForumListPage() {
  const { t } = useTranslation(['forum']);
  const { isAuthenticated, currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, mostViewed, mostLiked

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['posts', search, sortBy],
    queryFn: ({ pageParam = 0 }) =>
      forumService.getPosts({
        page: pageParam,
        size: 20,
        search,
        sortBy,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number, totalPages } = lastPage.page ?? {};
      return number < totalPages - 1 ? number + 1 : undefined;
    },
  });

  const likeMutation = useMutation({
    mutationFn: ({ postId, isLike }) => forumService.likePost(postId, isLike),
    onMutate: async ({ postId, isLike }) => {
      await queryClient.cancelQueries({ queryKey: ['posts', search, sortBy] });
      const prev = queryClient.getQueryData(['posts', search, sortBy]);
      queryClient.setQueryData(['posts', search, sortBy], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            content: page.content.map((p) =>
              p.id === postId
                ? { ...p, liked: isLike, likeCount: p.likeCount + (isLike ? 1 : -1) }
                : p
            ),
          })),
        };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        queryClient.setQueryData(['posts', search, sortBy], ctx.prev);
      }
    },
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const allPosts = data?.pages.flatMap((p) => p.content) ?? [];
  const canPost = isAuthenticated && currentUser?.role !== 'GUEST';

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        {canPost && (
          <div className="flex items-center gap-3">
            <Link
              id="my-posts-nav-btn"
              to="/forum/my-posts"
              className="flex items-center gap-2 px-4 py-2 border border-[#2d323f] bg-[#161922] text-[#e5e7eb] font-semibold text-sm rounded-xl hover:border-[#d4af37]/50 hover:text-[#d4af37] transition-all"
            >
              <FileText className="w-4 h-4 text-[#d4af37]" />
              {t('forum:my_posts_nav')}
            </Link>

            <Link
              id="create-post-btn"
              to="/forum/create"
              className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0d0e12] font-bold text-sm rounded-xl hover:bg-[#f3cd57] hover:shadow-[0_4px_14px_rgba(212,175,55,0.3)] transition-all"
            >
              <Plus className="w-4 h-4" />
              {t('forum:create_post_nav')}
            </Link>
          </div>
        )}
      </div>

      {/* Controls: Search & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-[#161922] p-4 rounded-2xl border border-[#2d323f]">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            id="forum-search-input"
            type="text"
            placeholder={t('forum:search_placeholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0d0e12] border border-[#2d323f] rounded-xl text-sm text-[#f3f4f6] placeholder-[#9ca3af] focus:outline-hidden focus:border-[#d4af37] transition-colors"
          />
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-[#9ca3af]" />
          <span className="text-xs text-[#9ca3af] font-medium hidden sm:inline">{t('forum:sort_label')}</span>
          <select
            id="forum-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0d0e12] border border-[#2d323f] text-[#f3f4f6] text-xs font-semibold rounded-xl px-3 py-2 focus:outline-hidden focus:border-[#d4af37] cursor-pointer"
          >
            <option value="newest">{t('forum:sort_newest')}</option>
            <option value="mostViewed">{t('forum:sort_most_viewed')}</option>
            <option value="mostLiked">{t('forum:sort_most_liked')}</option>
          </select>
        </div>
      </div>

      {/* Post list */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-[#9ca3af] bg-[#161922] border border-[#2d323f] rounded-2xl">
          <p className="text-lg mb-2">{t('forum:err_cannot_load_posts')}</p>
          <p className="text-sm">{t('forum:please_try_again')}</p>
        </div>
      ) : allPosts.length === 0 ? (
        <div className="text-center py-16 text-[#9ca3af] bg-[#161922] border border-[#2d323f] rounded-2xl">
          <p className="text-lg mb-2">{t('forum:no_posts_yet')}</p>
          {search ? (
            <p className="text-sm">{t('forum:no_posts_match', { search })}</p>
          ) : canPost ? (
            <Link to="/forum/create" className="text-[#d4af37] text-sm hover:underline">
              {t('forum:be_the_first_to_share')}
            </Link>
          ) : null}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {allPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={
                  isAuthenticated && currentUser?.role !== 'GUEST'
                    ? (id, isLike) => likeMutation.mutate({ postId: id, isLike })
                    : null
                }
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
                {isFetchingNextPage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> {t('forum:loading')}
                  </>
                ) : (
                  t('forum:load_more_posts')
                )}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
