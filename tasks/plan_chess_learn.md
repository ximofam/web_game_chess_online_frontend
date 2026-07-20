# Implementation Plan: Chess Learn Page & Bot Engine

## Phase 1: Dependencies & Base Engine Setup
- Install `chess.js` and `react-chessboard`.
- Define type contracts (JSDoc) & engine domain classes/helpers (`LessonValidator.js`, `AnnotationBuilder.js`, `ProgressTracker.js`).
- Define Bot Engine strategy interface (`ChessBot.js`) and `RandomBot.js`.

## Phase 2: Lesson Data Configurations
- Create data-driven lesson configurations in `src/features/learn/data/lessons/`:
  - Piece Movement (Pawn, Knight, Bishop, Rook, Queen, King)
  - Capture & Defense
  - Check & Checkmate
  - Special Moves (Castling, En Passant, Promotion)
  - Practice / Tactical Puzzles

## Phase 3: UI Components & Engine Integration
- `LessonBoard.jsx`: Visual chessboard wrapping `react-chessboard` with custom square styles, custom arrows, and drag-and-drop / click move handling.
- `StepControls.jsx`: Navigational buttons (Prev, Next, Restart, Undo), hint trigger, progress bar.
- `LessonCard.jsx`: Card component for lesson list on overview page.
- `BotSelector.jsx`: Interactive controls to select bot strategy & difficulty level.

## Phase 4: Pages & Route Wiring
- `LearnOverviewPage.jsx`: Main catalog of available lessons & progress stats.
- `LessonDetailPage.jsx`: Step execution view with live board, instruction panel, feedback toasts, and hint overlays.
- `PlayBotPage.jsx`: Interactive game mode vs AI bot strategy.
- Wire routes `/learn`, `/learn/:lessonId`, `/learn/play-bot` in `src/App.jsx` and add Learn link to Navbar.

## Phase 5: Verification & Self-Check
- Run `npm run build` and `npm run lint`.
- Add a lightweight self-check script for validation and bot engines.
