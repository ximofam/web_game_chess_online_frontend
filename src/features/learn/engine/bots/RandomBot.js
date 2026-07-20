import { ChessBot } from './ChessBot.js';

/**
 * Strategy: RandomBot
 * Selects legal moves with optional heuristic weighting based on difficulty.
 */
export class RandomBot extends ChessBot {
  constructor(difficulty = 1) {
    const names = { 1: 'Novice Bot (Random)', 2: 'Apprentice Bot (Tactical Random)', 3: 'Challenger Bot (Aggressive)' };
    super(names[difficulty] || 'Random Bot', difficulty);
  }

  getMove(chessInstance) {
    if (!chessInstance || chessInstance.isGameOver()) {
      return null;
    }

    const moves = chessInstance.moves({ verbose: true });
    if (moves.length === 0) return null;

    // Difficulty 1: Pure random
    if (this.difficulty === 1) {
      return moves[Math.floor(Math.random() * moves.length)];
    }

    // Difficulty 2 & 3: Favor captures and checks
    const capturesAndChecks = moves.filter(
      (m) => m.captured || m.san.includes('+') || m.san.includes('#')
    );

    const chanceToPickTactical = this.difficulty === 2 ? 0.5 : 0.8;

    if (capturesAndChecks.length > 0 && Math.random() < chanceToPickTactical) {
      return capturesAndChecks[Math.floor(Math.random() * capturesAndChecks.length)];
    }

    return moves[Math.floor(Math.random() * moves.length)];
  }
}
