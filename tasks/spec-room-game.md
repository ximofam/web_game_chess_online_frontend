# Tiêu chuẩn Tích hợp Giao diện Cờ Vua (Chess Game UI) tại RoomWaitingPage

## 1. Mục tiêu
Thay vì chuyển hướng (navigate) sang URL `/game/{roomId}` khi nhận event `GAME_STARTED`, hệ thống sẽ cập nhật trạng thái phòng ngay tại chỗ. Trang `RoomWaitingPage` sẽ biến đổi từ giao diện "Phòng chờ" sang giao diện "Phòng đấu" (Chess Game Workspace), mang lại trải nghiệm liền mạch.

## 2. Xử lý Event `GAME_STARTED`
**Tại `useRoomDetails.js`:**
- **Không** sử dụng `navigate('/game/:id')`.
- Cập nhật state của room thông qua `queryClient.setQueryData`:
  - Đổi `status` thành `'IN_PROGRESS'`.
  - Hủy bỏ biến đếm ngược (`startAt: null`).
  - Gắn toàn bộ data nhận được từ backend (whiteId, blackId, turn, fen) vào object room (vd: `room.gameData`).

## 3. Chuyển đổi Giao diện (`RoomWaitingPage.jsx`)
Khi `room.status === 'IN_PROGRESS'`:
- **Thanh Action (Nút Ready/Cancel)**: Ẩn đi hoặc thay thế bằng các nút điều khiển game (Đầu hàng, Xin hòa) nếu backend có hỗ trợ.
- **Khu vực Trái (Ghế ngồi & Khán giả)**: Sẽ được ẩn hoặc thu gọn, nhường chỗ để hiển thị Component **ChessGameUI**.
- **Khu vực Phải (Chat)**: Giữ nguyên `RoomChat` để người chơi và khán giả có thể tiếp tục trò chuyện trong lúc đánh cờ.

## 4. Thiết kế Component `ChessGameUI.jsx`
Giao diện sẽ tuân thủ thiết kế chuẩn của các nền tảng cờ vua hiện đại (Chess.com, Lichess):

1. **Khung Thông Tin Đối Thủ (Top Bar)**
   - Chứa Avatar, Tên, Elo của đối thủ.
   - Hiển thị danh sách quân cờ ăn được (Captured Pieces).
   - Đồng hồ đếm ngược của đối thủ.

2. **Bàn Cờ (Center Board)**
   - Tích hợp thư viện `react-chessboard` kết hợp `chess.js`.
   - Vị trí bàn cờ phụ thuộc vào vai trò của user hiện tại (Board Orientation). Nếu User = Quân Đen, bàn cờ sẽ lật ngược lại.
   - Khởi tạo trạng thái bàn cờ bằng mã FEN trả về từ event `GAME_STARTED`.

3. **Khung Thông Tin Người Chơi (Bottom Bar)**
   - Chứa Avatar, Tên, Elo của người dùng hiện tại (hoặc người chơi còn lại nếu đang ở chế độ xem).
   - Hiển thị danh sách quân cờ ăn được.
   - Đồng hồ đếm ngược của người chơi.

## 5. Đồng hồ thời gian (Timers)
- Lấy `room.settings.timeMinutes` và `room.settings.incrementSeconds` để khởi tạo thời gian ban đầu.
- *(Lưu ý: Logic đếm ngược và đồng bộ thời gian realtime cần được xử lý ở bước sau khi ghép nối thêm các event về nước đi - `PIECE_MOVED`).*

## Các bước triển khai (Implementation Plan)
1. Cập nhật file `useRoomDetails.js` để parse event `GAME_STARTED`.
2. Tạo Component `ChessGameUI.jsx` theo chuẩn thiết kế.
3. Chỉnh sửa `RoomWaitingPage.jsx` để render `ChessGameUI` khi trạng thái phòng là `IN_PROGRESS`.
4. Run ESLint.
