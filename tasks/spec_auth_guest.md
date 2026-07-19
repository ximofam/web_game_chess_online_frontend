# Spec: Guest & User Authentication Flow & Role Format Alignment

## Objective
Theo Đặc tả API Authentication (Auth API Specification):
1. **Định dạng Role không có tiền tố `ROLE_`**:
   - Tất cả thông tin `user.role` từ Backend đều trả về giá trị không có tiền tố `ROLE_` (ví dụ: `USER`, `GUEST`, `ADMIN`).
   - Refactor lại toàn bộ các câu lệnh so sánh, fallback và mock data trên frontend để dùng thống nhất chuẩn `USER`, `GUEST`, `ADMIN`.
2. **Loại bỏ GuestLayout**:
   - Vì Guest cũng là **User** của hệ thống (có ID/username sinh ngẫu nhiên và `accessToken`/`refreshToken` của riêng mình), nên Guest hoàn toàn là một User bình thường.
   - Không cần dùng `GuestLayout` để chặn/chuyển hướng người dùng khỏi các trang `/login` và `/register`. Các route `/login` và `/register` được truy cập trực tiếp.
3. **Luồng Khởi Tạo / Đăng Nhập Guest (Strict Guest Login Flow)**:
   - Khi thực hiện đăng nhập Guest (`loginGuest`), hệ thống thử gọi `POST /api/auth/login/guest`.
   - Nếu `loginGuest` thất bại (chưa có tài khoản guest / cookie `guestToken` chưa hợp lệ): hệ thống gọi `POST /api/auth/register/guest` để khởi tạo tài khoản guest. Khi đăng ký thành công, tự động gọi lại `POST /api/auth/login/guest` để nhận cặp token.
   - **Tuyệt đối KHÔNG sử dụng fallback `mock_guest` local** nếu cả 2 thao tác trên thất bại.
4. **Gia Hạn Token Guest (`refreshGuestToken`)**:
   - Khi tài khoản hiện tại là **Guest** và hệ thống thực hiện `refreshToken()` (`POST /api/auth/refresh`), hệ thống sẽ đồng thời gọi `POST /api/auth/refresh/guest-token` để gia hạn thời gian tồn tại của `guestToken` cookie.
5. **Liên Kết Tài Khoản ở AvatarDropdown**:
   - Ở `AvatarDropdown`, nếu tài khoản hiện tại là **Guest** (`isGuest` / `role === 'GUEST'`), hiển thị nút/liên kết **"Liên kết tài khoản"** (Link Account) cho phép Guest đăng ký/liên kết với tài khoản chính thức (chuyển hướng sang `/register`).

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
  - Sử dụng thống nhất tên Role dạng không có tiền tố `ROLE_` (`USER`, `GUEST`, `ADMIN`).
  - Thông báo lỗi cho người dùng khi `loginGuest` thất bại, không tự sinh `mock_guest`.
- **Ask first:** Thay đổi schema backend hoặc các tham số endpoint.
- **Never do:** Sử dụng chuỗi tiền tố `ROLE_` cũ gây không đồng bộ với Backend.

## Success Criteria
- [ ] Tất cả các vị trí kiểm tra hoặc hiển thị `user.role` sử dụng chuẩn `USER`, `GUEST`, `ADMIN`.
- [ ] `GuestLayout` được loại bỏ hoàn toàn.
- [ ] Build thành công không có lỗi syntax/type.
