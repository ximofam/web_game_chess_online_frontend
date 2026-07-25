# Spec: Giao diện Phòng Chờ & Thu Nhỏ/Mở Rộng Dạng Floating Widget (Room Waiting Page & Floating Mini Widget)

## 1. Assumptions (Giả định ban đầu)
1. **Đường dẫn Route**: Trang phòng chờ đầy đủ ở đường dẫn `/room/:roomId`.
2. **Khái niệm Phóng to / Thu nhỏ (Minimize / Expand Floating Widget)**:
   - Tương tự như các tựa game online (Lobby Mini Widget): Khi người chơi ở trong phòng chờ và cần làm việc khác (xem Sảnh cờ, học cờ ở `/learn`, lướt diễn đàn `/forum`), họ nhấp nút **"Thu nhỏ phòng"**.
   - Giao diện chuyển sang dạng **Floating Mini Room Widget** thu nhỏ ở góc dưới bên phải màn hình (fixed position z-50), cho phép tự do điều hướng khắp ứng dụng.
   - Khi ở dạng thu nhỏ, **Floating Mini Room Widget** vẫn duy trì trạng thái kết nối phòng, hiển thị thông tin số lượng người chơi (1/2), trạng thái phòng, nút **"Phóng to / Mở rộng"** (quay lại `/room/:roomId`) và nút **"Rời phòng"**.
3. **Gọi REST API (`GET /api/rooms/{roomId}`)**:
   - Lấy thông tin phòng chi tiết khi vào phòng hoặc khi Mini Widget mở rộng lại.
4. **Trạng thái Phòng Hoạt Động (Active Minimized Room State)**:
   - Lưu trữ thông tin phòng đang chờ vào `sessionStorage` (`active_room_id`) hoặc Room Context nhẹ để `PublicLayout` render `FloatingRoomWidget` xuyên suốt ứng dụng.

---

## 2. Objective (Mục tiêu)
Xây dựng tính năng Thu nhỏ / Phóng to phòng chờ cho phép người chơi thu nhỏ phòng cờ thành khung Mini Bar nổi ở góc màn hình để rảnh tay thực hiện các tác vụ khác (lướt sảnh, học cờ, đọc diễn đàn) trong khi chờ đối thủ tham gia, và dễ dàng phóng to mở rộng lại full giao diện phòng khi cần thiết.

---

## 3. Tech Stack
- **Framework & UI**: React 19, Vite, Tailwind CSS v4, Lucide React (Icons).
- **Routing**: `react-router-dom` v7 (`useParams`, `useNavigate`, `useLocation`).
- **State Persistence**: `sessionStorage` / `CustomEvent` cho active room broadcast.

---

## 4. Components & Flow

### 4.1. `RoomWaitingPage.jsx` (Giao diện phòng chờ đầy đủ)
- Nút **"Thu nhỏ phòng"** (`Minimize2` icon): Khi click, lưu `active_room_id` vào `sessionStorage`, phát sự kiện cập nhật active room và điều hướng sang `/dashboard`.

### 4.2. `FloatingRoomWidget.jsx` (Widget mini nổi ở góc màn hình)
- Hiển thị cố định ở góc dưới bên phải (`fixed bottom-4 right-4 z-50`).
- Hiển thị:
  - Tên phòng / Mã phòng
  - Badge trạng thái (`Đang chờ... 1/2 người chơi`)
  - Nút **"Phóng to"** (`Maximize2` icon) -> Chuyển hướng về `/room/:roomId`.
  - Nút **"Rời phòng"** (`LogOut` icon) -> Xóa phòng khỏi active room state.
- Tự động ẩn khi người dùng đang ở chính trang `/room/:roomId`.

---

## 5. Success Criteria
- [ ] Khi ở trang phòng chờ `/room/:roomId`, bấm nút **"Thu nhỏ"** lập tức thu phòng thành Mini Widget góc màn hình và điều hướng về Dashboard.
- [ ] Mini Widget xuất hiện cố định ở góc dưới phải màn hình trên tất cả các trang (`/dashboard`, `/learn`, `/forum`).
- [ ] Bấm nút **"Phóng to"** trên Mini Widget lập tức chuyển hướng mở rộng lại đầy đủ trang `/room/:roomId`.
- [ ] Bấm **"Rời phòng"** trên Mini Widget đóng widget và giải phóng phòng.
