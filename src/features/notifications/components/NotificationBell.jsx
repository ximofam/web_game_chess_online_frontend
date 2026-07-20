import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import NotificationBadge from './NotificationBadge';
import NotificationDropdown from './NotificationDropdown';

/**
 * NotificationBell is the Navbar trigger button that manages dropdown displays
 * and badge overlays.
 */
export const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteItem,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-[#1a1d24]/50 border border-[#2d323f]/50 hover:bg-[#2d323f]/50 text-[#9ca3af] hover:text-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition-all relative cursor-pointer"
        aria-label="Open notifications panel"
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        <Bell className="w-5 h-5" />
        <NotificationBadge count={unreadCount} />
      </button>

      {isOpen && (
        <NotificationDropdown
          items={notifications}
          unreadCount={unreadCount}
          onMarkRead={markAsRead}
          onMarkAllRead={markAllAsRead}
          onDelete={deleteItem}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
