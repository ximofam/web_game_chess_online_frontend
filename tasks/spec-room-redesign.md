# Spec: Chess Room Lobby & Game UI Redesign

## Objective
Improve the UI/UX, layout, hierarchy, and responsiveness of the "Room Lobby" (Waiting Room) and "Game In Progress" screens. The redesign aims to reduce visual clutter, create a more professional dashboard-like interface, center the chessboard as the primary focal point during games, and improve responsive behavior. All existing business logic, WS events, and features will remain untouched.

## Tech Stack
- React / React Router DOM
- Tailwind CSS
- lucide-react (icons)
- Existing custom hooks and contexts (Auth, Socket)

## Commands
```bash
Build: npm run build
Lint: npx eslint src/features/rooms
Dev: npm run dev
```

## Project Structure
The components to be modified are located in `src/features/rooms/components/` and `src/features/rooms/pages/`:
- `RoomPage.jsx` - Parent container, layout boundary adjustments.
- `RoomWaiting.jsx` - Lobby layout restructuring.
- `RoomSeats.jsx` - Refactor player cards into a compact "PLAYER MATCH" display.
- `RoomPlaying.jsx` - Game layout restructuring.
- `ChessGameUI.jsx` - Integrates player info closer to the board, improves clock UI.
- `ChessGameSidebar.jsx` - Move history redesign (compact, secondary action).
- `RoomChat.jsx` & `RoomSpectators.jsx` - Visual cleanups and compact empty states.

## Code Style
- Use Tailwind for spacing scale (4, 8, 12, 16, 24, 32px).
- Minimize deeply nested cards and excessive borders. Use section headers instead of boxed cards where appropriate.
```jsx
// Example of cleaner section header without heavy wrapping cards
<div className="flex flex-col h-full">
  <h3 className="text-sm font-semibold text-[#f3f4f6] mb-3 uppercase tracking-wider">
    Spectators <span className="text-[#9ca3af] ml-2">{count}</span>
  </h3>
  {/* Content */}
</div>
```

## Testing Strategy
- **Manual Visual QA:** Verify layouts at Desktop (>=1280px), Tablet (768px-1279px), and Mobile (<768px).
- **Functional Check:** Ensure ready/leave, chat input, move mechanics, timers, and modals still function exactly as before.
- **Empty States Check:** Ensure 0 spectators and empty chats render compactly.

## Boundaries
- **Always do:** Use existing Tailwind theme colors (Dark backgrounds, gold/yellow for actions, red for destructive/low time).
- **Ask first:** If a UI change requires altering the props interface of deeply integrated components (like `ChessGameUI`).
- **Never do:** Modify `useSocket`, game logic (`chess.js`), timer countdown logic, or `react-chessboard` behavior (drag/drop rules). Do not change the overall sidebar layout created previously.

## Success Criteria
1. **Lobby:** Player match section is compact, White vs Black is clear, "Ready" dominates "Leave", chat is usable, and empty states don't waste space.
2. **Game Screen:** Chessboard is the focal point and uses viewport efficiently. Player info (Avatar, Elo, Active Clock) is directly above/below the board. Move history and Chat are cleanly separated, scroll independently, and do not force a page-level scroll on desktop.
3. **Responsiveness:** Single column on mobile. Logical grid on tablet/desktop.

## Open Questions
- Is there any specific existing UI component (like standard Buttons or Inputs in `src/shared`) that we MUST use instead of inline Tailwind elements, or is inline Tailwind for standardizing them acceptable for this refactor?
