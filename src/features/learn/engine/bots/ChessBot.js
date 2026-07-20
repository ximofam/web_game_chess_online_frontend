/**
 * Base Strategy interface for AI Chess Bots.
 */
export class ChessBot {
  constructor(name = 'Base Bot', difficulty = 1) {
    this.name = name;
    this.difficulty = difficulty;
  }

  /**
   * Synchronous getMove calculation
   * @param {import('chess.js').Chess} chessInstance
   * @returns {import('chess.js').Move|null}
   */
  getMove() {
    throw new Error('getMove must be implemented by concrete bot strategies');
  }

  /**
   * Asynchronous getMove calculation (supports Web Workers & async engines)
   * @param {import('chess.js').Chess} chessInstance
   * @returns {Promise<import('chess.js').Move|null>}
   */
  async getMoveAsync(chessInstance) {
    return this.getMove(chessInstance);
  }

  /**
   * Optional cleanup hook when strategy is unmounted / switched
   */
  destroy() {}
}
