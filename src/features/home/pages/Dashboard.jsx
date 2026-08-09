import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/context/AuthContext';
import { User, Shield, LogIn, Sparkles, ArrowRight, LogOut, Flag } from 'lucide-react';
import { usePresence } from '../../presence/hooks/usePresence';
import { roomService } from '../../rooms/services/roomService';
import { useQueryClient } from '@tanstack/react-query';
import { PlayModeCards } from '../../rooms/components/PlayModeCards';
import { CreateRoomModal } from '../../rooms/components/CreateRoomModal';
import { MatchmakingModal } from '../../rooms/components/MatchmakingModal';
import { LobbyList } from '../../rooms/components/LobbyList';

export default function Dashboard() {
  const { t } = useTranslation(['home']);
  const { currentUser, isGuest, showToast } = useAuth();
  const { isInRoom, isPlaying, roomId } = usePresence();
  const queryClient = useQueryClient();

  const isBusy = isInRoom || isPlaying;
  const [isActionPending, setIsActionPending] = useState(false);

  const handleAction = async () => {
    if (!roomId || isActionPending) return;
    setIsActionPending(true);
    try {
      if (isPlaying) {
        await roomService.resign(roomId);
        showToast(t('home:resign_success', 'Đã đầu hàng ván cờ'), 'success');
      } else {
        await roomService.leaveRoom(roomId);
        showToast(t('home:leave_room_success', 'Đã rời phòng'), 'success');
      }
      queryClient.invalidateQueries({ queryKey: ['rooms', 'lobby'] });
    } catch (err) {
      showToast(t('home:action_error', 'Có lỗi xảy ra: ') + (err.response?.data?.message || err.message), 'error');
    } finally {
      setIsActionPending(false);
    }
  };

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMatchmakingModalOpen, setIsMatchmakingModalOpen] = useState(false);

  return (
    <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 select-none">
      <div className="w-full max-w-7xl space-y-5">

        {/* GUEST BANNER (COMPACT) */}
        {isGuest && (
          <div className="bg-gradient-to-r from-[#d4af37]/15 via-[#1a1d24] to-[#242834] border border-[#d4af37]/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#f3f4f6]">{t('home:guest_mode_title')}</h3>
                <p className="text-xs text-[#9ca3af]">{t('home:guest_mode_desc')}</p>
              </div>
            </div>

            <Link
              to="/login"
              className="bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('home:login_btn')}</span>
            </Link>
          </div>
        )}

        {/* LICHESS-STYLE TWO COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT / MAIN COLUMN: REALTIME LOBBY TABLE (lg:col-span-8) */}
          <div className={`lg:col-span-8 h-full ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}>
            <LobbyList onCreateRoomClick={() => setIsCreateModalOpen(true)} />
          </div>

          {/* RIGHT SIDEBAR: USER QUICK PROFILE & ACTION CARDS (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5">
            {/* USER QUICK CARD */}
            <div className="bg-[#1a1d24] border border-[#2d323f] p-4.5 rounded-2xl shadow-md">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full border border-[#d4af37] flex items-center justify-center bg-[#13161c] text-[#d4af37] relative overflow-hidden shrink-0">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                  <span className="absolute bottom-0 right-0 bg-[#d4af37] text-[#0d0e12] rounded-full p-0.5 border border-[#1a1d24]">
                    <Shield className="w-2.5 h-2.5" />
                  </span>
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-base text-[#f3f4f6] truncate">{currentUser?.username || 'Guest Player'}</h3>
                  <span className="inline-block text-[11px] font-semibold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded-md border border-[#d4af37]/30 mt-0.5">
                    {currentUser?.role || 'GUEST'}
                  </span>
                </div>
              </div>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-2 text-center mt-4 pt-3.5 border-t border-[#2d323f]/80">
                <div className="bg-[#13161c] py-2 rounded-lg border border-[#2d323f]">
                  <span className="block text-sm font-bold text-[#10b981]">142</span>
                  <span className="text-[10px] text-[#9ca3af] uppercase">{t('home:stats_wins')}</span>
                </div>
                <div className="bg-[#13161c] py-2 rounded-lg border border-[#2d323f]">
                  <span className="block text-sm font-bold text-[#38bdf8]">32</span>
                  <span className="text-[10px] text-[#9ca3af] uppercase">{t('home:stats_draws')}</span>
                </div>
                <div className="bg-[#13161c] py-2 rounded-lg border border-[#2d323f]">
                  <span className="block text-sm font-bold text-[#ef4444]">12</span>
                  <span className="text-[10px] text-[#9ca3af] uppercase">{t('home:stats_losses')}</span>
                </div>
              </div>
            </div>

            {/* 3 ACTION BUTTONS OR BUSY BANNER */}
            <div className="bg-[#1a1d24] border border-[#2d323f] p-4.5 rounded-2xl shadow-md">
              {isBusy ? (
                <div className="flex flex-col items-center text-center py-2">
                  <h3 className="font-playfair text-lg font-bold text-[#d4af37] mb-2">
                    {isPlaying ? t('home:status_playing', 'You are playing a game') : t('home:status_in_room', 'You are in a room')}
                  </h3>
                  <p className="text-xs text-[#9ca3af] mb-5">
                    {t('home:status_busy_desc', 'Please return to your active session.')}
                  </p>
                  <div className="w-full flex items-center gap-2">
                    <button
                      onClick={handleAction}
                      disabled={isActionPending}
                      className="flex-1 bg-[#13161c] hover:bg-[#ef4444]/10 border border-[#2d323f] hover:border-[#ef4444]/40 text-[#9ca3af] hover:text-[#ef4444] font-bold py-2.5 rounded-xl flex justify-center items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer text-xs"
                    >
                      {isPlaying ? <Flag className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                      <span>{isPlaying ? t('home:resign', 'Đầu hàng') : t('home:leave_room', 'Thoát phòng')}</span>
                    </button>

                    <Link
                      to={`/room/${roomId}`}
                      className="flex-1 bg-[#d4af37] hover:bg-[#b59226] text-[#0d0e12] font-bold py-2.5 rounded-xl flex justify-center items-center gap-1.5 transition-colors text-xs"
                    >
                      <span>{isPlaying ? t('home:return_game', 'Return to Game') : t('home:return_room', 'Return to Room')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-playfair text-base font-bold text-[#f3f4f6] mb-3">{t('home:play_modes_title')}</h3>
                  <PlayModeCards
                    onCreateRoomClick={() => setIsCreateModalOpen(true)}
                    onMatchmakingClick={() => setIsMatchmakingModalOpen(true)}
                  />
                </>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* MODALS */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <MatchmakingModal
        isOpen={isMatchmakingModalOpen}
        onClose={() => setIsMatchmakingModalOpen(false)}
      />
    </main>
  );
}
