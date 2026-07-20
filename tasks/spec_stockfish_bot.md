# Spec: Stockfish AI Bot Integration

## Objective
Add a real **Stockfish Chess Engine** strategy (`StockfishBot`) running entirely on the client side via Web Workers and UCI (Universal Chess Interface) protocol in `stockfish.js`. 
Users will be able to select Stockfish as an opponent in `PlayBotPage`, configuring search depth / skill level (Grandmaster level engine).

## Tech Stack
- React 19 + Vite 8
- `stockfish.js` (WebAssembly/JS Stockfish 10 compilation)
- `chess.js` (move parsing and board FEN synchronization)
- Web Worker / UCI protocol interface

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Structure
```text
src/
  features/
    learn/
      engine/
        bots/
          ChessBot.js             # Updated strategy interface (supports getMoveAsync)
          StockfishBot.js         # Stockfish UCI Web Worker strategy implementation
          RandomBot.js            # Existing random move strategy
          MiniMaxBot.js           # Existing minimax strategy
      components/
        BotSelector.jsx           # Added Stockfish choice & engine info
      pages/
        PlayBotPage.jsx           # Async bot move invocation & engine status indicator
```

## Code Style
- Strategy pattern: `StockfishBot` implements the `ChessBot` contract.
- Clean Web Worker lifecycle management: spawn/terminate Stockfish worker without leaking memory.
- Non-blocking async calculation: UI remains responsive during deep engine analysis.

## Testing Strategy
- Standalone self-check script (`scratch/test_stockfish_bot.js`) testing UCI initialization, FEN positioning, and `bestmove` parsing.
- Vite build verification (`npm run build`).

## Boundaries
- **Always:** Perform 100% of Stockfish engine calculations on the frontend in a Web Worker.
- **Ask first:** Adding additional chess engine dependencies besides `stockfish.js`.
- **Never:** Block the main UI thread with heavy synchronous search loops.

## Success Criteria
1. `StockfishBot` can be selected in `BotSelector` alongside `RandomBot` and `MiniMaxBot`.
2. Selecting `StockfishBot` initializes a Stockfish engine Web Worker and sends UCI `position fen ...` and `go depth ...` commands.
3. The bot calculates the optimal move asynchronously and returns a valid `chess.js` move object.
4. Player can play full games against Stockfish with responsive move feedback and game status detection.
5. Worker is cleaned up when leaving `PlayBotPage` or switching bot strategies.

## Open Questions
- None. Requirements are self-contained.
