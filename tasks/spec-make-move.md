# Spec: Chess Gameplay Frontend Implementation

## Objective
Implement the core gameplay loop for the room feature (Make Move, MOVE_MADE event, GAME_OVER event) over WebSocket/STOMP. The frontend will allow users to drag/click pieces to submit moves, listen to the authoritative server events, and update the board, timers, and game status without optimistically committing the board state.

## Tech Stack
- React
- chess.js (local move validation and UCI generation)
- react-chessboard (UI)
- STOMP/SockJS (via `useSocket`)
- React Query (room state management)

## Commands
- Build: `npm run build`
- Test: `npm test`
- Lint: `npx eslint .`
- Dev: `npm run dev`

## Project Structure
- `src/features/rooms/components/ChessGameUI.jsx` → Handles board interaction and STOMP sending.
- `src/features/rooms/hooks/useRoomDetails.js` → Handles incoming STOMP events.
- `src/features/rooms/pages/RoomPage.jsx` → Contains the main room logic and modal rendering.
- `tasks/` → Stores spec and plans.

## Code Style
```jsx
// Use existing hooks and destructure appropriately
const { send } = useSocket();

// UCI conversion
const onPieceDrop = (sourceSquare, targetSquare) => {
  if (gameData.turn !== playerColor) return false;
  try {
    const move = chess.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (move) {
      send(`/app/room.${roomId}.move`, { move: move.from + move.to + (move.promotion || '') });
      // Do not update FEN yet. Wait for MOVE_MADE.
      return true; // react-chessboard will temporarily show it, but we revert if no event.
    }
  } catch (e) {
    return false;
  }
}
```

## Testing Strategy
- Manual verification covering the 8 scenarios specified (White move, Black move, Wrong turn, Spectator, Checkmate, Timeout, Draw, Refresh).
- ESLint to verify code formatting.

## Boundaries
- Always: Rely on `newFen` from `MOVE_MADE` as the source of truth. Stop local timers upon `GAME_OVER`. Use UCI format for move payload.
- Ask first: Changing existing websocket abstractions or creating new states.
- Never: Optimistically commit board state before server response. Rename existing state fields if they already exist. Dispatch fake timeout events from frontend.

## Success Criteria
- User can send a move via drag and drop or clicking, converting to UCI format.
- Moves are sent to `/app/room.{roomId}.move` via STOMP.
- `MOVE_MADE` event correctly updates `fen`, `turn`, and clocks.
- `GAME_OVER` event correctly stops clocks, displays the winner and reason, and disables the board.
- Invalid interactions (spectator, not turn) are disabled on the client side.

## Open Questions
- None.
