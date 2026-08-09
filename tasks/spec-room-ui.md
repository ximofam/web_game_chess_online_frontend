# Spec: Room UI Refactor

## Objective
Refactor the Room Lobby and Game Screen UI to be professional, compact, and chessboard-focused without changing any business logic.

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npm run lint`

## Project Structure
- `src/features/rooms/components/`: Contains RoomUI components.
- `src/features/rooms/pages/`: Contains RoomPage container.

## Code Style
- Reuse Tailwind CSS utilities. Minimal nesting. Clean hierarchy.

## Testing Strategy
- Manual verification of UI states (Lobby/Game/Responsive).

## Boundaries
- Always: Preserve existing websocket, timer, game, and room logic.
- Ask first: Changing any state management structure.
- Never: Touch backend API contracts or add UI libraries.
