# Todo: Chess Online Authentication Feature

- [x] **Task 1: Setup Dependencies and Tailwind v4**
  - **Description:** Install all required npm packages and configure Tailwind CSS v4 in the project.
  - **Acceptance:** App builds successfully and styles compile using Tailwind.
  - **Verify:** Run `yarn build` or `npm run build`
  - **Files:** `package.json`, `vite.config.js`, `src/index.css`
  - **Estimated scope:** Small (1-3 files)

- [x] **Task 2: Define Zod Validation Schemas**
  - **Description:** Create login and registration validation schemas using Zod.
  - **Acceptance:** Email, username, password validation criteria are satisfied. Password confirm matches.
  - **Verify:** Node execution checks / inline tests pass.
  - **Files:** `src/features/auth/validation/authSchemas.js`
  - **Estimated scope:** XS (1 file)

- [x] **Task 3: Setup Axios Client & Token Interceptors**
  - **Description:** Implement an Axios instance with request headers for auth and response interceptors to refresh expired access tokens. Set up a Mock API handler for browser testing.
  - **Acceptance:** Interceptors automatically call `/api/auth/refresh` on 401 response and retry failed requests. Mock handler mimics backend success/error states.
  - **Verify:** Axios tests / browser developer tools console logs.
  - **Files:** `src/features/auth/api/authClient.js`
  - **Estimated scope:** Medium (2-3 files)

- [x] **Task 4: Create Global Auth Context**
  - **Description:** Build `AuthContext` and `AuthProvider` to manage in-memory user information and state functions (`login`, `logout`, `refreshToken`).
  - **Acceptance:** Auth state coordinates correctly with Axios clients and updates reactive components.
  - **Verify:** Context state prints expected structures on login/logout.
  - **Files:** `src/features/auth/context/AuthContext.jsx`
  - **Estimated scope:** Small (1-2 files)

- [x] **Task 5: Route Protection Guard Setup**
  - **Description:** Configure guest-only page layouts and protected layout screens using React Router.
  - **Acceptance:** Users are blocked from dashboard if logged out, and redirected away from login if already logged in.
  - **Verify:** Route navigation manual click-through.
  - **Files:** `src/layouts/GuestLayout.jsx`, `src/layouts/ProtectedLayout.jsx`, `src/App.jsx`
  - **Estimated scope:** Small (2-3 files)

- [x] **Task 6: Build Chess Register Page**
  - **Description:** Create the Registration page UI with input validation, password toggle, state management, and API submission.
  - **Acceptance:** Register form handles user input validation, loading status, backend errors, and success redirects.
  - **Verify:** Perform a registration flow and observe successful route change and validation triggers.
  - **Files:** `src/features/auth/pages/RegisterPage.jsx`, `src/features/auth/components/AuthInput.jsx`
  - **Estimated scope:** Medium (3-4 files)

- [x] **Task 7: Build Chess Login Page**
  - **Description:** Create the LoginPage UI matching the chess design spec.
  - **Acceptance:** Login form handles user input validation, loading status, backend errors, token saving, and redirects.
  - **Verify:** Log in and observe successful redirect to Protected Dashboard.
  - **Files:** `src/features/auth/pages/LoginPage.jsx`
  - **Estimated scope:** Medium (2-3 files)

- [x] **Task 8: Implement Protected Dashboard and Toast System**
  - **Description:** Build a simple chess lobby/dashboard mock showing player details, status, a Logout button, and custom toast notifications for feedback.
  - **Acceptance:** Success/error alerts pop up elegantly. Logged-in users see the dashboard and can log out.
  - **Verify:** Login -> success toast -> dashboard -> logout -> login screen.
  - **Files:** `src/features/home/Dashboard.jsx`, `src/shared/components/Toast.jsx`
  - **Estimated scope:** Small (2-3 files)

- [x] **Task 9: Polish, Verify and Audit**
  - **Description:** Implement keyboard accessibility focus, check ARIA tags, dark-mode verification, and self-check script run.
  - **Acceptance:** Full keyboard navigability (forms, toggles, buttons). Build is production clean.
  - **Verify:** Run a custom test harness or build script.
  - **Files:** `src/features/auth/__tests__/authSelfCheck.js`
  - **Estimated scope:** XS (1-2 files)
