/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useSocket } from '../../../shared/socket/useSocket';
import { presenceService } from '../services/presenceService';

export const PresenceContext = createContext(null);

const normalizePresence = (data) => ({
  status: data?.status || 'OFFLINE',
  roomId: data?.roomId || null,
  role: data?.role || null,
});

export const PresenceProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const { subscribe, unsubscribe, connectionStatus } = useSocket();
  const [presence, setPresence] = useState(normalizePresence(null));
  const [loading, setLoading] = useState(true);

  const fetchInitialPresence = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const data = await presenceService.getUserPresence(currentUser.id);
      setPresence(normalizePresence(data));
    } catch (err) {
      console.warn('Failed to fetch initial presence, defaulting to OFFLINE', err);
      setPresence(normalizePresence(null));
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // 1. Load REST presence on mount or auth change
  useEffect(() => {
    if (!isAuthenticated) {
      setPresence(normalizePresence(null));
      setLoading(false);
      return;
    }
    fetchInitialPresence();
  }, [isAuthenticated, fetchInitialPresence]);

  // 2. Subscribe to STOMP for realtime updates
  useEffect(() => {
    if (connectionStatus !== 'CONNECTED' || !currentUser?.id) return;
    
    const subId = subscribe(`/topic/user.${currentUser.id}`, (msg) => {
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
  }, [connectionStatus, currentUser?.id, subscribe, unsubscribe]);

  const value = {
    ...presence,
    isOnline: presence.status === 'ONLINE',
    isInRoom: presence.status === 'IN_ROOM',
    isPlaying: presence.status === 'PLAYING',
    isOffline: presence.status === 'OFFLINE',
    loading,
    refreshPresence: fetchInitialPresence
  };

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
};
