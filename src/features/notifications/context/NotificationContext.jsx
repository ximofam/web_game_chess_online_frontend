import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useSocket } from '../../../socket/useSocket';
import { notificationService } from '../services/notificationService';
import { subscribeToNotifications, NOTIFICATION_EVENTS } from '../socket/notificationSocket';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, showToast } = useAuth();
  const socket = useSocket();
  const { connectionStatus, reconnect } = socket;

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load initial notifications and unread count from REST endpoints
  const loadNotificationsData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const listData = await notificationService.getNotifications(0, 20);
      setNotifications(listData.content || []);

      const countData = await notificationService.getUnreadCount();
      setUnreadCount(countData.count || 0);
    } catch (err) {
      console.error('Failed to load initial notifications data', err);
    }
  }, [isAuthenticated]);

  // REST handlers mapping to service calls and keeping state synchronized
  const markAsRead = async (id) => {
    try {
      await notificationService.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      if (showToast) showToast('Failed to mark notification as read.', 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      if (showToast) showToast('All notifications marked as read.', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to mark all as read.', 'error');
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
      if (showToast) showToast('Failed to delete notification.', 'error');
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.deleteAll();
      setNotifications([]);
      setUnreadCount(0);
      if (showToast) showToast('Notification history cleared.', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to clear notification history.', 'error');
    }
  };

  // REST Data Initialization & Cleanup
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    loadNotificationsData();
  }, [isAuthenticated, loadNotificationsData]);

  // Subscribe to real-time notification events via notificationSocket adapter
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = subscribeToNotifications(socket, (event) => {
      if (event.type === NOTIFICATION_EVENTS.NEW) {
        const newNotif = event.payload;
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((c) => c + 1);
        if (showToast) showToast(newNotif.message, 'success');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, socket, showToast]);

  const value = {
    notifications,
    unreadCount,
    connectionStatus,
    reconnect,
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
    },
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
