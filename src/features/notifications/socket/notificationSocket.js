/**
 * Notification Socket Adapter
 * Destination: /user/queue/notifications
 * Event Namespace: notification:*
 */
export const NOTIFICATION_EVENTS = {
  NEW: 'notification:new',
  READ: 'notification:read',
};

export const subscribeToNotifications = (socket, eventHandler) => {
  if (!socket || typeof socket.subscribe !== 'function') {
    return () => {};
  }

  const subId = socket.subscribe('/user/queue/notifications', (message) => {
    if (message?.body) {
      try {
        const payload = JSON.parse(message.body);
        eventHandler({ type: NOTIFICATION_EVENTS.NEW, payload });
      } catch (err) {
        console.error('[notificationSocket] Failed to parse notification frame payload', err);
      }
    }
  });

  // Return unsubscribe cleanup function
  return () => {
    socket.unsubscribe(subId);
  };
};
