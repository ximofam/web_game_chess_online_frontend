import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { roomService } from '../services/roomService';
import { useAuth } from '../../auth/context/AuthContext';
import { useSocket } from '../../../shared/socket/useSocket';
import { useTranslation } from 'react-i18next';

/**
 * Hook fetch thông tin phòng chơi từ GET /api/rooms/:roomId
 * Có hỗ trợ Mock Fallback khi DEV / backend endpoint chưa sẵn sàng.
 */
export function useRoomDetails(roomId, options = {}) {
  const { onRoomDeleted } = options;
  const navigate = useNavigate();
  const { currentUser, showToast } = useAuth();
  const queryClient = useQueryClient();
  const { subscribe, unsubscribe, connectionStatus } = useSocket();
  const { t } = useTranslation(['room']);

  const onRoomDeletedRef = useRef(onRoomDeleted);
  useEffect(() => {
    onRoomDeletedRef.current = onRoomDeleted;
  }, [onRoomDeleted]);

  const query = useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      if (!roomId) throw new Error('Room ID is required');
      try {
        return await roomService.getRoomDetails(roomId);
      } catch (err) {
        if (err?.response?.status === 404) {
          throw err;
        }
        // Mock fallback if API endpoint is not live or other errors
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

    const topic = `/topic/room.${roomId}`;
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
          if (window.location.pathname !== `/room/${roomId}`) {
            showToast(t('room:playerJoined', '{{username}} joined the room', { username: user.username }), 'info');
          }
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

            return { ...oldRoom, [role]: null, [`${role}Ready`]: false };
          });
          if (window.location.pathname !== `/room/${roomId}` && userId !== currentUser?.id) {
            showToast(t('room:playerLeft', 'A player left the room'), 'info');
          }
        }

        if (event.type === 'PLAYER_READY') {
          const { role, isReady } = event.data || {};
          if (role === 'white' || role === 'black') {
            queryClient.setQueryData(['room', roomId], (oldRoom) => {
              if (!oldRoom) return oldRoom;
              return { ...oldRoom, [`${role}Ready`]: isReady };
            });
          }
        }

        if (event.type === 'COUNTDOWN_STARTED') {
          const { startAt } = event.data || {};
          if (startAt) {
            queryClient.setQueryData(['room', roomId], (oldRoom) => {
              if (!oldRoom) return oldRoom;
              return { ...oldRoom, status: 'COUNTDOWN', startAt };
            });
          }
        }

        if (event.type === 'COUNTDOWN_CANCELLED') {
          queryClient.setQueryData(['room', roomId], (oldRoom) => {
            if (!oldRoom) return oldRoom;
            return { ...oldRoom, status: 'WAITING', startAt: null };
          });
        }

        if (event.type === 'GAME_STARTED') {
          const { whiteId, blackId, turn, fen, turnStartedAt } = event.data || {};
          queryClient.setQueryData(['room', roomId], (oldRoom) => {
            if (!oldRoom) return oldRoom;
            return {
              ...oldRoom,
              status: 'IN_PROGRESS',
              startAt: null,
              gameData: {
                whiteId,
                blackId,
                turn: turn || 'white',
                fen: fen || 'start',
                initialFen: event.data?.initialFen || fen || 'start',
                moves: event.data?.moves || [],
                // Server should eventually pass initial clock here, fallback to settings if not provided
                whiteRemainingMillis: event.data?.whiteRemainingMillis || (oldRoom.settings?.timeMinutes * 60 * 1000),
                blackRemainingMillis: event.data?.blackRemainingMillis || (oldRoom.settings?.timeMinutes * 60 * 1000),
                turnStartedAt,
              }
            };
          });
        }

        if (event.type === 'MOVE_MADE') {
          const { move, newTurn, newFen, whiteRemainingMillis, blackRemainingMillis, turnStartedAt } = event.data || {};
          queryClient.setQueryData(['room', roomId], (oldRoom) => {
            if (!oldRoom) return oldRoom;
            return {
              ...oldRoom,
              gameData: {
                ...oldRoom.gameData,
                turn: newTurn,
                fen: newFen,
                moves: move ? [...(oldRoom.gameData?.moves || []), move] : (oldRoom.gameData?.moves || []),
                whiteRemainingMillis,
                blackRemainingMillis,
                turnStartedAt,
                drawOfferBy: null, // Xóa offer khi có nước đi
              }
            };
          });
        }

        if (event.type === 'DRAW_OFFERED') {
          const { offeredBy } = event.data || {};
          queryClient.setQueryData(['room', roomId], (oldRoom) => {
            if (!oldRoom) return oldRoom;
            return {
              ...oldRoom,
              gameData: {
                ...oldRoom.gameData,
                drawOfferBy: offeredBy
              }
            };
          });
        }

        if (event.type === 'DRAW_DECLINED') {
          showToast(t('room:drawDeclinedToast', 'Opponent declined the draw offer.'), 'info');
          queryClient.setQueryData(['room', roomId], (oldRoom) => {
            if (!oldRoom) return oldRoom;
            return {
              ...oldRoom,
              gameData: {
                ...oldRoom.gameData,
                drawOfferBy: null
              }
            };
          });
        }

        if (event.type === 'GAME_OVER') {
          const { winner, reason } = event.data || {};
          queryClient.setQueryData(['room', roomId], (oldRoom) => {
            if (!oldRoom) return oldRoom;
            return {
              ...oldRoom,
              status: 'WAITING',
              gameData: {
                ...oldRoom.gameData,
                winner,
                gameOverReason: reason,
                drawOfferBy: null // Xóa offer khi kết thúc
              }
            };
          });
        }

        if (event.type === 'CHAT_MESSAGE') {
          if (window.location.pathname !== `/room/${roomId}` && event.data?.sender?.id !== currentUser?.id) {
            const sender = event.data?.sender?.username || 'Ai đó';
            showToast(`💬 ${sender}: ${event.data?.message}`, 'info');
          }
        }

        if (event.type === 'ROOM_DELETED') {
          queryClient.invalidateQueries({ queryKey: ['rooms', 'lobby'] });
          showToast(t('room:roomDeletedMsg', 'Room was deleted by host.'), 'error');
          if (onRoomDeletedRef.current) {
            onRoomDeletedRef.current();
          } else {
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error('[Room Socket] Failed to parse realtime event', err);
      }
    });

    return () => {
      if (subId) unsubscribe(subId);
    };
  }, [roomId, connectionStatus, subscribe, unsubscribe, queryClient, navigate, showToast, currentUser?.id, t]);

  // Tự động refetch lại thông tin phòng khi WebSocket kết nối lại thành công
  // Đảm bảo không bị lỡ mất sự kiện (như xóa phòng) trong lúc rớt mạng
  const prevConnectionStatus = useRef(connectionStatus);
  useEffect(() => {
    if (prevConnectionStatus.current !== 'CONNECTED' && connectionStatus === 'CONNECTED' && roomId) {
      queryClient.invalidateQueries({ queryKey: ['room', roomId] });
    }
    prevConnectionStatus.current = connectionStatus;
  }, [connectionStatus, roomId, queryClient]);

  return {
    room: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
