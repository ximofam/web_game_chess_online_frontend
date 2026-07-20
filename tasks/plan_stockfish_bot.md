# Implementation Plan: Stockfish AI Bot

## Phase 1: Dependency & Strategy Contract Update
- Install `stockfish.js`.
- Update `ChessBot.js` base class to include `getMoveAsync(chessInstance)` method for async bot strategies.

## Phase 2: Stockfish Worker Strategy Implementation
- Create `StockfishBot.js` in `src/features/learn/engine/bots/StockfishBot.js`:
  - Worker lifecycle management (instantiation, message handlers, cleanup).
  - UCI command pipeline (`uci`, `ucinewgame`, `position fen <fen>`, `go depth <depth>`).
  - Response parser for `bestmove <from><to><promotion>`.

## Phase 3: UI Integration
- Update `BotSelector.jsx` to include `Stockfish Engine` strategy option.
- Update `PlayBotPage.jsx` to handle async bot move execution (`getMoveAsync`) with loading indicators and error handling.

## Phase 4: Verification & Build
- Create standalone test `scratch/test_stockfish_bot.js`.
- Run `npm run build` and `npm run lint`.
