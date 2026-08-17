
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth/context/AuthContext';
import NotificationBell from '../../features/notifications/components/NotificationBell';
import ChatbotWidget from '../../features/ai-chat/components/ChatbotWidget';
import LanguageSwitcher from './LanguageSwitcher';

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Header = ({ onOpenSidebar }) => {
  const { t } = useTranslation(['nav', 'auth']);
  const { isAuthenticated } = useAuth();

  return (
    <header className="w-full h-16 border-b border-chess-border bg-chess-dark px-4 lg:px-6 flex items-center justify-between shrink-0 select-none z-40 transition-colors">
      {/* Left side: Mobile Hamburger + Github */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-1 text-chess-muted hover:text-chess-text focus:outline-none focus:ring-1 focus:ring-chess-gold rounded transition-colors cursor-pointer"
          aria-label={t('nav:open_sidebar', 'Open sidebar')}
        >
          <Menu className="w-6 h-6" />
        </button>
        <a
          href="https://github.com/ximofam/web_game_chess_online_frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="lg:hidden flex items-center gap-2 text-chess-text hover:text-chess-gold transition-colors focus:outline-none"
        >
          <GithubIcon className="w-6 h-6" />
        </a>
      </div>
      
      {/* Right side: Utilities */}
      <div className="flex items-center gap-4 lg:gap-5 ml-auto">
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center gap-4 lg:gap-5 relative">
            <NotificationBell />
            <ChatbotWidget />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
