import { useState, useMemo, useCallback, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useAuth } from '../../auth/context/AuthContext';
import { useSocket } from '../../../shared/socket/useSocket';
import { User, Clock, Flag, Handshake, Wifi, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserPresence } from '../../presence/hooks/useUserPresence';
import { buildSquareStyles } from '../../learn/engine/annotations/AnnotationBuilder';

const ConnectionIndicator = ({ userId }) => {
  const { isOffline, loading } = useUserPresence(userId);
  if (!userId || loading) return null;
  return isOffline ? (
    <div className="flex items-center text-[#ef4444] bg-[#ef4444]/10 rounded-full p-0.5 ml-2" title="Disconnected">
      <WifiOff className="w-3 h-3" />
    </div>
  ) : (
    <div className="flex items-center text-[#10b981] bg-[#10b981]/10 rounded-full p-0.5 ml-2" title="Connected">
      <Wifi className="w-3 h-3" />
    </div>
  );
};

export function ChessGameUI({ room, handleReady, handleConfirmLeave, isReadyPending, onAcknowledgeGameOver }) {
  const { currentUser } = useAuth();
  const { send } = useSocket();
  const { t } = useTranslation(['room']);
  const [selectedSquare, setSelectedSquare] = useState(null);

  const { gameData, white, black, settings, roomId, status } = room;
  const currentUserId = String(currentUser?.id);

  // Timers
  const initialTimeMillis = (settings?.timeMinutes || 5) * 60 * 1000;
  const [whiteRemaining, setWhiteRemaining] = useState(gameData?.whiteRemainingMillis ?? initialTimeMillis);
  const [blackRemaining, setBlackRemaining] = useState(gameData?.blackRemainingMillis ?? initialTimeMillis);

  useEffect(() => {
    if (gameData?.whiteRemainingMillis !== undefined) setWhiteRemaining(gameData.whiteRemainingMillis);
    if (gameData?.blackRemainingMillis !== undefined) setBlackRemaining(gameData.blackRemainingMillis);
  }, [gameData?.whiteRemainingMillis, gameData?.blackRemainingMillis]);

  const [showGameOverModal, setShowGameOverModal] = useState(true);
  const [countdown, setCountdown] = useState(15);

  const isPostGame = status === 'WAITING' && gameData?.winner;

  useEffect(() => {
    if (isPostGame) {
      setShowGameOverModal(true);
      setCountdown(15);
    }
  }, [isPostGame]);

  useEffect(() => {
    if (isPostGame && showGameOverModal) {
      if (countdown <= 0) {
        handleConfirmLeave();
        return;
      }
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isPostGame, showGameOverModal, countdown, handleConfirmLeave]);

  useEffect(() => {
    const activeTurn = gameData?.turn || 'white';
    if (status !== 'IN_PROGRESS') return;
    const interval = setInterval(() => {
      if (activeTurn === 'white') setWhiteRemaining(prev => Math.max(0, prev - 100));
      else setBlackRemaining(prev => Math.max(0, prev - 100));
    }, 100);
    return () => clearInterval(interval);
  }, [status, gameData?.turn]);

  const formatTime = (millis) => {
    const totalSeconds = Math.max(0, Math.ceil(millis / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Initialize local chess instance for legal moves
  const chess = useMemo(() => {
    try {
      return new Chess(gameData?.fen || 'start');
    } catch {
      return new Chess();
    }
  }, [gameData?.fen]);

  // Determine board orientation and permissions
  const isBlack = currentUserId === String(black?.id) || currentUserId === String(gameData?.blackId);
  const isWhite = currentUserId === String(white?.id) || currentUserId === String(gameData?.whiteId);
  const isPlayer = isWhite || isBlack;
  const myColor = isWhite ? 'white' : isBlack ? 'black' : null;
  const currentTurn = gameData?.turn || 'white';
  const isMyTurn = myColor === currentTurn && status === 'IN_PROGRESS';
  const boardOrientation = isBlack ? 'black' : 'white';

  const onStay = () => {
    setShowGameOverModal(false);
    if (onAcknowledgeGameOver) onAcknowledgeGameOver();
  };

  const onRematch = () => {
    handleReady(true);
    setShowGameOverModal(false);
    if (onAcknowledgeGameOver) onAcknowledgeGameOver();
  };

  const topPlayer = isBlack ? white : black;
  const bottomPlayer = isBlack ? black : white;
  const topPlayerIsWhite = isBlack;
  const bottomPlayerIsWhite = !isBlack;

  // Compute legal move highlights
  const legalMoveSquares = useMemo(() => {
    if (!selectedSquare || !isMyTurn) return [];
    try {
      const moves = chess.moves({ square: selectedSquare, verbose: true });
      return moves.map(m => ({
        square: m.to,
        isCapture: Boolean(m.captured || m.flags.includes('c') || m.flags.includes('e'))
      }));
    } catch {
      return [];
    }
  }, [chess, selectedSquare, isMyTurn]);

  const squareStyles = useMemo(() => {
    return buildSquareStyles({
      highlightSquares: legalMoveSquares,
      selectedSquare,
      // You can add lastMove highlight here later if backend provides it
    });
  }, [legalMoveSquares, selectedSquare]);

  // Handlers for selection
  const handleMove = useCallback((sourceSquare, targetSquare) => {
    if (!isMyTurn) return false;
    try {
      const move = chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
      if (move) {
        const uciMove = move.from + move.to + (move.promotion || '');
        send(`/app/room.${roomId}.move`, { move: uciMove });
        // Spec: do not optimistically update fen. Revert the local move.
        chess.undo();
        setSelectedSquare(null);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [isMyTurn, chess, send, roomId]);

  const handlePieceClick = useCallback(({ square }) => {
    if (isMyTurn) setSelectedSquare(prev => prev === square ? null : square);
  }, [isMyTurn]);

  const handlePieceDrag = useCallback(({ square }) => {
    if (isMyTurn) setSelectedSquare(square);
  }, [isMyTurn]);

  const handleSquareMouseDown = useCallback(({ square }) => {
    if (isMyTurn) setSelectedSquare(square);
  }, [isMyTurn]);

  const handleSquareClick = useCallback(({ square }) => {
    if (!isMyTurn) return;
    if (selectedSquare && selectedSquare !== square) {
      handleMove(selectedSquare, square);
    } else {
      setSelectedSquare(square);
    }
  }, [selectedSquare, handleMove, isMyTurn]);

  const onPieceDrop = useCallback(({ sourceSquare, targetSquare }) => {
    return handleMove(sourceSquare, targetSquare);
  }, [handleMove]);

  const renderPlayerInfo = (player, isTop, isPlayerWhite) => {
    const remainingMillis = isPlayerWhite ? whiteRemaining : blackRemaining;
    const isPlayerTurn = isPlayerWhite ? currentTurn === 'white' : currentTurn === 'black';
    const isLowTime = remainingMillis <= 30000 && remainingMillis > 0; // <= 30s

    return (
      <div className={`flex items-center justify-between bg-[#1a1d24] border border-[#2d323f] p-3 rounded-xl shadow-sm ${isTop ? 'mb-4' : 'mt-4'} ${isPlayerTurn ? 'border-[#d4af37]/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'opacity-80'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-[#13161c] border flex items-center justify-center overflow-hidden shrink-0 shadow-inner ${isPlayerTurn ? 'border-[#d4af37]/50' : 'border-[#2d323f]'}`}>
            {player?.avatarUrl ? (
              <img src={player.avatarUrl} alt={player.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-[#9ca3af]" />
            )}
          </div>
          <div>
            <div className="font-bold text-[#f3f4f6] text-sm flex items-center gap-2">
              {player?.username || t('room:waitingPlayer', 'Waiting...')}
              <span className="text-[10px] bg-[#2d323f] text-[#9ca3af] px-1.5 py-0.5 rounded font-mono">1500?</span>
              <ConnectionIndicator userId={player?.id} />
            </div>
            {/* Placeholder for captured pieces */}
            <div className="text-xs text-[#9ca3af] mt-0.5 min-h-[16px]">
              {/* Captured pieces will go here */}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1.5 border px-4 py-2 rounded-lg font-mono text-lg font-bold shadow-inner transition-colors ${isLowTime
              ? 'bg-[#ef4444]/20 border-[#ef4444]/50 text-[#ef4444] animate-pulse'
              : isPlayerTurn
                ? 'bg-[#13161c] border-[#d4af37]/50 text-[#d4af37]'
                : 'bg-[#13161c] border-[#2d323f] text-[#9ca3af]'
            }`}>
            <Clock className="w-4 h-4" />
            {formatTime(remainingMillis)}
          </div>
        </div>
      </div>
    );
  };

  // Game over overlay UI mapping
  const getGameOverReasonUI = (reason) => {
    const mapping = {
      'CHECKMATE': t('room:reasonCheckmate', 'Checkmate'),
      'TIMEOUT': t('room:reasonTimeout', 'Time out'),
      'RESIGN': t('room:reasonResignation', 'Resignation'),
      'STALEMATE': t('room:reasonStalemate', 'Stalemate'),
      'DRAW': t('room:reasonDraw', 'Draw')
    };
    return mapping[reason] || reason;
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
      {/* Top Player (Opponent) */}
      {renderPlayerInfo(topPlayer, true, topPlayerIsWhite)}

      {/* Chess Board Area */}
      <div className="flex-1 flex items-center justify-center bg-[#13161c] rounded-2xl border border-[#2d323f] p-4 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-full aspect-square relative z-10 drop-shadow-2xl flex justify-center items-center">
          <Chessboard
            key={`board-${boardOrientation}`}
            options={{
              id: "RoomChessboard",
              position: gameData?.fen || 'start',
              boardOrientation: boardOrientation,
              darkSquareStyle: { backgroundColor: '#4b5563' },
              lightSquareStyle: { backgroundColor: '#9ca3af' },
              boardStyle: {
                borderRadius: '8px',
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
              },
              animationDurationInMs: 300,
              allowDragging: isMyTurn,
              squareStyles,
              onPieceClick: handlePieceClick,
              onPieceDrag: handlePieceDrag,
              onSquareMouseDown: handleSquareMouseDown,
              onSquareClick: handleSquareClick,
              onPieceDrop: onPieceDrop,
            }}
          />

          {/* Game Over Overlay */}
          {isPostGame && showGameOverModal && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0d0e12]/80 backdrop-blur-sm rounded-lg animate-in fade-in zoom-in-95 duration-300">
              <div className="text-center p-6 bg-[#1a1d24] border border-[#2d323f] rounded-2xl shadow-2xl min-w-[280px]">
                <h3 className="text-2xl font-black mb-1 text-[#f3f4f6]">
                  {!isPlayer
                    ? (gameData?.winner === 'DRAW' ? t('room:gameDraw', 'Draw') : gameData?.winner === 'WHITE_WIN' ? t('room:whiteWon', 'White won') : t('room:blackWon', 'Black won'))
                    : (gameData?.winner === (myColor === 'white' ? 'WHITE_WIN' : 'BLACK_WIN') ? t('room:youWon', 'You won') : gameData?.winner === 'DRAW' ? t('room:gameDraw', 'Draw') : t('room:youLost', 'You lost'))
                  }
                </h3>
                <p className="text-[#9ca3af] uppercase tracking-wider text-sm font-semibold mb-6">
                  {getGameOverReasonUI(gameData?.gameOverReason)}
                </p>
                <div className="flex gap-3">
                  <button onClick={handleConfirmLeave} className="flex-1 flex flex-col items-center justify-center py-2 bg-[#13161c] hover:bg-[#ef4444]/10 border border-[#2d323f] hover:border-[#ef4444]/40 text-[#9ca3af] hover:text-[#ef4444] text-xs font-bold rounded-xl transition-all cursor-pointer">
                    <span>{t('room:leave', 'Thoát')}</span>
                    <span className="text-[10px] font-normal opacity-70">({countdown}s)</span>
                  </button>
                  {isPlayer ? (
                    <button onClick={onRematch} disabled={isReadyPending} className="flex-1 py-2 bg-[#d4af37] hover:bg-[#b59226] text-[#0d0e12] text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer">
                      {isReadyPending ? '...' : t('room:rematch', 'Chơi lại')}
                    </button>
                  ) : (
                    <button onClick={onStay} className="flex-1 py-2 bg-[#d4af37] hover:bg-[#b59226] text-[#0d0e12] text-xs font-bold rounded-xl transition-all cursor-pointer">
                      {t('room:stay', 'Ở lại')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Player (Current User) */}
      {renderPlayerInfo(bottomPlayer, false, bottomPlayerIsWhite)}

      {/* Game Actions (Resign, Draw) */}
      {status === 'IN_PROGRESS' && isPlayer && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button className="flex items-center gap-2 bg-[#13161c] hover:bg-[#2d323f] border border-[#2d323f] text-[#9ca3af] hover:text-[#f3f4f6] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
            <Handshake className="w-4 h-4" />
            <span>{t('room:offerDraw', 'Offer Draw')}</span>
          </button>
          <button className="flex items-center gap-2 bg-[#ef4444]/10 hover:bg-[#ef4444] border border-[#ef4444]/40 text-[#ef4444] hover:text-[#0d0e12] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
            <Flag className="w-4 h-4" />
            <span>{t('room:resign', 'Resign')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
