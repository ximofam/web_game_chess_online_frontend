import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, LogOut, Loader2, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { useRoomDetails } from '../hooks/useRoomDetails';
import { RoomHeader } from '../components/RoomHeader';
import { RoomSeats } from '../components/RoomSeats';
import { RoomSpectators } from '../components/RoomSpectators';
import { RoomBoardPreview } from '../components/RoomBoardPreview';
import { RoomZoomControls } from '../components/RoomZoomControls';
import { useAuth } from '../../auth/context/AuthContext';

export function RoomWaitingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser, showToast } = useAuth();
  const { room, isLoading, isError, refetch } = useRoomDetails(roomId);

  // Zoom scale state (0.75 -> 1.30)
  const [zoom, setZoom] = useState(1.0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

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

  const handleLeaveRoom = () => {
    showToast('Đã rời khỏi phòng chơi', 'info');
    navigate('/dashboard');
  };

  const handleSeatChange = (side) => {
    showToast(`Đã chuyển sang ghế quân ${side === 'WHITE' ? 'Trắng' : 'Đen'}`, 'success');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      {/* ROOM HEADER */}
      <RoomHeader room={room} />

      {/* TOOLBAR: ZOOM & ROOM CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-3 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#f3f4f6] flex items-center gap-1.5 pl-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Phòng chờ thi đấu</span>
          </span>
        </div>

        {/* ZOOM CONTROLS (PHÓNG TO / THU NHỎ) */}
        <RoomZoomControls
          zoom={zoom}
          onZoomChange={setZoom}
          isMaximized={isMaximized}
          onToggleMaximize={() => setIsMaximized(!isMaximized)}
        />
      </div>

      {/* MAIN CONTENT WORKSPACE */}
      <div className={`grid gap-6 ${isMaximized ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'}`}>
        {/* CHESS BOARD PREVIEW SECTION (WITH DYNAMIC ZOOM SCALE) */}
        <div className={`${isMaximized ? 'w-full' : 'lg:col-span-7'} bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-4 shadow-lg flex flex-col items-center justify-between min-h-[460px] overflow-hidden`}>
          <div className="w-full flex items-center justify-between border-b border-[#2d323f] pb-3 mb-2">
            <h3 className="text-xs font-bold text-[#f3f4f6] uppercase tracking-wider">Xem trước Bàn Cờ</h3>
            <span className="text-[11px] font-mono text-[#d4af37]">Tỉ lệ: {Math.round(zoom * 100)}%</span>
          </div>

          <RoomBoardPreview zoom={zoom} isMaximized={isMaximized} />

          <div className="w-full pt-3 border-t border-[#2d323f] text-center text-xs text-[#9ca3af]">
            Giao diện bàn cờ sẽ tự động khớp với màu quân khi bắt đầu thi đấu.
          </div>
        </div>

        {/* SEATS, SPECTATORS & HOST ACTIONS SECTION */}
        {!isMaximized && (
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            {/* SEATS (WHITE vs BLACK) */}
            <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-5 shadow-lg space-y-4">
              <h3 className="text-xs font-bold text-[#f3f4f6] uppercase tracking-wider border-b border-[#2d323f] pb-2">
                Danh sách Người chơi
              </h3>
              <RoomSeats room={room} onSeatChange={handleSeatChange} />
            </div>

            {/* SPECTATORS LIST */}
            <RoomSpectators spectators={room.spectators || []} />

            {/* ACTION BUTTONS (START GAME & LEAVE ROOM) */}
            <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-5 shadow-lg space-y-3">
              {isHost ? (
                <button
                  type="button"
                  onClick={handleStartGame}
                  disabled={!canStartGame || isStarting}
                  className="w-full bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang khởi tạo trận đấu...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-[#0d0e12]" />
                      <span>BẮT ĐẦU TRẬN ĐẤU</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-3 bg-[#13161c] border border-[#2d323f] rounded-xl text-center text-xs text-[#9ca3af] flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#d4af37]" />
                  <span>Đang chờ chủ phòng bắt đầu trận đấu...</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleLeaveRoom}
                className="w-full bg-[#13161c] border border-[#2d323f] hover:bg-[#ef4444]/10 hover:border-[#ef4444]/40 hover:text-[#ef4444] text-[#9ca3af] font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Rời khỏi phòng</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomWaitingPage;
