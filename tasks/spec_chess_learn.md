# Spec: Chess Learn Page & Play Against Computer

## Objective
Build a modular, extensible, and data-driven **Chess Learn** platform inspired by Lichess Learn (`/learn`). 
The page is publicly accessible (no authentication required) and allows users to learn chess rules, practice interactively step-by-step, view hints/annotations, and play practice games against a extensible frontend Bot Engine (Strategy Pattern with `RandomBot`).

## Tech Stack
- React 19 + Vite 8
- TailwindCSS v4 + Custom Chess Dark Aesthetic (`#0d0e12`, `#13161c`, `#1a1d24`, `#d4af37`)
- React Router DOM v7 (`/learn`, `/learn/:lessonId`)
- `chess.js` (rule validation & board state)
- `react-chessboard` (visual board rendering, drag-and-drop, custom square highlights, arrows)
- Lucide React Icons (`BookOpen`, `Award`, `Bot`, `RotateCcw`, `HelpCircle`, `CheckCircle2`, `ArrowRight`, `ChevronRight`)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Structure
```text
src/
  features/
    learn/
      pages/
        LearnOverviewPage.jsx     # Lesson catalog & progress overview
        LessonDetailPage.jsx      # Interactive lesson runner page
        PlayBotPage.jsx           # Practice mode vs computer bot
      components/
        LessonCard.jsx            # Lesson list item display card
        LessonBoard.jsx           # Wrapped react-chessboard with annotations & validation
        StepControls.jsx          # Next/Prev, Reset, Show Hint controls
        HintOverlay.jsx           # Text hint & square/arrow annotations generator
        BotSelector.jsx           # Difficulty & Bot strategy selector
      engine/
        bots/
          ChessBot.js             # Base Strategy interface (abstract contract)
          RandomBot.js            # Random legal move strategy (Easy/Medium/Hard variations)
          MiniMaxBot.js           # Stub / basic depth-search strategy for expansion
        lesson/
          LessonValidator.js      # Pure validation logic (expected moves vs chess.js move)
          ProgressTracker.js      # LocalStorage helper for saving completed lessons/steps
        annotations/
          AnnotationBuilder.js    # Highlight square & arrow builder for react-chessboard
      data/
        lessons/
          index.js                # Master LessonConfig list export
          pieceMovement.js        # Piece movement step definitions
          capture.js              # Capture step definitions
          checkAndCheckmate.js    # Check & Checkmate step definitions
          specialMoves.js         # Castling, En Passant, Promotion step definitions
          tactics.js              # Basic tactical puzzles
          botPractice.js          # Practice against bot lessons
      types/
        lessonTypes.js            # JSDoc type definitions for Lesson & Step configs
```

## Code Style
- SOLID & Clean Architecture tailored for React: decouple engine logic (validation, bot, annotations) from UI components.
- Data-driven configuration for lessons. No hardcoded step logic in JSX components.
- Optimization: `React.memo`, `useCallback`, `useMemo` on board & step state transitions to avoid extraneous rerenders.
- JSDoc annotations for types & configuration contracts.

## Testing Strategy
- Standalone runnable check (`src/features/learn/engine/lesson/LessonValidator.test.js` or self-check script) verifying move validation logic & bot response logic.
- Manual verification via Vite build (`npm run build`).

## Boundaries
- **Always:** Perform 100% of game logic & bot calculations on the frontend without backend API calls.
- **Ask first:** Installing extra packages besides `chess.js` and `react-chessboard`.
- **Never:** Hardcode specific lesson move rules inside React UI component files.

## Success Criteria
1. Public route `/learn` displays all lessons grouped with difficulty, title, estimated time, and progress status.
2. Clicking a lesson loads `/learn/:lessonId` with step-by-step interactive board, instructions, expected move validation, success feedback, and hint annotations.
3. Invalid moves instantly revert piece position and show feedback without advancing steps.
4. Correct moves update board state, trigger success state, and unlock/advance to the next step.
5. Hint button dynamically renders custom arrow/highlight annotations on `react-chessboard`.
6. Play vs Bot mode works seamlessly using the Strategy pattern (`ChessBot` -> `RandomBot`), supporting move validation, AI response execution, and game status detection (checkmate, draw, stalemate).
7. Progress is saved locally in `localStorage` so users can track completed lessons.

## Open Questions
- None. Requirements are clear.
