export const checkAndCheckmateLessons = [
  {
    id: 'check-basics',
    title: 'Check',
    description: 'Attack the enemy King and put him in check.',
    difficulty: 'Beginner',
    estimatedTime: '3 mins',
    icon: 'AlertTriangle',
    category: 'Check & Checkmate',
    order: 5,
    steps: [
      {
        id: 'check-step-1',
        title: 'Attacking the King',
        description: 'Check means the King is under direct attack. Move your Rook to e8 to check the enemy King on e8.',
        fen: '4k3/8/8/8/8/8/8/3R2K1 w - - 0 1',
        orientation: 'white',
        expectedMove: { from: 'd1', to: 'd8' },
        hint: {
          text: 'Move the Rook to d8 to attack the King on e8.',
          highlightSquares: ['d1', 'd8'],
          arrows: [['d1', 'd8', 'rgba(239, 68, 68, 0.9)']],
        },
        successMessage: 'CHECK! The enemy King is attacked and must respond next turn.',
      },
    ],
  },
  {
    id: 'checkmate-basics',
    title: 'Checkmate',
    description: 'Corner the enemy King with no legal escape moves.',
    difficulty: 'Intermediate',
    estimatedTime: '4 mins',
    icon: 'Crown',
    category: 'Check & Checkmate',
    order: 6,
    steps: [
      {
        id: 'mate-step-1',
        title: 'Back-Rank Mate',
        description: 'The black King is trapped behind his own pawns. Move your Rook to d8 to deliver checkmate!',
        fen: '3r2k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
        orientation: 'white',
        expectedMove: { from: 'd1', to: 'd8' },
        hint: {
          text: 'Slide your Rook all the way down to d8.',
          highlightSquares: ['d1', 'd8'],
          arrows: [['d1', 'd8', 'rgba(212, 175, 55, 0.9)']],
        },
        successMessage: 'CHECKMATE! The King is trapped with no legal moves left. Game Over!',
      },
    ],
  },
];
