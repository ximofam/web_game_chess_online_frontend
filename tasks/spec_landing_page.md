# Spec: Landing Page & Unauthenticated Access Routing

## Objective
Replace the `GuestChoiceModal` auto-popup with a dedicated Landing Page as the default route for unauthenticated visitors. 

Specifically:
- Non-logged-in users visiting `/` or `/landing` will see a modern, high-aesthetic Landing Page explaining the Chess Arena platform.
- Unauthenticated Navbar will feature:
  1. GitHub Logo button (linking to the GitHub repository)
  2. "Play as Guest" button (executes `loginGuest()` and redirects to `/dashboard`)
  3. "Login" button (navigates to `/login`)
  4. "Register" button (navigates to `/register`)
  5. "Forum" link (navigates to `/forum`, accessible publicly)
- When a user logs out, they are redirected to the Landing Page (`/`).
- `GuestChoiceModal` auto-popup on unauthenticated init/logout is removed.

## Tech Stack
- React 19 + Vite 8
- TailwindCSS v4 + Custom Chess Theme (`#0d0e12`, `#13161c`, `#1a1d24`, `#d4af37`)
- React Router DOM v7
- Lucide React Icons (`Github`, `UserCheck`, `LogIn`, `UserPlus`, `MessageSquare`, `Trophy`)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Structure
```
src/
  features/
    landing/
      pages/
        LandingPage.jsx      # Main Intro/Landing Page for unauthenticated users
      components/
        HeroSection.jsx      # Championship hero banner & CTA
        FeaturesSection.jsx  # Live Blitz, Tournaments, Strategy Forum features
    home/
      components/
        Navbar.jsx           # Updated with GitHub link, Guest, Login, Register, Forum CTAs
    auth/
      context/
        AuthContext.jsx      # Remove GuestChoiceModal auto-open trigger on logout/init
```

## Code Style
- Clean functional React components using hooks.
- Semantic HTML tags (`<main>`, `<header>`, `<section>`, `<article>`, `<nav>`).
- Tailwind v4 classes using gold accents (`#d4af37`) and dark chess aesthetic (`#0d0e12`).

## Testing Strategy
- Manual verification via browser build (`npm run build`).
- Verify unauthenticated visitor flow, Guest login flow, Registered user login flow, and Logout redirect flow.

## Boundaries
- **Always:** Use active voice in UI text, maintain accessible contrast ratios, preserve existing auth token management (`authClient.js`).
- **Ask first:** Modifying backend API endpoints or database schemas.
- **Never:** Hardcode sensitive tokens or bypass authentication on protected routes (`/profile`, `/notifications`, `/forum/create`).

## Success Criteria
1. Visiting `/` when unauthenticated renders `LandingPage` without showing `GuestChoiceModal`.
2. Unauthenticated Navbar displays GitHub icon link, "Play as Guest", "Login", "Register", and "Forum" links.
3. Clicking "Play as Guest" initiates guest login and navigates to `/dashboard`.
4. Logging out as a User or Guest redirects cleanly to `/` (Landing Page).
5. Forum remains publicly accessible for both unauthenticated visitors and logged-in users.

## Open Questions
- GitHub Repository URL: Currently defaulting to `https://github.com/ximofam/DoAnNganhOUCS2302` or `https://github.com`.
