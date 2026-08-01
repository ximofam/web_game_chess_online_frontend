# Spec: Player Ready Feature

## Objective
Tích hợp nghiệp vụ **Player Ready** vào frontend của dự án cờ vua. 
Cho phép hai người chơi (White/Black) xác nhận sẵn sàng. Khi cả hai sẵn sàng, hiển thị đếm ngược (countdown) dựa trên thời gian thực từ server. Khi đếm ngược kết thúc, chuyển sang màn hình chơi game. Hỗ trợ huỷ sẵn sàng và xử lý các trường hợp reconnect, huỷ đếm ngược. Toàn bộ UI đồng bộ hoàn toàn qua WebSocket, không dùng optimistic update cho state này.

## Tech Stack
- Frontend: React (dựa trên project hiện tại)
- State Management: Tận dụng state management hiện có của project cho Room state.
- Network: REST (gửi command) & WebSocket (nhận event đồng bộ)

## Commands
*Sẽ cập nhật chi tiết sau khi khảo sát project, giả định dùng npm*
- Dev: `npm run dev` hoặc `npm start`
- Build: `npm run build`

## Project Structure
*Cần khảo sát project để biết chính xác thư mục chứa:*
- Trang Room: Nơi hiển thị nút Ready và Countdown
- UI Components: Nơi chứa Countdown Overlay
- API layer: Nơi gọi API `POST /api/games/{roomId}/ready`
- WebSocket listener: Nơi subscribe topic `/topic/room.{roomId}`

## Code Style
- Tuân thủ các quy tắc trong `AGENTS.md`.
- **Bắt buộc** sử dụng i18n cho các text user-facing ("Ready", "Cancel Ready", thông báo đếm ngược...).
- Không define inline utility mà tách ra `src/shared/utils/`.
- Hạn chế tối đa việc tạo state React (`useState`) lưu trữ trùng lặp thông tin; sử dụng trực tiếp các field từ payload WebSocket/RoomResponse (`whiteReady`, `blackReady`, `startAt`).

## Testing Strategy
- Manual test với 2 client kết nối WebSocket để kiểm tra luồng: Ready -> Countdown -> Game Started.
- Test kịch bản reconnect: F5 (refresh) trình duyệt giữa lúc countdown.
- Test kịch bản Host (người tạo phòng) đổi trạng thái Ready -> ẩn/hiện nút Delete Room.

## Boundaries
- **Always do:** Đồng bộ UI 100% dựa vào WebSocket event; cleanup timer khi component unmount; tính countdown dựa trên `startAt` của server thay vì timer tĩnh; dùng i18n cho mọi text hiển thị.
- **Ask first:** Cần thêm thư viện ngoài hoặc thay đổi type definitions/interfaces của API.
- **Never do:** Optimistic update trạng thái ready; sửa đổi API backend; dùng `setTimeout` giả lập cứng 3 giây; reload lại trang web; gọi lại API fetch room info khi nhận event `PLAYER_READY`; hiển thị nút Ready cho Spectator.

## Success Criteria
- [ ] Người chơi (White hoặc Black) thấy và bấm được nút Ready/Cancel Ready. Nút phải bị disable trong lúc call API (tránh spam).
- [ ] Spectator hoàn toàn không thấy nút Ready.
- [ ] Host, nếu đang là White/Black và đã Ready, thì sẽ **không** thấy nút "Delete Room".
- [ ] Cả 2 người chơi Ready -> Nhận event `COUNTDOWN_STARTED` -> Hiện Overlay đếm ngược toàn màn hình.
- [ ] Countdown timer chính xác theo `startAt` từ server: tính bằng `startAt - Date.now()`.
- [ ] Nhận `COUNTDOWN_CANCELLED` -> Đóng Overlay, dừng timer, trở về trạng thái chưa start.
- [ ] Nhận `GAME_STARTED` -> Đóng Overlay, dừng timer, chuyển UI sang game.
- [ ] Refresh trình duyệt trong lúc countdown -> Tự động khôi phục giao diện đếm ngược dựa trên `room.startAt`.
- [ ] Không có optimistic update sai trạng thái hoặc hiển thị text hardcode trên giao diện.

## Open Questions
1. Project đang sử dụng thư viện WebSocket/STOMP nào (để tôi biết cách gắn listener)?
2. Thư mục chứa component trang Room hiện tại đang nằm ở đâu?
3. Component nào chịu trách nhiệm render nút "Delete Room"?

## Assumptions I'm Making:
1. Dự án đã cài đặt sẵn framework i18n (ví dụ `react-i18next`), tôi chỉ cần thêm keys vào locales.
2. Interface `RoomResponse` và kết nối WebSocket cơ bản đã được implement, tôi chỉ cần thêm xử lý cho các event mới.
3. Việc lấy thông tin current user (`currentUser.id`) và room role đã có sẵn helper/state.

→ **Người dùng vui lòng xác nhận hoặc đính chính các Assumptions và Open Questions trên.**
