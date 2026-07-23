# Spec: Quản lý Phòng chơi (Lobby & Rooms Management) ở Trang Home

## 1. Assumptions
1. **Trang hiển thị**: Tính năng này được tích hợp trực tiếp vào Trang chủ / Dashboard (`src/features/home/Dashboard.jsx` hoặc sub-components tại `src/features/rooms`).
2. **3 Nút Hành Động**: 
   - **Tạo phòng (Create Lobby)**: Mở Modal cấu hình phòng (Tên phòng, Thời gian, Increment, Thể loại, Rated/Unrated, Riêng tư). Gọi `POST /api/rooms`. Yêu cầu người dùng đang Online (có kết nối WebSocket).
   - **Ghép trận (Quick Matchmaking)**: Đánh dấu là "(Tương lai)" (Coming Soon). Nhấp vào hiển thị thông báo/Modal trải nghiệm xem trước về tính năng tìm trận tự động.
   - **Đánh với máy (Play vs Computer / Bot)**: Cho phép chuyển nhanh đến trang đấu với AI Bot (`/learn/play-bot`).
3. **Danh Sách Sảnh Chơi Real-time (Lobby List)**:
   - **REST API (`GET /api/rooms`)**: Lấy danh sách 20 phòng mới nhất khi load trang lần đầu (`WAITING`, `IN_PROGRESS`).
   - **WebSocket Topic (`/topic/lobbies`)**: Nhận sự kiện từ STOMP:
     - `ROOM_CREATED`: Thêm/Chèn phòng mới vào danh sách sảnh.
     - `ROOM_DELETED`: Xóa phòng tương ứng khỏi danh sách dựa trên `roomId`.
     - `ROOM_UPDATED`: Cập nhật trạng thái (`status`, `white`, `black`) của phòng trong danh sách.
4. **Mock API & Mock WebSocket**: Hỗ trợ chế độ DEV (`VITE_USE_MOCK_API === 'true'`) cho phép giả lập danh sách phòng và phát các sự kiện WebSocket để kiểm thử UI mà không cần backend thực tế.

---

## 2. Objective
Thiết kế và cài đặt module Quản lý Phòng chơi (Lobby & Rooms Management) ngay tại trang chủ (Home / Dashboard), cung cấp 3 nút bấm thao tác chính (Tạo phòng, Ghép trận [Tương lai], Đánh với máy) và hiển thị danh sách phòng chờ thời gian thực được đồng bộ tự động qua REST API + STOMP Topic `/topic/lobbies`.

---

## 3. Tech Stack
- **Framework & Libraries**: React 19, Vite, Tailwind CSS v4, Lucide React (Icons).
- **State & Data Fetching**: TanStack React Query (`@tanstack/react-query`).
- **Realtime Connection**: STOMP Protocol qua `SocketProvider` (`useSocket()`).
- **REST Client**: Axios / `authClient.js`.

---

## 4. Commands
- **Dev Server**: `npm run dev`
- **Build Production**: `npm run build`
- **Lint Code**: `npm run lint`

---

## 5. Project Structure
```
src/
  features/
    rooms/
      api/
        roomsApi.js             # Service REST API (getRooms, createRoom, joinRoom)
      hooks/
        useLobbyRooms.js        # Hook quản lý danh sách phòng & subscribe STOMP /topic/lobbies
      components/
        PlayModeCards.jsx       # 3 Nút lựa chọn chế độ (Tạo phòng, Ghép trận, Đánh với máy)
        CreateRoomModal.jsx     # Modal điền cấu hình & tạo phòng mới
        MatchmakingModal.jsx    # Modal preview tính năng Ghép trận (Tương lai)
        RoomCard.jsx            # Card hiển thị thông tin 1 phòng chơi ở Sảnh
        LobbyList.jsx           # Khung danh sách phòng chơi & bộ lọc/tìm kiếm
    home/
      Dashboard.jsx             # Tích hợp PlayModeCards và LobbyList vào Trang chủ
```

---

## 6. Code Style & Rules (Ponytail)
- **Tối giản code**: Tận dụng helper đã có, không tạo abstraction thừa.
- **WebSocket Listener**: Clean up subscription trong `useEffect` để tránh memory leak.
- **Xử lý lỗi**: Hiển thị Toast thông báo khi `POST /api/rooms` trả về 403 FORBIDDEN (người chơi offline WebSocket).
- **Giao diện**: Modern dark theme đồng bộ với thiết kế ứng dụng (Gold `#d4af37`, Dark `#1a1d24`, `#13161c`, `#2d323f`), hiệu ứng micro-animations mượt mà.

---

## 7. Testing & Verification Strategy
- Kiểm tra `npm run build` đảm bảo không có lỗi biên dịch.
- Test UI tạo phòng: validate form inputs (tên phòng, thời gian), gọi API tạo phòng.
- Test Mock Socket: Giả lập sự kiện `ROOM_CREATED` và `ROOM_DELETED` trên sảnh.

---

## 8. Boundaries
- **Always do**: Hủy kết nối/unsubscribe STOMP topic khi unmount component.
- **Ask first**: Thay đổi cấu trúc dữ liệu `CreateRoomRequest` ngoài đặc tả API backend.
- **Never do**: Polling liên tục REST API `GET /api/rooms` khi WebSocket đang hoạt động bình thường.

---

## 9. Success Criteria
- [ ] Spec được viết chi tiết và lưu tại `tasks/spec_rooms_lobby.md`.
- [ ] Trang Home hiển thị nổi bật 3 thẻ chế độ chơi: **Tạo phòng**, **Ghép trận (Tương lai)**, **Đánh với máy**.
- [ ] Nút **Tạo phòng** mở Modal cho phép nhập Tên phòng, chọn Thời gian (3m, 5m, 10m, 15m), Increment, Thể loại (Standard), Rated/Unrated và gửi `POST /api/rooms`.
- [ ] Nút **Ghép trận** mở Modal thông báo tính năng đang phát triển (Tương lai).
- [ ] Nút **Đánh với máy** điều hướng sang chế độ chơi với Bot (`/learn/play-bot`).
- [ ] Khung **Sảnh Chơi (Lobby List)** tải danh sách từ `GET /api/rooms` và lắng nghe sự kiện `/topic/lobbies` (`ROOM_CREATED`, `ROOM_DELETED`, `ROOM_UPDATED`) để tự động cập nhật danh sách phòng theo thời gian thực.
- [ ] Hỗ trợ Mock API & Mock WebSocket trong DEV mode.
- [ ] Cho phép xem thông tin chi tiết phòng (Host, Người chơi Trắng/Đen, Trạng thái WAITING/IN_PROGRESS) và nút Tham gia/Vào xem.
