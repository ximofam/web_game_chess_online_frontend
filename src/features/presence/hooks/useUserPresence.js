import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../../../shared/socket/useSocket';
import { presenceService } from '../services/presenceService';

const normalizePresence = (data) => ({
  status: data?.status || 'OFFLINE',
  roomId: data?.roomId || null,
  role: data?.role || null,
});

export const useUserPresence = (userId) => {
  const { subscribe, unsubscribe, connectionStatus } = useSocket();
  const [presence, setPresence] = useState(normalizePresence(null));
  const [loading, setLoading] = useState(true);

  const fetchInitialPresence = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await presenceService.getUserPresence(userId);
      setPresence(normalizePresence(data));
    } catch (err) {
      console.warn(`Failed to fetch presence for user ${userId}`, err);
      setPresence(normalizePresence(null));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setPresence(normalizePresence(null));
      setLoading(false);
      return;
    }
    fetchInitialPresence();
  }, [userId, fetchInitialPresence]);

  useEffect(() => {
    if (connectionStatus !== 'CONNECTED' || !userId) return;
    
    const subId = subscribe(`/topic/user.${userId}`, (msg) => {
      try {
        const body = JSON.parse(msg.body);
        if (body.type === 'USER_PRESENCE') {
          setPresence(normalizePresence(body.data));
        }
      } catch (err) {
        console.warn('Failed to parse presence message', err);
      }
    });

    return () => {
      unsubscribe(subId);
    };
  }, [connectionStatus, userId, subscribe, unsubscribe]);

  return {
    ...presence,
    isOnline: presence.status === 'ONLINE',
    isInRoom: presence.status === 'IN_ROOM',
    isPlaying: presence.status === 'PLAYING',
    isOffline: presence.status === 'OFFLINE',
    loading,
    refreshPresence: fetchInitialPresence
  };
};
