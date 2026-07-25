# Spec: Cải tiến Create Room và Join Room

## 1. Objective
Cải thiện luồng tạo và tham gia phòng chơi:
1. **Create Room**: Tận dụng dữ liệu `RoomResponse` trả về từ API `/api/rooms` để không phải gọi thêm `GET /api/rooms/:roomId` (thông qua React Query Cache).
2. **Join Room**: Thêm 2 nút "Vào chơi" (Play) và "Xem" (Spectate) ở sảnh (`LobbyList`). Xử lý logic tự động chọn phe (Trắng hoặc Đen) dựa trên tình trạng ghế trống.

## 2. Các thay đổi chính

### 2.1 Cập nhật `CreateRoomModal.jsx`
- Sử dụng `useQueryClient` từ `@tanstack/react-query`.
- Sau khi gọi API `createRoom` thành công, lưu trực tiếp dữ liệu trả về vào cache bằng `queryClient.setQueryData(['room', roomId], result)`.
- Điều này sẽ giúp `useRoomDetails` trên trang `RoomWaitingPage` dùng dữ liệu cache ngay lập tức mà không gọi thêm API `getRoomDetails`.

### 2.2 Cập nhật `LobbyList.jsx`
- Trong bảng danh sách phòng, cột "Thao tác" (Action) sẽ hiển thị 2 nút khi phòng ở trạng thái `WAITING`:
  - **Vào chơi**: Nút chính (primary). Khi click:
    - Kiểm tra nếu `room.white` tồn tại (có dữ liệu) → `role = 'black'`, ngược lại `role = 'white'`.
    - Gọi API `roomService.joinRoom(roomId, role)`.
    - Cache `RoomResponse` trả về.
    - Navigate sang `/room/:roomId`.
  - **Xem**: Nút phụ (secondary). Khi click:
    - Gọi API `roomService.joinRoom(roomId, 'spectator')`.
    - Cache `RoomResponse`.
    - Navigate sang `/room/:roomId`.
- Nếu phòng `IN_PROGRESS`, hiển thị duy nhất nút **Xem** (như hiện tại), click vào sẽ join với role `spectator`.

### 2.3 Cập nhật `roomService.js`
- Đảm bảo hàm `joinRoom` gửi đúng payload body: `{ role }`. (Hiện tại đang là `{ side }`, cần sửa thành `{ role }` theo Spec).

## 3. Boundaries
- Luôn cập nhật cache của React Query (`['room', roomId]`) sau các thao tác thay đổi trạng thái phòng (Create, Join).
- Không tự động sửa backend. Chỉ sửa code frontend dựa trên Spec backend cung cấp.

## 4. Success Criteria
- [ ] Tạo phòng mới không gửi request GET đến `api/rooms/:roomId` ngay sau đó.
- [ ] Ở danh sách Lobby, thấy 2 nút "Vào chơi" và "Xem" đối với phòng WAITING.
- [ ] Bấm "Vào chơi", gửi API join với role đúng (black nếu white đã có người, và ngược lại).
- [ ] Bấm "Xem", gửi API join với role 'spectator'.
