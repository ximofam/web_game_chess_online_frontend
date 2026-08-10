# VieChess Frontend Architecture

This document provides a high-level overview of the frontend architecture for the **VieChess** web application. 

## 1. High-Level Overview

**VieChess** is a Single Page Application (SPA) built with modern frontend tools to deliver a real-time, interactive online chess platform. It utilizes a **Feature-Driven Architecture** (similar to Feature-Sliced Design) to cleanly separate concerns and group related domain logic, making the codebase scalable and maintainable.

### Key Technology Stack:
- **Core:** React 19, Vite
- **Routing:** React Router v7
- **State & Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **Forms & Validation:** React Hook Form, Zod
- **Real-Time Communication:** SockJS Client, STOMPjs (WebSocket)
- **Chess Engine & Board:** `chess.js` (logic), `react-chessboard` (UI), `stockfish.js` (bot integration)
- **Rich Text Editing:** Tiptap Editor
- **Internationalization (i18n):** `i18next`, `react-i18next`

---

## 2. Directory Structure

The project is structured entirely inside the `src/` directory, broken down by distinct functional roles:

```text
src/
├── assets/        # Static assets such as images and global stylesheets
├── features/      # Domain-specific modules (The core of the application)
├── i18n/          # Internationalization configuration and locales
├── layouts/       # Global page layout wrappers (e.g., PublicLayout, ProtectedLayout)
├── shared/        # Reusable, domain-agnostic UI and logic
├── App.jsx        # Root application setup (Routing and global Context Providers)
└── main.jsx       # Application entry point
```

### 2.1 The `features/` Directory
All major functionality is decoupled into isolated "features." Each feature directory contains its own components, context, pages, API services, and validation logic.

- **`auth/`**: Authentication flow (Login, Register), Auth Context, and session management.
- **`forum/`**: Community forum pages, discussion threads, and Tiptap rich-text editor integration.
- **`home/`**: Public Landing page and authenticated Dashboard.
- **`learn/`**: Chess tutorials, lessons, and the "Play Bot" engine (Stockfish) integration.
- **`notifications/`**: Real-time push notification handling and inbox UI.
- **`presence/`**: User online/offline status tracking logic.
- **`profile/`**: User profile management and match history.
- **`rooms/`**: The core real-time chess gameplay room (WebSockets, `react-chessboard`, game state).

*Typical internal structure of a feature:*
```text
features/[feature-name]/
├── api/           # API endpoints and TanStack query hooks specific to this feature
├── components/    # UI components isolated to this feature
├── context/       # React Contexts specific to this domain
├── pages/         # Page-level components used by React Router
├── services/      # Business logic and complex client-side routines
└── validation/    # Zod schemas for forms in this feature
```

### 2.2 The `shared/` Directory
This directory holds generic code used across multiple features to prevent duplication.

- **`components/`**: Reusable UI elements (e.g., `Sidebar`, `Footer`, `LanguageSwitcher`).
- **`errors/`**: Global error handling, Error Boundaries, and fallback pages (`404 NotFound`, `403 Forbidden`).
- **`socket/`**: Central WebSocket connection configuration and global providers (`SocketProvider`).
- **`utils/`**: Generic utility functions (e.g., time formatting, calculation helpers).

### 2.3 `layouts/`
Layout components act as shells for the application routing:
- **`PublicLayout`**: Renders the Sidebar/Footer for general, accessible pages.
- **`ProtectedLayout`**: Enforces authentication; prevents unauthenticated users from accessing private routes (e.g., Profile, Forum Creation).

---

## 3. Data Flow & State Management

1. **Server State (TanStack Query):** 
   - HTTP requests are primarily handled via `axios` and managed globally by `QueryClient`. 
   - `react-query` handles caching, background fetching, and optimistic updates.
2. **Local / UI State:**
   - Handled natively via React Hooks (`useState`, `useReducer`).
   - Form state is managed cleanly using `react-hook-form`.
3. **Global / Context State:**
   - Used sparingly for true global needs: Authentication State (`AuthContext`), WebSocket connection instances (`SocketProvider`), UI Notifications (`NotificationContext`), and User Presence (`PresenceContext`).
4. **Real-Time Data:**
   - `STOMPjs` over `SockJS` connects to the Spring Boot backend. Real-time game moves, presence updates, and instant notifications are dispatched via WS and update the React local state or trigger a TanStack Query invalidation.

---

## 4. Internationalization (i18n)

The application fully supports multi-language configurations (English `en` and Vietnamese `vi`).
- Handled by `react-i18next`.
- Configuration and locale JSON files reside in `src/i18n/`.
- **Golden Rule:** No hardcoded text in UI. All strings map to `t('namespace:key')`.

---

## 5. Development & Deployment Configuration

- **Development Server (`vite.config.js`):** Configured to proxy HTTP requests (`/api`) and WebSocket connections (`/ws`) to `localhost:8080` (Spring Boot backend) during local development to avoid CORS issues.
- **Environment Variables:** Handled via `.env` files (`VITE_API_URL`, `VITE_WS_URL`, etc.).
- **Linting:** Enforced via `eslint.config.js` to ensure consistent code styling across React and React Hooks logic.
