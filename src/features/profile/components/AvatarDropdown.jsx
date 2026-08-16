import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut, Shield, FileText, UserPlus } from 'lucide-react';

/**
 * AvatarDropdown displays profile information and options.
 * It listens for clicks outside and Escape keystrokes to close.
 */
export const AvatarDropdown = ({ user, onClose, onLogout, className = "absolute right-0 top-full mt-2" }) => {
  const { t } = useTranslation(['nav', 'profile', 'auth', 'common']);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Handle click outside of dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Handle Escape key
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const isGuestUser = Boolean(user?.isGuest || user?.role === 'GUEST');
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'G';
  const roleText = isGuestUser ? 'GUEST' : (user?.role || 'USER');

  return (
    <div
      ref={dropdownRef}
      className={`${className} w-64 bg-chess-surface border border-chess-border rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in text-left`}
      role="menu"
      aria-label="User profile dropdown"
    >
      {/* Header Info */}
      <div className="p-4 border-b border-chess-border bg-chess-dark flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border border-chess-gold/60 bg-chess-dark text-chess-gold flex items-center justify-center font-bold shrink-0 overflow-hidden select-none">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.username}'s avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-playfair text-xl font-bold">{initial}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-inter text-sm font-bold text-chess-text truncate">
            {user?.username}
          </p>
          <p className="font-inter text-xs text-chess-muted truncate mb-1">
            {user?.email || (isGuestUser ? t('profile:anonymous_account') : '')}
          </p>
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest bg-chess-gold/10 text-chess-gold px-2 py-0.5 rounded font-inter font-bold border border-chess-gold/30">
            <Shield className="w-2.5 h-2.5" />
            {roleText}
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {isGuestUser && (
          <Link
            to="/register"
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-4 py-2.5 mx-2 my-1 text-sm font-inter font-bold text-chess-dark bg-chess-gold hover:bg-chess-gold-hover rounded-md transition-colors shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-chess-gold focus:ring-offset-2 focus:ring-offset-chess-dark"
            role="menuitem"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('auth:link_account')}</span>
          </Link>
        )}

        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-inter font-semibold text-chess-text hover:bg-chess-dark hover:text-chess-gold transition-colors focus:outline-none focus:bg-chess-dark focus:text-chess-gold"
          role="menuitem"
        >
          <User className="w-4 h-4 text-chess-gold" />
          <span>{t('nav:profile')}</span>
        </Link>
        <Link
          to="/forum/my-posts"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-inter font-semibold text-chess-text hover:bg-chess-dark hover:text-chess-gold transition-colors focus:outline-none focus:bg-chess-dark focus:text-chess-gold"
          role="menuitem"
        >
          <FileText className="w-4 h-4 text-chess-gold" />
          <span>{t('profile:manage_posts')}</span>
        </Link>
        <Link
          to="/profile?edit=true"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-inter font-semibold text-chess-text hover:bg-chess-dark hover:text-chess-gold transition-colors focus:outline-none focus:bg-chess-dark focus:text-chess-gold"
          role="menuitem"
        >
          <Settings className="w-4 h-4 text-chess-gold" />
          <span>{t('profile:edit_profile')}</span>
        </Link>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-chess-border py-1 bg-chess-dark/40">
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-inter font-bold text-red-500 hover:bg-red-950/20 hover:text-red-400 transition-colors cursor-pointer text-left focus:outline-none focus:bg-red-950/20"
          role="menuitem"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>{t('nav:logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default AvatarDropdown;
