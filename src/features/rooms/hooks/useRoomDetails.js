import { useQuery } from '@tanstack/react-query';
import { roomService } from '../services/roomService';
import { useAuth } from '../../auth/context/AuthContext';

/**
 * Hook fetch thông tin phòng chơi từ GET /api/rooms/:roomId
 * Có hỗ trợ Mock Fallback khi DEV / backend endpoint chưa sẵn sàng.
 */
export function useRoomDetails(roomId) {
  const { currentUser } = useAuth();

  const query = useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      if (!roomId) throw new Error('Room ID is required');
      try {
        return await roomService.getRoomDetails(roomId);
      } catch (err) {
        // Mock fallback if API endpoint is not live or 404
        console.warn(`[useRoomDetails] Failed to fetch room ${roomId}, using fallback mock data.`, err);
        return {
          roomId,
          name: currentUser?.username ? `${currentUser.username}'s room` : `Phòng Cờ #${roomId?.slice(0, 6)}`,
          createdAt: Date.now(),
          status: 'WAITING',
          host: {
            id: currentUser?.id || 1,
            username: currentUser?.username || 'Host Player',
            avatarUrl: currentUser?.avatarUrl || null,
            role: currentUser?.role || 'USER',
          },
          white: {
            id: currentUser?.id || 1,
            username: currentUser?.username || 'Host Player',
            avatarUrl: currentUser?.avatarUrl || null,
          },
          black: null,
          spectators: [],
          settings: {
            timeMinutes: 5,
            incrementSeconds: 3,
            variant: 'STANDARD',
            rated: true,
            isPrivate: false,
          },
        };
      }
    },
    enabled: Boolean(roomId),
    staleTime: 5000,
  });

  return {
    room: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
