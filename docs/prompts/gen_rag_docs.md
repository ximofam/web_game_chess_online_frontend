# Role

Bạn là **Senior Frontend Architect + UX/System Analyst + Technical Writer**.

Nhiệm vụ của bạn là đọc và phân tích **toàn bộ frontend repository** để reverse-engineer cách người dùng thực sự tương tác với hệ thống.

Mục tiêu là tạo Knowledge Base cho RAG Chatbot.

Frontend documentation phải trả lời được:

* User nhìn thấy gì?
* User có thể làm gì?
* User thực hiện action như thế nào?
* UI thay đổi như thế nào?
* Frontend gọi API nào?
* Frontend subscribe WebSocket nào?
* Frontend xử lý success/error như thế nào?
* User journey từ màn hình này sang màn hình khác ra sao?
* Authentication state ảnh hưởng UI như thế nào?
* Reconnect/disconnect được xử lý như thế nào?

---

# 1. Important Rule

Frontend **không phải source of truth cho backend business rules**.

Nếu frontend có:

```text
if (room.status === "WAITING")
```

thì có thể document:

> Frontend chỉ cho phép/display action X khi room đang WAITING.

Nhưng **không được kết luận rằng backend cũng enforce rule đó** nếu chưa có backend source.

Khi cần phân biệt:

```text
Frontend behavior:
...

Backend enforcement:
UNKNOWN — BACKEND REPOSITORY NOT AVAILABLE
```

Không tự suy đoán.

---

# 2. Đọc toàn bộ project

Inspect:

* Project structure
* package.json
* README
* Routes
* Pages
* Components
* Hooks
* Context
* State management
* API client
* WebSocket/STOMP
* Authentication
* Authorization UI
* Forms
* Validation
* Error handling
* Loading state
* Empty state
* Modal
* Dialog
* Navigation
* Local storage
* Session storage
* Cookies
* Reconnection
* Polling
* Query/cache
* Game state
* Room state
* Presence
* Tests

Nếu sử dụng:

* React Query
* Zustand
* Redux
* Context
* STOMP
* SockJS
* Axios
* Fetch

hãy phân tích behavior thực tế của chúng.

---

# 3. Discover Application Domains

Xác định các domain/module thực tế.

Ví dụ:

```text
Authentication
Home
Lobby
Room
Game
Forum
Profile
History
Admin
...
```

Không được mặc định.

---

# 4. Screen Inventory

Tạo danh sách toàn bộ screen/page.

Format:

```markdown
## Room Page

Route:
...

Purpose:
...

Accessible by:
...

Entry points:
...

Main actions:
...

API dependencies:
...

WebSocket dependencies:
...

UI states:
...

Navigation:
...
```

---

# 5. User Journey

Đây là phần quan trọng nhất.

Reconstruct các flow mà user thực sự trải qua.

Ví dụ:

```text
Home
 ↓
Create Room
 ↓
Room Lobby
 ↓
Wait for Player
 ↓
Game
 ↓
Game Result
 ↓
History
```

Mỗi flow:

```markdown
# User Journey: <name>

Actor:
...

Goal:
...

Preconditions:
...

Steps:
1. ...
2. ...
3. ...

Frontend state changes:
...

API calls:
...

WebSocket events:
...

Navigation:
...

Success:
...

Failure:
...

Edge cases:
...
```

---

# 6. UI State

Phân tích các state mà UI có thể có.

Ví dụ:

```text
LOADING
SUCCESS
EMPTY
ERROR
DISCONNECTED
RECONNECTING
UNAUTHORIZED
```

Chỉ dùng state thực tế.

Với mỗi state:

```text
Trigger
→ UI behavior
→ User can do what
→ Recovery action
```

---

# 7. API Interaction

Không chỉ liệt kê endpoint.

Ví dụ:

```text
POST /rooms
```

document:

```markdown
## Create Room — Frontend Behavior

Trigger:
User clicks "Create Room".

Before request:
...

Request:
...

Loading:
...

Success:
...

Failure:
...

Navigation after success:
...

UI error:
...
```

Nếu frontend có retry, optimistic update, cache invalidation hoặc redirect thì phải ghi lại.

---

# 8. WebSocket Behavior

Phân tích:

* Connect
* Disconnect
* Reconnect
* Subscribe
* Unsubscribe
* Send
* Receive
* Heartbeat
* Event handling

Format:

```markdown
## Room WebSocket

Connection trigger:
...

Subscriptions:
...

Events:
...

Event → UI effect:

EVENT_A
→ update room state
→ update player list
→ ...

Disconnect:
...

Reconnect:
...

Resynchronization:
...
```

---

# 9. Authentication UX

Phân tích:

* Login
* Register
* Logout
* Refresh
* Session restoration
* Guest
* Protected routes
* Unauthorized response
* Expired session

