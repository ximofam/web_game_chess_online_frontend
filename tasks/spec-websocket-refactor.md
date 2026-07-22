# Spec: WebSocket / STOMP Architecture Refactoring

## Assumptions
1. **Single Connection**: Only one STOMP/WebSocket connection (or mock connection in dev mode with mock enabled) per user session.
2. **Provider Order**: `SocketProvider` will sit inside `AuthProvider` and wrap `NotificationProvider` and the rest of the app in `App.jsx`.
3. **STOMP & SockJS**: `@stomp/stompjs` and `sockjs-client` remain the core protocols and transport drivers for real backend communication.
4. **Mock Support**: In DEV mode with `VITE_USE_MOCK_API === 'true'`, `mockSocket` will simulate websocket pushes seamlessly through the same `SocketProvider` interface.

## Objective
Refactor the current WebSocket / STOMP implementation from `NotificationProvider` (which violates Single Responsibility Principle) into a scalable, feature-based architecture with a unified `SocketProvider` and feature-specific socket adapters (`notificationSocket`, `chatSocket`, `gameSocket`, `presenceSocket`).

## Tech Stack
- React 19 (Functional Components, Hooks)
- `@stomp/stompjs` (v7.3.0)
- `sockjs-client` (v1.6.1)
- React Context & Custom Hooks

## Commands
- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`

## Project Structure
```
src/
  socket/
    stompClient.js       # Low-level STOMP & WS connection manager & listener registry
    mockSocket.js        # Standalone mock WebSocket generator for dev mode
    SocketProvider.jsx   # Context provider managing life-cycle & exposing socket API
    useSocket.js         # Custom hook to consume SocketContext
  features/
    notifications/
      socket/
        notificationSocket.js # Feature socket adapter for notifications (notification:new, etc.)
      context/
        NotificationContext.jsx # Pure notification state & REST management
      ...
    chat/
      socket/
        chatSocket.js        # Feature socket adapter for chat (chat:new-message, chat:typing)
    game/
      socket/
        gameSocket.js        # Feature socket adapter for game (game:move, game:join, game:resign)
    presence/
      socket/
        presenceSocket.js    # Feature socket adapter for presence (presence:update, presence:heartbeat)
```

## Code Style
- Clean JavaScript with ES6+ syntax.
- Strict event namespacing: `domain:action` (e.g., `notification:new`, `chat:new-message`, `game:move`, `presence:update`).
- Explicit cleanup in `useEffect` for all subscriptions to avoid memory leaks or duplicate listeners.

## Testing Strategy & Verification
- Unit & integration verification via `npm run build` and runtime browser execution.
- Verification that `NotificationProvider` no longer imports `@stomp/stompjs` or `sockjs-client`.

## Boundaries
- **Always do**: Clean up socket listeners on component unmount; maintain backwards compatibility for existing `useNotifications()` hook consumers.
- **Ask first**: Major API changes to REST endpoints or authentication flow.
- **Never do**: Open multiple WebSocket instances per application session; embed feature logic (e.g., toast alerts or notification state) inside `SocketProvider` or `stompClient.js`.

## Success Criteria
1. Single STOMP/WebSocket client instance managed via `SocketProvider`.
2. `NotificationProvider` delegates all real-time events to `notificationSocket.js` / `useSocket`.
3. Feature socket files created for `notification`, `chat`, `game`, `presence` with namespaced events.
4. Mock WebSocket logic isolated in `src/socket/mockSocket.js`.
5. No memory leaks or duplicated event handlers on remount.
6. `npm run build` completes cleanly without errors.
