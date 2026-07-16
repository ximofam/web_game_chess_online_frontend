# Spec: User Menu & Realtime Notifications

## Objective
Build a premium, highly responsive user avatar menu and a realtime notification system for authenticated chess players. This covers profile display, editing profile details, avatar uploads, a notification bell dropdown, a paginated notification history view, and WebSocket connection (STOMP protocol) to receive realtime notifications from the server.

## Tech Stack
- **Framework**: React 19, Vite, Tailwind CSS v4 (with `@tailwindcss/vite` plugin).
- **Icons**: `lucide-react` for premium typography icons.
- **Routing**: `react-router-dom` v7.
- **Data Fetching**: `@tanstack/react-query` and `axios` (utilizing existing `authClient.js`).
- **Form Validation**: `react-hook-form` + `zod` for the edit profile form.
- **Realtime Connection**: Custom lightweight, zero-dependency STOMP client over native WebSocket.

---

## Commands
- **Dev Server**: `npm run dev`
- **Build Production**: `npm run build`
- **Lint**: `npm run lint`

---

## Project Structure
We will organize code cleanly using the existing structure:
```
src/
├── features/
│   ├── auth/
│   │   ├── api/authClient.js        → Intercepts 401s, handles token memory & mock API
│   │   ├── context/AuthContext.jsx  → Updated to hold user profile & refresh handlers
│   │   └── services/authService.js  → Updated to query user details
│   ├── notifications/                → NEW Feature folder
│   │   ├── api/                     → WebSocket and HTTP client functions
│   │   │   └── wsClient.js          → Zero-dependency STOMP client
│   │   ├── components/              → Notification bell, badge, dropdown, items
│   │   ├── context/                 → NotificationContext for global ws & notification state
│   │   ├── pages/                   → NotificationsPage (/notifications)
│   │   └── services/                → notificationService.js
│   ├── profile/                      → NEW Feature folder
│   │   ├── components/              → Editable details, upload progress indicators
│   │   ├── pages/                   → ProfilePage (/profile)
│   │   └── services/                → profileService.js
│   └── home/
│       └── components/
│           └── Navbar.jsx           → Reusable navbar containing Logo, Bell, Avatar Dropdown
tests/                               → Future test files
```

---

## Code Style
We follow clean React 19 functional component design patterns using Tailwind CSS v4 utility classes.
Example component styling (matching the existing gold and dark chess theme):

```jsx
import React from 'react';
import { User } from 'lucide-react';

export const UserAvatar = ({ src, username, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-20 h-20 text-lg',
  }[size];

  if (src) {
    return (
      <img
        src={src}
        alt={`${username}'s avatar`}
        className={`${sizeClasses} rounded-full object-cover border border-[#d4af37]/60`}
      />
    );
  }

  const initial = username ? username.charAt(0).toUpperCase() : 'P';
  return (
    <div
      className={`${sizeClasses} rounded-full border border-[#d4af37]/60 bg-[#1a1d24] text-[#d4af37] flex items-center justify-center font-bold`}
      aria-label={`${username}'s default avatar`}
    >
      {initial}
    </div>
  );
};
```

---

## Testing Strategy
- **Manual Verification**: Interactive client tests using simulated API delays and mock websocket triggers.
- **Mock Services**: Interceptor mock endpoints inside `authClient.js` simulation for:
  - `GET /api/users/me`
  - `PATCH /api/users/me`
  - `PATCH /api/users/me/avatar`
  - `GET /api/notifications`
  - `GET /api/notifications/unread-count`
  - `PATCH /api/notifications/{id}/read`
  - `PATCH /api/notifications/read-all`
  - `DELETE /api/notifications/{id}`
  - `DELETE /api/notifications`
- **Realtime WebSocket Mocking**: A browser-side mock server or custom internal mock connection that triggers fake server notifications (e.g. `POST_LIKE`, `ROOM_INVITE`) at regular intervals in development/demo mode to test UI responsiveness and sound/toast effects.

---

## Boundaries
- **Always**: Keep styles responsive, accessible (with ARIA tags and `role` indicators), and aligned with the dark chess theme.
- **Ask First**: Adding heavy client libraries like `@stomp/stompjs` or `sockjs-client` if the zero-dependency STOMP client does not meet integration constraints.
- **Never**: Commit secrets or credentials; remove standard error notifications.

---

## Success Criteria
- [ ] User details (`fullName`, `gender`, `dateOfBirth`, `avatar`) display in Profile page and nav menu, and persist when updated.
- [ ] Avatar image uploads show immediate feedback and refresh the image everywhere (navbar, profile, lists).
- [ ] Notification bell dynamically updates unread counts.
- [ ] WebSocket reconnects automatically and updates the dropdown and toast alerts in real time.
- [ ] Keyboard accessibility is complete (press Escape or click outside to dismiss menus).

---

## Open Questions
1. Do you need us to use standard `@stomp/stompjs` and `sockjs-client` npm dependencies, or is a lightweight, clean, native WebSocket-based STOMP implementation preferred?
2. What are the fallback genders and date-of-birth formats for input validation? (e.g., standard YYYY-MM-DD picker, selection dropdown for gender)
3. Should a default alert sound play on incoming notifications?
