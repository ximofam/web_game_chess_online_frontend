import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Maximize2, X, Clock, Users, Sparkles } from 'lucide-react';
import { activeRoomManager } from '../services/activeRoomManager';
import { useAuth } from '../../auth/context/AuthContext';
import { roomService } from '../services/roomService';
import { useQueryClient } from '@tanstack/react-query';
import { useRoomDetails } from '../hooks/useRoomDetails';

/**
 * Floating Room Widget cho phép thu nhỏ phòng chờ ở góc màn hình.
 * Người chơi có thể tự do xem Sảnh, Học cờ, Diễn đàn trong khi phòng vẫn ở trạng thái chờ.
 */
export function FloatingRoomWidget() {
  const [activeRoom, setActiveRoom] = useState(() => activeRoomManager.getRoom());
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    return activeRoomManager.subscribe((room) => {
      setActiveRoom(room);
    });
  }, []);

  const { room: fetchedRoom, isError } = useRoomDetails(activeRoom?.roomId, {
    onRoomDeleted: () => {
      activeRoomManager.clearRoom();
    }
  });

  // Clear room on error (e.g., room deleted while offline)
  useEffect(() => {
    if (isError && activeRoom) {
      activeRoomManager.clearRoom();
    }
  }, [isError, activeRoom]);

  const displayRoom = fetchedRoom || activeRoom;

  if (!displayRoom) return null;

  // Don't display widget when user is already inside the full room page
  if (location.pathname === `/room/${displayRoom.roomId}`) {
    return null;
  }

  const { roomId, name, settings = {}, white, black } = displayRoom;
  const { timeMinutes = 5, incrementSeconds = 3 } = settings;
  const playerCount = (white ? 1 : 0) + (black ? 1 : 0);

  const handleExpand = () => {
    navigate(`/room/${roomId}`);
  };

  const handleLeave = async (e) => {
    e.stopPropagation();
    try {
      await roomService.leaveRoom(roomId);
      showToast('Đã rời khỏi phòng chơi', 'info');
      queryClient.invalidateQueries({ queryKey: ['rooms', 'lobby'] });
      activeRoomManager.clearRoom();
    } catch (err) {
      showToast('Lỗi khi rời phòng: ' + (err.response?.data?.message || err.message), 'error');
      queryClient.invalidateQueries({ queryKey: ['rooms', 'lobby'] });
      activeRoomManager.clearRoom(); // fallback in case room is already gone
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-in select-none">
      <div className="bg-[#1a1d24]/95 backdrop-blur-md border border-[#d4af37]/40 shadow-2xl rounded-2xl p-3 sm:p-4 flex items-center gap-3.5 max-w-sm text-[#f3f4f6] hover:border-[#d4af37] transition-all group">
        {/* PULSING STATUS DOT */}
        <div className="relative flex items-center justify-center shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span className="absolute w-3 h-3 rounded-full bg-[#10b981] animate-ping opacity-75" />
        </div>

        {/* ROOM DETAILS */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <h4 className="font-bold text-xs text-[#f3f4f6] truncate">
              {name || `Phòng Cờ #${roomId?.slice(0, 6)}`}
            </h4>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#9ca3af] mt-0.5">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-[#d4af37]" /> {playerCount}/2
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#d4af37]" /> {timeMinutes}+{incrementSeconds}m
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-1 shrink-0">
          {/* PHÓNG TO / MỞ RỘNG */}
          <button
            type="button"
            onClick={handleExpand}
            className="flex items-center gap-1 bg-[#d4af37] hover:bg-[#b59226] text-[#0d0e12] font-bold text-xs px-2.5 py-1.5 rounded-xl transition-all shadow-md cursor-pointer"
            title="Phóng to mở rộng phòng chờ"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phóng to</span>
          </button>

          {/* ĐÓNG / RỜI PHÒNG */}
          <button
            type="button"
            onClick={handleLeave}
            className="p-1.5 rounded-xl text-[#9ca3af] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors cursor-pointer"
            title="Đóng widget phòng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FloatingRoomWidget;
