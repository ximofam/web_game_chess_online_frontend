import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, RefreshCw, FileText, ArrowLeft, AlertTriangle } from 'lucide-react';
import { forumService } from '../services/forumService';
import MyPostCard from '../components/MyPostCard';
import PostSkeleton from '../components/PostSkeleton';

export default function MyPostsPage() {
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
    { id: 'ALL', label: 'Tất cả' },
    { id: 'PENDING', label: 'Chờ duyệt' },
    { id: 'APPROVED', label: 'Đã duyệt' },
    { id: 'DENIED', label: 'Từ chối' },
  ];

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-10">
      {/* Back link & Title */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/forum"
          className="inline-flex items-center gap-1.5 text-sm text-[#9ca3af] hover:text-[#d4af37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại Diễn đàn
        </Link>

        <Link
          id="my-posts-create-btn"
          to="/forum/create"
          className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0d0e12] font-bold text-sm rounded-xl hover:bg-[#f3cd57] hover:shadow-[0_4px_14px_rgba(212,175,55,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" /> Viết bài mới
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="font-playfair text-3xl font-bold text-[#f3f4f6] mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#d4af37]" /> Quản lý bài viết của tôi
        </h1>
        <p className="text-sm text-[#9ca3af]">
          Theo dõi trạng thái duyệt bài, ghi chú của AI và quản lý tất cả bài thảo luận bạn đã tạo.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#161922] p-1.5 rounded-2xl border border-[#2d323f]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-status-${tab.id.toLowerCase()}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#d4af37] text-[#0d0e12] shadow-sm'
                  : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#252a36]'
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
            placeholder="Tìm theo tiêu đề..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#161922] border border-[#2d323f] rounded-xl text-sm text-[#f3f4f6] placeholder-[#9ca3af] focus:outline-hidden focus:border-[#d4af37] transition-colors"
          />
          <Search className="w-4 h-4 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
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
        <div className="text-center py-16 text-[#9ca3af] bg-[#161922] border border-[#2d323f] rounded-2xl">
          <p className="text-lg mb-2">Không thể tải bài viết của bạn</p>
          <button
            onClick={() => refetch()}
            className="text-sm text-[#d4af37] hover:underline inline-flex items-center gap-1 mt-2"
          >
            <RefreshCw className="w-4 h-4" /> Thử lại
          </button>
        </div>
      ) : allMyPosts.length === 0 ? (
        <div className="text-center py-16 text-[#9ca3af] bg-[#161922] border border-[#2d323f] rounded-2xl">
          <p className="text-lg mb-2">Không tìm thấy bài viết nào</p>
          <p className="text-sm mb-4">
            {activeTab !== 'ALL'
              ? `Bạn chưa có bài viết nào ở trạng thái "${tabs.find((t) => t.id === activeTab)?.label}".`
              : 'Bạn chưa tạo bài viết nào trên hệ thống.'}
          </p>
          <Link
            to="/forum/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-[#0d0e12] font-bold text-sm rounded-xl hover:bg-[#f3cd57] transition-all"
          >
            <Plus className="w-4 h-4" /> Tạo bài viết đầu tiên
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
                className="flex items-center gap-2 px-6 py-2.5 border border-[#2d323f] rounded-xl text-sm font-semibold text-[#f3f4f6] hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-all disabled:opacity-60"
              >
                {isFetchingNextPage ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Đang tải...
                  </>
                ) : (
                  'Xem thêm'
                )}
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#161922] border border-[#2d323f] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 bg-rose-500/10 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#f3f4f6]">Xác nhận xóa bài viết</h3>
            </div>

            <p className="text-sm text-[#9ca3af]">
              Bạn có chắc chắn muốn xóa bài viết{' '}
              <span className="text-[#f3f4f6] font-semibold">"{deletingPost.title}"</span>? Hành động này không thể hoàn tác.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingPost(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-semibold text-[#f3f4f6] bg-[#252a36] hover:bg-[#2d323f] rounded-xl transition-all"
              >
                Hủy bỏ
              </button>
              <button
                id="confirm-delete-btn"
                onClick={() => deleteMutation.mutate(deletingPost.id)}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Đang xóa...
                  </>
                ) : (
                  'Xóa bài viết'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
