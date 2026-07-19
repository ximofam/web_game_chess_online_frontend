# Spec: Guest & User Authentication Flow & Profile Fetching

## Objective
Theo Đặc tả API Authentication (Auth API Specification):
1. **Đối xử với Guest như User hệ thống trong `refreshToken()`**:
   - Khi `refreshToken()` được gọi, nếu là tài khoản **Guest**, hệ thống vẫn thực hiện gia hạn cookie `guestToken` qua `refreshGuestToken()`.
   - Cả **Guest** và **User** bình thường đều gọi `profileService.getCurrentUser()` (`GET /api/users/me`) để lấy thông tin profile chính thức từ Backend.
2. **Định dạng Role không có tiền tố `ROLE_`**:
   - Tất cả thông tin `user.role` từ Backend đều trả về giá trị không có tiền tố `ROLE_` (`USER`, `GUEST`, `ADMIN`).
3. **Loại bỏ GuestLayout**:
   - Guest cũng là **User** của hệ thống (có ID/username sinh ngẫu nhiên và `accessToken`/`refreshToken` của riêng mình), các route `/login` và `/register` được truy cập trực tiếp.
4. **Luồng Khởi Tạo / Đăng Nhập Guest (Strict Guest Login Flow)**:
   - Thử `loginGuest()` -> nếu thất bại thì gọi `registerGuest()` -> sau đó gọi lại `loginGuest()`.
   - Không dùng fallback `mock_guest` local nếu thất bại.
5. **Liên Kết Tài Khoản ở AvatarDropdown**:
   - Ở `AvatarDropdown`, nếu tài khoản hiện tại là **Guest** (`isGuest` / `role === 'GUEST'`), hiển thị nút/liên kết **"Liên kết tài khoản"** (chuyển hướng sang `/register`).

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

## Boundaries
- **Always do:**
  - Gọi `profileService.getCurrentUser()` cho cả Guest và User trong `refreshToken()`.
  - Sử dụng thống nhất tên Role dạng không có tiền tố `ROLE_` (`USER`, `GUEST`, `ADMIN`).
- **Ask first:** Thay đổi schema backend hoặc các tham số endpoint.
- **Never do:** Bỏ qua việc lấy thông tin profile `GET /api/users/me` khi refresh token cho Guest.

## Success Criteria
- [ ] `refreshToken()` thực hiện gọi `profileService.getCurrentUser()` đồng nhất cho cả Guest và User.
- [ ] Build thành công không có lỗi syntax/type.
