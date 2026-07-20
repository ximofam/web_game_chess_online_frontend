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
        description: 'Enemy pieces are captured by moving into their square. Take the undefended black pawn on e5 with your Queen.',
        fen: '4k3/8/8/4p3/1Q6/8/8/4K3 w - - 0 1',
        orientation: 'white',
        expectedMove: { from: 'b4', to: 'e5' },
        hint: {
          text: 'Move the Queen on b4 diagonally right to take the pawn on e5.',
          highlightSquares: ['b4', 'e5'],
          arrows: [['b4', 'e5', 'rgba(239, 68, 68, 0.9)']],
        },
        successMessage: 'Target captured! The enemy pawn is removed from the board.',
      },
    ],
  },
];
