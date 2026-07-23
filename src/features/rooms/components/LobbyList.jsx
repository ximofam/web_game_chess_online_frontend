import React, { useState, useMemo } from 'react';
import { Search, RefreshCw, Radio, Layers, User, Clock, Shield, Play, Eye, AlertCircle } from 'lucide-react';
import { useLobbyRooms } from '../hooks/useLobbyRooms';
import { useAuth } from '../../auth/context/AuthContext';

export function LobbyList({ onCreateRoomClick }) {
  const { rooms, isLoading, isError, refetch, connectionStatus } = useLobbyRooms();
  const { showToast } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'WAITING' | 'IN_PROGRESS'

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (statusFilter === 'WAITING' && room.status !== 'WAITING') return false;
      if (statusFilter === 'IN_PROGRESS' && room.status !== 'IN_PROGRESS') return false;

      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const roomName = (room.name || '').toLowerCase();
        const hostName = (room.host?.username || '').toLowerCase();
        return roomName.includes(term) || hostName.includes(term);
      }
      return true;
    });
  }, [rooms, statusFilter, searchTerm]);

  const handleAction = (room) => {
    if (room.status === 'WAITING') {
      showToast(`Đang tham gia phòng "${room.name || room.roomId}"...`, 'info');
    } else {
      showToast(`Đang vào xem trận đấu của ${room.host?.username || 'phòng'}...`, 'info');
    }
  };

  const getTimeCategory = (mins) => {
    if (mins < 3) return 'Bullet';
    if (mins <= 5) return 'Blitz';
    if (mins <= 15) return 'Rapid';
    return 'Classical';
  };

  return (
    <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-5 shadow-lg flex flex-col h-full">
      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#2d323f]">
        <div className="flex items-center gap-3">
          <h2 className="font-playfair text-xl font-bold text-[#f3f4f6]">Sảnh Chơi (Lobby)</h2>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
            <Radio className="w-3 h-3 animate-ping" /> Realtime
          </span>
        </div>

        {/* SEARCH & REFRESH */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm phòng / host..."
              className="w-full bg-[#13161c] border border-[#2d323f] focus:border-[#d4af37] text-[#f3f4f6] text-xs rounded-xl pl-8 pr-2.5 py-1.5 focus:outline-none transition-all placeholder-[#4b5563]"
            />
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 rounded-xl bg-[#13161c] hover:bg-[#2d323f] border border-[#2d323f] text-[#9ca3af] hover:text-[#d4af37] transition-colors cursor-pointer shrink-0"
            title="Tải lại"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#d4af37]' : ''}`} />
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1 bg-[#13161c] p-1 rounded-xl border border-[#2d323f]">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${statusFilter === 'ALL'
              ? 'bg-[#d4af37] text-[#0d0e12] shadow-sm'
              : 'text-[#9ca3af] hover:text-[#f3f4f6]'
              }`}
          >
            Tất cả ({rooms.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('WAITING')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${statusFilter === 'WAITING'
              ? 'bg-[#10b981] text-[#0d0e12] shadow-sm'
              : 'text-[#9ca3af] hover:text-[#f3f4f6]'
              }`}
          >
            Đang chờ ({rooms.filter((r) => r.status === 'WAITING').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('IN_PROGRESS')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${statusFilter === 'IN_PROGRESS'
              ? 'bg-[#38bdf8] text-[#0d0e12] shadow-sm'
              : 'text-[#9ca3af] hover:text-[#f3f4f6]'
              }`}
          >
            Đang đấu ({rooms.filter((r) => r.status === 'IN_PROGRESS').length})
          </button>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#13161c] text-[#9ca3af] border border-[#2d323f]">
          <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'CONNECTED' ? 'bg-[#10b981]' : 'bg-[#ef4444]'}`} />
          {connectionStatus}
        </span>
      </div>

      {/* LOBBY TABLE / LIST */}
      {isLoading ? (
        <div className="py-12 text-center text-[#9ca3af] space-y-2">
          <RefreshCw className="w-6 h-6 mx-auto animate-spin text-[#d4af37]" />
          <p className="text-xs font-medium">Đang tải sảnh chơi...</p>
        </div>
      ) : isError ? (
        <div className="py-8 text-center text-[#ef4444] bg-[#13161c] rounded-xl border border-[#ef4444]/20 p-4 space-y-2">
          <AlertCircle className="w-6 h-6 mx-auto" />
          <p className="text-xs font-semibold">Không thể tải dữ liệu sảnh.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs text-[#d4af37] underline font-semibold cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="py-12 text-center bg-[#13161c] rounded-xl border border-[#2d323f] p-6 space-y-3">
          <Layers className="w-8 h-8 text-[#d4af37] mx-auto opacity-80" />
          <div>
            <h4 className="text-sm font-bold text-[#f3f4f6]">Chưa có phòng chơi nào</h4>
            <p className="text-xs text-[#9ca3af] mt-0.5">Tạo phòng đầu tiên để bắt đầu thách đấu!</p>
          </div>
          {onCreateRoomClick && (
            <button
              type="button"
              onClick={onCreateRoomClick}
              className="bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md"
            >
              + Tạo phòng chơi
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[460px] pr-1 scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#1a1d24] shadow-md z-10">
              <tr className="border-b border-[#2d323f] text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider">
                <th className="pb-2.5 pt-1 pl-2">Host / Tên phòng</th>
                <th className="pb-2.5 pt-1">Thời gian</th>
                <th className="pb-2.5 pt-1">Chế độ</th>
                <th className="pb-2.5 pt-1">Người chơi</th>
                <th className="pb-2.5 pt-1 pr-2 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d323f]/50 text-xs">
              {filteredRooms.map((room) => {
                const { roomId, name, host, settings = {}, white, black, status } = room;
                const timeMinutes = settings.timeMinutes || 5;
                const incrementSeconds = settings.incrementSeconds || 0;
                const isRated = settings.rated !== false;
                const category = getTimeCategory(timeMinutes);
                const isWaiting = status === 'WAITING';

                return (
                  <tr key={roomId} className="group hover:bg-[#13161c]/80 transition-colors">
                    {/* HOST & ROOM NAME */}
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#13161c] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-xs shrink-0 overflow-hidden">
                          {host?.avatarUrl ? (
                            <img src={host.avatarUrl} alt={host.username} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="truncate max-w-[160px] sm:max-w-[220px]">
                          <span className="block font-semibold text-[#f3f4f6] group-hover:text-[#d4af37] transition-colors truncate">
                            {name || `Phòng Cờ #${roomId?.slice(0, 8)}`}
                          </span>
                          <span className="text-[10px] text-[#9ca3af]">
                            Host: {host?.username || 'Player'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* TIME CONTROL */}
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-[#f3f4f6]">
                        <Clock className="w-3 h-3 text-[#d4af37]" />
                        {timeMinutes}+{incrementSeconds} <span className="text-[10px] text-[#9ca3af]">({category})</span>
                      </span>
                    </td>

                    {/* RATED */}
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${isRated ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30' : 'bg-[#13161c] text-[#9ca3af] border-[#2d323f]'
                        }`}>
                        <Shield className="w-2.5 h-2.5" /> {isRated ? 'Rated' : 'Casual'}
                      </span>
                    </td>

                    {/* PLAYERS */}
                    <td className="py-3">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="inline-flex items-center gap-1 text-[#f3f4f6]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f3f4f6] border border-[#9ca3af]" />
                          {white ? white.username : '---'}
                        </span>
                        <span className="text-[#6b7280]">vs</span>
                        <span className="inline-flex items-center gap-1 text-[#f3f4f6]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#2d323f] border border-[#6b7280]" />
                          {black ? black.username : '---'}
                        </span>
                      </div>
                    </td>

                    {/* ACTION */}
                    <td className="py-3 pr-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleAction(room)}
                        className={`py-1.5 px-3 rounded-lg font-bold text-[11px] inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${isWaiting
                          ? 'bg-[#d4af37] hover:bg-[#b59226] text-[#0d0e12]'
                          : 'bg-[#13161c] hover:bg-[#2d323f] text-[#38bdf8] border border-[#38bdf8]/40'
                          }`}
                      >
                        {isWaiting ? (
                          <>
                            <Play className="w-3 h-3 fill-[#0d0e12]" />
                            <span>VÀO CHƠI</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>XEM</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
