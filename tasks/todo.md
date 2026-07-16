# Todo: Chess Online Realtime Notifications

- [ ] **Task 1: Install STOMP and SockJS & Polyfill setup**
  - **Description:** Install `@stomp/stompjs` and `sockjs-client` packages. Inject `window.global = window;` at the top of `main.jsx` to avoid Vite SockJS bundler errors.
  - **Acceptance:** Dependencies are added and the build completes cleanly.
  - **Verify:** Run `yarn build` after installation.
  - **Files:** `package.json`, `yarn.lock`, `src/main.jsx`
  - **Estimated scope:** Small

- [ ] **Task 2: Configure Vite Server Proxy for WebSocket Connection**
  - **Description:** Update `vite.config.js` to add proxying support for `/ws` with `ws: true` targeting the backend at `http://localhost:8080`.
  - **Acceptance:** Proxy rule routes ws traffic correctly.
  - **Verify:** Inspect dev server proxy configurations.
  - **Files:** `vite.config.js`
  - **Estimated scope:** Small

- [ ] **Task 3: Implement Mock Notification API Endpoints**
  - **Description:** Implement Axios mock interceptors inside `authClient.js` for GET/PATCH/DELETE notifications and unread-count, keeping mock database states in sync.
  - **Acceptance:** Mock requests respond with expected JSON payloads.
  - **Verify:** Inspect mock API calls outcomes.
  - **Files:** `src/features/auth/api/authClient.js`
  - **Estimated scope:** Medium

- [ ] **Task 4: Create Notification Services**
  - **Description:** Create `notificationService.js` to hold API calls for notification queries, read updates, and deletion requests.
  - **Acceptance:** HTTP services wrapper methods map correctly to Axios client calls.
  - **Verify:** Inspect service query exports.
  - **Files:** `src/features/notifications/services/notificationService.js`
  - **Estimated scope:** Small

- [ ] **Task 5: Implement NotificationContext with STOMP & Mock Emitter**
  - **Description:** Create `NotificationContext` that initiates WebSocket/STOMP connection on login, subscribes, updates unread list/count, and closes socket on logout. Inject mock WebSocket interval emitter in dev mode.
  - **Acceptance:** Socket connection lifecycles align with login state. Updates trigger toasts and updates state.
  - **Verify:** Verify connection connection and mock message reception.
  - **Files:** `src/features/notifications/context/NotificationContext.jsx`
  - **Estimated scope:** Large

- [ ] **Task 6: Create Navbar Bell, Badge and Dropdown Components**
  - **Description:** Build `NotificationBell`, `NotificationBadge`, `NotificationDropdown`, and `NotificationItem`. Hook these into `Navbar.jsx` with keyboard ESC and outside click listeners.
  - **Acceptance:** Navbar displays bell with unread badge. Dropdown lists items, actions work, and menu closes cleanly.
  - **Verify:** Toggle menu, trigger actions, test ESC key.
  - **Files:** `src/features/notifications/components/NotificationBell.jsx`, `src/features/notifications/components/NotificationBadge.jsx`, `src/features/notifications/components/NotificationDropdown.jsx`, `src/features/notifications/components/NotificationItem.jsx`, `src/features/home/components/Navbar.jsx`
  - **Estimated scope:** Large

- [ ] **Task 7: Build Notifications Page with Pagination**
  - **Description:** Create `NotificationsPage.jsx` at `/notifications` with paginated lists, load-more controls, clear all, mark all read, loading skeletons, and empty states. Wire `/notifications` route under `ProtectedLayout` in `App.jsx`.
  - **Acceptance:** Notifications page manages listings correctly, redirects unauthenticated players, and performs actions.
  - **Verify:** Navigate to `/notifications`, inspect listings and paging actions.
  - **Files:** `src/features/notifications/pages/NotificationsPage.jsx`, `src/App.jsx`
  - **Estimated scope:** Medium

- [ ] **Task 8: Final Review & Auditing**
  - **Description:** Review responsive layouts, audit keyboard accessibility, test cleanup on logout, and check final production build.
  - **Acceptance:** Build is clean, no websocket leaks, styling matches premium chess dark theme.
  - **Verify:** Run `yarn build`.
  - **Files:** All modified files
  - **Estimated scope:** Small
