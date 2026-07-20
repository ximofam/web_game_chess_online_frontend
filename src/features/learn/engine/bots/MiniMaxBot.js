import { ChessBot } from './ChessBot.js';
import { Chess } from 'chess.js';

const PIECE_VALUES = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };

/**
 * Strategy: MiniMaxBot
 * Performs depth search with positional/material evaluation.
 */
export class MiniMaxBot extends ChessBot {
  constructor(difficulty = 2) {
    super(`MiniMax Bot (Lvl ${difficulty})`, difficulty);
    this.maxDepth = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3;
  }

  getMove(chessInstance) {
    if (!chessInstance || chessInstance.isGameOver()) return null;

    const moves = chessInstance.moves({ verbose: true });
    if (moves.length === 0) return null;

    const isMaximizing = chessInstance.turn() === 'w';
    let bestMove = null;
    let bestValue = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      const clone = new Chess(chessInstance.fen());
      clone.move(move);

      const boardValue = this.minimax(clone, this.maxDepth - 1, !isMaximizing, -Infinity, Infinity);

      if (isMaximizing) {
        if (boardValue > bestValue) {
          bestValue = boardValue;
          bestMove = move;
        }
      } else {
        if (boardValue < bestValue) {
          bestValue = boardValue;
          bestMove = move;
        }
      }
    }

    return bestMove || moves[Math.floor(Math.random() * moves.length)];
  }

  minimax(chess, depth, isMaximizing, alpha, beta) {
    if (depth === 0 || chess.isGameOver()) {
      return this.evaluateBoard(chess);
    }

    const moves = chess.moves({ verbose: true });

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const clone = new Chess(chess.fen());
        clone.move(move);
        const evalVal = this.minimax(clone, depth - 1, false, alpha, beta);
        maxEval = Math.max(maxEval, evalVal);
        alpha = Math.max(alpha, evalVal);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const clone = new Chess(chess.fen());
        clone.move(move);
        const evalVal = this.minimax(clone, depth - 1, true, alpha, beta);
        minEval = Math.min(minEval, evalVal);
        beta = Math.min(beta, evalVal);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }

  evaluateBoard(chess) {
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? -9999 : 9999;
    }
    if (chess.isDraw() || chess.isStalemate()) return 0;

    let score = 0;
    const board = chess.board();

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece) {
          const val = PIECE_VALUES[piece.type] || 0;
          if (piece.color === 'w') {
            score += val;
          } else {
            score -= val;
          }
        }
      }
    }

    return score;
  }
}
