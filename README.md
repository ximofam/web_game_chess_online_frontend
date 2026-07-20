# ♟️ VieChess - Nền Tảng Chơi Cờ Vua Trực Tuyến (Online Chess Game Platform)

## 🌐 Deploy & Live Demo

- **Truy cập ứng dụng trực tuyến:** [https://viechess.vercel.app/](https://viechess.vercel.app/)

### Các Dịch Vụ Sử Dụng Để Deploy:

| Thành phần | Dịch vụ Cloud / Platform | Mô tả |
| :--- | :--- | :--- |
| **Frontend** | [Vercel](https://vercel.com/) | Host ứng dụng Single Page Application (React + Vite) |
| **Backend** | [Railway](https://railway.app/) | Host dịch vụ API & WebSocket server (Spring Boot) |
| **PostgreSQL Database** | [NeonDB](https://neon.tech/) | Cơ sở dữ liệu quan hệ Serverless PostgreSQL |
| **Redis Cache** | [Upstash](https://upstash.com/) | Serverless Redis quản lý Caching & Session |
| **Message Broker (RabbitMQ)** | [CloudAMQP](https://www.cloudamqp.com/) | Quản lý Hàng đợi tin nhắn & Xử lý sự kiện Real-time |

---

## 📌 Giới Thiệu Dự Án

**VieChess** là một nền tảng chơi cờ vua trực tuyến hiện đại, kết hợp trải nghiệm chơi cờ thời gian thực (real-time) tương tác mượt mà cùng cộng đồng giao lưu cờ vua tích hợp. Hệ thống được thiết kế theo kiến trúc hiện đại, đảm bảo tốc độ phản hồi nhanh, khả năng mở rộng tốt và trải nghiệm người dùng tối ưu trên mọi thiết bị.

---

## ✨ Tính Năng Nổi Bật

- ♟️ **Chơi cờ Real-time:** Đấu cờ trực tuyến với người chơi khác thông qua giao thức WebSocket (STOMP/SockJS) với độ trễ thấp.
- 🔐 **Hệ thống Xác thực & Phân quyền:** Đăng ký, đăng nhập an toàn với JWT và phân quyền người dùng.
- 💬 **Diễn đàn Cờ vua (Community Forum):** Nơi chia sẻ bài viết, thế cờ hay, thảo luận chiến thuật với bộ biên tập văn bản phong phú (Tiptap Editor).
- 🔔 **Thông báo thời gian thực:** Nhận thông báo tức thì về lượt đấu, bình luận và tin nhắn qua RabbitMQ.
- 🎨 **Giao diện hiện đại & Tối ưu:** Thiết kế theo phong cách hiện đại, hỗ trợ Responsive trên nhiều thiết bị.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework & Build tool:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **State & Data Fetching:** TanStack Query (React Query)
- **Routing & Forms:** React Router v7, React Hook Form, Zod Validation
- **Real-time & Editor:** SockJS Client, STOMPjs, Tiptap Editor

### Backend & Cloud Infrastructure
- **Core API & WebSocket:** Java, Spring Boot, Spring Security, STOMP
- **Database:** PostgreSQL ([NeonDB](https://neon.tech/))
- **Caching & Memory:** Redis ([Upstash](https://upstash.com/))
- **Message Queue:** RabbitMQ ([CloudAMQP](https://www.cloudamqp.com/))
- **Deployment Platforms:** [Vercel](https://vercel.com/) (Frontend), [Railway](https://railway.app/) (Backend)

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

### Yêu cầu tiên quyết
- Node.js >= 18.x
- npm >= 9.x (hoặc yarn / pnpm)

### Cài đặt Frontend

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/my-react-app.git
   cd my-react-app
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường (`.env`):**
   Tạo file `.env` ở thư mục gốc của project frontend:
   ```env
   VITE_API_URL=http://localhost:8080/api
   VITE_WS_URL=http://localhost:8080/ws
   ```

4. **Khởi chạy ứng dụng ở chế độ Development:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173`

5. **Build cho môi trường Production:**
   ```bash
   npm run build
   ```
