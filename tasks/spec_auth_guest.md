# Spec: Guest Authentication & Navigation System

## Objective
Hỗ trợ xác thực khách ẩn danh (Guest Token / Guest Session) theo đúng API Spec, cho phép người dùng xem guest cũng như user hệ thống để truy cập các trang công cộng (Home, Forum) mà không bắt buộc đăng nhập. Cung cấp tùy chọn khi vào hệ thống: "Tiếp tục với tư cách Guest" hoặc "Đăng nhập", đồng thời cập nhật Navigation Bar bao gồm các mục Nav (Home, Forum, Status Guest/User, Login button).

## Tech Stack & Dependencies
- Framework: React 19, Vite, React Router v7
- State & API: TanStack Query, Axios, Context API
- Icons & Styling: Lucide React, Tailwind CSS

## Commands
```bash
Dev: npm run dev
Build: npm run build
Lint: npm run lint
```

## Project Structure
```
src/
├── features/
│   ├── auth/
│   │   ├── api/authClient.js          # Extended mock interceptors for guest endpoints
│   │   ├── context/AuthContext.jsx     # Handles guest & user auth state, auto guest init / modal prompt
│   │   ├── services/authService.js     # registerGuest, loginGuest, refreshGuestToken endpoints
│   │   └── components/
│   │       └── GuestChoiceModal.jsx   # Modal choosing "Continue as Guest" or "Login"
│   ├── home/
│   │   ├── Dashboard.jsx               # Home Page accessible to both Guest & User
│   │   └── components/Navbar.jsx       # Unified Header Nav (Home, Forum, Auth actions)
│   └── forum/                          # Forum pages (Public read for Guest/User)
├── layouts/
│   ├── PublicLayout.jsx                # Layout with Navbar & Footer for Home & Forum (Guest/User)
│   ├── ProtectedLayout.jsx             # Restricts to authenticated ROLE_USER (Profile, Notifications, Create Post)
│   └── GuestLayout.jsx                 # Auth pages layout (Login, Register)
```

## API Endpoints Specs Covered
- `POST /api/auth/register/guest` -> Cookie `guestToken`
- `POST /api/auth/login/guest` -> Header `Authorization: Bearer <accessToken>` + Cookie `refreshToken`
- `POST /api/auth/refresh/guest-token` -> Refreshes `guestToken` cookie
- `POST /api/auth/login` -> User login
- `POST /api/auth/register` -> User registration
- `POST /api/auth/refresh` -> Token rotation
- `POST /api/auth/logout` -> Clears session

## Boundaries
- Always do: Allow Guests to read Home and Forum content without forcing redirect to `/login`.
- Ask first: Changing routing hierarchy or database schema expectations.
- Never do: Block guest users from visiting public pages.

## Success Criteria
1. Guest access without requiring login for public services (Home, Forum, Post Detail).
2. When landing unauthenticated: user can choose "Continue as Guest" or "Login" (or smoothly auto-register guest session while offering Login switch).
3. Header Navbar features links to `Home` and `Forum`, plus user profile or Guest indicator + "Login" button for guests.
4. Mock interceptor in `authClient.js` fully supports guest endpoints for complete offline/dev testing.
