import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../../shared/socket/useSocket';
import { presenceService } from '../services/presenceService';

/**
 * Presence Socket Adapter
 * Destination: /topic/presence, /topic/presence.online-count, /app/presence.online-count
 * Event Namespace: presence:*
 */
export const PRESENCE_EVENTS = {
  UPDATE: 'presence:update',
  HEARTBEAT: 'presence:heartbeat',
  ONLINE_COUNT: 'presence:online-count',
};

export const subscribeToPresence = (socket, eventHandler) => {
  if (!socket || typeof socket.subscribe !== 'function') {
    return () => { };
  }

  const destination = '/topic/presence';
  const subId = socket.subscribe(destination, (message) => {
    if (message?.body) {
      try {
        const payload = JSON.parse(message.body);
        const eventType = payload.isHeartbeat ? PRESENCE_EVENTS.HEARTBEAT : PRESENCE_EVENTS.UPDATE;
        eventHandler({ type: eventType, payload });
      } catch (err) {
        console.error('[presenceSocket] Failed to parse presence frame payload', err);
      }
    }
  });

  return () => {
    socket.unsubscribe(subId);
  };
};

export const sendPresenceHeartbeat = (socket) => {
  if (!socket || typeof socket.send !== 'function') return false;
  return socket.send('/app/presence.heartbeat');
};

/**
 * Subscribes to real-time online user count updates.
 */
export const subscribeOnlineCount = (socket, callback) => {
  if (!socket || typeof socket.subscribe !== 'function') {
    return () => { };
  }

  const handleMessage = (message) => {
    if (message?.body !== undefined && message?.body !== null) {
      try {
        const raw = JSON.parse(message.body);
        const count = typeof raw === 'number' ? raw : (raw.count ?? Number(raw));
        if (!isNaN(count)) {
          callback(count);
        }
      } catch (_error) {
        const count = Number(message.body);
        if (!isNaN(count)) {
          callback(count);
        }
      }
    }
  };

  const subTopicId = socket.subscribe('/topic/presence.online-count', handleMessage);

  return () => {
    socket.unsubscribe(subTopicId);
  };
};

/**
 * Hook to get the real-time online user count via REST API and Websocket
 */
export const useOnlineCount = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  const { data: onlineCount = 0 } = useQuery({
    queryKey: ['presence', 'onlineCount'],
    queryFn: () => presenceService.getOnlineCount(),
    staleTime: Infinity, // Rely on websocket for updates
  });

  useEffect(() => {
    if (socket.connectionStatus !== 'CONNECTED') return;

    queryClient.invalidateQueries({ queryKey: ['presence', 'onlineCount'] });

    const unsubscribe = subscribeOnlineCount(socket, (count) => {
      queryClient.setQueryData(['presence', 'onlineCount'], count);
    });

    return () => unsubscribe();
  }, [socket, socket.connectionStatus, queryClient]);

  return onlineCount;
};
