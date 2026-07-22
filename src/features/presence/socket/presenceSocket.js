import { useState, useEffect } from 'react';
import { useSocket } from '../../../socket/useSocket';

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
    return () => {};
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
 * Subscribes to online user count updates.
 * - `/app/presence.online-count`: triggers initial @SubscribeMapping response
 * - `/topic/presence.online-count`: receives real-time broadcast updates
 */
export const subscribeOnlineCount = (socket, callback) => {
  if (!socket || typeof socket.subscribe !== 'function') {
    return () => {};
  }

  const handleMessage = (message) => {
    if (message?.body !== undefined && message?.body !== null) {
      try {
        const raw = JSON.parse(message.body);
        const count = typeof raw === 'number' ? raw : (raw.count ?? Number(raw));
        if (!isNaN(count)) {
          callback(count);
        }
      } catch (e) {
        const count = Number(message.body);
        if (!isNaN(count)) {
          callback(count);
        }
      }
    }
  };

  const subAppId = socket.subscribe('/app/presence.online-count', handleMessage);
  const subTopicId = socket.subscribe('/topic/presence.online-count', handleMessage);

  return () => {
    socket.unsubscribe(subAppId);
    socket.unsubscribe(subTopicId);
  };
};

/**
 * Hook to get and listen to the real-time online user count
 */
export const useOnlineCount = () => {
  const socket = useSocket();
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    if (socket.connectionStatus !== 'CONNECTED') return;

    const unsubscribe = subscribeOnlineCount(socket, (count) => {
      setOnlineCount(count);
    });

    return () => {
      unsubscribe();
    };
  }, [socket, socket.connectionStatus]);

  return onlineCount;
};
