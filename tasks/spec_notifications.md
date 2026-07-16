# Spec: Realtime Notifications

## Objective
Build a robust, premium realtime notification system for authenticated players in the Chess Arena. This includes an unread notification badge on the Navbar, a popover dropdown list showing recent notifications, a full `/notifications` history page with pagination/infinite scroll, and active WebSocket synchronization using STOMP and SockJS.

## Tech Stack
- **Framework**: React 19, Vite, Tailwind CSS v4.
- **Routing**: `react-router-dom` v7.
- **Libraries**:
  - `@stomp/stompjs` v7+
  - `sockjs-client` v1.6+
  - `lucide-react` for brand and action icons.

---

## Commands
- **Install Dependencies**: `yarn add @stomp/stompjs sockjs-client`
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`

---

## Project Structure
All notification assets will live under `src/features/notifications`:
```
src/features/notifications/
├── api/
│   └── notificationApi.js        → HTTP query wrappers
├── components/
│   ├── NotificationBadge.jsx     → Unread notification count badge
│   ├── NotificationBell.jsx      → Navigation bar bell trigger
│   ├── NotificationDropdown.jsx  → Popover listing recent notifications
│   ├── NotificationItem.jsx      → Single notification row component
│   ├── NotificationList.jsx      → List view container
│   ├── LoadingSkeleton.jsx       → Shimmer loaders for lists
│   └── EmptyState.jsx            → Clear message for no notifications
├── context/
│   └── NotificationContext.jsx   → Handles REST requests and STOMP WebSocket states
├── pages/
│   └── NotificationsPage.jsx     → Infinite scroll/pagination history page
├── services/
│   └── notificationService.js    → REST mapping services
└── websocket/
    └── stompClient.js            → WebSocket connection wrapper
```

---

## API Design

### 1. Get Paginated Notifications
- **Endpoint**: `GET /api/notifications?page=0&size=20`
- **Response**:
```json
{
  "content": [
    {
      "id": 10,
      "sender": {
        "id": 2,
        "username": "john",
        "avatarUrl": "https://..."
      },
      "type": "POST_LIKE",
      "title": "New Like",
      "message": "John liked your post.",
      "metadata": {
        "postId": 42
      },
      "createdAt": "2026-07-17T01:05:48",
      "read": false
    }
  ]
}
```

### 2. Get Unread Count
- **Endpoint**: `GET /api/notifications/unread-count`
- **Response**:
```json
{
  "count": 5
}
```

### 3. Mark Notification as Read
- **Endpoint**: `PATCH /api/notifications/{id}/read`
- **Response**: `204 No Content`

### 4. Mark All Notifications as Read
- **Endpoint**: `PATCH /api/notifications/read-all`
- **Response**: `204 No Content`

### 5. Delete Notification
- **Endpoint**: `DELETE /api/notifications/{id}`
- **Response**: `204 No Content`

### 6. Delete All Notifications
- **Endpoint**: `DELETE /api/notifications`
- **Response**: `204 No Content`

---

## WebSocket & STOMP Configuration
- **Connection Endpoint**: `/ws` (using SockJS transport).
- **Subscribe Destination**: `/user/queue/notifications`
- **Auth Transmission**: Access Token is sent in connection headers:
```javascript
{
  Authorization: `Bearer ${accessToken}`
}
```
- **Connection Parameters**:
  - Heartbeat: Send/Receive every 10,000ms.
  - Reconnect Delay: Automatic retry every 5,000ms.

---

## Realtime Integration Workflow
1. When a notification arrives via WebSocket:
   - Prepend payload to notification list state.
   - Increment `unreadCount` badge state.
   - Show temporary Success Toast displaying message text.
   - Animate the Navbar Bell icon.
2. Clicking a notification:
   - Sends a read request to the backend.
   - Decodes `type` and navigates user:
     - `POST_LIKE` -> `/posts/{metadata.postId}`
     - Other types (`COMMENT`, `FOLLOW`, `ROOM_INVITE`, `SYSTEM`) will resolve to contextual pages or default routes.

---

## Code Style
Functional hooks managing connection states with `@stomp/stompjs`. Example client configuration:

```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const createStompClient = ({ token, onConnect, onDisconnect, onMessage }) => {
  const socketUrl = `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.host}/ws`;
  
  const client = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    reconnectDelay: 5000,
    onConnect: (frame) => {
      onConnect(client, frame);
    },
    onDisconnect: () => {
      onDisconnect();
    },
    onStompError: (frame) => {
      console.error('STOMP protocol error:', frame);
    }
  });

  return client;
};
```

---

## Testing & Mocking Strategy
- **Mock REST Endpoints**: Expand [authClient.js](file:///home/ximofam/MyCodes/DoAnNganhOUCS2302/frontend/my-react-app/src/features/auth/api/authClient.js) to store an array of notifications in-memory, handling filtering, updates, and deletes.
- **Mock WebSocket Service**: When `VITE_USE_MOCK_API === 'true'`, instead of loading SockJS, we will start a mock interval generator inside `NotificationContext.jsx` that periodically dispatches a new random notification payload to the subscription listeners, simulating real-time activity.

---

## Boundaries
- **Always**: Disconnect active client sockets when the user logs out or the token expires.
- **Ask First**: Modifying standard Spring destination queues.
- **Never**: Leave reconnect loops running after Component unmounts.

---

## Success Criteria
- [ ] Badge count dynamically reflects actual unread items in the database.
- [ ] New notifications arrive in realtime and update lists/dropdowns instantly.
- [ ] Clicking dropdown items navigates to related entities (e.g. `/posts/42`).
- [ ] Mark All and Clear All clear active counts.
- [ ] Clean infinite scroll pagination on `/notifications`.
- [ ] WebSocket reconnects automatically if the server connection breaks.
