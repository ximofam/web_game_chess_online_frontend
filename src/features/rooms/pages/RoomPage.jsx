import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useBlocker } from 'react-router-dom';
import { AlertCircle, ShieldAlert, Minimize2, X, Loader2, LogOut, Copy, Check } from 'lucide-react';
import { useRoomContext } from '../context/RoomContext';

import { RoomWaiting } from '../components/RoomWaiting';
import { RoomPlaying } from '../components/RoomPlaying';
import { useAuth } from '../../auth/context/AuthContext';
import { roomService } from '../services/roomService';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export function RoomPage() {
  const { t } = useTranslation(['room']);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { currentUser, showToast } = useAuth();
  const queryClient = useQueryClient();
  const { activeRoomId, setActiveRoomId, room, isLoading, isError, deletedRoomId, refetch, clearRoom } = useRoomContext();
  const bypassBlockerRef = useRef(false);

  // Set active room when entering the page
  useEffect(() => {
    if (roomId && roomId !== activeRoomId && !bypassBlockerRef.current && deletedRoomId !== roomId) {
      setActiveRoomId(roomId);
    }
  }, [roomId, activeRoomId, setActiveRoomId, deletedRoomId]);

  // Navigate away automatically if the room is deleted
  useEffect(() => {
    if (deletedRoomId && deletedRoomId === roomId) {
      bypassBlockerRef.current = true;
      navigate('/dashboard', { replace: true });
    }
  }, [deletedRoomId, roomId, navigate]);

  const [isReadyPending, setIsReadyPending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [postGameAcknowledged, setPostGameAcknowledged] = useState(false);

  useEffect(() => {
    if (room?.status === 'IN_PROGRESS') {
      setPostGameAcknowledged(false);
    }
  }, [room?.status]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/room/${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast(t('room:copyLinkSuccess', 'Đã sao chép liên kết phòng!'), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Blocker to intercept navigation attempts (Back button, links, etc.)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      deletedRoomId !== roomId && !isError && !!room && currentLocation.pathname !== nextLocation.pathname && !bypassBlockerRef.current
  );

  const handleConfirmLeave = async () => {
    try {
      await roomService.leaveRoom(roomId);
      showToast(t('room:leaveRoomSuccess', 'Left the room'), 'info');
      queryClient.invalidateQueries({ queryKey: ['rooms', 'lobby'] });
    } catch (err) {
      showToast(t('room:leaveRoomError', 'Error leaving room: ') + (err.response?.data?.message || err.message), 'error');
      queryClient.invalidateQueries({ queryKey: ['rooms', 'lobby'] });
    }
    bypassBlockerRef.current = true;
    clearRoom();
    if (blocker.state === 'blocked') {
      blocker.proceed();
    } else {
      navigate('/dashboard');
    }
  };

  const handleConfirmMinimize = () => {
    // Context already tracks activeRoomId, just navigate away
    showToast(t('room:minimizeSuccess', 'Room minimized to screen corner!'), 'info');
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

  // If context hasn't synced the active room yet, show loader
  if (isLoading || roomId !== activeRoomId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#d4af37]" />
        <p className="text-sm font-semibold text-[#f3f4f6]">{t('room:loadingLobby', 'Loading lobby...')} #{roomId?.slice(0, 8)}</p>
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center justify-center text-[#ef4444]">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#f3f4f6]">{t('room:loadLobbyError', 'Failed to load lobby data.')}</h2>
        <p className="text-xs text-[#9ca3af]">{t('room:noRoomsDesc', 'Create the first room to start playing!')}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 bg-[#13161c] border border-[#2d323f] rounded-xl text-xs font-bold text-[#d4af37] hover:bg-[#2d323f] cursor-pointer"
          >
            {t('room:retry', 'Retry')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-[#d4af37] text-[#0d0e12] rounded-xl text-xs font-bold hover:bg-[#b59226] cursor-pointer"
          >
            {t('room:joinPlay', 'PLAY')}
          </button>
        </div>
      </div>
    );
  }

  const isHost = String(currentUser?.id) === String(room?.host?.id);
  const isUserWhite = String(currentUser?.id) === String(room?.white?.id);
  const isUserBlack = String(currentUser?.id) === String(room?.black?.id);
  const isPlayer = isUserWhite || isUserBlack;
  const isCurrentUserReady = isUserWhite ? room.whiteReady : (isUserBlack ? room.blackReady : false);

  const hostReady = isHost && isPlayer && isCurrentUserReady;
  const showLeaveRoomButton = !hostReady;

  const handleReady = async (readyStatus) => {
    if (isReadyPending) return;
    setIsReadyPending(true);
    try {
      await roomService.ready(room.roomId, readyStatus);
    } catch (_error) {
      showToast(t('room:readyError', 'Failed to update ready state'), 'error');
    } finally {
      setIsReadyPending(false);
    }
  };

  const handleSeatChange = async (side) => {
    if (isReadyPending) return;
    const role = side === 'WHITE' ? 'white' : side === 'BLACK' ? 'black' : 'spectator';
    try {
      await roomService.switchSeat(roomId, role);
    } catch (err) {
      showToast(err.response?.data?.message || t('room:joinRoomError', 'Error joining seat'), 'error');
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 max-w-6xl flex flex-col h-full min-h-[500px] py-4">
        {/* TOP MINI ACTIONS */}
        <div className="flex items-center justify-end gap-2 py-3 shrink-0">
          <button
            type="button"
            onClick={handleConfirmMinimize}
            className="flex items-center gap-1.5 bg-[#13161c] hover:bg-[#2d323f] text-[#f3f4f6] border border-[#2d323f] px-3 py-1.5 rounded-lg font-semibold text-xs transition-all cursor-pointer shadow-sm"
          >
            <Minimize2 className="w-4 h-4 text-[#d4af37]" />
            <span className="hidden sm:inline">{t('room:minimize', 'Thu nhỏ')}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-[#d4af37]/15 hover:bg-[#d4af37]/25 text-[#d4af37] border border-[#d4af37]/40 px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? t('room:copied', 'Đã chép') : t('room:copyLink', 'Sao chép link')}</span>
          </button>
        </div>

        {/* MAIN CONTENT WORKSPACE */}
        <div className="flex-1 min-h-0 relative flex flex-col">
          {(room.status === 'IN_PROGRESS' || (room.status === 'WAITING' && room.gameData?.winner && !postGameAcknowledged)) ? (
            <RoomPlaying
              room={room}
              roomId={roomId}
              handleReady={handleReady}
              handleConfirmLeave={handleConfirmLeave}
              isReadyPending={isReadyPending}
              onAcknowledgeGameOver={() => setPostGameAcknowledged(true)}
            />
          ) : (
            <RoomWaiting
              room={room}
              roomId={roomId}
              t={t}
              isPlayer={isPlayer}
              isCurrentUserReady={isCurrentUserReady}
              isReadyPending={isReadyPending}
              handleReady={handleReady}
              handleSeatChange={handleSeatChange}
              showLeaveRoomButton={showLeaveRoomButton}
              handleConfirmLeave={handleConfirmLeave}
            />
          )}
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
              <h3 className="text-lg font-bold text-[#f3f4f6]">{t('room:expandWidgetTitle', 'Expand room widget')}</h3>
              <p className="text-sm text-[#9ca3af]">
                {t('room:waitingPlayer', 'Waiting for player...')}
              </p>
            </div>
            <div className={`grid ${showLeaveRoomButton ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
              {showLeaveRoomButton && (
                <button
                  type="button"
                  onClick={handleConfirmLeave}
                  className="flex flex-col items-center justify-center gap-2 bg-[#13161c] hover:bg-[#ef4444]/10 border border-[#2d323f] hover:border-[#ef4444]/40 text-[#9ca3af] hover:text-[#ef4444] p-3 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-xs font-semibold">{t('room:leaveRoomSuccess', 'Leave room').replace('Left the', 'Leave')}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleConfirmMinimize}
                className="flex flex-col items-center justify-center gap-2 bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] border border-[#d4af37] p-3 rounded-xl transition-all cursor-pointer"
              >
                <Minimize2 className="w-5 h-5" />
                <span className="text-xs font-bold">{t('room:minimize', 'Minimize')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RoomPage;
