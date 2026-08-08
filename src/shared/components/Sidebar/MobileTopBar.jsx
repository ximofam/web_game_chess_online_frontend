import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NotificationBell from '../../../features/notifications/components/NotificationBell';
import NavbarAvatar from '../../../features/profile/components/NavbarAvatar';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { useNotifications } from '../../../features/notifications/context/NotificationContext';

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const MobileTopBar = ({ onOpenSidebar }) => {
  const { t } = useTranslation(['nav']);
  const { currentUser, isAuthenticated } = useAuth();
  const { connectionStatus } = useNotifications();

  return (
    <header className="lg:hidden w-full border-b border-[#2d323f] bg-[#13161c] px-4 py-3 flex items-center justify-between shrink-0 select-none shadow-md z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-1 text-[#9ca3af] hover:text-[#f3f4f6] focus:outline-none focus:ring-1 focus:ring-[#d4af37] rounded transition-colors"
          aria-label={t('nav:open_sidebar', 'Open sidebar')}
        >
          <Menu className="w-6 h-6" />
        </button>
        <a
          href="https://github.com/ximofam/web_game_chess_online_frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#f3f4f6] hover:text-[#d4af37] transition-colors focus:outline-none"
        >
          <GithubIcon className="w-6 h-6" />
        </a>
      </div>
      
      {isAuthenticated && (
        <div className="flex items-center gap-3">
          <NotificationBell />
          <NavbarAvatar
            src={currentUser?.avatarUrl}
            username={currentUser?.username}
            isOnline={connectionStatus === 'CONNECTED'}
            onClick={onOpenSidebar}
          />
        </div>
      )}
    </header>
  );
};

export default MobileTopBar;
