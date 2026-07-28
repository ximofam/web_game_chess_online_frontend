# Spec: Error Pages (Not Found & Forbidden)

## Objective
Add "Not Found" (404) and "Forbidden" (403) pages to the React application. When the backend API returns a 404 or 403 HTTP status code, the application should automatically navigate the user to the corresponding error page. Unmatched routes should also show the Not Found page.

## Tech Stack
- React 19
- React Router v7
- Axios v1.18
- TailwindCSS v4

## Commands
- Build: `npm run build`
- Dev: `npm run dev`

## Project Structure
```text
src/
  shared/
    errors/
      pages/
        NotFoundPage.jsx    → 404 Page UI
        ForbiddenPage.jsx   → 403 Page UI
      components/
        GlobalApiErrorHandler.jsx → Invisible component inside BrowserRouter to listen for API errors and trigger `useNavigate()`
  features/auth/api/authClient.js → Update Axios interceptor to dispatch global custom events for 403/404 errors.
```

## Code Style
```jsx
// features/errors/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Link to="/" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">Go Home</Link>
    </div>
  );
}
```

## Testing Strategy
- Manual testing:
  1. Navigate to a non-existent URL (e.g. `/this-does-not-exist`) -> Should show Not Found.
  2. Mock an API response with 403 status -> Should navigate to Forbidden page.
  3. Mock an API response with 404 status -> Should navigate to Not Found page.

## Boundaries
- Always: Display consistent styling with the rest of the application (using Tailwind).
- Ask first: Changing existing routing logic beyond adding 403/404 handling.
- Never: Use `window.location.href` to navigate if it can be avoided (use `useNavigate` via global event listener instead to prevent full page reloads).

## Success Criteria
- User navigating to `/fake-url` sees the 404 page.
- Axios requests returning HTTP 403 automatically redirect to `/403` using React Router's `navigate`.
- Axios requests returning HTTP 404 automatically redirect to `/404` using React Router's `navigate`.

## Open Questions
- Do you want any specific imagery or styling for these error pages? I will start with a clean, dark-themed UI matching standard modern apps.
