import { pieceMovementLessons } from './pieceMovement.js';
import { captureLessons } from './capture.js';
import { checkAndCheckmateLessons } from './checkAndCheckmate.js';
import { specialMovesLessons } from './specialMoves.js';

export const ALL_LESSONS = [
  ...pieceMovementLessons,
  ...captureLessons,
  ...checkAndCheckmateLessons,
  ...specialMovesLessons,
].sort((a, b) => a.order - b.order);

export const getLessonById = (id) => ALL_LESSONS.find((l) => l.id === id);
