import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useBlocker } from 'react-router-dom';
import { Play, LogOut, Loader2, AlertCircle, ShieldAlert, Minimize2, X } from 'lucide-react';
import { useRoomDetails } from '../hooks/useRoomDetails';
import { RoomHeader } from '../components/RoomHeader';
import { RoomSeats } from '../components/RoomSeats';
import { RoomSpectators } from '../components/RoomSpectators';
import { RoomChat } from '../components/RoomChat';
import { useAuth } from '../../auth/context/AuthContext';
import { roomService } from '../services/roomService';
import { activeRoomManager } from '../services/activeRoomManager';
import { useQueryClient } from '@tanstack/react-query';

export function RoomWaitingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser, showToast } = useAuth();
  const queryClient = useQueryClient();
  const { room, isLoading, isError, refetch } = useRoomDetails(roomId);

  const [isStarting, setIsStarting] = useState(false);
  const bypassBlockerRef = useRef(false);

  // Blocker to intercept navigation attempts (Back button, links, etc.)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname && !bypassBlockerRef.current
  );

  const handleConfirmLeave = async () => {
    try {
      await roomService.leaveRoom(roomId);
      showToast('Đã rời khỏi phòng chơi', 'info');
      queryClient.invalidateQueries({ queryKey: ['rooms', 'lobby'] });
    } catch (err) {
      showToast('Lỗi khi rời phòng: ' + (err.response?.data?.message || err.message), 'error');
      queryClient.invalidateQueries({ queryKey: ['rooms', 'lobby'] });
    }
    bypassBlockerRef.current = true;
    if (blocker.state === 'blocked') {
      blocker.proceed();
    } else {
      navigate('/dashboard');
    }
  };

  const handleConfirmMinimize = () => {
    activeRoomManager.setRoom(room);
    showToast('Đã thu nhỏ phòng cờ ở góc màn hình!', 'info');
    bypassBlockerRef.current = true;
    if (blocker.state === 'blocked') {
      blocker.proceed();
    } else {
      navigate('/dashboard');
    }
  };

  const handleCancelNavigation = () => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  // Cleanup bypass flag on mount
  useEffect(() => {
    bypassBlockerRef.current = false;
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" />
        <p className="text-sm font-semibold text-[#f3f4f6]">Đang tải thông tin phòng cờ #{roomId?.slice(0, 8)}...</p>
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444]">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#f3f4f6]">Không thể tải thông tin phòng</h2>
        <p className="text-xs text-[#9ca3af]">Phòng chơi có thể đã bị xóa hoặc không tồn tại.</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#13161c] border border-[#2d323f] rounded-xl text-xs font-bold text-[#d4af37] hover:bg-[#2d323f] cursor-pointer"
          >
            Thử lại
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#d4af37] text-[#0d0e12] rounded-xl text-xs font-bold hover:bg-[#b59226] cursor-pointer"
          >
            Về Sảnh chơi
          </button>
        </div>
      </div>
    );
  }

  const isHost = currentUser?.id === room.host?.id;
  const canStartGame = room.white && room.black && room.status === 'WAITING';

  const handleStartGame = async () => {
    setIsStarting(true);
    showToast('Bắt đầu trận đấu cờ!', 'success');
    setTimeout(() => {
      setIsStarting(false);
      // In future: navigate to actual board play route e.g. /game/:gameId
    }, 1200);
  };

  const handleSeatChange = (side) => {
    showToast(`Đã chuyển sang ghế quân ${side === 'WHITE' ? 'Trắng' : 'Đen'}`, 'success');
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6 relative">
        {/* ROOM HEADER */}
        <RoomHeader room={room} onMinimize={handleConfirmMinimize} />

        {/* ACTION BUTTONS (START GAME & LEAVE ROOM) MOVED TO TOP */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isHost ? (
            <button
              type="button"
              onClick={handleStartGame}
              disabled={!canStartGame || isStarting}
              className="flex-1 bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang khởi tạo trận đấu...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-[#0d0e12]" />
                  <span>SẴN SÀNG</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex-1 p-3 bg-[#13161c] border border-[#2d323f] rounded-xl text-center text-xs text-[#9ca3af] flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#d4af37]" />
              <span>Đang chờ chủ phòng bắt đầu trận đấu...</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleConfirmLeave}
            className="sm:w-auto w-full bg-[#13161c] border border-[#2d323f] hover:bg-[#ef4444]/10 hover:border-[#ef4444]/40 hover:text-[#ef4444] text-[#9ca3af] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Rời khỏi phòng</span>
          </button>
        </div>

        {/* MAIN CONTENT WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* SEATS & SPECTATORS SECTION (LEFT) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
            {/* SEATS (WHITE vs BLACK) */}
            <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="text-xs font-bold text-[#f3f4f6] uppercase tracking-wider border-b border-[#2d323f] pb-2">
                Danh sách Người chơi
              </h3>
              <RoomSeats room={room} onSeatChange={handleSeatChange} />
            </div>

            {/* SPECTATORS LIST */}
            <RoomSpectators spectators={room.spectators || []} />
          </div>

          {/* CHAT SECTION (RIGHT) */}
          <div className="lg:col-span-7 h-full min-h-[500px]">
            <RoomChat roomId={roomId} room={room} />
          </div>
        </div>
      </div>

      {/* BLOCKER CONFIRMATION MODAL */}
      {blocker.state === 'blocked' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d0e12]/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-6 shadow-2xl max-w-sm w-full space-y-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={handleCancelNavigation}
              className="absolute top-4 right-4 text-[#9ca3af] hover:text-[#f3f4f6] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-[#d4af37]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#d4af37]/30">
                <AlertCircle className="w-6 h-6 text-[#d4af37]" />
              </div>
              <h3 className="text-lg font-bold text-[#f3f4f6]">Bạn đang rời khỏi trang</h3>
              <p className="text-sm text-[#9ca3af]">
                Bạn muốn làm gì với phòng chờ hiện tại?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleConfirmLeave}
                className="flex flex-col items-center justify-center gap-2 bg-[#13161c] hover:bg-[#ef4444]/10 border border-[#2d323f] hover:border-[#ef4444]/40 text-[#9ca3af] hover:text-[#ef4444] p-3 rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-xs font-semibold">Rời phòng</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmMinimize}
                className="flex flex-col items-center justify-center gap-2 bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] border border-[#d4af37] p-3 rounded-xl transition-all cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
                <span className="text-xs font-bold">Thu nhỏ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RoomWaitingPage;
