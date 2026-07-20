import STOCKFISH from 'stockfish.js';

console.log('--- TESTING STOCKFISH.JS API ---');

const engine = STOCKFISH();

engine.onmessage = (event) => {
  const line = typeof event === 'object' ? event.data || event : event;
  console.log('[STOCKFISH OUTPUT]:', line);
  if (line.includes('bestmove')) {
    console.log('✅ BESTMOVE FOUND:', line);
    process.exit(0);
  }
};

console.log('Sending uci...');
engine.postMessage('uci');

setTimeout(() => {
  console.log('Sending position and go depth 4...');
  engine.postMessage('position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  engine.postMessage('go depth 4');
}, 500);
