import { Chess } from 'chess.js';
import { StockfishBot } from '../src/features/learn/engine/bots/StockfishBot.js';
import assert from 'node:assert';

console.log('--- TESTING STOCKFISH BOT STRATEGY ---');

const chess = new Chess();
const bot = new StockfishBot(2);

console.log(`Bot initialized: ${bot.name} (Difficulty: ${bot.difficulty})`);

const move = await bot.getMoveAsync(chess);

console.log('Stockfish move received:', move);

assert.ok(move && move.from && move.to, 'Stockfish should return a move object with from and to');

const executed = chess.move(move);
assert.ok(executed, 'Move returned by Stockfish must be legal in chess.js');

console.log(`✅ Legal move executed: ${executed.san}`);
bot.destroy();
console.log('🎉 STOCKFISH BOT TEST PASSED 100%!');
