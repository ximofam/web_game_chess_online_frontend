# Spec: Realtime Minimized Room Widget

## Objective
Enable the `FloatingRoomWidget` to maintain a realtime WebSocket connection to the active room. This ensures that when users minimize a room and browse other pages (Home, Forums, Learn), the widget accurately reflects realtime changes such as player joins/leaves, game start events, or room deletion.

## Assumptions
1. We can reuse the `useRoomDetails` custom hook within `FloatingRoomWidget` to seamlessly manage socket events and data fetching.
2. `FloatingRoomWidget` and `RoomWaitingPage` are mutually exclusive in visibility (the widget hides itself if the route is `/room/:roomId`), preventing duplicate socket connection conflicts.
3. If the room is deleted while minimized, the widget should auto-dismiss and notify the user.

## Tech Stack
- React (Hooks: useEffect, useState)
- React Query (via `useRoomDetails`)
- Socket.io (via `useRoomDetails`)
- TailwindCSS & Lucide-react (UI)

## Commands
- Dev: `npm run dev`
- Lint: `npm run lint`

## Project Structure
- `src/features/rooms/components/FloatingRoomWidget.jsx`: Target UI component to be updated.
- `src/features/rooms/hooks/useRoomDetails.js`: Existing hook to be reused.

## Code Style
Keep changes minimal and declarative.
```jsx
// Instead of static state, use the hook for dynamic data:
const { room, isLoading, isError } = useRoomDetails(activeRoom?.roomId, {
  onRoomDeleted: () => {
    activeRoomManager.clearRoom();
    showToast('Phòng chơi đã bị giải tán.', 'info');
  }
});
```

## Testing Strategy
- **Manual Verification**: 
  1. Create a room.
  2. Minimize it (navigate to Dashboard).
  3. Have a second tab/user join the room.
  4. Verify the widget's player count updates from `1/2` to `2/2` instantly.
  5. Delete the room from the other tab; verify the widget disappears.

## Boundaries
- **Always**: Gracefully handle missing/deleted rooms by clearing the `activeRoomManager`.
- **Ask first**: Making changes to the backend socket logic.
- **Never**: Render the widget if the user is already actively on the `/room/:id` route.

## Success Criteria
- The minimized widget correctly displays realtime player counts (`white`, `black`).
- The widget vanishes automatically if `ROOM_DELETE` is emitted.
- No memory leaks or duplicated socket listeners when moving between routes.
