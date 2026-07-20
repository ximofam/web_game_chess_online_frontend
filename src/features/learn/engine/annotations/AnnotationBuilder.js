/**
 * Utility to generate react-chessboard annotation props (customSquareStyles and customArrows).
 */
export class AnnotationBuilder {
  /**
   * Builds customSquareStyles object for react-chessboard
   * @param {Object} options
   * @param {string[]} [options.highlightSquares] - List of square coordinates (e.g. ['e4', 'd4'])
   * @param {Object} [options.squareStyles] - Custom key-value map of square styles
   * @param {string} [options.selectedSquare] - Selected square string
   * @param {{ from: string, to: string }} [options.lastMove] - Last move squares
   * @returns {Object} Square styles map
   */
  static buildSquareStyles({
    highlightSquares = [],
    squareStyles = {},
    selectedSquare = null,
    lastMove = null,
  } = {}) {
    const styles = { ...squareStyles };

    // Add last move highlights
    if (lastMove) {
      if (lastMove.from) {
        styles[lastMove.from] = {
          backgroundColor: 'rgba(212, 175, 55, 0.25)',
          ...styles[lastMove.from],
        };
      }
      if (lastMove.to) {
        styles[lastMove.to] = {
          backgroundColor: 'rgba(212, 175, 55, 0.4)',
          ...styles[lastMove.to],
        };
      }
    }

    // Add selected square highlight
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        ...styles[selectedSquare],
      };
    }

    // Add step highlight squares
    highlightSquares.forEach((sq) => {
      if (typeof sq === 'string') {
        styles[sq] = {
          backgroundColor: 'rgba(34, 197, 94, 0.4)',
          borderRadius: '50%',
          boxShadow: 'inset 0 0 8px rgba(34, 197, 94, 0.8)',
          ...styles[sq],
        };
      } else if (sq && typeof sq === 'object' && sq.square) {
        styles[sq.square] = {
          backgroundColor: sq.color || 'rgba(34, 197, 94, 0.4)',
          ...styles[sq.square],
        };
      }
    });

    return styles;
  }

  /**
   * Builds customArrows array for react-chessboard
   * @param {Array} arrows - Array of arrow configs ([from, to, color] or { from, to, color })
   * @returns {Array<[string, string, string]>} Array of tuple arrows
   */
  static buildArrows(arrows = []) {
    if (!Array.isArray(arrows)) return [];

    return arrows
      .map((arrow) => {
        if (Array.isArray(arrow) && arrow.length >= 2) {
          return [arrow[0], arrow[1], arrow[2] || 'rgb(212, 175, 55)'];
        }
        if (arrow && typeof arrow === 'object' && arrow.from && arrow.to) {
          return [arrow.from, arrow.to, arrow.color || 'rgb(212, 175, 55)'];
        }
        return null;
      })
      .filter(Boolean);
  }
}
