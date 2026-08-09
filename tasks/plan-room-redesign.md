# Implementation Plan: Chess Room Lobby & Game UI Redesign

## Overview
Redesign the "Room Lobby" and "Game In Progress" UI to improve information density, visual hierarchy, spacing, and responsiveness, making the chessboard the central focal point of the application. No business logic or existing backend events will be altered.

## Architecture Decisions
- **Grid Layout Strategy:** We will utilize CSS Grid heavily to manage the responsive layout without breaking constraints. Mobile will stack linearly (`flex-col`), Tablet/Desktop will split appropriately based on available viewport space.
- **Component Isolation:** Small UI details (like Chat bubbles, Spectator list) will be updated internally in their respective components to avoid mutating parent layouts unless necessary.
- **Clock Sizing:** The `CountdownOverlay` logic remains, but we will visually tie the timer closer to the player's avatar in `ChessGameUI.jsx`.

## Task List

### Phase 1: Lobby Refactor
- [ ] Task 1: Redesign `RoomSeats.jsx` (Player Match display, primary "Ready" / secondary "Leave").
- [ ] Task 2: Redesign `RoomSpectators.jsx` (Compact list, elegant empty state).
- [ ] Task 3: Redesign `RoomChat.jsx` (Differentiate own vs opponent messages, independent scroll).
- [ ] Task 4: Restructure `RoomWaiting.jsx` layout (2-column layout for Desktop).

### Phase 2: Game Screen Refactor
- [ ] Task 5: Redesign `ChessGameUI.jsx` (Integrate player info and active clock above/below chessboard).
- [ ] Task 6: Redesign `ChessGameSidebar.jsx` (Compact Move History, secondary export action).
- [ ] Task 7: Restructure `RoomPlaying.jsx` layout (Center chessboard, smart side panels).

### Checkpoint: Complete Refactor
- [ ] Test layout on Mobile (<768px), Tablet (768px-1279px), and Desktop (>=1280px).
- [ ] Ensure all socket events and game actions continue functioning correctly.
- [ ] Lint and build the project.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Layout shift breaking on small heights | Medium | Test extensively with minimum height settings and rely on `overflow-y-auto` internal components. |
| Overwriting existing WS/Timer logic | High | Carefully preserve all React hooks and `useEffect` blocks within the components. Only edit JSX classes and structure. |

## Open Questions
- None.
