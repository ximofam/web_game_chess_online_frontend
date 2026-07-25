# Spec: Xử lý WebSocket Events trong Phòng (Room)

## 1. Objective
Hoàn thiện logic lắng nghe WebSocket trên channel `/topic/room/{roomId}` tại giao diện Phòng chờ (`RoomWaitingPage`), để phản ứng đúng với các sự kiện người chơi rời phòng hoặc phòng bị giải tán.

## 2. Các thay đổi chính (`useRoomDetails.js`)

Hiện tại hook `useRoomDetails` đã subscribe vào `/topic/room/{roomId}` và xử lý `PLAYER_JOINED`. Ta cần bổ sung thêm:

### 2.1 Xử lý `PLAYER_LEFT`
- **Payload**: `{ role: "white" | "black" | "spectator", userId: string }`
- **Logic cập nhật Cache**:
  - Nếu `role` là `"white"` hoặc `"black"`: set `room[role] = null`.
  - Nếu `role` là `"spectator"`: Lọc (filter) user có `id == userId` ra khỏi mảng `room.spectators`.

### 2.2 Xử lý `ROOM_DELETED`
- **Payload**: `{ roomId: string }`
- **Side effects**:
  - Khi chủ phòng (host) thoát, phòng bị huỷ. 
  - Hook sẽ nhận diện event này, hiển thị một thông báo Toast: "Phòng chơi đã bị giải tán do chủ phòng rời đi" (bằng `showToast` của `useAuth`).
  - Tự động điều hướng (redirect) người dùng về trang sảnh `/dashboard` bằng `useNavigate`.

## 3. Boundaries
- Xử lý thuần tuý trên React Query cache (`queryClient.setQueryData`) đối với `PLAYER_LEFT` để đảm bảo UI tự cập nhật mượt mà không cần refetch API.
- Đảm bảo hook dọn dẹp (unsubscribe) đúng cách khi unmount.

## 4. Success Criteria
- [ ] Khi một người chơi khác (white/black) thoát, ghế đó lập tức trống (`null`) trên màn hình.
- [ ] Khi một khán giả thoát, số lượng khán giả giảm đi lập tức.
- [ ] Khi host thoát (nhận `ROOM_DELETED`), màn hình hiện thông báo báo lỗi và tự chuyển hướng về sảnh (`/dashboard`).
