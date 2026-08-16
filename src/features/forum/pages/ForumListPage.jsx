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
              className="flex items-center gap-2 px-4 py-2 border border-chess-border bg-transparent text-chess-text font-inter font-semibold text-sm rounded-lg hover:border-chess-gold hover:text-chess-gold transition-colors"
            >
              <FileText className="w-4 h-4" />
              {t('forum:my_posts_nav')}
            </Link>

            <Link
              id="create-post-btn"
              to="/forum/create"
              className="flex items-center gap-2 px-4 py-2 bg-chess-gold text-chess-dark font-inter font-bold text-sm rounded-lg hover:bg-chess-gold-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('forum:create_post_nav')}
            </Link>
          </div>
        )}
      </div>

      {/* Controls: Search & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-chess-surface p-4 rounded-lg border border-chess-border shadow-sm">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            id="forum-search-input"
            type="text"
            placeholder={t('forum:search_placeholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-chess-dark border border-chess-border rounded-lg text-sm font-inter text-chess-text placeholder-chess-muted focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold focus:border-chess-gold transition-colors"
          />
          <Search className="w-4 h-4 text-chess-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-chess-muted" />
          <span className="text-xs text-chess-muted font-inter uppercase tracking-widest font-semibold hidden sm:inline">{t('forum:sort_label')}</span>
          <select
            id="forum-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-chess-dark border border-chess-border text-chess-text font-inter text-xs font-semibold rounded-lg px-3 py-2 focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold focus:border-chess-gold cursor-pointer"
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
        <div className="text-center py-16 font-inter text-chess-muted bg-chess-surface border border-chess-border rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-2">{t('forum:err_cannot_load_posts')}</p>
          <p className="text-sm">{t('forum:please_try_again')}</p>
        </div>
      ) : allPosts.length === 0 ? (
        <div className="text-center py-16 font-inter text-chess-muted bg-chess-surface border border-chess-border rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-2">{t('forum:no_posts_yet')}</p>
          {search ? (
            <p className="text-sm">{t('forum:no_posts_match', { search })}</p>
          ) : canPost ? (
            <Link to="/forum/create" className="text-chess-gold font-semibold text-sm hover:underline hover:text-chess-gold-hover transition-colors">
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
                className="flex items-center gap-2 px-6 py-2.5 border border-chess-border rounded-lg bg-transparent text-sm font-inter font-semibold text-chess-text hover:border-chess-gold hover:text-chess-gold transition-colors disabled:opacity-60"
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
