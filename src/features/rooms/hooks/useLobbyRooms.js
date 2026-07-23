import { useEffect, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../services/roomService';
import { useSocket } from '../../../socket/useSocket';

/**
 * Custom Hook quản lý danh sách phòng chơi ở Sảnh (Lobby)
 * Hỗ trợ Phân trang cuộn vô tận (Infinite Scroll), Tổng số lượng phòng (totalElements) & Realtime STOMP Topic `/topic/lobbies`
 */
export function useLobbyRooms(size = 20) {
  const queryClient = useQueryClient();
  const { subscribe, unsubscribe, connectionStatus } = useSocket();

  // 1. Fetch Infinite Pages via TanStack React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['rooms', 'lobby', size],
    queryFn: ({ pageParam = 0 }) => roomService.getRooms(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined;

      // 1. Structure specified in prompt: { content: [...], page: { size: 20, number: 0, totalElements: 1, totalPages: 1 } }
      const pageObj = lastPage.page;
      if (pageObj && typeof pageObj.number === 'number' && typeof pageObj.totalPages === 'number') {
        return pageObj.number + 1 < pageObj.totalPages ? pageObj.number + 1 : undefined;
      }

      // 2. Direct Spring Boot Page response: { content: [...], number: 0, totalPages: 1 }
      if (typeof lastPage.number === 'number' && typeof lastPage.totalPages === 'number') {
        return lastPage.number + 1 < lastPage.totalPages ? lastPage.number + 1 : undefined;
      }

      // 3. Fallback: if item count equals page size, try next page
      const items = Array.isArray(lastPage) ? lastPage : (lastPage.content || []);
      return items.length >= size ? allPages.length : undefined;
    },
    staleTime: 30000,
  });

  // 2. Flatten all pages into a single flat array of unique rooms
  const rooms = useMemo(() => {
    if (!data?.pages) return [];
    const roomMap = new Map();
    data.pages.forEach((pageData) => {
      const items = Array.isArray(pageData) ? pageData : (pageData.content || []);
      items.forEach((item) => {
        if (item && item.roomId) {
          roomMap.set(item.roomId, item);
        }
      });
    });
    return Array.from(roomMap.values());
  }, [data]);

  // 3. Calculate totalElements from response metadata (with fallback to rooms count)
  const totalElements = useMemo(() => {
    if (!data?.pages || data.pages.length === 0) return 0;
    const firstPage = data.pages[0];
    if (!firstPage) return 0;
    const count = firstPage?.page?.totalElements ?? firstPage?.totalElements;
    if (typeof count === 'number') return count;
    return rooms.length;
  }, [data, rooms]);

  // 4. Real-time Subscription to WebSocket Topic `/topic/lobbies`
  useEffect(() => {
    if (connectionStatus !== 'CONNECTED') return;

    const subId = subscribe('/topic/lobbies', (message) => {
      try {
        const event = JSON.parse(message.body);
        if (!event || !event.type) return;

        queryClient.setQueryData(['rooms', 'lobby', size], (oldData) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;

          const newPages = oldData.pages.map((pageData, index) => {
            const currentItems = Array.isArray(pageData) ? pageData : (pageData.content || []);

            if (event.type === 'ROOM_CREATED') {
              const newRoom = event.data;
              if (!newRoom || !newRoom.roomId) return pageData;

              // Prepend new room to the first page (index === 0) & increment totalElements
              if (index === 0) {
                const filtered = currentItems.filter((r) => r.roomId !== newRoom.roomId);
                const updatedItems = [newRoom, ...filtered];
                if (Array.isArray(pageData)) return updatedItems;

                const currentTotal = pageData.page?.totalElements ?? pageData.totalElements ?? currentItems.length;
                const newTotal = currentTotal + (filtered.length === currentItems.length ? 1 : 0);

                return {
                  ...pageData,
                  content: updatedItems,
                  ...(pageData.page
                    ? { page: { ...pageData.page, totalElements: newTotal } }
                    : { totalElements: newTotal }),
                };
              }

              // Remove duplicate from subsequent pages if exists
              const filtered = currentItems.filter((r) => r.roomId !== newRoom.roomId);
              return Array.isArray(pageData) ? filtered : { ...pageData, content: filtered };
            }

            if (event.type === 'ROOM_DELETED') {
              const deletedId = event.data?.roomId;
              if (!deletedId) return pageData;
              const updatedItems = currentItems.filter((r) => r.roomId !== deletedId);
              if (Array.isArray(pageData)) return updatedItems;

              const wasRemoved = currentItems.length > updatedItems.length;
              const currentTotal = pageData.page?.totalElements ?? pageData.totalElements ?? currentItems.length;
              const newTotal = Math.max(0, currentTotal - (wasRemoved ? 1 : 0));

              return {
                ...pageData,
                content: updatedItems,
                ...(pageData.page
                  ? { page: { ...pageData.page, totalElements: newTotal } }
                  : { totalElements: newTotal }),
              };
            }

            if (event.type === 'ROOM_UPDATED') {
              const updatedRoomData = event.data;
              if (!updatedRoomData || !updatedRoomData.roomId) return pageData;
              const updatedItems = currentItems.map((r) =>
                r.roomId === updatedRoomData.roomId ? { ...r, ...updatedRoomData } : r
              );
              return Array.isArray(pageData) ? updatedItems : { ...pageData, content: updatedItems };
            }

            return pageData;
          });

          return {
            ...oldData,
            pages: newPages,
          };
        });
      } catch (err) {
        console.error('[Lobby Socket] Failed to parse realtime event', err);
      }
    });

    return () => {
      if (subId) {
        unsubscribe(subId);
      }
    };
  }, [connectionStatus, subscribe, unsubscribe, queryClient, size]);

  return {
    rooms,
    totalElements,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    connectionStatus,
  };
}
