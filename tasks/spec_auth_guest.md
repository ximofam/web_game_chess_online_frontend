# Spec: Guest & User Authentication Flow & Elimination of GuestLayout

## Objective
Theo Đặc tả API Authentication (Auth API Specification):
1. **Loại bỏ GuestLayout**:
   - Vì Guest cũng là **User** của hệ thống (có ID/username sinh ngẫu nhiên và `accessToken`/`refreshToken` của riêng mình), nên Guest hoàn toàn là một User bình thường.
   - Không cần dùng `GuestLayout` để chặn/chuyển hướng người dùng khỏi các trang `/login` và `/register`. Các route `/login` và `/register` được truy cập trực tiếp.
2. **Luồng Khởi Tạo / Đăng Nhập Guest (Fallback Registration Flow)**:
   - Khi thực hiện đăng nhập Guest (`loginGuest`), hệ thống thử gọi `POST /api/auth/login/guest`.
   - Nếu `loginGuest` thất bại (chưa có tài khoản guest / cookie `guestToken` chưa hợp lệ): gọi `POST /api/auth/register/guest` để khởi tạo tài khoản guest. Khi đăng ký thành công, tự động gọi lại `POST /api/auth/login/guest` để nhận cặp token.
3. **Gia Hạn Token Guest (`refreshGuestToken`)**:
   - Khi tài khoản hiện tại là **Guest** và hệ thống thực hiện `refreshToken()` (`POST /api/auth/refresh`), hệ thống sẽ đồng thời gọi `POST /api/auth/refresh/guest-token` để gia hạn thời gian tồn tại của `guestToken` cookie.
4. **Liên Kết Tài Khoản ở AvatarDropdown**:
   - Ở `AvatarDropdown`, nếu tài khoản hiện tại là **Guest** (`isGuest` / `ROLE_GUEST`), hiển thị nút/liên kết **"Liên kết tài khoản"** (Link Account) cho phép Guest đăng ký/liên kết với tài khoản chính thức (chuyển hướng sang `/register`).

## Tech Stack & Dependencies
- Framework: React 19, Vite, React Router v7
- HTTP & State: Axios (`authClient`), Context API (`AuthContext`)
- Styling & Icons: Tailwind CSS, Lucide React (`UserPlus`, `Link2`, `ShieldAlert`, `UserCheck`)

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
│   │   ├── api/authClient.js            # Interceptor & Mock Endpoints theo API Spec
│   │   ├── services/authService.js       # Mapping API (login, register, loginGuest, registerGuest, refreshGuestToken, refresh)
│   │   ├── context/AuthContext.jsx       # Xử lý fallback loginGuest, refreshGuestToken khi user là Guest, & 401 prompt
    │   ├── pages/LoginPage.jsx          # Login Page (Direct access)
    │   ├── pages/RegisterPage.jsx       # Register Page (Direct access)
│   │   └── components/
│   │       └── GuestChoiceModal.jsx     # UI Modal với nút Guest & Login
│   └── profile/
│       └── components/
│           └── AvatarDropdown.jsx       # Hiển thị nút "Liên kết tài khoản" cho Guest user
└── layouts/
    ├── PublicLayout.jsx                # Layout công cộng (Header + Footer)
    └── ProtectedLayout.jsx             # Layout yêu cầu xác thực
```

## Code Style & Implementation Snippets
```jsx
// Direct routes without GuestLayout guard in App.jsx
<Route path="/login" element={<LoginPage />} />
<Route path="/register" element={<RegisterPage />} />
```

## Boundaries
- **Always do:**
  - Loại bỏ `GuestLayout` và cho phép truy cập trực tiếp các route auth.
  - Thực hiện đúng trình tự `loginGuest` -> fail -> `registerGuest` -> `loginGuest`.
  - Gọi `refreshGuestToken` khi refresh token cho tài khoản Guest.
  - Hiển thị tùy chọn "Liên kết tài khoản" trong `AvatarDropdown` dành cho Guest.
- **Ask first:** Thay đổi schema backend hoặc các tham số endpoint.
- **Never do:** Dùng `GuestLayout` chặn Guest hoặc User đăng nhập/đăng ký.

## Success Criteria
- [ ] `GuestLayout` được loại bỏ hoàn toàn khỏi `App.jsx`.
- [ ] Các trang `/login` và `/register` có thể được truy cập trực tiếp bởi bất kỳ User nào (kể cả Guest).
- [ ] `loginGuest` thử đăng nhập trước, nếu không được thì tự động đăng ký guest rồi đăng nhập lại.
- [ ] Khi tài khoản là Guest, lệnh `refreshToken` tự động gia hạn `guestToken` qua `refreshGuestToken`.
- [ ] `AvatarDropdown` hiển thị nút "Liên kết tài khoản" dẫn tới `/register` khi user là Guest.
- [ ] Build thành công không có lỗi syntax/type.
