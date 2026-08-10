/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { useRoomDetails } from '../hooks/useRoomDetails';

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [activeRoomId, setActiveRoomId] = useState(() => {
    try {
      return sessionStorage.getItem('minimized_active_room_id') || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (activeRoomId) {
        sessionStorage.setItem('minimized_active_room_id', activeRoomId);
      } else {
        sessionStorage.removeItem('minimized_active_room_id');
      }
    } catch {
      // ignore
    }
  }, [activeRoomId]);

  // Global room query that stays alive as long as activeRoomId is set
  const { room, isLoading, isError, refetch } = useRoomDetails(activeRoomId, {
    onRoomDeleted: () => setActiveRoomId(null)
  });

  // Clear active room if it failed to load (e.g. deleted while offline)
  useEffect(() => {
    if (isError) {
      setActiveRoomId(null);
    }
  }, [isError]);

  const clearRoom = () => setActiveRoomId(null);

  const value = {
    activeRoomId,
    setActiveRoomId,
    room,
    isLoading,
    isError,
    refetch,
    clearRoom
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoomContext() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
}
