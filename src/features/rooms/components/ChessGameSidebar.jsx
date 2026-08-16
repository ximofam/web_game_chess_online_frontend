import { useMemo, useEffect, useRef, useState } from 'react';
import { ScrollText, Move } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Chess } from 'chess.js';
import { useSocket } from '../../../shared/socket/useSocket';
import { useAuth } from '../../auth/context/AuthContext';
import { useChessTimer } from '../hooks/useChessTimer';

export function ChessGameSidebar({ room }) {
  const { t } = useTranslation(['room']);
  const scrollRef = useRef(null);

  const { gameData } = room || {};
  const initialFen = gameData?.initialFen || 'start';

  const moveHistory = useMemo(() => {
    const movesUci = gameData?.moves || [];
    try {
      const chess = new Chess(initialFen);
      const history = [];
      for (const m of movesUci) {
        if (!m) continue;
        // UCI format e.g. e2e4, e7e8q
        const from = m.slice(0, 2);
        const to = m.slice(2, 4);
        const promotion = m.length > 4 ? m[4] : undefined;
        try {
          const result = chess.move({ from, to, promotion });
          if (result) {
            history.push(result.san);
          } else {
            history.push(m);
          }
        } catch {
          history.push(m); // fallback if chess.js throws
        }
      }
      return history;
    } catch {
      return gameData?.moves || []; // ultimate fallback
    }
  }, [gameData?.moves, initialFen]);

  const movePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      pairs.push({
        white: moveHistory[i],
        black: moveHistory[i + 1]
      });
    }
    return pairs;
  }, [moveHistory]);

  const [displayCount, setDisplayCount] = useState(20);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const previousScrollHeight = useRef(0);
  const prevMoveCount = useRef(movePairs.length);

  const movePairsToDisplay = useMemo(() => {
    if (movePairs.length <= displayCount) return movePairs;
    return movePairs.slice(movePairs.length - displayCount);
  }, [movePairs, displayCount]);

  const startingIndex = Math.max(0, movePairs.length - displayCount);

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && displayCount < movePairs.length) {
      previousScrollHeight.current = e.target.scrollHeight;
      setIsLoadingOlder(true);
      setDisplayCount(prev => prev + 20);
    }
  };

  // Restore scroll position after loading older moves
  useEffect(() => {
    if (isLoadingOlder && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight - previousScrollHeight.current;
      setIsLoadingOlder(false);
    }
  }, [displayCount, isLoadingOlder]);

  // Auto-scroll to bottom when new moves arrive
  useEffect(() => {
    if (scrollRef.current) {
      if (movePairs.length > prevMoveCount.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
    prevMoveCount.current = movePairs.length;
  }, [movePairs.length]);

  const { send } = useSocket();
  const { currentUser } = useAuth();
  const { whiteRemaining, blackRemaining } = useChessTimer(room);

  const [showResignConfirm, setShowResignConfirm] = useState(false);

  // Player and role logic
  const currentUserId = String(currentUser?.id);
  const isBlack = currentUserId === String(room.black?.id) || currentUserId === String(gameData?.blackId);
  const isWhite = currentUserId === String(room.white?.id) || currentUserId === String(gameData?.whiteId);
  const isPlayer = isWhite || isBlack;
  const myColor = isWhite ? 'white' : isBlack ? 'black' : null;
  const currentTurn = gameData?.turn || 'white';
  
  const topPlayer = isBlack ? room.white : room.black;
  const bottomPlayer = isBlack ? room.black : room.white;
  const topPlayerIsWhite = isBlack;
  const bottomPlayerIsWhite = !isBlack;

  const formatTime = (millis) => {
    const totalSeconds = Math.max(0, Math.ceil(millis / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleResign = () => setShowResignConfirm(true);
  const confirmResign = () => {
    setShowResignConfirm(false);
    send(`/app/room.${room.roomId}.resign`, {});
  };
  const handleOfferDraw = () => send(`/app/room.${room.roomId}.draw.offer`, {});
  const handleAcceptDraw = () => send(`/app/room.${room.roomId}.draw.accept`, {});
  const handleDeclineDraw = () => send(`/app/room.${room.roomId}.draw.decline`, {});

  const renderPlayerInfo = (player, isTop, isPlayerWhite) => {
    const remainingMillis = isPlayerWhite ? whiteRemaining : blackRemaining;
    const isPlayerTurn = isPlayerWhite ? currentTurn === 'white' : currentTurn === 'black';
    const isLowTime = remainingMillis <= 30000 && remainingMillis > 0;

    return (
      <div className={`flex items-center justify-between bg-[#1a1d24] border border-[#2d323f] p-3 rounded-xl shadow-sm shrink-0 ${isTop ? 'mb-4' : 'mt-4'} ${isPlayerTurn ? 'border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'opacity-80'}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-xl bg-[#13161c] border flex items-center justify-center overflow-hidden shrink-0 shadow-inner ${isPlayerTurn ? 'border-[#d4af37]/50' : 'border-[#2d323f]'}`}>
            {player?.avatarUrl ? (
              <img src={player.avatarUrl} alt={player.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-5 h-5 text-[#9ca3af] bg-[#9ca3af]" style={{maskImage: 'url(/user-icon.svg)', WebkitMaskImage: 'url(/user-icon.svg)'}} />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-[#f3f4f6] text-sm flex items-center gap-2 truncate">
              <span className="truncate">{player?.username || t('room:waitingPlayer', 'Waiting...')}</span>
              <span className="text-[10px] bg-[#2d323f] text-[#9ca3af] px-1.5 py-0.5 rounded font-mono shrink-0">1500?</span>
            </div>
            <div className="text-xs text-[#9ca3af] mt-0.5 min-h-[16px]">
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-lg font-mono text-lg font-bold shadow-inner transition-colors ${isLowTime
            ? 'bg-[#ef4444]/20 border-[#ef4444]/50 text-[#ef4444] animate-pulse'
            : isPlayerTurn
              ? 'bg-[#13161c] border-[#d4af37]/50 text-[#d4af37]'
              : 'bg-[#13161c] border-[#2d323f] text-[#9ca3af]'
            }`}>
            {formatTime(remainingMillis)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[300px] lg:min-h-0 overflow-hidden">
      {/* Top Player */}
      {renderPlayerInfo(topPlayer, true, topPlayerIsWhite)}

      {/* Moves History */}
      <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl p-4 shadow-lg flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 border-b border-[#2d323f] pb-2 mb-3 shrink-0">
          <ScrollText className="w-4 h-4 text-[#d4af37]" />
          <h3 className="text-sm font-bold text-[#f3f4f6] uppercase tracking-wider">
            {t('room:moveHistory', 'Move History')}
          </h3>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto pr-2 scrollbar-thin flex flex-col"
        >
          {movePairsToDisplay.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-[#6b7280] space-y-3">
              <Move className="w-8 h-8 opacity-50" />
              <p className="text-xs font-semibold">{t('room:noMovesYet', 'No moves yet')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-[30px_1fr_1fr] gap-x-2 gap-y-0.5 text-xs font-mono">
              {displayCount < movePairs.length && (
                <div className="col-span-3 text-center text-[#9ca3af] py-1 italic opacity-50">
                  {t('room:loadingOlderMoves', 'Loading older moves...')}
                </div>
              )}
              {movePairsToDisplay.map((pair, idx) => {
                const globalIdx = startingIndex + idx;
                const isLatestWhite = !pair.black && globalIdx === movePairs.length - 1;
                const isLatestBlack = pair.black && globalIdx === movePairs.length - 1;
                return (
                  <div key={globalIdx} className="contents group">
                    <div className="flex items-center justify-end pr-2 text-[#6b7280]">
                      {globalIdx + 1}.
                    </div>
                    <div className={`flex items-center px-2 py-0.5 rounded transition-colors ${isLatestWhite ? 'bg-[#d4af37] text-[#0d0e12] font-bold' : 'bg-[#13161c] text-[#f3f4f6] group-hover:bg-[#2d323f]'}`}>
                      {pair.white}
                    </div>
                    {pair.black ? (
                      <div className={`flex items-center px-2 py-0.5 rounded transition-colors ${isLatestBlack ? 'bg-[#d4af37] text-[#0d0e12] font-bold' : 'bg-[#13161c] text-[#f3f4f6] group-hover:bg-[#2d323f]'}`}>
                        {pair.black}
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Game Actions */}
      {room.status === 'IN_PROGRESS' && isPlayer && (
        <div className="flex-none flex flex-col items-center justify-center gap-3 mt-4">
          {gameData?.drawOfferBy && gameData.drawOfferBy !== myColor && (
            <div className="bg-[#d4af37]/10 border border-[#d4af37]/40 rounded-xl p-3 w-full animate-in fade-in zoom-in-95 duration-200">
              <p className="text-sm font-bold text-[#d4af37] mb-2 text-center">
                {t('room:opponent_offers_draw', 'Opponent offers a draw')}
              </p>
              <div className="flex gap-2">
                <button onClick={handleDeclineDraw} className="flex-1 py-1.5 bg-[#13161c] hover:bg-[#2d323f] border border-[#2d323f] text-[#9ca3af] hover:text-[#f3f4f6] text-xs font-bold rounded-lg transition-all cursor-pointer">
                  {t('room:declineDraw', 'Decline')}
                </button>
                <button onClick={handleAcceptDraw} className="flex-1 py-1.5 bg-[#d4af37] hover:bg-[#b59226] text-[#0d0e12] text-xs font-bold rounded-lg transition-all cursor-pointer">
                  {t('room:acceptDraw', 'Accept Draw')}
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center justify-center gap-3 w-full">
            <button 
              onClick={handleOfferDraw}
              disabled={!!gameData?.drawOfferBy}
              className={`flex-1 flex items-center justify-center gap-2 border px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                gameData?.drawOfferBy === myColor 
                  ? 'bg-[#13161c] border-[#2d323f] text-[#d4af37] opacity-80 cursor-not-allowed'
                  : 'bg-[#13161c] hover:bg-[#2d323f] border-[#2d323f] text-[#9ca3af] hover:text-[#f3f4f6] cursor-pointer'
              }`}
            >
              <span>
                {gameData?.drawOfferBy === myColor ? t('room:drawOfferWaiting', 'Waiting...') : t('room:offerDraw', 'Offer Draw')}
              </span>
            </button>
            <button onClick={handleResign} className="flex-1 flex items-center justify-center gap-2 bg-[#ef4444]/10 hover:bg-[#ef4444] border border-[#ef4444]/40 text-[#ef4444] hover:text-[#0d0e12] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
              <span>{t('room:resign', 'Resign')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Resign Confirm Modal */}
      {showResignConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0d0e12]/80 backdrop-blur-sm rounded-lg p-4">
          <div className="bg-[#1a1d24] border border-[#2d323f] rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h3 className="text-xl font-bold text-[#f3f4f6] mb-2">{t('room:resignConfirmTitle', 'Xác nhận đầu hàng')}</h3>
            <p className="text-sm text-[#9ca3af] mb-6">{t('room:resignConfirmDesc', 'Bạn có chắc chắn muốn đầu hàng ván đấu này không?')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowResignConfirm(false)} className="flex-1 py-2.5 bg-[#13161c] hover:bg-[#2d323f] border border-[#2d323f] text-[#f3f4f6] text-sm font-bold rounded-xl transition-all cursor-pointer">
                {t('room:cancel', 'Hủy')}
              </button>
              <button onClick={confirmResign} className="flex-1 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-sm font-bold rounded-xl transition-all cursor-pointer">
                {t('room:confirmResign', 'Đầu hàng')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Player */}
      {renderPlayerInfo(bottomPlayer, false, bottomPlayerIsWhite)}
    </div>
  );
}
