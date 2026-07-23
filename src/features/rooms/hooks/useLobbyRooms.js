import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { roomsApi } from '../api/roomsApi';
import { useSocket } from '../../../socket/useSocket';

/**
 * Custom Hook quản lý danh sách phòng chơi ở Sảnh (Lobby)
 * Tự động đồng bộ Real-time qua STOMP WebSocket Topic `/topic/lobbies`
 */
export function useLobbyRooms(page = 0, size = 20) {
  const queryClient = useQueryClient();
  const { subscribe, unsubscribe, connectionStatus } = useSocket();

  // 1. Initial State Fetch via TanStack React Query
  const {
    data: initialRoomsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['rooms', 'lobby', page, size],
    queryFn: () => roomsApi.getRooms(page, size),
    staleTime: 30000,
  });

  // Ensure rooms is an array (handle either raw array or paginated object response)
  const rooms = Array.isArray(initialRoomsData)
    ? initialRoomsData
    : (initialRoomsData?.content || []);

  // 2. Real-time Subscription to WebSocket Topic `/topic/lobbies`
  useEffect(() => {
    if (connectionStatus !== 'CONNECTED') return;

    const subId = subscribe('/topic/lobbies', (message) => {
      try {
        const event = JSON.parse(message.body);
        if (!event || !event.type) return;

        queryClient.setQueryData(['rooms', 'lobby', page, size], (oldData) => {
          const currentList = Array.isArray(oldData) ? oldData : (oldData?.content || []);

          if (event.type === 'ROOM_CREATED') {
            const newRoom = event.data;
            if (!newRoom || !newRoom.roomId) return oldData;
            // Prevent duplicate room insertion
            if (currentList.some((r) => r.roomId === newRoom.roomId)) return oldData;
            const updated = [newRoom, ...currentList];
            return Array.isArray(oldData) ? updated : { ...oldData, content: updated };
          }

          if (event.type === 'ROOM_DELETED') {
            const deletedId = event.data?.roomId;
            if (!deletedId) return oldData;
            const updated = currentList.filter((r) => r.roomId !== deletedId);
            return Array.isArray(oldData) ? updated : { ...oldData, content: updated };
          }

          if (event.type === 'ROOM_UPDATED') {
            const updatedRoomData = event.data;
            if (!updatedRoomData || !updatedRoomData.roomId) return oldData;
            const updated = currentList.map((r) =>
              r.roomId === updatedRoomData.roomId ? { ...r, ...updatedRoomData } : r
            );
            return Array.isArray(oldData) ? updated : { ...oldData, content: updated };
          }

          return oldData;
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
  }, [connectionStatus, subscribe, unsubscribe, queryClient, page, size]);

  return {
    rooms,
    isLoading,
    isError,
    error,
    refetch,
    connectionStatus,
  };
}
