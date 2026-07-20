export const captureLessons = [
  {
    id: 'capturing-pieces',
    title: 'Capturing Pieces',
    description: 'Learn how pieces capture enemy pieces by occupying their square.',
    difficulty: 'Beginner',
    estimatedTime: '2 mins',
    icon: 'Target',
    category: 'Captures',
    order: 4,
    steps: [
      {
        id: 'capture-step-1',
        title: 'Take the Undefended Pawn',
        description: 'Enemy pieces are captured by moving into their square. Take the undefended black pawn on e5 with your Queen from b2.',
        fen: '4k3/8/8/4p3/8/8/1Q6/4K3 w - - 0 1',
        orientation: 'white',
        expectedMove: { from: 'b2', to: 'e5' },
        hint: {
          text: 'Move the Queen on b2 diagonally right to take the pawn on e5.',
          highlightSquares: ['b2', 'e5'],
          arrows: [{ startSquare: 'b2', endSquare: 'e5', color: 'rgba(239, 68, 68, 0.9)' }],
        },
        successMessage: 'Target captured! The enemy pawn is removed from the board.',
      },
    ],
  },
];
