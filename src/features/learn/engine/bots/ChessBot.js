/**
 * Base Strategy interface for AI Chess Bots.
 */
export class ChessBot {
  constructor(name = 'Base Bot', difficulty = 1) {
    this.name = name;
    this.difficulty = difficulty;
  }

  /**
   * Calculate next move for given chess position.
   * @param {import('chess.js').Chess} chessInstance - Active chess.js game
   * @returns {import('chess.js').Move|null} Valid move object or null if game over
   */
  getMove() {
    throw new Error('getMove must be implemented by concrete bot strategies');
  }
}
