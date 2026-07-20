import { Chess } from 'chess.js';
import { LessonValidator } from '../src/features/learn/engine/lesson/LessonValidator.js';
import { RandomBot } from '../src/features/learn/engine/bots/RandomBot.js';
import { MiniMaxBot } from '../src/features/learn/engine/bots/MiniMaxBot.js';
import assert from 'node:assert';

console.log('--- RUNNING LESSON ENGINE SELF-CHECK ---');

// Test 1: LessonValidator
const chess = new Chess('4k3/8/8/8/4R3/8/8/4K3 w - - 0 1');
const stepConfig = { expectedMove: { from: 'e4', to: 'e8' } };

const validResult = LessonValidator.validateMove(chess, { from: 'e4', to: 'e8' }, stepConfig);
assert.strictEqual(validResult.success, true, 'e4 -> e8 should be valid');

const invalidResult = LessonValidator.validateMove(chess, { from: 'e4', to: 'e5' }, stepConfig);
assert.strictEqual(invalidResult.success, false, 'e4 -> e5 should be invalid against step config');

console.log('✅ LessonValidator tests passed!');

// Test 2: RandomBot
const startChess = new Chess();
const randomBot = new RandomBot(1);
const randomMove = randomBot.getMove(startChess);
assert.ok(randomMove && randomMove.from && randomMove.to, 'RandomBot should return a valid move');
console.log(`✅ RandomBot move: ${randomMove.san}`);

// Test 3: MiniMaxBot
const minimaxBot = new MiniMaxBot(2);
const minimaxMove = minimaxBot.getMove(startChess);
assert.ok(minimaxMove && minimaxMove.from && minimaxMove.to, 'MiniMaxBot should return a valid move');
console.log(`✅ MiniMaxBot move: ${minimaxMove.san}`);

console.log('--- ALL ENGINE CHECKS PASSED SUCCESSFULLY ---');
