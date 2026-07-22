import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { SocketProvider } from './socket/SocketProvider';
import { NotificationProvider } from './features/notifications/context/NotificationContext';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import LandingPage from './features/landing/pages/LandingPage';
import Dashboard from './features/home/Dashboard';
import ProfilePage from './features/profile/pages/ProfilePage';
import NotificationsPage from './features/notifications/pages/NotificationsPage';
import ForumListPage from './features/forum/pages/ForumListPage';
import ForumCreatePage from './features/forum/pages/ForumCreatePage';
import PostDetailPage from './features/forum/pages/PostDetailPage';
import MyPostsPage from './features/forum/pages/MyPostsPage';
import LearnOverviewPage from './features/learn/pages/LearnOverviewPage';
import LessonDetailPage from './features/learn/pages/LessonDetailPage';
import PlayBotPage from './features/learn/pages/PlayBotPage';

// Create a client for TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

/**
 * HomeIndex renders Dashboard for authenticated users/guests and LandingPage for non-authenticated visitors.
 */
const HomeIndex = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Dashboard /> : <LandingPage />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <Routes>
                {/* Auth Routes (Login, Register - Directly Accessible) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Public Routes (Accessible to Guest & User with Navbar + Footer) */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<HomeIndex />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/learn" element={<LearnOverviewPage />} />
                  <Route path="/learn/play-bot" element={<PlayBotPage />} />
                  <Route path="/learn/:lessonId" element={<LessonDetailPage />} />
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
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
