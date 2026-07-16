# Spec: User Profile

## Objective
Build a complete User Profile module for authenticated users in the Chess Arena. This allows logged-in players to view their stats and profile details, update their details (Full Name, Gender, Date of Birth), and upload a new profile avatar image. Guests are blocked from access, and all edits validate correctly prior to API updates.

## Tech Stack
- **Framework**: React 19, Vite, Tailwind CSS v4.
- **Routing**: `react-router-dom` v7.
- **Forms & Validation**: `react-hook-form` + `zod` for profile and file formats.
- **Query Management**: `@tanstack/react-query` + Axios (`authClient`).
- **Icons**: `lucide-react`.

---

## Commands
- **Dev Server**: `npm run dev`
- **Build Production**: `npm run build`
- **Lint**: `npm run lint`

---

## Project Structure
All profile features will reside in `src/features/profile`:
```
src/features/profile/
├── api/
│   └── profileApi.js          → Client wrapper for profile requests
├── components/
│   ├── AvatarDropdown.jsx     → Dropdown menu inside Navbar
│   ├── AvatarUploader.jsx     → Drag-drop or click image upload with progress
│   ├── DatePicker.jsx         → Custom/Native date picker mapping to dd/MM/yyyy
│   ├── GenderSelect.jsx       → Dropdown select for Male, Female, Other
│   ├── LoadingSkeleton.jsx    → Loading states for card and form
│   ├── NavbarAvatar.jsx       → Navbar circular avatar button
│   ├── ProfileCard.jsx        → Read-only preview of profile info
│   └── ProfileForm.jsx        → Editable form for profile details
├── pages/
│   └── ProfilePage.jsx        → Main page handling /profile route
├── services/
│   └── profileService.js      → Business logic wrappers
└── validation/
    └── profileSchema.js       → Zod schema validation rules
```

---

## API Design

### 1. Get Current User Details
- **Endpoint**: `GET /api/users/me`
- **Headers**: `Authorization: Bearer <AccessToken>`
- **Response**:
```json
{
  "id": 1,
  "username": "example_user",
  "email": "user@example.com",
  "avatarUrl": "https://...",
  "role": "USER",
  "profile": {
    "fullName": "Nguyen Van A",
    "gender": "MALE",
    "dateOfBirth": "16/07/2000"
  }
}
```

### 2. Update Profile Details
- **Endpoint**: `PATCH /api/users/me`
- **Headers**: `Authorization: Bearer <AccessToken>`
- **Request Body**:
```json
{
  "fullName": "Nguyen Van B",
  "gender": "MALE",
  "dateOfBirth": "20/08/2000"
}
```
- **Response**:
```json
{
  "id": 1,
  "username": "example_user",
  "email": "user@example.com",
  "avatarUrl": "https://...",
  "role": "USER",
  "profile": {
    "fullName": "Nguyen Van B",
    "gender": "MALE",
    "dateOfBirth": "20/08/2000"
  }
}
```

### 3. Upload Avatar Image
- **Endpoint**: `PATCH /api/users/me/avatar`
- **Headers**: `Authorization: Bearer <AccessToken>`
- **Content-Type**: `multipart/form-data`
- **Request Body**: `file=<binary_image>`
- **Response**:
```json
{
  "avatarUrl": "https://..."
}
```

---

## Code Style
We use clean React 19 functional components, React Query hooks for fetching, and Tailwind CSS v4 colors matching the Chess arena style.
Example schema representation in `validation/profileSchema.js`:

```javascript
import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    errorMap: () => ({ message: 'Gender is required' })
  }),
  dateOfBirth: z.string().regex(
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
    'Date of Birth must be in dd/MM/yyyy format'
  )
});
```

---

## Testing & Mocking Strategy
- **Mock Interceptor**: Inside `authClient.js`, when `VITE_USE_MOCK_API === 'true'`, we intercept requests:
  - Cache the mock user details (`id`, `username`, `email`, `role`, `avatarUrl`, `profile`).
  - `GET /api/users/me` returns cached user state.
  - `PATCH /api/users/me` saves profile fields.
  - `PATCH /api/users/me/avatar` creates a temporary object URL or mock URL for the image file and updates the cached user avatar.
- **Manual Verification**: Verify inputs update profile state on screen. Verify logout occurs automatically if GET requests return `401`.

---

## Boundaries
- **Always**: Keep forms accessible, style inputs with gold-to-dark theme, and handle keyboard navigation.
- **Ask First**: Adding external date picker packages if standard HTML5 date pickers with formatting utilities do not suffice.
- **Never**: Accept upload file types outside `jpg, jpeg, png, webp`.

---

## Success Criteria
- [ ] User can view profile details under `/profile`.
- [ ] User can edit profile details with correct form validation.
- [ ] Date format `dd/MM/yyyy` parses and displays correctly in the edit form.
- [ ] User can upload a new avatar with file progress indicators.
- [ ] Navbar avatar and profile layout image refresh instantly upon update.
- [ ] Clean responsive design across mobile, tablet, and desktop views.
- [ ] Unauthorized profile access redirects to `/login`.
