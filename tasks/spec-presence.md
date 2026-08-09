# Spec: Frontend Presence System

## Objective
Implement a global frontend Presence system using React Context that manages the current user's connection and game state (ONLINE, IN_ROOM, PLAYING, OFFLINE). It must utilize the existing STOMP WebSocket setup (`SocketContext`) for real-time updates and an initial REST API call for recovery. The system will prevent users from accidentally joining multiple rooms and provide a native feeling to the Lobby UI. 

## Tech Stack
- React 18
- Vite
- JSX (No TypeScript)
- React Router DOM v6
- Context API
- STOMP / SockJS (Existing `stompClientManager`)
- Axios (Existing API clients)

## Commands
- Build: `npm run build`
- Dev: `npm run dev`
- Lint: `npx eslint . --fix`

## Project Structure
```text
src/
  features/presence/
    context/
      PresenceContext.jsx     → Global presence state manager
    hooks/
      usePresence.js          → Hook to access own presence
      useUserPresence.js      → Reusable hook to track other users (opponents)
    services/
      presenceService.js      → REST API for initial state
  features/home/
    pages/
      Dashboard.jsx           → Will consume usePresence() to show CurrentRoomBanner or block joining
```

## Code Style
```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../auth/context/AuthContext';
import { useSocket } from '../../../shared/socket/useSocket';
import { getPresence } from '../services/presenceService';

// Ponytail YAGNI: Keep state minimal, no unnecessary re-renders.
export const PresenceContext = createContext(null);

export const PresenceProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { subscribe, connectionStatus } = useSocket();
  const [presence, setPresence] = useState({ status: 'OFFLINE', roomId: null, role: null });

  // ... effects for STOMP and REST fallback
};
```

## Testing Strategy
- **Manual Verification:** 
  1. Open Lobby, verify ONLINE.
  2. Simulate IN_ROOM / PLAYING state in backend, verify Lobby blocks joining and shows "Return" banner.
  3. Disconnect network, verify reconnect restores subscriptions without leaks.
  4. Opponent disconnects on Game page, verify subtle "offline" indicator appears.

## Boundaries
- **Always do:** 
  - Follow existing i18n rules (`useTranslation`).
  - Rely on `useSocket` for STOMP, do not create a new client.
  - Normalize backend status into a predictable shape.
- **Ask first:** 
  - Making changes to the backend API.
  - Redesigning the entire Lobby or Game UI.
- **Never do:** 
  - Introduce TypeScript.
  - Assume an OFFLINE presence means the game has ended (backend controls game logic).
  - Poll the REST endpoint repeatedly.

## Success Criteria
1. Initial presence is loaded correctly via REST.
2. STOMP subscription over `/topic/user.{userId}` updates context in real-time.
3. Lobby correctly hides/disables "Join" buttons and shows "Return to Room/Game" if status is `IN_ROOM` or `PLAYING`.
4. Opponent presence can be observed cleanly without duplicating WebSocket connections.
5. Reconnecting STOMP restores subscriptions.

## Open Questions
- Are there any specific existing UI components for "In Room" banners we should reuse, or should we build a minimalistic one inside `Dashboard.jsx`?
- Should `useUserPresence` also rely on REST for initial opponent state, or purely STOMP events? (Assuming REST + STOMP is safest).
