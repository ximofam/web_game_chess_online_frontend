import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();

  const handleAction = async () => {
    if (!roomId || isActionPending) return;

    if (isPlaying) {
      navigate(`/room/${roomId}`, { state: { openResignConfirm: true } });
      return;
    }

    setIsActionPending(true);
    try {
      await roomService.leaveRoom(roomId);
      showToast(t('home:leave_room_success', 'Đã rời phòng'), 'success');
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
    <main className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 select-none bg-chess-dark">
      <div className="w-full max-w-7xl space-y-6">

        {/* GUEST BANNER */}
        {isGuest && (
          <div className="bg-chess-surface border border-chess-border rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-chess-dark border border-chess-border flex items-center justify-center text-chess-gold shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-playfair font-bold text-lg text-chess-text">{t('home:guest_mode_title')}</h3>
                <p className="font-inter text-sm text-chess-muted">{t('home:guest_mode_desc')}</p>
              </div>
            </div>

            <Link
              to="/login"
              className="bg-chess-gold text-chess-dark hover:bg-chess-gold-hover font-bold font-inter text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('home:login_btn')}</span>
            </Link>
          </div>
        )}

        {/* TWO COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT / MAIN COLUMN: REALTIME LOBBY TABLE (lg:col-span-8) */}
          <div className={`lg:col-span-8 h-full ${isBusy ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
            <LobbyList onCreateRoomClick={() => setIsCreateModalOpen(true)} />
          </div>

          {/* RIGHT SIDEBAR: USER QUICK PROFILE & ACTION CARDS (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* USER QUICK CARD */}
            <div className="bg-chess-surface border border-chess-border p-5 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-md border border-chess-gold flex items-center justify-center bg-chess-dark text-chess-gold relative overflow-hidden shrink-0">
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7" />
                  )}
                  <span className="absolute bottom-0 right-0 bg-chess-gold text-chess-dark rounded-br-md rounded-tl-md p-0.5 border-t border-l border-chess-border">
                    <Shield className="w-3 h-3" />
                  </span>
                </div>
                <div className="truncate">
                  <h3 className="font-playfair font-bold text-xl text-chess-text truncate">{currentUser?.username || 'Guest Player'}</h3>
                  <span className="inline-block font-inter text-[10px] font-bold uppercase tracking-widest text-chess-muted mt-1">
                    {currentUser?.role || 'GUEST'}
                  </span>
                </div>
              </div>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-3 text-center mt-5 pt-4 border-t border-chess-border">
                <div className="bg-chess-dark py-2.5 rounded-md border border-chess-border">
                  <span className="block font-inter text-base font-bold text-emerald-500">142</span>
                  <span className="font-inter text-[10px] text-chess-muted uppercase tracking-widest">{t('home:stats_wins')}</span>
                </div>
                <div className="bg-chess-dark py-2.5 rounded-md border border-chess-border">
                  <span className="block font-inter text-base font-bold text-sky-500">32</span>
                  <span className="font-inter text-[10px] text-chess-muted uppercase tracking-widest">{t('home:stats_draws')}</span>
                </div>
                <div className="bg-chess-dark py-2.5 rounded-md border border-chess-border">
                  <span className="block font-inter text-base font-bold text-red-500">12</span>
                  <span className="font-inter text-[10px] text-chess-muted uppercase tracking-widest">{t('home:stats_losses')}</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS OR BUSY BANNER */}
            <div className="bg-chess-surface border border-chess-border p-5 rounded-lg shadow-sm">
              {isBusy ? (
                <div className="flex flex-col items-center text-center py-2">
                  <h3 className="font-playfair text-xl font-bold text-chess-gold mb-2">
                    {isPlaying ? t('home:status_playing', 'You are playing a game') : t('home:status_in_room', 'You are in a room')}
                  </h3>
                  <p className="font-inter text-sm text-chess-muted mb-6">
                    {t('home:status_busy_desc', 'Please return to your active session.')}
                  </p>
                  <div className="w-full flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={handleAction}
                      disabled={isActionPending}
                      className="w-full flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-bold font-inter py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer text-xs uppercase tracking-wide"
                    >
                      {isPlaying ? <Flag className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                      <span>{isPlaying ? t('home:resign', 'Đầu hàng') : t('home:leave_room', 'Thoát phòng')}</span>
                    </button>

                    <Link
                      to={`/room/${roomId}`}
                      className="w-full flex-1 bg-chess-gold hover:bg-chess-gold-hover text-chess-dark font-bold font-inter py-2.5 rounded-lg flex justify-center items-center gap-2 transition-colors text-xs uppercase tracking-wide"
                    >
                      <span>{isPlaying ? t('home:return_game', 'Return to Game') : t('home:return_room', 'Return to Room')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-playfair text-xl font-bold text-chess-text mb-4">{t('home:play_modes_title')}</h3>
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
