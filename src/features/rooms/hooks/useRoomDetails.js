import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../services/roomService';
import { useAuth } from '../../auth/context/AuthContext';
import { useSocket } from '../../../shared/socket/useSocket';

/**
 * Hook fetch thông tin phòng chơi từ GET /api/rooms/:roomId
 * Có hỗ trợ Mock Fallback khi DEV / backend endpoint chưa sẵn sàng.
 */
export function useRoomDetails(roomId) {
  const navigate = useNavigate();
  const { currentUser, showToast } = useAuth();
  const queryClient = useQueryClient();
  const { subscribe, unsubscribe, connectionStatus } = useSocket();

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

  // Đăng ký WebSocket lắng nghe sự kiện của phòng
  useEffect(() => {
    if (!roomId || connectionStatus !== 'CONNECTED') return;

    const topic = `/topic/room/${roomId}`;
    const subId = subscribe(topic, (message) => {
      try {
        const event = JSON.parse(message.body);
        if (!event || !event.type) return;

        if (event.type === 'PLAYER_JOINED') {
          const { role, user } = event.data || {};
          if (!role || !user) return;

          queryClient.setQueryData(['room', roomId], (oldRoom) => {
            if (!oldRoom) return oldRoom;

            if (role === 'spectator') {
              const currentSpectators = oldRoom.spectators || [];
              const exists = currentSpectators.some((s) => s.id === user.id);
              if (exists) return oldRoom;
              return { ...oldRoom, spectators: [user, ...currentSpectators] };
            }

            return { ...oldRoom, [role]: user };
          });
        }

        if (event.type === 'PLAYER_LEFT') {
          const { role, userId } = event.data || {};
          if (!role || !userId) return;

          queryClient.setQueryData(['room', roomId], (oldRoom) => {
            if (!oldRoom) return oldRoom;

            if (role === 'spectator') {
              const updatedSpectators = (oldRoom.spectators || []).filter(
                (s) => String(s.id) !== String(userId)
              );
              return { ...oldRoom, spectators: updatedSpectators };
            }

            return { ...oldRoom, [role]: null };
          });
        }

        if (event.type === 'ROOM_DELETED') {
          // Xoá cache phòng và redirect về sảnh
          queryClient.removeQueries({ queryKey: ['room', roomId] });
          queryClient.invalidateQueries({ queryKey: ['rooms', 'lobby'] });
          showToast('Phòng chơi đã bị hủy do chủ phòng rời đi.', 'error');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('[Room Socket] Failed to parse realtime event', err);
      }
    });

    return () => {
      if (subId) unsubscribe(subId);
    };
  }, [roomId, connectionStatus, subscribe, unsubscribe, queryClient, navigate, showToast]);

  return {
    room: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
