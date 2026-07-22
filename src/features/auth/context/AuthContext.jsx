import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { authService } from '../services/authService';
import { setAccessToken, registerOnLogout } from '../api/authClient';
import { profileService } from '../../profile/services/profileService';
import GuestChoiceModal from '../components/GuestChoiceModal';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);

  // Single-flight & mounting guards to prevent duplicate token rotation requests
  const refreshPromiseRef = useRef(null);
  const initAuthStartedRef = useRef(false);

  // Computed helper flags
  const isGuest = Boolean(currentUser?.isGuest || currentUser?.role === 'GUEST');
  const isRegisteredUser = Boolean(isAuthenticated && !isGuest);

  // Show a toast message for specified duration (default 4000ms)
  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now();
    setToast({ id, message, type, duration });
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, toast.duration || 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Define logout helper to clear all states
  const logoutLocal = () => {
    setAccessToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Perform logout by hitting the backend API and clearing local state & redirecting to landing page
  const logout = async () => {
    try {
      await authService.logout();
      showToast('Đã đăng xuất thành công.', 'success');
    } catch (err) {
      console.warn('Logout request failed or timed out', err);
    } finally {
      logoutLocal();
      navigate('/', { replace: true });
    }
  };

  // Login as Guest handler (tries loginGuest -> fallback registerGuest -> retry loginGuest)
  const loginGuest = async () => {
    let data;
    try {
      // Step 1: Attempt loginGuest first
      data = await authService.loginGuest();
    } catch (loginErr) {
      // Step 2: If loginGuest fails (no guest account yet), call registerGuest
      try {
        await authService.registerGuest();
        // Step 3: Retry loginGuest after successful guest registration
        data = await authService.loginGuest();
      } catch (regErr) {
        console.error('Failed guest registration/login flow', regErr);
        showToast('Không thể khởi tạo tài khoản Khách (Guest).', 'error');
        throw regErr;
      }
    }

    if (!data?.accessToken) {
      const err = new Error('No access token received for guest account');
      showToast('Đăng nhập Khách (Guest) không thành công.', 'error');
      throw err;
    }

    setAccessToken(data.accessToken);

    try {
      const userProfile = await profileService.getCurrentUser();
      const guestObj = {
        ...userProfile,
        role: userProfile.role || 'GUEST',
        isGuest: true
      };
      setCurrentUser(guestObj);
      setIsAuthenticated(true);
      setIsGuestModalOpen(false);
      return guestObj;
    } catch (profileErr) {
      const guestObj = data.user || {
        id: 'guest_' + Math.floor(Math.random() * 1000),
        username: 'Guest Player',
        role: 'GUEST',
        isGuest: true
      };
      setCurrentUser(guestObj);
      setIsAuthenticated(true);
      setIsGuestModalOpen(false);
      return guestObj;
    }
  };

  // Regular user login handler
  const login = async (usernameOrEmail, password) => {
    const data = await authService.login(usernameOrEmail, password);
    setAccessToken(data.accessToken);

    // Fetch detailed profile immediately
    try {
      const userProfile = await profileService.getCurrentUser();
      const userObj = { ...userProfile, role: userProfile.role || 'USER', isGuest: false };
      setCurrentUser(userObj);
      setIsAuthenticated(true);
      setIsGuestModalOpen(false);
      showToast(`Welcome back, ${userObj.username}!`, 'success');
      return userObj;
    } catch (err) {
      const fallbackUser = { ...data.user, role: data.user?.role || 'USER', isGuest: false };
      setCurrentUser(fallbackUser);
      setIsAuthenticated(true);
      setIsGuestModalOpen(false);
      showToast(`Welcome back, ${fallbackUser.username || 'player'}!`, 'success');
      return fallbackUser;
    }
  };

  // Refresh token helper (Single-Flight guarded to prevent Token Rotation 401 race conditions)
  const refreshToken = async () => {
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    refreshPromiseRef.current = (async () => {
      try {
        // If currently logged in user is guest, also call refresh/guest-token to renew guest cookie
        if (isGuest) {
          try {
            await authService.refreshGuestToken();
          } catch (e) {
            console.warn('Failed to refresh guest token cookie', e);
          }
        }

        const data = await authService.refresh();
        setAccessToken(data.accessToken);

        // Treat Guest as a system User: always fetch /api/users/me profile details
        try {
          const userProfile = await profileService.getCurrentUser();
          const userRole = userProfile.role || (isGuest ? 'GUEST' : 'USER');
          const userObj = {
            ...userProfile,
            role: userRole,
            isGuest: userRole === 'GUEST' || Boolean(userProfile.isGuest)
          };
          setCurrentUser(userObj);
          setIsAuthenticated(true);
          return data.accessToken;
        } catch (profileErr) {
          if (data.user) {
            const userRole = data.user.role || (isGuest ? 'GUEST' : 'USER');
            const fallbackUser = {
              ...data.user,
              role: userRole,
              isGuest: userRole === 'GUEST' || Boolean(data.user.isGuest)
            };
            setCurrentUser(fallbackUser);
          }
          setIsAuthenticated(true);
          return data.accessToken;
        }
      } catch (err) {
        logoutLocal();
        throw err;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  };

  const updateCurrentUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const openGuestModal = () => {
    setIsGuestModalOpen(true);
  };

  const closeGuestModal = () => {
    setIsGuestModalOpen(false);
  };

  // Setup callbacks on mount
  useEffect(() => {
    registerOnLogout(() => {
      logoutLocal();
      showToast('Phiên đăng nhập đã hết hạn.', 'error');
      navigate('/', { replace: true });
    });

    if (initAuthStartedRef.current) {
      return;
    }
    initAuthStartedRef.current = true;

    const initAuth = async () => {
      try {
        // First check for active registered user session
        await refreshToken();
      } catch (err) {
        // Refresh returned 401 -> non-authenticated visitor lands on Landing Page
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    isAuthenticated,
    isGuest,
    isRegisteredUser,
    currentUser,
    isLoading,
    login,
    loginGuest,
    logout,
    refreshToken,
    showToast,
    updateCurrentUser,
    isGuestModalOpen,
    openGuestModal,
    closeGuestModal
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="min-h-screen bg-[#0d0e12] flex flex-col items-center justify-center text-[#f3f4f6]">
          <div className="relative w-16 h-16 mb-4 animate-bounce">
            <svg viewBox="0 0 24 24" className="w-16 h-16 fill-[#d4af37]">
              <path d="M19,22H5V20H19V22M17,12C17,14 15.5,15.5 13.5,15.5C13.5,15.5 13.3,15.5 13,15.5C13,15.9 12.8,16.2 12.5,16.5C12,17 11,18 10,18.5V19H17V17.5C17,16 16,14.5 16,13.5C16,13 16.5,12.5 17,12M15,9C15,7 13.5,5 11.5,5C9.5,5 8.5,6.5 8.5,8C8.5,9.5 9,10 9,11C9,12 8,13 7,14C6,15 5.5,16.5 5.5,18V19H9V18.5C9,17.5 9.5,16.5 10.5,15.5C11.5,14.5 12,14 12,13C12,12 11.5,11.5 11.5,11C11.5,10.5 12,10 12.5,10C13,10 13.5,10.5 13.5,11C13.5,11.5 13,12 13,12.5C13.5,12.5 14.5,11.5 14.5,10.5C14.5,9.5 14,9 14.5,9C15,9 15,9 15,9.5" />
            </svg>
          </div>
          <p className="font-playfair text-lg tracking-widest text-[#d4af37] animate-pulse">
            LOADING BOARD...
          </p>
        </div>
      ) : (
        <>
          {children}

          {/* Guest Choice Selection Modal */}
          <GuestChoiceModal isOpen={isGuestModalOpen} onClose={closeGuestModal} />

          {/* Global Toast Notification */}
          {toast && (
            <div
              key={toast.id || 'toast'}
              id="global-toast"
              role="alert"
              aria-live="assertive"
              className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-xl border backdrop-blur-md overflow-hidden max-w-sm ${
                toast.type === 'error'
                  ? 'bg-red-950/90 border-red-500/60 text-red-200 shadow-red-950/50'
                  : 'bg-[#1a1d24]/95 border-[#d4af37]/60 text-gray-100 shadow-black/50'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0" />
              )}
              <div className="text-sm font-medium pr-2">{toast.message}</div>
              <button
                onClick={() => setToast(null)}
                className="hover:opacity-80 p-0.5 rounded text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Real-time Progress Bar */}
              <div
                className={`absolute bottom-0 left-0 h-1 transition-all ${
                  toast.type === 'error' ? 'bg-red-500' : 'bg-[#d4af37]'
                }`}
                style={{
                  animation: `toastProgress ${toast.duration || 4000}ms linear forwards`,
                }}
              />
            </div>
          )}
        </>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
