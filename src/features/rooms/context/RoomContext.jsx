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
  const [deletedRoomId, setDeletedRoomId] = useState(null);

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
    onRoomDeleted: () => {
      setDeletedRoomId(activeRoomId);
      setActiveRoomId(null);
    }
  });

  // ponytail: Removed automatic activeRoomId(null) on isError.
  // It causes an infinite loop with RoomPage.jsx which constantly re-sets activeRoomId if it's null on its route.
  // The widget will handle isError gracefully instead.

  const clearRoom = () => setActiveRoomId(null);

  const value = {
    activeRoomId,
    setActiveRoomId,
    room,
    isLoading,
    isError,
    deletedRoomId,
    refetch,
    clearRoom
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRoomContext() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomProvider');
  }
  return context;
}
