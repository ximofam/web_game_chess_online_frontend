# Implementation Plan: Internationalization (i18n)

## Phase 1: Infrastructure & Core Setup
- Install `i18next`, `react-i18next`, and `i18next-browser-languagedetector`.
- Setup `src/i18n/index.js` and initialize in `src/main.jsx`.
- Create namespaced English translation JSON files in `src/i18n/locales/en/`:
  - `common.json`, `nav.json`, `auth.json`, `home.json`, `learn.json`, `chess.json`, `forum.json`, `profile.json`, `notifications.json`.

## Phase 2: Navigation & Common Components Migration
- Refactor `Navbar.jsx`, `Footer.jsx`, `PublicLayout.jsx`, `ProtectedLayout.jsx` to use `useTranslation('nav')` and `useTranslation('common')`.

## Phase 3: Auth & Profile Features Migration
- Refactor `LoginPage.jsx`, `RegisterPage.jsx`, `AuthInput.jsx`, `ProfilePage.jsx`, `ProfileForm.jsx`, `ProfileCard.jsx`, `NavbarAvatar.jsx`, `AvatarDropdown.jsx`.

## Phase 4: Learn & Chess Feature Migration
- Refactor `LearnOverviewPage.jsx`, `LessonDetailPage.jsx`, `PlayBotPage.jsx`, `LessonBoard.jsx`, `StepControls.jsx`, `LessonCard.jsx`, `BotSelector.jsx`.

## Phase 5: Home & Forum Features Migration
- Refactor `LandingPage.jsx`, `Dashboard.jsx`, `ForumListPage.jsx`, `ForumCreatePage.jsx`, `PostDetailPage.jsx`, `MyPostsPage.jsx`, `NotificationBell.jsx`, `NotificationsPage.jsx`.

## Phase 6: Verification & Self-Check
- Create `scratch/test_i18n_config.js` to verify key loading, interpolation, and pluralization.
- Run `npm run build` and `npm run lint`.
