import { pieceMovementLessons } from './pieceMovement';
import { captureLessons } from './capture';
import { checkAndCheckmateLessons } from './checkAndCheckmate';
import { specialMovesLessons } from './specialMoves';

export const ALL_LESSONS = [
  ...pieceMovementLessons,
  ...captureLessons,
  ...checkAndCheckmateLessons,
  ...specialMovesLessons,
].sort((a, b) => a.order - b.order);

export const getLessonById = (id) => ALL_LESSONS.find((l) => l.id === id);
