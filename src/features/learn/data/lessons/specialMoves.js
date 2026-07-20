export const specialMovesLessons = [
  {
    id: 'castling',
    title: 'Castling',
    description: 'Safeguard your King and activate your Rook in a single move.',
    difficulty: 'Intermediate',
    estimatedTime: '3 mins',
    icon: 'ShieldAlert',
    category: 'Special Rules',
    order: 7,
    steps: [
      {
        id: 'castling-step-1',
        title: 'Kingside Castling',
        description: 'Castling allows your King to move 2 squares towards a Rook while the Rook hops over. Move your King from e1 to g1.',
        fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
        orientation: 'white',
        expectedMove: { from: 'e1', to: 'g1' },
        hint: {
          text: 'Drag King from e1 to g1 to castle Kingside.',
          highlightSquares: ['e1', 'g1'],
          arrows: [{ startSquare: 'e1', endSquare: 'g1', color: 'rgba(212, 175, 55, 0.9)' }],
        },
        successMessage: 'Kingside castling complete! Your King is tucked into safety.',
      },
    ],
  },
  {
    id: 'en-passant',
    title: 'En Passant',
    description: 'Special pawn capture rule when an enemy pawn moves two squares.',
    difficulty: 'Advanced',
    estimatedTime: '4 mins',
    icon: 'Flame',
    category: 'Special Rules',
    order: 8,
    steps: [
      {
        id: 'en-passant-step-1',
        title: 'Capturing In-Passing',
        description: 'Black just moved pawn d7 to d5. You can capture it "in passing" by moving your e5 pawn to d6!',
        fen: 'rnbqkbnr/ppp1pppp/8/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2',
        orientation: 'white',
        expectedMove: { from: 'e5', to: 'd6' },
        hint: {
          text: 'Move your pawn on e5 diagonally to d6.',
          highlightSquares: ['e5', 'd6'],
          arrows: [{ startSquare: 'e5', endSquare: 'd6', color: 'rgba(239, 68, 68, 0.9)' }],
        },
        successMessage: 'En Passant! You captured the pawn as it tried to bypass your guard.',
      },
    ],
  },
];
