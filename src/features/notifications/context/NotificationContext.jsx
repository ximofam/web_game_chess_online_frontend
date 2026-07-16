import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../../auth/context/AuthContext';
import { getAccessToken } from '../../auth/api/authClient';
import { notificationService } from '../services/notificationService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, showToast } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const stompClientRef = useRef(null);

  // Load initial notifications and unread count from REST endpoints
  const loadNotificationsData = async () => {
    if (!isAuthenticated) return;
    try {
      const listData = await notificationService.getNotifications(0, 20);
      setNotifications(listData.content || []);

      const countData = await notificationService.getUnreadCount();
      setUnreadCount(countData.count || 0);
    } catch (err) {
      console.error('Failed to load initial notifications data', err);
    }
  };

  // REST handlers mapping to service calls and keeping state synchronized
  const markAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      showToast('Failed to mark notification as read.', 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      showToast('All notifications marked as read.', 'success');
    } catch (err) {
      showToast('Failed to mark all as read.', 'error');
    }
  };

  const deleteItem = async (id) => {
    try {
      const itemToDelete = notifications.find((n) => n.id === id);
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (itemToDelete && !itemToDelete.read) {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      showToast('Failed to delete notification.', 'error');
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.deleteAll();
      setNotifications([]);
      setUnreadCount(0);
      showToast('Notification history cleared.', 'success');
    } catch (err) {
      showToast('Failed to clear notification history.', 'error');
    }
  };

  // WebSocket connection management loop
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      setConnectionStatus('DISCONNECTED');
      return;
    }

    // Load initial REST state
    loadNotificationsData();

    // 1. DEVELOPMENT MOCK WEB SOCKET
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true') {
      setConnectionStatus('CONNECTED');
      console.log('[Mock Socket] WebSocket connection established.');

      const interval = setInterval(() => {
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

        const newNotif = {
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

        // Sync with browser mockNotificationsDb global array
        if (window.mockNotificationsDb) {
          window.mockNotificationsDb.unshift(newNotif);
        }

        // React state update
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((c) => c + 1);
        showToast(newNotif.message, 'success');
      }, 45000); // periodically inject every 45 seconds

      return () => {
        clearInterval(interval);
        setConnectionStatus('DISCONNECTED');
      };
    }

    // 2. LIVE SPRING STOMP SOCKJS CONNECTION
    setConnectionStatus('CONNECTING');
    const token = getAccessToken();
    const wsUrl = `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.host}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnectionStatus('CONNECTED');
        console.log('[STOMP] Connected to live WS endpoints.');

        // Subscribe to destination
        client.subscribe('/user/queue/notifications', (message) => {
          if (message.body) {
            try {
              const newNotif = JSON.parse(message.body);
              setNotifications((prev) => [newNotif, ...prev]);
              setUnreadCount((c) => c + 1);
              showToast(newNotif.message, 'success');
            } catch (err) {
              console.error('Failed to parse incoming notification frame payload', err);
            }
          }
        });
      },
      onDisconnect: () => {
        setConnectionStatus('DISCONNECTED');
        console.log('[STOMP] Disconnected.');
      },
      onStompError: (frame) => {
        console.error('STOMP Protocol error', frame);
        setConnectionStatus('DISCONNECTED');
      },
      onWebSocketClose: () => {
        setConnectionStatus('DISCONNECTED');
      }
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [isAuthenticated]);

  const value = {
    notifications,
    unreadCount,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    deleteItem,
    clearAll,
    loadMore: async (page, size) => {
      try {
        const listData = await notificationService.getNotifications(page, size);
        return listData;
      } catch (err) {
        console.error('Failed loading extra notifications page', err);
        return { content: [] };
      }
    }
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
