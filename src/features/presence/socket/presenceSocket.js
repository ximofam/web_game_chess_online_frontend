/**
 * Presence Socket Adapter
 * Destination: /topic/presence
 * Event Namespace: presence:*
 */
export const PRESENCE_EVENTS = {
  UPDATE: 'presence:update',
  HEARTBEAT: 'presence:heartbeat',
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

export const sendPresenceHeartbeat = (socket, userId) => {
  if (!socket || typeof socket.send !== 'function') return false;
  return socket.send('/app/presence/heartbeat', { userId, timestamp: Date.now() });
};
