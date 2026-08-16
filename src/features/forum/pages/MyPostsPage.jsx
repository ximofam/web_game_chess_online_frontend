import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, RefreshCw, FileText, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { forumService } from '../services/forumService';
import MyPostCard from '../components/MyPostCard';
import PostSkeleton from '../components/PostSkeleton';

export default function MyPostsPage() {
  const { t } = useTranslation(['forum']);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [deletingPost, setDeletingPost] = useState(null); // { id, title }

  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['myPosts', activeTab, search],
    queryFn: ({ pageParam = 0 }) =>
      forumService.getPosts({
        page: pageParam,
        size: 10,
        mine: true,
        status: activeTab,
        search,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number, totalPages } = lastPage.page ?? {};
      return number < totalPages - 1 ? number + 1 : undefined;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => forumService.deletePost(postId),
    onSuccess: () => {
      setDeletingPost(null);
      queryClient.invalidateQueries({ queryKey: ['myPosts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const allMyPosts = data?.pages.flatMap((p) => p.content) ?? [];

  const tabs = [
    { id: 'ALL', label: t('forum:tab_all') },
    { id: 'PENDING', label: t('forum:tab_pending') },
    { id: 'APPROVED', label: t('forum:tab_approved') },
    { id: 'DENIED', label: t('forum:tab_denied') },
  ];

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Back link & Title */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/forum"
          className="inline-flex items-center gap-1.5 text-sm font-inter font-semibold text-chess-muted hover:text-chess-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('forum:back_to_forum')}
        </Link>

        <Link
          id="my-posts-create-btn"
          to="/forum/create"
          className="flex items-center gap-2 px-4 py-2 bg-chess-gold text-chess-dark font-inter font-bold text-sm rounded-lg hover:bg-chess-gold-hover transition-colors"
        >
          <Plus className="w-4 h-4" /> {t('forum:write_new_post')}
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-chess-text mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-chess-gold" /> {t('forum:manage_my_posts')}
        </h1>
        <p className="text-sm font-inter text-chess-muted">
          {t('forum:manage_posts_desc')}
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-chess-surface p-1.5 rounded-lg border border-chess-border shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-status-${tab.id.toLowerCase()}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-inter text-xs font-semibold transition-colors focus:outline-none ${
                activeTab === tab.id
                  ? 'bg-chess-gold text-chess-dark shadow-sm'
                  : 'text-chess-muted hover:text-chess-text hover:bg-chess-dark'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
          <input
            type="text"
            placeholder={t('forum:search_by_title')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-chess-dark border border-chess-border rounded-lg text-sm font-inter text-chess-text placeholder-chess-muted focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-chess-gold focus:border-chess-gold transition-colors"
          />
          <Search className="w-4 h-4 text-chess-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* List content */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 font-inter text-chess-muted bg-chess-surface border border-chess-border rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-2">{t('forum:err_cannot_load_my_posts')}</p>
          <button
            onClick={() => refetch()}
            className="text-sm font-semibold text-chess-gold hover:underline inline-flex items-center gap-1 mt-2 focus:outline-none"
          >
            <RefreshCw className="w-4 h-4" /> {t('forum:try_again')}
          </button>
        </div>
      ) : allMyPosts.length === 0 ? (
        <div className="text-center py-16 font-inter text-chess-muted bg-chess-surface border border-chess-border rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-2">{t('forum:no_posts_found')}</p>
          <p className="text-sm mb-4">
            {activeTab !== 'ALL'
              ? t('forum:no_posts_in_status', { status: tabs.find((t) => t.id === activeTab)?.label })
              : t('forum:no_posts_created_yet')}
          </p>
          <Link
            to="/forum/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-chess-gold text-chess-dark font-bold text-sm rounded-lg hover:bg-chess-gold-hover transition-colors"
          >
            <Plus className="w-4 h-4" /> {t('forum:create_first_post')}
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {allMyPosts.map((post) => (
              <MyPostCard
                key={post.id}
                post={post}
                onDelete={(id, title) => setDeletingPost({ id, title })}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                id="load-more-my-posts"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="flex items-center gap-2 px-6 py-2.5 border border-chess-border rounded-lg bg-transparent text-sm font-inter font-semibold text-chess-text hover:border-chess-gold hover:text-chess-gold transition-colors disabled:opacity-60 focus:outline-none"
              >
                {isFetchingNextPage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> {t('forum:loading')}
                  </>
                ) : (
                  t('forum:load_more')
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-chess-surface border border-chess-border rounded-lg p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-chess-text">{t('forum:confirm_delete_post')}</h3>
            </div>

            <p className="text-sm font-inter text-chess-muted">
              {t('forum:are_you_sure_delete_post')}{' '}
              <span className="text-chess-text font-semibold">"{deletingPost.title}"</span>{t('forum:delete_irreversible')}
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-chess-border">
              <button
                onClick={() => setDeletingPost(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-inter font-semibold text-chess-text bg-chess-dark border border-chess-border hover:bg-chess-border/50 rounded-lg transition-colors focus:outline-none"
              >
                {t('forum:cancel_delete')}
              </button>
              <button
                id="confirm-delete-btn"
                onClick={() => deleteMutation.mutate(deletingPost.id)}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-inter font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-50 focus:outline-none"
              >
                {deleteMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> {t('forum:deleting')}
                  </>
                ) : (
                  t('forum:delete_post')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
