import { Chess } from 'chess.js';

/**
 * Validates player moves against step expected moves using chess.js.
 */
export class LessonValidator {
  /**
   * Validate a move made by the user against expected move(s) in a step.
   * @param {Chess} chessInstance - Active chess.js instance
   * @param {{ from: string, to: string, promotion?: string }} moveCandidate - Move attempted
   * @param {Object} stepConfig - Step configuration object
   * @returns {{ success: boolean, move: Object|null, error?: string, completed: boolean }}
   */
  static validateMove(chessInstance, moveCandidate, stepConfig) {
    if (!chessInstance || !moveCandidate || !stepConfig) {
      return { success: false, move: null, error: 'Invalid parameters', completed: false };
    }

    // Clone chess instance to simulate move without mutating original immediately
    const tempChess = new Chess(chessInstance.fen());
    let executedMove = null;

    try {
      executedMove = tempChess.move(moveCandidate);
    } catch {
      return { success: false, move: null, error: 'Illegal chess move', completed: false };
    }

    if (!executedMove) {
      return { success: false, move: null, error: 'Illegal chess move', completed: false };
    }

    const { expectedMove, expectedMoves, targetFen } = stepConfig;

    // Case 1: Target FEN match
    if (targetFen) {
      const fenMatch = tempChess.fen().split(' ')[0] === targetFen.split(' ')[0];
      return {
        success: fenMatch,
        move: fenMatch ? executedMove : null,
        error: fenMatch ? undefined : 'Incorrect target position',
        completed: fenMatch,
      };
    }

    // Normalize candidate moves to match format
    const matchesExpected = (expected) => {
      if (typeof expected === 'string') {
        return (
          executedMove.san === expected ||
          executedMove.lan === expected ||
          `${executedMove.from}${executedMove.to}` === expected
        );
      }
      if (expected && typeof expected === 'object') {
        const fromMatch = expected.from ? expected.from === executedMove.from : true;
        const toMatch = expected.to ? expected.to === executedMove.to : true;
        const pieceMatch = expected.piece ? expected.piece === executedMove.piece : true;
        return fromMatch && toMatch && pieceMatch;
      }
      return false;
    };

    let isMatch;
    if (Array.isArray(expectedMoves)) {
      isMatch = expectedMoves.some(matchesExpected);
    } else if (expectedMove) {
      isMatch = matchesExpected(expectedMove);
    } else {
      // If step has no specific expected move, any legal move is valid
      isMatch = true;
    }

    return {
      success: isMatch,
      move: isMatch ? executedMove : null,
      error: isMatch ? undefined : 'Wrong move, try again!',
      completed: isMatch,
    };
  }
}
