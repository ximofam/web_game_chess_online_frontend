import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import { SocketProvider } from './shared/socket/SocketProvider';
import { PresenceProvider } from './features/presence/context/PresenceContext';
import { NotificationProvider } from './features/notifications/context/NotificationContext';
import PublicLayout from './layouts/PublicLayout';
import ProtectedLayout from './layouts/ProtectedLayout';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import LandingPage from './features/home/pages/LandingPage';
import Dashboard from './features/home/pages/Dashboard';
import ProfilePage from './features/profile/pages/ProfilePage';
import NotificationsPage from './features/notifications/pages/NotificationsPage';
import ForumListPage from './features/forum/pages/ForumListPage';
import ForumCreatePage from './features/forum/pages/ForumCreatePage';
import PostDetailPage from './features/forum/pages/PostDetailPage';
import MyPostsPage from './features/forum/pages/MyPostsPage';
import LearnOverviewPage from './features/learn/pages/LearnOverviewPage';
import LessonDetailPage from './features/learn/pages/LessonDetailPage';
import PlayBotPage from './features/learn/pages/PlayBotPage';
import RoomPage from './features/rooms/pages/RoomPage';
import GlobalApiErrorHandler from './shared/errors/components/GlobalApiErrorHandler';
import NotFoundPage from './shared/errors/pages/NotFoundPage';
import ForbiddenPage from './shared/errors/pages/ForbiddenPage';

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

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <SocketProvider>
          <PresenceProvider>
            <NotificationProvider>
              <GlobalApiErrorHandler />
              <Outlet />
            </NotificationProvider>
          </PresenceProvider>
        </SocketProvider>
      </AuthProvider>
    ),
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <HomeIndex /> },
          { path: '/landing', element: <LandingPage /> },
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/room/:roomId', element: <RoomPage /> },
          { path: '/learn', element: <LearnOverviewPage /> },
          { path: '/learn/play-bot', element: <PlayBotPage /> },
          { path: '/learn/:lessonId', element: <LessonDetailPage /> },
          { path: '/forum', element: <ForumListPage /> },
          { path: '/forum/posts/:id', element: <PostDetailPage /> },
          { path: '/403', element: <ForbiddenPage /> },
          { path: '/404', element: <NotFoundPage /> },
        ],
      },
      {
        element: <ProtectedLayout />,
        children: [
          { path: '/profile', element: <ProfilePage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/forum/create', element: <ForumCreatePage /> },
          { path: '/forum/my-posts', element: <MyPostsPage /> },
        ],
      },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
