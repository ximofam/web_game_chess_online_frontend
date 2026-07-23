import React from 'react';
import { User, Clock, Shield, Play, Eye, Users } from 'lucide-react';

export function RoomCard({ room, onJoin }) {
  const {
    roomId,
    name,
    host,
    settings = {},
    white,
    black,
    status = 'WAITING',
  } = room;

  const timeMinutes = settings.timeMinutes || 5;
  const incrementSeconds = settings.incrementSeconds || 0;
  const isRated = settings.rated !== false;

  // Format time label (e.g. 3+2 | Blitz)
  const getTimeCategory = (mins) => {
    if (mins < 3) return 'Bullet';
    if (mins <= 5) return 'Blitz';
    if (mins <= 15) return 'Rapid';
    return 'Classical';
  };

  const category = getTimeCategory(timeMinutes);

  // Status color formatting
  const isWaiting = status === 'WAITING';
  const isInProgress = status === 'IN_PROGRESS';

  return (
    <div className="group relative bg-[#1a1d24] border border-[#2d323f] hover:border-[#d4af37]/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between">
      {/* ROOM HEADER */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-[#13161c] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0">
              {host?.avatarUrl ? (
                <img src={host.avatarUrl} alt={host.username} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <span className="text-xs text-[#9ca3af] truncate">
              Host: <strong className="text-[#f3f4f6] font-semibold">{host?.username || 'Player'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isWaiting
                ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40'
                : 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/40'
            }`}>
              {isWaiting ? 'Đang chờ' : 'Đang đấu'}
            </span>
          </div>
        </div>

        {/* ROOM TITLE */}
        <h4 className="font-playfair text-base font-bold text-[#f3f4f6] group-hover:text-[#d4af37] transition-colors truncate mb-3">
          {name || `Phòng Cờ #${roomId?.slice(0, 8)}`}
        </h4>

        {/* METADATA BADGES */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#13161c] text-[#f3f4f6] px-2.5 py-1 rounded-lg border border-[#2d323f]">
            <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
            {timeMinutes}m + {incrementSeconds}s ({category})
          </span>

          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${
            isRated
              ? 'bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/30'
              : 'bg-[#13161c] text-[#9ca3af] border-[#2d323f]'
          }`}>
            <Shield className="w-3 h-3" />
            {isRated ? 'Rated' : 'Casual'}
          </span>
        </div>

        {/* PLAYER SEATS */}
        <div className="bg-[#13161c] rounded-xl p-3 border border-[#2d323f]/60 grid grid-cols-2 gap-2 mb-4 text-xs">
          {/* WHITE SEAT */}
          <div className="flex items-center gap-2 truncate">
            <span className="w-3 h-3 rounded-full bg-[#f3f4f6] border border-[#9ca3af] shrink-0" title="Quân Trắng" />
            <span className="truncate text-[#f3f4f6] font-medium">
              {white ? white.username : <em className="text-[#6b7280]">Ghế trống</em>}
            </span>
          </div>

          {/* BLACK SEAT */}
          <div className="flex items-center gap-2 truncate">
            <span className="w-3 h-3 rounded-full bg-[#2d323f] border border-[#6b7280] shrink-0" title="Quân Đen" />
            <span className="truncate text-[#f3f4f6] font-medium">
              {black ? black.username : <em className="text-[#6b7280]">Ghế trống</em>}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <button
        type="button"
        onClick={() => onJoin && onJoin(room)}
        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
          isWaiting
            ? 'bg-[#d4af37] hover:bg-[#b59226] text-[#0d0e12]'
            : 'bg-[#13161c] hover:bg-[#2d323f] text-[#38bdf8] border border-[#38bdf8]/40'
        }`}
      >
        {isWaiting ? (
          <>
            <Play className="w-3.5 h-3.5 fill-[#0d0e12]" />
            <span>THAM GIA PHÒNG</span>
          </>
        ) : (
          <>
            <Eye className="w-3.5 h-3.5" />
            <span>XEM TRẬN ĐẤU</span>
          </>
        )}
      </button>
    </div>
  );
}
