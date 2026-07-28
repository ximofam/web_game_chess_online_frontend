import { User, Crown, ArrowLeftRight, CheckCircle2, Plus } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';

export function RoomSeats({ room, onSeatChange }) {
  const { currentUser } = useAuth();
  if (!room) return null;

  const { white, black, host, status } = room;
  const isHost = currentUser?.id === host?.id;
  const isWaiting = status === 'WAITING';

  const isUserWhite = currentUser && white && currentUser.id === white.id;
  const isUserBlack = currentUser && black && currentUser.id === black.id;

  const renderSeat = (player, side, sideName, bgBadge) => {
    const isOccupied = Boolean(player);
    const isCurrentHost = player && player.id === host?.id;

    return (
      <div className="flex-1 bg-[#13161c] border border-[#2d323f] rounded-2xl p-4 flex flex-col items-center justify-between text-center relative overflow-hidden group">
        {/* SIDE LABEL BADGE */}
        <div className="w-full flex items-center justify-between border-b border-[#2d323f]/60 pb-2 mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${bgBadge}`}>
            Quân {sideName}
          </span>
          {isCurrentHost && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-full border border-[#d4af37]/30">
              <Crown className="w-3 h-3" /> Host
            </span>
          )}
        </div>

        {/* PLAYER AVATAR & INFO */}
        <div className="my-2 space-y-2 flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1d24] border-2 border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-inner overflow-hidden">
              {isOccupied && player.avatarUrl ? (
                <img src={player.avatarUrl} alt={player.username} className="w-full h-full object-cover" />
              ) : isOccupied ? (
                <User className="w-8 h-8 text-[#d4af37]" />
              ) : (
                <User className="w-8 h-8 text-[#4b5563]" />
              )}
            </div>
            {isOccupied && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10b981] border-2 border-[#13161c] rounded-full" />
            )}
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#f3f4f6]">
              {isOccupied ? player.username : 'Ghế trống'}
            </h4>
            <p className="text-[11px] text-[#9ca3af]">
              {isOccupied ? `Elo: ${player.elo || 1500}` : 'Đang chờ người chơi...'}
            </p>
          </div>
        </div>

        {/* ACTION BUTTON */}
        {isWaiting && (
          <div className="mt-3 w-full">
            {!isOccupied ? (
              <button
                type="button"
                onClick={() => onSeatChange && onSeatChange(side)}
                className="w-full bg-[#d4af37]/15 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#0d0e12] border border-[#d4af37]/40 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Ngồi ghế {sideName}</span>
              </button>
            ) : (isUserWhite && side === 'WHITE') || (isUserBlack && side === 'BLACK') ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10b981]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Bạn đang ở đây
              </span>
            ) : null}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      {/* WHITE SEAT */}
      {renderSeat(
        white,
        'WHITE',
        'Trắng',
        'bg-[#f3f4f6]/10 text-[#f3f4f6] border-[#f3f4f6]/30'
      )}

      {/* VS ICON / SWAP BUTTON */}
      <div className="flex flex-col items-center justify-center gap-1 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#1a1d24] border border-[#2d323f] flex items-center justify-center font-playfair font-black text-sm text-[#d4af37] shadow-md">
          VS
        </div>
      </div>

      {/* BLACK SEAT */}
      {renderSeat(
        black,
        'BLACK',
        'Đen',
        'bg-[#2d323f] text-[#9ca3af] border-[#4b5563]'
      )}
    </div>
  );
}
