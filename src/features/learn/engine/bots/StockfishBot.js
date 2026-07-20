import { ChessBot } from './ChessBot.js';
import STOCKFISH from 'stockfish.js';

/**
 * Strategy: StockfishBot
 * Uses WebWorker/Emscripten Stockfish UCI engine for grandmaster-level calculations.
 */
export class StockfishBot extends ChessBot {
  constructor(difficulty = 2) {
    const depths = { 1: 3, 2: 7, 3: 14 };
    const labels = { 1: 'Stockfish (Beginner)', 2: 'Stockfish (Master)', 3: 'Stockfish (Grandmaster)' };
    const depth = depths[difficulty] || 7;
    super(labels[difficulty] || `Stockfish Lvl ${difficulty}`, difficulty);

    this.depth = depth;
    this.engine = null;
    this.initEngine();
  }

  initEngine() {
    try {
      if (typeof STOCKFISH === 'function') {
        const eng = STOCKFISH();
        if (eng && typeof eng.postMessage === 'function') {
          this.engine = eng;
        }
      }
    } catch {
      this.engine = null;
    }
  }

  async getMoveAsync(chessInstance) {
    if (!chessInstance || chessInstance.isGameOver()) return null;

    if (!this.engine) {
      this.initEngine();
    }

    // Fallback if Stockfish worker fails to instantiate
    if (!this.engine) {
      const moves = chessInstance.moves({ verbose: true });
      return moves[Math.floor(Math.random() * moves.length)];
    }

    return new Promise((resolve) => {
      let resolved = false;

      const messageHandler = (event) => {
        const line = typeof event === 'object' && event !== null ? event.data || event : event;
        if (typeof line === 'string' && line.startsWith('bestmove')) {
          const parts = line.split(' ');
          const moveStr = parts[1]; // e.g. "e2e4" or "e7e8q"

          if (moveStr && moveStr !== '(none)' && !resolved) {
            resolved = true;
            this.engine.onmessage = null;

            const from = moveStr.slice(0, 2);
            const to = moveStr.slice(2, 4);
            const promotion = moveStr.length > 4 ? moveStr.slice(4, 5) : undefined;

            resolve({ from, to, promotion });
          } else if (!resolved) {
            resolved = true;
            this.engine.onmessage = null;
            const moves = chessInstance.moves({ verbose: true });
            resolve(moves[Math.floor(Math.random() * moves.length)]);
          }
        }
      };

      this.engine.onmessage = messageHandler;

      // Timeout safety net (3 seconds max)
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.engine.onmessage = null;
          const moves = chessInstance.moves({ verbose: true });
          resolve(moves[Math.floor(Math.random() * moves.length)]);
        }
      }, 3000);

      try {
        this.engine.postMessage('ucinewgame');
        this.engine.postMessage(`position fen ${chessInstance.fen()}`);
        this.engine.postMessage(`go depth ${this.depth}`);
      } catch {
        if (!resolved) {
          resolved = true;
          this.engine.onmessage = null;
          const moves = chessInstance.moves({ verbose: true });
          resolve(moves[Math.floor(Math.random() * moves.length)]);
        }
      }
    });
  }

  destroy() {
    if (this.engine) {
      try {
        this.engine.postMessage('quit');
      } catch {
        // Ignore quit errors
      }
      this.engine = null;
    }
  }
}
