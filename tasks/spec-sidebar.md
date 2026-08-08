# Spec: Left Sidebar Navigation Refactor

## Objective
Refactor the current top horizontal `Navbar` into a modern, collapsible Left Sidebar navigation system. The sidebar will have two states (Expanded and Collapsed) and will persist across the application, freeing up vertical space while providing a platform-like experience. This change affects layout presentation only; existing routing, authentication, and logic will remain intact.

## Design Changes
1. **Layout Re-architecture**: Move from a vertical flow (`Navbar` -> `Main` -> `Footer`) to a horizontal split (`Sidebar` -> `Content Area (Main + Footer)`).
2. **Sidebar States**:
   - **Expanded (w-64 / 256px)**: Full logo, text labels for navigation items, full user profile display.
   - **Collapsed (w-16 / 64px)**: Minimal icon logo, icon-only navigation with tooltips, compact user avatar.
3. **Mobile Responsive**: On mobile devices (`md:` or `lg:` breakpoint), the sidebar will transform into a slide-out drawer triggered by a top-bar hamburger menu.
4. **Active State**: The active navigation link will be highlighted using existing design system tokens (e.g., `text-[#d4af37]` and background glows).

## Architecture Changes
- Rename/Refactor `src/shared/components/Navbar.jsx` to `src/shared/components/Sidebar/Sidebar.jsx`.
- Update `src/layouts/PublicLayout.jsx` and `src/layouts/ProtectedLayout.jsx` to wrap the `main` and `Footer` inside a scrollable content area, placing the `Sidebar` alongside it.
- State Persistence: Add local state (and possibly `localStorage`) to remember the user's preferred sidebar state (expanded vs. collapsed).

## Tech Stack
- React / React Router DOM
- Tailwind CSS for styling and transitions
- Lucide React for icons (reusing `Home`, `MessageSquare`, `BookOpen`, `Menu`, `X`, `ChevronLeft`, `ChevronRight`)

## Boundaries
- **Always do**: Preserve the exact routing paths and authentication checks. Maintain the visual distinction of the "Play as Guest" vs "Logged In User" flows. Keep the `FloatingRoomWidget` intact.
- **Ask first**: If removing any existing link or altering the `Footer`.
- **Never do**: Do not change any backend endpoints, WebSocket logic, or room mechanics.

## Testing Strategy
- Manual verification of routing for each link (Home, Learn, Forum).
- Manual verification of authentication dropdown/logout flow.
- Responsive testing (ensure mobile hamburger menu works, and desktop collapse/expand animation is smooth).
- Verify that pages dependent on `100vh` calculation (like `RoomPage`) do not break or scroll improperly.

## Implementation Tasks (Phase 3 Prep)
1. Implement `Sidebar.jsx` with internal `isExpanded` state and toggle behavior.
2. Implement `MobileTopBar.jsx` for mobile screens (hamburger menu).
3. Update `PublicLayout.jsx` and `ProtectedLayout.jsx` to utilize the new Sidebar and responsive layout.
4. Clean up `RoomPage` height calculations if the navbar height (`140px` offset) is no longer applicable.
