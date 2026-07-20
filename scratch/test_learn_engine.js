import { Chess } from 'chess.js';
import { ALL_LESSONS } from '../src/features/learn/data/lessons/index.js';
import { LessonValidator } from '../src/features/learn/engine/lesson/LessonValidator.js';
import { RandomBot } from '../src/features/learn/engine/bots/RandomBot.js';
import { MiniMaxBot } from '../src/features/learn/engine/bots/MiniMaxBot.js';
import assert from 'node:assert';

console.log('--- TESTING ALL LESSON STEPS AND BOT ENGINES ---');

ALL_LESSONS.forEach((lesson) => {
  console.log(`\nLesson: ${lesson.title} (${lesson.id})`);
  lesson.steps.forEach((step, idx) => {
    // 1. Check FEN validity
    let chess;
    try {
      chess = new Chess(step.fen);
    } catch (err) {
      assert.fail(`Step ${idx + 1} (${step.id}) has invalid FEN: "${step.fen}". Error: ${err.message}`);
    }

    // 2. Validate expected move
    const result = LessonValidator.validateMove(chess, step.expectedMove, step);
    assert.strictEqual(
      result.success,
      true,
      `Step ${idx + 1} (${step.id}) expected move failed! Error: ${result.error}`
    );
    console.log(`  ✅ Step ${idx + 1} (${step.title}): Move ${result.move.san} validated!`);
  });
});

console.log('\n--- TESTING BOT ENGINES ---');
const startChess = new Chess();
const randomBot = new RandomBot(1);
const rMove = randomBot.getMove(startChess);
assert.ok(rMove, 'RandomBot should generate a valid move');
console.log(`✅ RandomBot move: ${rMove.san}`);

const minimaxBot = new MiniMaxBot(2);
const mMove = minimaxBot.getMove(startChess);
assert.ok(mMove, 'MiniMaxBot should generate a valid move');
console.log(`✅ MiniMaxBot move: ${mMove.san}`);

console.log('\n🎉 ALL LESSON FENS AND MOVES ARE 100% VALID!');
