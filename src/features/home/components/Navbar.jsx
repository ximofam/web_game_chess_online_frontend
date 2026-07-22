import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Home, MessageSquare, BookOpen, LogIn, UserPlus, UserCheck, WifiOff, Users } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import { useNotifications } from '../../notifications/context/NotificationContext';
import { useOnlineCount } from '../../presence/socket/presenceSocket';
import NavbarAvatar from '../../profile/components/NavbarAvatar';
import AvatarDropdown from '../../profile/components/AvatarDropdown';
import NotificationBell from '../../notifications/components/NotificationBell';

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

/**
 * Global Navigation Header.
 * Features Navigation links (Home, Forum, Learn) and displays User Profile Dropdown or Guest Status & Auth CTAs.
 */
export const Navbar = () => {
  const { t } = useTranslation(['nav', 'auth']);
  const { currentUser, isAuthenticated, loginGuest, logout, showToast } = useAuth();
  const { connectionStatus, reconnect } = useNotifications();
  const onlineCount = useOnlineCount();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomeActive = location.pathname === '/' || location.pathname === '/dashboard';
  const isForumActive = location.pathname.startsWith('/forum');
  const isLearnActive = location.pathname.startsWith('/learn');

  const handlePlayAsGuest = async () => {
    try {
      await loginGuest();
      showToast(t('auth:guest_welcome_toast'), 'success');
      navigate('/dashboard');
    } catch {
      showToast(t('auth:guest_failed_toast'), 'error');
    }
  };

  return (
    <header className="w-full border-b border-[#2d323f] bg-[#13161c] px-4 md:px-8 py-3.5 flex items-center justify-between relative z-40 select-none shadow-md">
      {/* Brand Logo & Navigation Links */}
      <div className="flex items-center gap-4 md:gap-8">
        <a
          href="https://github.com/ximofam/web_game_chess_online_frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-[#f3f4f6] hover:text-[#d4af37] transition-colors focus:outline-none focus:ring-1 focus:ring-[#d4af37] rounded p-1"
          aria-label="GitHub Repository"
          title="GitHub Repository"
        >
          <GithubIcon className="w-6 h-6" />
        </a>

        {/* Primary Nav Links (Home, Forum, Learn) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${isHomeActive
              ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30'
              : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#242834]'
              }`}
          >
            <Home className="w-4 h-4" />
            <span>{t('nav:home')}</span>
          </Link>

          <Link
            to="/learn"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${isLearnActive
              ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30'
              : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#242834]'
              }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('nav:learn')}</span>
          </Link>

          <Link
            to="/forum"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${isForumActive
              ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30'
              : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#242834]'
              }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('nav:forum')}</span>
          </Link>
        </nav>
      </div>

      {/* User Actions & Auth Status */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 md:gap-4">
            {/* Realtime Online Users Badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-[#373d4e] bg-[#1d222e] text-[#e5e7eb] select-none"
              title="Số người dùng online"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-xs">{onlineCount}</span>
              <span className="hidden md:inline text-[10px] text-[#9ca3af] uppercase tracking-wider">online</span>
            </div>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-[#f3f4f6] leading-tight">
                {currentUser?.username}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mt-0.5">
                {currentUser?.role || 'USER'}
              </span>
            </div>

            <NotificationBell />

            <div className="relative">
              <NavbarAvatar
                src={currentUser?.avatarUrl}
                username={currentUser?.username}
                isOnline={connectionStatus === 'CONNECTED'}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />

              {isDropdownOpen && (
                <AvatarDropdown
                  user={currentUser}
                  onClose={() => setIsDropdownOpen(false)}
                  onLogout={logout}
                />
              )}
            </div>
          </div>
        ) : (
          /* Unauthenticated Visitor Options */
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Play as Guest Quick Trigger */}
            <button
              onClick={handlePlayAsGuest}
              className="hidden sm:flex items-center gap-1.5 bg-[#d4af37] text-[#0d0e12] hover:bg-[#f3cd57] font-bold text-xs px-3 py-2 rounded-lg transition-all shadow cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t('nav:play_as_guest')}</span>
            </button>

            {/* Login Link */}
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-[#242834] border border-[#373d4e] hover:bg-[#2d3242] text-[#f3f4f6] font-semibold text-xs px-3 py-2 rounded-lg transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#d4af37]" />
              <span>{t('nav:login')}</span>
            </Link>

            {/* Register Link */}
            <Link
              to="/register"
              className="hidden md:flex items-center gap-1.5 bg-[#1a1d24] border border-[#2d323f] hover:border-[#d4af37]/50 text-[#f3f4f6] font-semibold text-xs px-3 py-2 rounded-lg transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#d4af37]" />
              <span>{t('nav:register')}</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
