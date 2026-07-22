/**
 * Standalone Mock WebSocket Manager for development mode
 * Enables testing real-time events without a running backend.
 */
class MockSocketManager {
  constructor() {
    this.status = 'DISCONNECTED';
    this.subscriptions = new Map(); // subId -> { destination, callback }
    this.statusListeners = new Set();
    this.subIdCounter = 0;
    this.timer = null;
  }

  getStatus() {
    return this.status;
  }

  setStatus(newStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.statusListeners.forEach((listener) => listener(newStatus));
    }
  }

  onStatusChange(listener) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  connect(onConnectedCallback) {
    if (this.status === 'CONNECTED') return;

    this.setStatus('CONNECTED');
    console.log('[Mock Socket] Mock WebSocket connection established.');
    if (onConnectedCallback) onConnectedCallback();

    // Start mock periodic push timer
    this.startMockInterval();
  }

  disconnect() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.subscriptions.clear();
    this.setStatus('DISCONNECTED');
    console.log('[Mock Socket] Mock WebSocket disconnected.');
  }

  subscribe(destination, callback) {
    const subId = `mock-sub-${++this.subIdCounter}`;
    this.subscriptions.set(subId, { destination, callback });

    // Instantly return mock online count if subscribing to presence count
    if (destination === '/app/presence.online-count' || destination === '/topic/presence.online-count') {
      setTimeout(() => {
        callback({ body: JSON.stringify(42) });
      }, 50);
    }

    return subId;
  }

  unsubscribe(subId) {
    this.subscriptions.delete(subId);
  }

  send(destination, payload) {
    console.log(`[Mock Socket] Frame sent to ${destination}:`, payload);
    return true;
  }

  // Trigger mock notification frame to all subscribers of /user/queue/notifications
  startMockInterval() {
    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.triggerMockNotification();
    }, 45000);
  }

  triggerMockNotification() {
    const senders = [
      { id: 2, username: 'magnus_c', avatarUrl: null },
      { id: 3, username: 'hikaru_n', avatarUrl: null },
      { id: 4, username: 'garry_k', avatarUrl: null },
    ];
    const selectedSender = senders[Math.floor(Math.random() * senders.length)];
    const types = ['POST_LIKE', 'ROOM_INVITE', 'FOLLOW', 'COMMENT', 'SYSTEM'];
    const selectedType = types[Math.floor(Math.random() * types.length)];
    const messages = {
      POST_LIKE: 'liked your tournament victory breakdown.',
      ROOM_INVITE: 'invited you to a live Blitz match.',
      FOLLOW: 'followed your player stats.',
      COMMENT: 'commented on your opening move analysis.',
      SYSTEM: 'notified you of upcoming tournament schedule updates.',
    };

    const mockPayload = {
      id: Date.now(),
      sender: selectedSender,
      type: selectedType,
      title: selectedType.replace('_', ' '),
      message: `${selectedSender.username} ${messages[selectedType]}`,
      metadata: {
        postId: 42,
        roomId: 99,
      },
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Update global mock notifications db if present
    if (window.mockNotificationsDb) {
      window.mockNotificationsDb.unshift(mockPayload);
    }

    // Broadcast frame to subbed notification listeners
    this.broadcast('/user/queue/notifications', JSON.stringify(mockPayload));
  }

  broadcast(destination, messageBody) {
    this.subscriptions.forEach(({ destination: subDest, callback }) => {
      if (subDest === destination) {
        callback({ body: messageBody });
      }
    });
  }
}

export const mockSocketManager = new MockSocketManager();
