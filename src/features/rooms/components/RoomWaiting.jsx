import { Loader2, X, CheckCircle2, AlertCircle, LogOut, Users } from 'lucide-react';
import { RoomSeats } from './RoomSeats';
import { RoomSpectators } from './RoomSpectators';
import { RoomChat } from './RoomChat';
import { CountdownOverlay } from './CountdownOverlay';

export function RoomWaiting({
  room,
  roomId,
  t,
  isPlayer,
  isCurrentUserReady,
  isReadyPending,
  handleReady,
  handleSeatChange,
  showLeaveRoomButton,
  handleConfirmLeave,
}) {
  return (
    <>
      <CountdownOverlay
        startAt={room.startAt}
        onCancelReady={isPlayer && isCurrentUserReady ? () => handleReady(false) : undefined}
        isReadyPending={isReadyPending}
      />


      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-1 gap-6 h-full min-h-0 pb-4">
        {/* SEATS & SPECTATORS SECTION (LEFT) */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
          {/* SEATS (WHITE vs BLACK) */}
          <div className="space-y-4 shrink-0">
            <h3 className="text-sm font-bold text-[#f3f4f6] uppercase tracking-wider">
              {t('room:playerList', 'Player List')}
            </h3>
            <RoomSeats room={room} onSeatChange={handleSeatChange} />
          </div>

          {/* ACTION BUTTONS (READY & LEAVE ROOM) */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            {isPlayer ? (
              isCurrentUserReady ? (
                <button
                  type="button"
                  onClick={() => handleReady(false)}
                  disabled={isReadyPending}
                  className="flex-1 bg-[#ef4444]/15 hover:bg-[#ef4444] text-[#ef4444] hover:text-[#f3f4f6] border border-[#ef4444]/40 font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReadyPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                  <span>{t('room:cancelReady', 'Cancel Ready')}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleSeatChange('SPECTATOR')}
                    disabled={isReadyPending}
                    className="flex-1 bg-[#374151]/30 hover:bg-[#374151] text-[#9ca3af] hover:text-[#f3f4f6] border border-[#4b5563]/40 font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Users className="w-5 h-5" />
                    <span className="truncate">{t('room:becomeSpectator', 'Khán giả')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReady(true)}
                    disabled={isReadyPending}
                    className="flex-1 bg-[#10b981]/15 hover:bg-[#10b981] text-[#10b981] hover:text-[#f3f4f6] border border-[#10b981]/40 font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isReadyPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    <span>{t('room:ready', 'Ready')}</span>
                  </button>
                </>
              )
            ) : (
              <div className="flex-1 p-3 bg-[#13161c] border border-[#2d323f] rounded-xl text-center text-xs text-[#9ca3af] flex items-center justify-center gap-2 shadow-lg">
                <AlertCircle className="w-4 h-4 text-[#d4af37]" />
                <span>{t('room:waitingPlayer', 'Waiting for player...')}</span>
              </div>
            )}

            {showLeaveRoomButton && (
               <button
                type="button"
                onClick={handleConfirmLeave}
                className="sm:w-auto w-full bg-[#13161c] border border-[#2d323f] hover:bg-[#ef4444]/10 hover:border-[#ef4444]/40 hover:text-[#ef4444] text-[#9ca3af] font-semibold text-xs py-2.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('room:leaveRoomSuccess', 'Leave room').replace('Left the', 'Leave')}</span>
              </button>
            )}
          </div>

          {/* SPECTATORS LIST */}
          <div className="flex-1 min-h-0">
            <RoomSpectators spectators={room.spectators || []} hostId={room.host?.id} />
          </div>
        </div>

        {/* CHAT SECTION (RIGHT) */}
        <div className="lg:col-span-7 flex flex-col h-[400px] lg:h-auto min-h-[300px]">
          <RoomChat roomId={roomId} room={room} />
        </div>
      </div>
    </>
  );
}