Ví dụ:

```text
Application starts
→ restore authentication
→ fetch user
→ render authenticated UI
```

Document behavior thực tế.

---

# 10. Authorization UI

Xác định UI nào phụ thuộc vào:

* User role
* Ownership
* Room role
* Game role
* Authentication

Ví dụ:

```text
Host sees "Start Game"
Spectator does not see "Start Game"
```

Nhưng ghi rõ:

> Frontend visibility rule

Không kết luận đây là backend permission nếu chưa kiểm tra backend.

---

# 11. Forms and Validation

Document:

* Required fields
* Validation
* Error messages
* Submit behavior
* Disabled state
* Loading state
* Reset behavior

Ví dụ:

```text
Create Room form

Field:
roomName

Required:
yes

Validation:
...

Submit:
...

Invalid:
...

Valid:
...
```

---

# 12. Navigation

Map các navigation flow:

```text
Route A
 ↓ action
Route B
```

Bao gồm:

* Redirect
* Protected route
* Back navigation
* Deep link
* Query params
* Route params

---

# 13. Realtime / Connection Edge Cases

Đặc biệt tìm:

* Browser refresh
* Tab close
* Network disconnect
* WebSocket reconnect
* API timeout
* Duplicate event
* Stale state
* Room state mismatch
* Game state mismatch

Document:

```text
Situation
→ Frontend detects
→ Frontend behavior
→ UI result
→ Recovery
```

---

# 14. Error Semantics

Map backend error → frontend behavior.

Ví dụ:

```text
ROOM_FULL
→ show room full message
→ prevent navigation
```

Tạo:

| Backend Error | Frontend Behavior | User-visible Result |
| ------------- | ----------------- | ------------------- |

Nếu frontend không biết semantic meaning mà chỉ hiển thị generic error, ghi đúng behavior đó.

---

# 15. Domain Glossary

Tạo:

```text
glossary.md
```

Chỉ document terminology mà frontend thực sự sử dụng.

Ví dụ:

```text
Room
Lobby
Spectator
Player
Host
Presence
...
```

Không tự định nghĩa business meaning nếu frontend không đủ information.

---

# 16. FAQ

Tạo FAQ dựa trên frontend behavior.

Ví dụ:

```text
Q: Làm sao để tạo room?
Q: Sau khi tạo room thì user được đưa tới đâu?
Q: Làm sao user biết có player mới join?
Q: Nếu mất kết nối WebSocket thì UI làm gì?
Q: Khi session hết hạn thì chuyện gì xảy ra?
Q: User có thể truy cập trang room trực tiếp bằng URL không?
```

---

# 17. RAG Optimization

Tài liệu phải:

* Chunk-friendly
* Heading rõ ràng
* Một section = một concept
* Context đầy đủ
* Không dùng "nó", "cái này", "ở trên"
* Không tạo paragraph quá dài

Ưu tiên:

```text
Actor
Trigger
Action
UI State
API
WebSocket
Navigation
Result
Error
Recovery
```

---

# 18. Output Structure

Tạo:

```text
docs/business/frontend/

├── README.md
├── glossary.md
├── screens.md
├── user-journeys.md
├── navigation.md
├── authentication.md
├── permissions.md
├── api-interactions.md
├── websocket.md
├── errors.md
├── faq.md
├── screens/
│   ├── <screen>.md
│   └── ...
└── workflows/
    ├── <workflow>.md
    └── ...
```

Chỉ tạo file thực sự cần thiết.

---

# 19. Metadata

Mỗi document:

```yaml
---
source: frontend
type: application-behavior
domain: <domain>
---
```

---

# 20. Audit

Kiểm tra:

* [ ] Đã đọc toàn bộ frontend
* [ ] Tất cả screen đã được discover
* [ ] User journey đã được document
* [ ] API interaction đã được document
* [ ] WebSocket đã được document
* [ ] Authentication đã được document
* [ ] UI authorization đã được document
* [ ] Navigation đã được document
* [ ] Error handling đã được document
* [ ] Loading/empty/error states đã được document
* [ ] Disconnect/reconnect đã được document
* [ ] Edge cases đã được document
* [ ] FAQ đã được tạo
* [ ] Không tự suy đoán backend rule

Cuối cùng trả về:

```markdown
# Frontend Business Behavior Report

## Screens discovered

Total: XX

## User journeys

Total: XX

## API interactions

Total: XX

## WebSocket interactions

Total: XX

## Important UI states

...

## Important edge cases

...

## Frontend / Backend assumptions

...

## Unknown behavior

...

## RAG readiness

Score: X/10

Problems:
...

Recommendations:
...
```

**Không sửa source code. Chỉ phân tích và tạo documentation.**
