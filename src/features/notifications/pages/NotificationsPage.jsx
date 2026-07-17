import React, { useState, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import Navbar from '../../home/components/Navbar';
import NotificationItem from '../components/NotificationItem';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Footer from '../../../shared/components/Footer';
import { CheckCheck, Trash2, RefreshCw, ArrowDown } from 'lucide-react';

/**
 * NotificationsPage renders the player's notification history log.
 * Handles load-more pagination, deduplication, and bulk status updates.
 */
export const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteItem,
    clearAll,
    loadMore,
  } = useNotifications();

  const [page, setPage] = useState(0);
  const [extraItems, setExtraItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Sync / Reset paging whenever the core context list shifts (e.g. reload or WebSocket push)
  useEffect(() => {
    setPage(0);
    setExtraItems([]);
    setHasMore(notifications.length >= 20);
  }, [notifications]);

  const handleLoadMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const data = await loadMore(nextPage, 20);
      if (data && data.content && data.content.length > 0) {
        setExtraItems((prev) => [...prev, ...data.content]);
        setPage(nextPage);
        // If it's the last page or returns fewer items than size, hasMore becomes false
        setHasMore(!data.last && data.content.length === 20);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more notifications', err);
      setHasMore(false);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Merge context notifications (page 0 + live web sockets) and loaded pages
  const combined = [...notifications, ...extraItems];
  // Deduplicate items by ID and sort newest first
  const uniqueItems = Array.from(new Map(combined.map((item) => [item.id, item])).values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="w-full min-h-screen bg-[#0d0e12] flex flex-col justify-between select-none">
      {/* NAVBAR */}
      <Navbar />

      {/* BODY */}
      <main className="flex-1 flex flex-col items-center p-6 md:p-12">
        <div className="w-full max-w-3xl flex flex-col gap-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between border-b border-[#2d323f] pb-4">
            <h2 className="font-playfair text-2xl font-bold text-[#f3f4f6] m-0">
              Notification Arena
            </h2>

            {uniqueItems.length > 0 && (
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2d323f] hover:bg-[#2d323f]/50 hover:text-[#d4af37] text-xs font-semibold text-[#f3f4f6] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4 text-[#d4af37]" />
                    <span>MARK ALL READ</span>
                  </button>
                )}

                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 hover:bg-red-900/40 hover:border-red-500/60 text-xs font-semibold text-red-200 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-red-500"
                  title="Clear all history"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>CLEAR ALL</span>
                </button>
              </div>
            )}
          </div>

          {/* List display */}
          {uniqueItems.length > 0 ? (
            <div className="bg-[#1a1d24] border border-[#2d323f] rounded-xl overflow-hidden shadow-lg divide-y divide-[#2d323f]/50">
              {uniqueItems.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onMarkRead={markAsRead}
                  onDelete={deleteItem}
                />
              ))}

              {/* Load More Trigger */}
              {hasMore && (
                <div className="p-4 flex justify-center bg-[#13161c]/30">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="flex items-center gap-1.5 bg-[#d4af37] text-[#0d0e12] font-bold py-2.5 px-5 rounded-lg hover:bg-[#f3cd57] hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)] transition-all cursor-pointer text-xs disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                    <span>LOAD MORE NOTIFICATIONS</span>
                  </button>
                </div>
              )}
            </div>
          ) : notifications.length === 0 && page === 0 ? (
            <EmptyState />
          ) : (
            <LoadingSkeleton />
          )}
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default NotificationsPage;
