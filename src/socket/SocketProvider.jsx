import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../features/auth/context/AuthContext';
import { stompClientManager } from './stompClient';
import { mockSocketManager } from './mockSocket';

export const SocketContext = createContext(null);

const isMockMode = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === 'true';
const activeManager = isMockMode ? mockSocketManager : stompClientManager;

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, showToast } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState(activeManager.getStatus());
  const [reconnectCount, setReconnectCount] = useState(0);
  const wasConnectedRef = useRef(false);

  // Status listener synchronization
  useEffect(() => {
    const unsubscribeStatus = activeManager.onStatusChange((newStatus) => {
      setConnectionStatus(newStatus);
    });
    return () => unsubscribeStatus();
  }, []);

  const connect = useCallback(() => {
    if (!isAuthenticated) return;

    activeManager.connect(
      () => {
        if (!wasConnectedRef.current && showToast) {
          showToast('Đã kết nối máy chủ realtime.', 'success');
        }
        wasConnectedRef.current = true;
      },
      (errorFrame) => {
        if (wasConnectedRef.current && showToast) {
          wasConnectedRef.current = false;
          showToast('Lỗi kết nối máy chủ realtime.', 'error');
        }
      }
    );
  }, [isAuthenticated, showToast]);

  const disconnect = useCallback(() => {
    wasConnectedRef.current = false;
    activeManager.disconnect();
  }, []);

  const reconnect = useCallback(() => {
    if (!isAuthenticated) return;
    if (showToast) {
      showToast('Đang thử kết nối lại máy chủ realtime...', 'info');
    }
    wasConnectedRef.current = false;
    activeManager.disconnect();
    setReconnectCount((c) => c + 1);
  }, [isAuthenticated, showToast]);

  // Lifecycle management based on authentication & reconnect trigger
  useEffect(() => {
    if (!isAuthenticated) {
      disconnect();
      return;
    }

    connect();

    return () => {
      // Ponytail: cleanup connection on unmount or user logout
      disconnect();
    };
  }, [isAuthenticated, reconnectCount, connect, disconnect]);

  // Global automatic presence heartbeat interval
  useEffect(() => {
    if (!isAuthenticated || connectionStatus !== 'CONNECTED') {
      return;
    }

    const envVal = import.meta.env.VITE_HEARTBEAT_INTERVAL_MS || import.meta.env.VITE_HEARTBEAT_INTERVAL_SECONDS;
    const parsedVal = Number(envVal);
    // If set in env as seconds (< 1000), convert to ms. Fallback to 10000ms (10s)
    const intervalMs = (!isNaN(parsedVal) && parsedVal > 0)
      ? (parsedVal < 1000 ? parsedVal * 1000 : parsedVal)
      : 10000;

    activeManager.send('/app/presence.heartbeat');

    const intervalId = setInterval(() => {
      activeManager.send('/app/presence.heartbeat');
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, connectionStatus]);

  const subscribe = useCallback((destination, callback, headers) => {
    return activeManager.subscribe(destination, callback, headers);
  }, []);

  const unsubscribe = useCallback((subId) => {
    activeManager.unsubscribe(subId);
  }, []);

  const send = useCallback((destination, payload, headers) => {
    return activeManager.send(destination, payload, headers);
  }, []);

  const value = {
    connect,
    disconnect,
    reconnect,
    subscribe,
    unsubscribe,
    send,
    connectionStatus,
    stompClient: activeManager,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
