import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { authService } from '../services/authService';
import { setAccessToken, registerOnLogout } from '../api/authClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Show a toast message for 4 seconds
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Define logout helper to clear all states
  const logoutLocal = () => {
    setAccessToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Perform logout by hitting the backend API and clearing local state
  const logout = async () => {
    try {
      await authService.logout();
      showToast('Logged out successfully. Draw your pieces next time!', 'success');
    } catch (err) {
      console.warn('Logout request failed or timed out', err);
    } finally {
      logoutLocal();
    }
  };

  // Login handler
  const login = async (usernameOrEmail, password) => {
    const data = await authService.login(usernameOrEmail, password);
    console.log(data)
    setAccessToken(data.accessToken);
    setCurrentUser(data.user);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${data.user.username}! Your battlefield is ready.`, 'success');
    return data.user;
  };

  // Refresh token helper
  const refreshToken = async () => {
    try {
      const data = await authService.refresh();
      setAccessToken(data.accessToken);

      const profile = await authService.getProfile();
      setCurrentUser({
        id: 'u1',
        username: profile.username || 'grandmaster',
        email: profile.email || 'gm@chess.com',
        rank: profile.rank || 'Grandmaster'
      });
      setIsAuthenticated(true);
      return data.accessToken;
    } catch (err) {
      logoutLocal();
      throw err;
    }
  };

  // Setup callbacks on mount
  useEffect(() => {
    registerOnLogout(() => {
      logoutLocal();
      showToast('Session expired. Please log in again.', 'error');
    });

    const initAuth = async () => {
      try {
        await refreshToken();
      } catch (err) {
        // No session
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    logout,
    refreshToken,
    showToast
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

          {/* Chess-themed Toast Notification */}
          {toast && (
            <div
              id="global-toast"
              role="alert"
              aria-live="assertive"
              className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg border backdrop-blur-md animate-fade-in-up max-w-sm ${toast.type === 'error'
                  ? 'bg-red-950/80 border-red-500/50 text-red-200'
                  : 'bg-[#1a1d24]/90 border-[#d4af37]/50 text-gray-100'
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
