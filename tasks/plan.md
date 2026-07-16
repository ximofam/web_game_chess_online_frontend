# Implementation Plan: Chess Online Realtime Notifications

## Overview
We will implement a realtime notification bell and dropdown on the Navbar, a full `/notifications` list page, and a SockJS + STOMP connection inside `NotificationContext`. We'll configure Vite's dev server proxy to support Websocket connections, and write mock endpoints in `authClient.js` alongside a client-side mock WebSocket emitter for offline development mode.

---

## Architectural Decisions
- **WebSocket Transport**:
  - We will install `@stomp/stompjs` and `sockjs-client`.
  - Since `sockjs-client` references the `global` variable (which is undefined in browser environments built by Vite), we will add a small inline polyfill in `src/main.jsx` to define `window.global = window;` if missing. This is a very standard and reliable Vite compatibility fix.
- **WebSocket proxying**:
  - Update `vite.config.js` proxy settings to capture `/ws` and proxy them as a WebSocket connection:
  ```javascript
  '/ws': {
    target: 'http://localhost:8080',
    ws: true,
    changeOrigin: true
  }
  ```
- **Connection Lifecycle Management**:
  - The connection will start when `isAuthenticated === true` and the Access Token is loaded, and will terminate immediately upon user logout or token expiry.
  - The client will automatically attempt reconnection with a 5000ms delay.
- **Notification Navigation**:
  - Clicking a notification will mark it as read, decrease the badge count, and navigate dynamically:
    - `POST_LIKE` -> `/posts/{metadata.postId}`
    - Defaults/Other types -> `/notifications` or stay on page.

---

## Implementation Order
1. **Package Installation**: Run `yarn add @stomp/stompjs sockjs-client`.
2. **Global Polyfill**: Inject `window.global = window` in `src/main.jsx`.
3. **Vite configuration**: Add `/ws` WebSocket proxy rule in `vite.config.js`.
4. **Mock API Interceptors**: Add mock intercepts in `authClient.js`.
5. **Notification Services & Schema**: Write API methods in `notificationService.js`.
6. **NotificationContext & STOMP connection**: Assemble `NotificationContext.jsx` with connection states, triggers, and mock connection generator.
7. **Navbar Bell components**: Create `NotificationBell`, `NotificationBadge`, and `NotificationDropdown`.
8. **Notifications Page**: Create `NotificationsPage.jsx` with paginated listings.
9. **Routing Integration**: Map `/notifications` protected route in `App.jsx` and insert the Bell component in `Navbar.jsx`.
10. **Polish & Verification**: Build checks, accessibility checks, and disconnect verification.

---

## Verification Checkpoints

### Checkpoint 1: WebSocket Connection & Mocks
- Stomp and SockJS libraries are installed.
- Proxy endpoints capture WebSocket handshakes without connection errors.
- Mock interval generator pushes new random notifications at intervals when `VITE_USE_MOCK_API === 'true'`.

### Checkpoint 2: Navbar Badge & Dropdown
- Unread badge shows correct count.
- Notification dropdown shows newest items first, unread highlighted.
- Clicks trigger "Mark as read" and decrement count.
- Dismiss handles Escape key and outside clicks.

### Checkpoint 3: Notifications Page
- Page `/notifications` displays paginated listings with "Load More" controls.
- "Delete" and "Mark all as read" update states globally.
- Logout disconnects socket client.
