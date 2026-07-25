# Kế hoạch Triển khai: Thu Nhỏ / Phóng To Phòng Chờ (Floating Mini Room Widget)

## Tổng quan
Kế hoạch triển khai tính năng thu nhỏ phòng chờ dạng **Floating Mini Room Widget** giống các tựa game multiplayer. Cho phép người chơi khi đang chờ đối thủ trong phòng cờ có thể thu nhỏ phòng thành widget ở góc dưới màn hình để rảnh tay thực hiện các công việc khác (lướt sảnh, học cờ, đọc forum) và dễ dàng phóng to mở rộng lại phòng cờ bất cứ lúc nào.

---

## Các bước thực hiện

### Step 1: Xây dựng Helper Quản lý Active Minimized Room State
- Viết utility / event listener nhẹ lưu & lấy `minimized_room` từ `sessionStorage` và phát sự kiện `active_room_changed`.
- Files: `src/features/rooms/services/activeRoomManager.js`

### Step 2: Xây dựng Component `FloatingRoomWidget.jsx`
- Đặt tại góc dưới phải màn hình (`fixed bottom-4 right-4 z-50`).
- Hiển thị tên phòng, thời gian, số người chơi, nút **"Phóng to"** (`Maximize2`) và **"Rời phòng"** (`LogOut`).
- Files: `src/features/rooms/components/FloatingRoomWidget.jsx`

### Step 3: Tích hợp `FloatingRoomWidget` vào `PublicLayout.jsx`
- Giúp widget xuất hiện trên tất cả các trang ngoại trừ khi người dùng đang ở trực tiếp trang `/room/:roomId`.
- Files: `src/layouts/PublicLayout.jsx`

### Step 4: Cập nhật nút "Thu nhỏ" trong `RoomWaitingPage.jsx`
- Thay thế nút zoom font cũ bằng nút **"Thu nhỏ phòng"** (`Minimize2`) đưa phòng thành Floating Mini Widget và điều hướng về Dashboard.
- Files: `src/features/rooms/pages/RoomWaitingPage.jsx`, `src/features/rooms/components/RoomHeader.jsx`

### Step 5: Verification & Production Build
- Kiểm tra `npm run build` và thử nghiệm quy trình Thu nhỏ -> Phóng to -> Rời phòng.
