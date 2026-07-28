import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getAccessToken, API_BASE_URL, refreshToken } from '../../features/auth/api/authClient';

class StompClientManager {
  constructor() {
    this.client = null;
    this.status = 'DISCONNECTED';
    this.subscriptions = new Map(); // id -> STOMP subscription object
    this.statusListeners = new Set();
    this.subIdCounter = 0;
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

  connect(onConnectedCallback, onErrorCallback) {
    if (this.client && (this.status === 'CONNECTED' || this.status === 'CONNECTING')) {
      return;
    }

    this.setStatus('CONNECTING');

    // Ưu tiên VITE_WS_URL (cấu hình trực tiếp URL STOMP server, ví dụ cho Vercel)
    // Nếu không có, dùng API_BASE_URL (ví dụ khi chạy local)
    // Nếu cả 2 đều không có, dùng domain hiện tại làm fallback.
    const baseWsUrl = import.meta.env.VITE_WS_URL || API_BASE_URL || `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.host}`;
    const wsUrl = `${baseWsUrl.replace(/\/$/, '')}/ws`;

    const token = getAccessToken();

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      beforeConnect: () => {
        const freshToken = getAccessToken();
        if (this.client) {
          this.client.connectHeaders = freshToken ? { Authorization: `Bearer ${freshToken}` } : {};
        }
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      onConnect: (frame) => {
        this.setStatus('CONNECTED');
        console.log('[STOMP Manager] Connected to live WS server.');
        if (onConnectedCallback) onConnectedCallback(frame);
      },
      onDisconnect: () => {
        this.setStatus('DISCONNECTED');
        console.log('[STOMP Manager] Disconnected from WS server.');
      },
      onStompError: async (frame) => {
        console.error('[STOMP Manager] STOMP Protocol Error', frame);

        if (frame.headers && frame.headers.message && frame.headers.message.includes('Invalid JWT token')) {
          console.log('[STOMP Manager] Token expired. Triggering refresh...');
          try {
            await refreshToken();
            console.log('[STOMP Manager] Token refreshed. Reconnecting immediately...');

            // Force immediate reconnect instead of waiting for reconnectDelay
            if (this.client) {
              this.client.deactivate();
              setTimeout(() => {
                if (this.client) this.client.activate();
              }, 100);
            }
          } catch (err) {
            console.error('[STOMP Manager] Token refresh failed during STOMP error.', err);
          }
        }

        this.setStatus('DISCONNECTED');
        if (onErrorCallback) onErrorCallback(frame);
      },
      onWebSocketClose: () => {
        this.setStatus('DISCONNECTED');
        console.log('[STOMP Manager] WebSocket closed.');
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      // Unsubscribe all active subscriptions
      this.subscriptions.forEach((sub) => {
        try {
          sub.unsubscribe();
        } catch (e) {
          // ignore
        }
      });
      this.subscriptions.clear();

      this.client.deactivate();
      this.client = null;
    }
    this.setStatus('DISCONNECTED');
  }

  subscribe(destination, callback, headers = {}) {
    const subId = `sub-${++this.subIdCounter}`;

    if (!this.client || this.status !== 'CONNECTED') {
      // Return a handle that allows early unsubscribe if needed
      return subId;
    }

    try {
      const stompSub = this.client.subscribe(
        destination,
        (message) => {
          callback(message);
        },
        headers
      );

      this.subscriptions.set(subId, stompSub);
    } catch (err) {
      console.error(`[STOMP Manager] Failed to subscribe to ${destination}`, err);
    }

    return subId;
  }

  unsubscribe(subId) {
    if (this.subscriptions.has(subId)) {
      const stompSub = this.subscriptions.get(subId);
      try {
        stompSub.unsubscribe();
      } catch (err) {
        console.error(`[STOMP Manager] Failed to unsubscribe ${subId}`, err);
      }
      this.subscriptions.delete(subId);
    }
  }

  send(destination, body = '', headers = {}) {
    if (!this.client || this.status !== 'CONNECTED') {
      console.warn(`[STOMP Manager] Cannot send frame to ${destination}: client not connected.`);
      return false;
    }

    try {
      const formattedBody = typeof body === 'string' ? body : (body ? JSON.stringify(body) : '');
      this.client.publish({
        destination,
        body: formattedBody,
        headers,
      });
      return true;
    } catch (err) {
      console.error(`[STOMP Manager] Failed to send frame to ${destination}`, err);
      return false;
    }
  }
}

export const stompClientManager = new StompClientManager();
