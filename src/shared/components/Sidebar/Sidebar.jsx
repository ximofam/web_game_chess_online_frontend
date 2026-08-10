import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home, MessageSquare, BookOpen, LogIn, UserPlus,
  UserCheck, Loader2, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useNotifications } from '../../../features/notifications/context/NotificationContext';
import NavbarAvatar from '../../../features/profile/components/NavbarAvatar';
import AvatarDropdown from '../../../features/profile/components/AvatarDropdown';
import LanguageSwitcher from '../LanguageSwitcher';

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['nav', 'auth']);
  const { currentUser, isAuthenticated, loginGuest, logout, showToast } = useAuth();
  const { connectionStatus } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Desktop sidebar state
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('sidebarExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  // Close mobile drawer when route changes
  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
  }, [location.pathname, isOpen, onClose]);

  const isHomeActive = location.pathname === '/' || location.pathname === '/dashboard';
  const isLearnActive = location.pathname.startsWith('/learn');
  const isForumActive = location.pathname.startsWith('/forum');

  const handlePlayAsGuest = async () => {
    if (isGuestLoading) return;
    setIsGuestLoading(true);
    try {
      await loginGuest();
      showToast(t('auth:guest_welcome_toast'), 'success');
      navigate('/dashboard');
    } catch {
      showToast(t('auth:guest_failed_toast'), 'error');
    } finally {
      setIsGuestLoading(false);
    }
  };

  const navItems = [
    { to: '/', icon: Home, label: t('nav:home'), active: isHomeActive },
    { to: '/learn', icon: BookOpen, label: t('nav:learn'), active: isLearnActive },
    { to: '/forum', icon: MessageSquare, label: t('nav:forum'), active: isForumActive },
  ];

  const sidebarWidth = isExpanded ? 'w-64' : 'w-16';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0d0e12]/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#13161c] border-r border-[#2d323f] shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${sidebarWidth} lg:shrink-0`}
      >
        {/* Header / Brand */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#2d323f] shrink-0">
          <a
            href="https://github.com/ximofam/web_game_chess_online_frontend"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 text-[#f3f4f6] hover:text-[#d4af37] transition-colors focus:outline-none ${!isExpanded ? 'mx-auto' : ''}`}
            title="GitHub Repository"
          >
            <GithubIcon className="w-7 h-7 shrink-0" />
            {isExpanded && <span className="font-bold text-lg whitespace-nowrap overflow-hidden">Chess Platform</span>}
          </a>

          {/* Mobile Close Button */}
          <button
            className="lg:hidden text-[#9ca3af] hover:text-[#f3f4f6] transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              title={!isExpanded ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group ${item.active
                ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30'
                : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#242834] border border-transparent'
                } ${!isExpanded ? 'justify-center px-0' : ''}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isExpanded && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Section (User & Actions) */}
        <div className="p-3 border-t border-[#2d323f] flex flex-col gap-3 shrink-0">
          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex items-center justify-center p-1.5 w-full text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#242834] rounded-lg transition-colors border border-transparent"
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className={`relative z-50 flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} bg-[#1a1d24] p-2 rounded-xl border border-[#2d323f]`}>
              <NavbarAvatar
                src={currentUser?.avatarUrl}
                username={currentUser?.username}
                isOnline={connectionStatus === 'CONNECTED'}
                onClick={() => setIsExpanded(true) || setIsDropdownOpen(!isDropdownOpen)}
              />

              {isExpanded && (
                <div className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <span className="text-sm font-semibold text-[#f3f4f6] truncate block w-full">
                    {currentUser?.username}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                    {currentUser?.role || 'USER'}
                  </span>
                </div>
              )}

              {isDropdownOpen && isExpanded && (
                <AvatarDropdown
                  user={currentUser}
                  onClose={() => setIsDropdownOpen(false)}
                  onLogout={logout}
                  className="absolute bottom-full left-0 mb-2 z-[60]"
                />
              )}
            </div>
          ) : (
            <div className={`flex flex-col gap-2 ${!isExpanded ? 'items-center' : ''}`}>
              <button
                onClick={handlePlayAsGuest}
                disabled={isGuestLoading}
                title={!isExpanded ? t('nav:play_as_guest') : undefined}
                className={`flex items-center justify-center gap-2 bg-[#d4af37] text-[#0d0e12] hover:bg-[#f3cd57] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs px-2 py-2.5 rounded-lg transition-all shadow cursor-pointer ${!isExpanded ? 'w-10 h-10 p-0' : 'w-full'}`}
              >
                {isGuestLoading ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <UserCheck className="w-5 h-5 shrink-0" />}
                {isExpanded && <span className="whitespace-nowrap truncate">{t('nav:play_as_guest')}</span>}
              </button>

              <Link
                to="/login"
                title={!isExpanded ? t('nav:login') : undefined}
                className={`flex items-center justify-center gap-2 bg-[#242834] border border-[#373d4e] hover:bg-[#2d3242] text-[#f3f4f6] font-semibold text-xs px-2 py-2.5 rounded-lg transition-all cursor-pointer ${!isExpanded ? 'w-10 h-10 p-0' : 'w-full'}`}
              >
                <LogIn className="w-5 h-5 text-[#d4af37] shrink-0" />
                {isExpanded && <span className="whitespace-nowrap">{t('nav:login')}</span>}
              </Link>

              {isExpanded && (
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 bg-[#1a1d24] border border-[#2d323f] hover:border-[#d4af37]/50 text-[#f3f4f6] font-semibold text-xs px-2 py-2.5 rounded-lg transition-all cursor-pointer w-full"
                >
                  <UserPlus className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span className="whitespace-nowrap">{t('nav:register')}</span>
                </Link>
              )}
            </div>
          )}

          {/* Language Switcher */}
          <div className={`flex ${isExpanded ? 'justify-start px-1' : 'justify-center'}`}>
            <LanguageSwitcher />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
