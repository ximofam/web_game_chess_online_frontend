# Spec: Guest & User Authentication Flow & Single-Flight Refresh Guard

## Objective
Theo Đặc tả API Authentication (Auth API Specification):
1. **Chống trùng lặp Request Refresh Token (Single-Flight Pattern & Init Guard)**:
   - Với cơ chế Token Rotation (xóa refresh token cũ trong Redis khi vừa cấp token mới), nếu `refreshToken()` bị kích hoạt trùng lặp đồng thời (ví dụ do React `StrictMode` mount 2 lần hoặc nhiều component gọi refresh cùng lúc), request thứ 2 sẽ gửi token cũ vừa bị vô hiệu hóa ➔ trả về `401 Unauthorized` sai làm mở modal guest.
   - Bổ sung Single-Flight Promise lock trong `refreshToken()` và Guard Flag (`initAuthStartedRef`) trong `useEffect` để đảm bảo API `/api/auth/refresh` chỉ chạy 1 lần duy nhất tại một thời điểm và không bị gọi chồng lặp.
2. **Đối xử với Guest như User hệ thống trong `refreshToken()`**:
   - Khi `refreshToken()` được gọi, nếu là tài khoản **Guest**, hệ thống vẫn thực hiện gia hạn cookie `guestToken` qua `refreshGuestToken()`.
   - Cả **Guest** và **User** bình thường đều gọi `profileService.getCurrentUser()` (`GET /api/users/me`) để lấy thông tin profile chính thức từ Backend.
3. **Định dạng Role không có tiền tố `ROLE_`**:
   - Tất cả thông tin `user.role` từ Backend đều trả về giá trị không có tiền tố `ROLE_` (`USER`, `GUEST`, `ADMIN`).
4. **Loại bỏ GuestLayout**:
   - Guest cũng là **User** của hệ thống (có ID/username sinh ngẫu nhiên và `accessToken`/`refreshToken` của riêng mình), các route `/login` và `/register` được truy cập trực tiếp.
5. **Luồng Khởi Tạo / Đăng Nhập Guest (Strict Guest Login Flow)**:
   - Thử `loginGuest()` -> nếu thất bại thì gọi `registerGuest()` -> sau đó gọi lại `loginGuest()`.
   - Không dùng fallback `mock_guest` local nếu thất bại.
6. **Liên Kết Tài Khoản ở AvatarDropdown**:
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
  - Áp dụng Single-Flight pattern cho `refreshToken` và Init Guard cho `initAuth` để ngăn 401 giả do Token Rotation.
  - Gọi `profileService.getCurrentUser()` cho cả Guest và User trong `refreshToken()`.
  - Sử dụng thống nhất tên Role dạng không có tiền tố `ROLE_` (`USER`, `GUEST`, `ADMIN`).
- **Ask first:** Thay đổi schema backend hoặc các tham số endpoint.
- **Never do:** Để `refreshToken()` chạy trùng lặp nhiều lần gây vô hiệu hóa token do Token Rotation.

## Success Criteria
- [ ] `refreshToken()` dùng single-flight pattern, tránh lỗi 401 khi khởi tạo ứng dụng hoặc refresh đồng thời.
- [ ] Modal Guest không bị bật lên nhầm khi phiên đăng nhập đầu tiên thành công.
- [ ] Build thành công không có lỗi syntax/type.
