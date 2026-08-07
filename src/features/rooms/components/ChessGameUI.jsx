import { useState, useMemo, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { useAuth } from '../../auth/context/AuthContext';
import { User, Clock, Flag, Handshake } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AnnotationBuilder } from '../../learn/engine/annotations/AnnotationBuilder';

export function ChessGameUI({ room }) {
  const { currentUser } = useAuth();
  const { t } = useTranslation(['room']);
  const [selectedSquare, setSelectedSquare] = useState(null);

  const { gameData, white, black, settings } = room;
  const currentUserId = String(currentUser?.id);

  // Initialize local chess instance for legal moves
  const chess = useMemo(() => {
    try {
      return new Chess(gameData?.fen || 'start');
    } catch {
      return new Chess();
    }
  }, [gameData?.fen]);

  // Compute legal move highlights
  const legalMoveSquares = useMemo(() => {
    if (!selectedSquare) return [];
    try {
      const moves = chess.moves({ square: selectedSquare, verbose: true });
      return moves.map(m => ({
        square: m.to,
        isCapture: Boolean(m.captured || m.flags.includes('c') || m.flags.includes('e'))
      }));
    } catch {
      return [];
    }
  }, [chess, selectedSquare]);

  const squareStyles = useMemo(() => {
    return AnnotationBuilder.buildSquareStyles({
      highlightSquares: legalMoveSquares,
      selectedSquare,
      // You can add lastMove highlight here later if backend provides it
    });
  }, [legalMoveSquares, selectedSquare]);

  // Handlers for selection
  const handlePieceClick = useCallback(({ square }) => {
    setSelectedSquare(prev => prev === square ? null : square);
  }, []);

  const handlePieceDrag = useCallback(({ square }) => {
    setSelectedSquare(square);
  }, []);

  const handleSquareMouseDown = useCallback(({ square }) => {
    setSelectedSquare(square);
  }, []);

  const handleSquareClick = useCallback(({ square }) => {
    if (selectedSquare && selectedSquare !== square) {
      // Future: send move via websocket if valid
      setSelectedSquare(null);
    } else {
      setSelectedSquare(square);
    }
  }, [selectedSquare]);

  // Determine board orientation
  const isBlack = currentUserId === String(black?.id) || currentUserId === String(gameData?.blackId);
  const boardOrientation = isBlack ? 'black' : 'white';

  // Determine players for top and bottom displays
  const topPlayer = isBlack ? white : black;
  const bottomPlayer = isBlack ? black : white;

  // Timers (Using initial static settings for now)
  const initialTimeMinutes = settings?.timeMinutes || 5;

  const renderPlayerInfo = (player, isTop) => {
    return (
      <div className={`flex items-center justify-between bg-[#1a1d24] border border-[#2d323f] p-3 rounded-xl shadow-sm ${isTop ? 'mb-4' : 'mt-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#13161c] border border-[#2d323f] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
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
            </div>
            {/* Placeholder for captured pieces */}
            <div className="text-xs text-[#9ca3af] mt-0.5 min-h-[16px]">
              {/* Captured pieces will go here */}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-[#13161c] border border-[#2d323f] px-4 py-2 rounded-lg font-mono text-lg font-bold text-[#f3f4f6] shadow-inner">
            <Clock className="w-4 h-4 text-[#9ca3af]" />
            {String(initialTimeMinutes).padStart(2, '0')}:00
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
      {/* Top Player (Opponent) */}
      {renderPlayerInfo(topPlayer, true)}

      {/* Chess Board Area */}
      <div className="flex-1 flex items-center justify-center bg-[#13161c] rounded-2xl border border-[#2d323f] p-4 shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[500px] aspect-square relative z-10 drop-shadow-2xl">
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
              allowDragging: true,
              squareStyles,
              onPieceClick: handlePieceClick,
              onPieceDrag: handlePieceDrag,
              onSquareMouseDown: handleSquareMouseDown,
              onSquareClick: handleSquareClick,
            }}
          />
        </div>
      </div>

      {/* Bottom Player (Current User) */}
      {renderPlayerInfo(bottomPlayer, false)}

      {/* Game Actions (Resign, Draw) */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button className="flex items-center gap-2 bg-[#13161c] hover:bg-[#2d323f] border border-[#2d323f] text-[#9ca3af] hover:text-[#f3f4f6] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
          <Handshake className="w-4 h-4" />
          <span>{t('room:offerDraw', 'Offer Draw')}</span>
        </button>
        <button className="flex items-center gap-2 bg-[#13161c] hover:bg-[#ef4444]/10 border border-[#2d323f] hover:border-[#ef4444]/40 text-[#9ca3af] hover:text-[#ef4444] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer">
          <Flag className="w-4 h-4" />
          <span>{t('room:resign', 'Resign')}</span>
        </button>
      </div>
    </div>
  );
}
