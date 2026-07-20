# Spec: Internationalization (i18n)

## Objective
Decouple all user-facing UI text strings from React components and implement a modular, extensible **Internationalization (i18n)** architecture using `i18next` and `react-i18next`.
Initial version defaults to English (`en`) with fallback to English, structured in namespaced module files (`common`, `nav`, `auth`, `home`, `learn`, `chess`, `forum`, `profile`, `notifications`) so future languages (vi, ja, ko, zh, fr, de) can be added simply by introducing new JSON locale files without touching React components.

## Tech Stack
- React 19 + Vite 8
- `i18next` (core i18n framework)
- `react-i18next` (React integration hooks & components)
- `i18next-browser-languagedetector` (LocalStorage / browser language detection)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

## Project Structure
```text
src/
  i18n/
    index.js                   # Main i18next configuration & initialization
    locales/
      en/
        common.json            # Common buttons, labels, dialogs, toasts
        nav.json               # Navbar, footer, navigation items
        auth.json              # Login, Register, Guest login text
        home.json              # Landing page, dashboard hero & features
        learn.json             # Chess Learn page, steps, hints, controls
        chess.json             # Board, Bot strategy, game statuses, moves
        forum.json             # Post list, detail, creation, comments
        profile.json           # User profile form, avatar, stats
        notifications.json     # Notifications list & bell dropdown
```

## Code Style
- Use `useTranslation()` hook in functional components:
  ```jsx
  import { useTranslation } from 'react-i18next';
  const { t } = useTranslation(['learn', 'common']);
  return <button>{t('common:next')}</button>;
  ```
- Namespaced semantic keys (e.g. `auth:login_title`, `learn:step_counter`, `chess:status_checkmate_winner`).
- Dynamic interpolation using `{{variable}}`:
  ```json
  { "welcome": "Welcome back, {{username}}!" }
  ```
- Pluralization support using i18next keys (`_one`, `_other`):
  ```json
  {
    "move_one": "{{count}} Move",
    "move_other": "{{count}} Moves"
  }
  ```

## Testing Strategy
- Standalone self-check script (`scratch/test_i18n_config.js`) verifying translation key resolution, interpolation, and pluralization.
- Vite build verification (`npm run build`).

## Boundaries
- **Always:** Retrieve 100% of user-facing UI text through `t()` translation functions.
- **Ask first:** Modifying component props or API interfaces beyond text internationalization.
- **Never:** Hardcode visible text strings directly in JSX elements.

## Success Criteria
1. `i18next` initializes seamlessly on app startup in `src/main.jsx`.
2. All hardcoded text across Navbar, LandingPage, Dashboard, Auth pages, Learn pages, Forum pages, Profile, and Notifications are replaced with semantic translation keys.
3. Dynamic text (usernames, move counts, step numbers) uses i18next interpolation `{{var}}` instead of string concatenation.
4. Pluralization works correctly for move/player counts.
5. `npm run build` and `npm run lint` pass without errors.
6. Adding a new language (e.g., `vi`) requires zero component edits—only adding translation JSON files in `src/i18n/locales/<lang>/`.

## Open Questions
- None. Requirements are clear and fully specified.
