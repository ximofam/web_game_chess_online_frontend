import { ChessBot } from './ChessBot.js';
import StockfishWorker from 'stockfish.js/stockfish.js?worker';

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
      this.engine = new StockfishWorker();
    } catch (err) {
      console.error('Failed to initialize Stockfish worker:', err);
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
      throw new Error('Stockfish engine failed to load or initialize.');
    }

    return new Promise((resolve, reject) => {
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
            reject(new Error('Stockfish returned invalid or no bestmove.'));
          }
        }
      };

      this.engine.onmessage = messageHandler;

      // Timeout safety net (15 seconds max to allow deep calculations)
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          this.engine.onmessage = null;
          reject(new Error('Stockfish engine calculation timed out.'));
        }
      }, 15000);

      try {
        this.engine.postMessage('ucinewgame');
        this.engine.postMessage(`position fen ${chessInstance.fen()}`);
        this.engine.postMessage(`go depth ${this.depth}`);
      } catch (err) {
        if (!resolved) {
          resolved = true;
          this.engine.onmessage = null;
          reject(new Error('Stockfish engine postMessage failed: ' + err.message));
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
