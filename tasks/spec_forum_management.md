# Spec: Forum Enhancements & User Post Management Page

## Objective
Update the Forum feature according to the Forum API Specification and add a dedicated **User Post Management Page** (`/forum/my-posts`).
This allows registered users (non-GUEST) to search, sort, filter, view status (`PENDING`, `APPROVED`, `DENIED`), view AI approval notes, and delete their own posts.

## Tech Stack
- React 19 + Vite
- React Router v7
- TanStack Query v5
- Tailwind CSS v4
- Lucide React icons
- Axios (via `authClient`)

## Commands
```bash
Build: npm run build
Lint:  npm run lint
Dev:   npm run dev
```

## Project Structure
```
src/
├── features/
│   └── forum/
│       ├── components/
│       │   ├── PostCard.jsx
│       │   ├── MyPostCard.jsx          # Component for user post item in management page
│       │   ├── PostSkeleton.jsx
│       │   └── ApprovalInfoModal.jsx   # Modal for showing approval/denial notes
│       ├── pages/
│       │   ├── ForumListPage.jsx       # Public forum list with search & sort
│       │   ├── ForumCreatePage.jsx     # Create post page
│       │   ├── PostDetailPage.jsx      # Public post detail page
│       │   └── MyPostsPage.jsx         # User post management page (/forum/my-posts)
│       └── services/
│           └── forumService.js         # API client updated with search, sort, mine, status, delete, getMyPost
```

## Code Style
- Single responsibility components in `src/features/forum/components`.
- TanStack Query hooks for async state management and optimistic updates.
- Tailwind CSS with dark theme tokens (`#0d0e12` bg, `#161922` card bg, `#d4af37` gold accent).
- Responsive, accessible interactive elements with unique IDs for testing.

## Testing Strategy
- Pre-commit build check (`npm run build`).
- Lint check (`npm run lint`).
- Manual verification & component sanity checks.

## Boundaries
- **Always do:** Check authentication and non-GUEST role before invoking mutation endpoints (create, like, delete, upload).
- **Ask first:** Modifying core `authClient` configuration or database schemas.
- **Never do:** Allow GUEST users to access `/forum/my-posts` or post/delete APIs.

## Success Criteria
1. `forumService.js` updated to cover all endpoints from API spec:
   - `getPosts(page, size, search, sortBy, mine, status)`
   - `getMyPost(postId)`
   - `deletePost(postId)`
2. `ForumListPage.jsx` enhanced:
   - Search bar by title (with debounce/submit).
   - Sort dropdown (`Mới nhất`, `Xem nhiều nhất`, `Thích nhiều nhất`).
   - "Bài viết của tôi" button leading to `/forum/my-posts`.
3. New `MyPostsPage.jsx` (`/forum/my-posts`) created:
   - Status tabs: `Tất cả`, `Chờ duyệt (PENDING)`, `Đã duyệt (APPROVED)`, `Từ chối (DENIED)`.
   - Displays list of user's posts with status badges and metrics (views, likes, comments).
   - Ability to view AI review/approval info (`approvalInfo.approvalNote`).
   - Delete post confirmation with soft-delete call (`DELETE /api/posts/{postId}`).
4. Routing in `App.jsx` updated under `ProtectedLayout`.

## Assumptions
1. `/forum/my-posts` is placed inside `ProtectedLayout` so only logged-in non-GUEST users can access it.
2. Status filter options on `/forum/my-posts` correspond to `status` query param (`PENDING`, `APPROVED`, `DENIED`).
