import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home, MessageSquare, BookOpen, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation(['nav']);
  const location = useLocation();

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
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-chess-dark border-r border-chess-border shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${sidebarWidth} lg:shrink-0`}
      >
        {/* Header / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-chess-border shrink-0 bg-chess-surface/30">
          <a
            href="https://github.com/ximofam/web_game_chess_online_frontend"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 text-chess-text hover:text-chess-gold transition-colors focus:outline-none ${!isExpanded ? 'mx-auto' : ''}`}
            title="GitHub Repository"
          >
            <GithubIcon className="w-7 h-7 shrink-0" />
            {isExpanded && (
              <span className="font-playfair font-bold text-xl whitespace-nowrap overflow-hidden tracking-wider text-chess-text">
                V<span className="text-chess-gold">i</span>e<span className="text-chess-gold">C</span>hess
              </span>
            )}
          </a>

          {/* Mobile Close Button */}
          <button
            className="lg:hidden text-chess-muted hover:text-chess-text transition-colors focus:outline-none cursor-pointer"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              title={!isExpanded ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-inter font-bold transition-all group focus:outline-none focus:ring-2 focus:ring-chess-gold cursor-pointer ${
                item.active
                  ? 'bg-chess-gold/15 text-chess-gold border border-chess-gold/30'
                  : 'text-chess-muted hover:text-chess-text hover:bg-chess-surface border border-transparent'
              } ${!isExpanded ? 'justify-center px-0' : ''}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isExpanded && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Section (Collapse Button only) */}
        <div className="p-3 border-t border-chess-border flex flex-col shrink-0">
          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden lg:flex items-center justify-center p-2 w-full text-chess-muted hover:text-chess-text hover:bg-chess-surface rounded-lg transition-colors border border-transparent focus:outline-none focus:ring-2 focus:ring-chess-gold cursor-pointer"
            title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
