import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/context/AuthContext';
import { NotificationProvider } from './features/notifications/context/NotificationContext';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import Dashboard from './features/home/Dashboard';
import ProfilePage from './features/profile/pages/ProfilePage';
import NotificationsPage from './features/notifications/pages/NotificationsPage';
import ForumListPage from './features/forum/pages/ForumListPage';
import ForumCreatePage from './features/forum/pages/ForumCreatePage';
import PostDetailPage from './features/forum/pages/PostDetailPage';
import MyPostsPage from './features/forum/pages/MyPostsPage';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Auth Routes (Login, Register - Directly Accessible) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Public Routes (Accessible to Guest & User with Navbar + Footer) */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/forum" element={<ForumListPage />} />
                <Route path="/forum/posts/:id" element={<PostDetailPage />} />
              </Route>

              {/* Registered User Only Routes */}
              <Route element={<ProtectedLayout />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/forum/create" element={<ForumCreatePage />} />
                <Route path="/forum/my-posts" element={<MyPostsPage />} />
              </Route>

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
