import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import LessonBoard from '../components/LessonBoard';
import BotSelector from '../components/BotSelector';
import { RandomBot } from '../engine/bots/RandomBot';
import { MiniMaxBot } from '../engine/bots/MiniMaxBot';
import { StockfishBot } from '../engine/bots/StockfishBot';
import { ArrowLeft, RotateCcw, Bot, Sparkles } from 'lucide-react';

const PlayBotPage = () => {
  const [strategyType, setStrategyType] = useState('random');
  const [difficulty, setDifficulty] = useState(1);
  const [playerColor, setPlayerColor] = useState('white');

  const [chess, setChess] = useState(() => new Chess());
  const [boardFen, setBoardFen] = useState(chess.fen());
  const [lastMove, setLastMove] = useState(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [gameStatus, setGameStatus] = useState('Playing');

  // Create Bot Strategy instance
  const botInstance = useMemo(() => {
    if (strategyType === 'stockfish') return new StockfishBot(difficulty);
    if (strategyType === 'minimax') return new MiniMaxBot(difficulty);
    return new RandomBot(difficulty);
  }, [strategyType, difficulty]);

  // Clean up engine worker on strategy switch or unmount
  useEffect(() => {
    return () => {
      botInstance?.destroy?.();
    };
  }, [botInstance]);

  const updateGameStatus = (currentChess) => {
    if (currentChess.isCheckmate()) {
      const winner = currentChess.turn() === 'w' ? 'Black (Bot)' : 'White (You)';
      setGameStatus(`Checkmate! Winner: ${winner}`);
    } else if (currentChess.isDraw() || currentChess.isStalemate()) {
      setGameStatus('Draw / Stalemate!');
    } else if (currentChess.inCheck()) {
      setGameStatus('CHECK!');
    } else {
      setGameStatus('Game in progress');
    }
  };

  const resetGame = useCallback(() => {
    const newChess = new Chess();
    setChess(newChess);
    setBoardFen(newChess.fen());
    setLastMove(null);
    setGameStatus('Playing');
  }, []);

  const handlePlayerColorChange = (color) => {
    setPlayerColor(color);
    resetGame();
  };

  // Bot Turn Trigger Effect
  useEffect(() => {
    const botTurnColor = playerColor === 'white' ? 'b' : 'w';

    if (chess.turn() === botTurnColor && !chess.isGameOver()) {
      let isSubscribed = true;

      const runBotMove = async () => {
        setIsBotThinking(true);
        const move = await botInstance.getMoveAsync(chess);
        if (isSubscribed && move) {
          try {
            const executed = chess.move(move);
            if (executed) {
              setBoardFen(chess.fen());
              setLastMove({ from: executed.from, to: executed.to });
              updateGameStatus(chess);
            }
          } catch {
            // Ignore move error
          }
        }
        if (isSubscribed) {
          setIsBotThinking(false);
        }
      };

      const timer = setTimeout(() => {
        runBotMove();
      }, 50);

      return () => {
        isSubscribed = false;
        clearTimeout(timer);
      };
    }
  }, [chess, boardFen, playerColor, botInstance]);

  const handleMove = (moveCandidate) => {
    const playerTurnColor = playerColor === 'white' ? 'w' : 'b';
    if (chess.turn() !== playerTurnColor || chess.isGameOver() || isBotThinking) {
      return false;
    }

    try {
      const move = chess.move(moveCandidate);
      if (move) {
        setBoardFen(chess.fen());
        setLastMove({ from: move.from, to: move.to });
        updateGameStatus(chess);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Link & Title */}
        <div className="flex items-center justify-between">
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Learn Overview
          </Link>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Board & Status */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
            {/* Game Status Banner */}
            <div className="w-full max-w-[560px] flex items-center justify-between p-4 bg-slate-900/90 border border-slate-800 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isBotThinking ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                <span className="text-sm font-semibold text-slate-200">
                  {isBotThinking ? `${botInstance.name} is thinking...` : gameStatus}
                </span>
              </div>
              <button
                onClick={resetGame}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restart Game
              </button>
            </div>

            <LessonBoard
              fen={boardFen}
              orientation={playerColor}
              onMove={handleMove}
              lastMove={lastMove}
              arePiecesDraggable={chess.turn() === (playerColor === 'white' ? 'w' : 'b') && !chess.isGameOver()}
            />
          </div>

          {/* Right: Bot Selector Panel */}
          <div className="lg:col-span-5 space-y-6">
            <BotSelector
              selectedStrategy={strategyType}
              onSelectStrategy={setStrategyType}
              difficulty={difficulty}
              onSelectDifficulty={setDifficulty}
              playerColor={playerColor}
              onSelectColor={handlePlayerColorChange}
              disabled={isBotThinking}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayBotPage;
