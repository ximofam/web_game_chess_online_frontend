import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, BellOff, ArrowRight } from 'lucide-react';
import NotificationItem from './NotificationItem';

/**
 * NotificationDropdown renders the popover list of notifications under Navbar.
 * Closes automatically on outside clicks or ESC keystrokes.
 */
export const NotificationDropdown = ({
  items,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  onClose,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Dismiss on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Dismiss on Escape key
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

  // Show only top 5 recent notifications in the dropdown
  const recentItems = items.slice(0, 5);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-[#1a1d24] border border-[#2d323f] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in text-left flex flex-col max-h-[480px]"
      role="menu"
      aria-label="Notification dropdown menu"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[#13161c] border-b border-[#2d323f] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#f3f4f6] tracking-wide">
            Notifications
          </span>
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && onMarkAllRead && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-xs text-[#d4af37] hover:text-[#f3cd57] font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-[#d4af37] cursor-pointer"
            title="Mark all as read"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List container */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#2d323f]/40">
        {recentItems.length > 0 ? (
          recentItems.map((item) => (
            <NotificationItem
              key={item.id}
              item={item}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
              onCloseDropdown={onClose}
            />
          ))
        ) : (
          <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-[#0d0e12] rounded-full flex items-center justify-center border border-[#2d323f] text-[#9ca3af] mb-3 animate-pulse">
              <BellOff className="w-5 h-5 text-[#9ca3af]/60" />
            </div>
            <p className="text-xs text-[#f3f4f6] font-semibold mb-1">
              Your board is clear
            </p>
            <p className="text-[10px] text-[#9ca3af] max-w-[200px]">
              No new moves or invites. We'll alert you of game updates!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#2d323f] bg-[#13161c]/40 shrink-0">
        <Link
          to="/notifications"
          onClick={onClose}
          className="w-full py-2.5 px-4 text-xs font-semibold text-[#d4af37] hover:text-[#f3cd57] flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:bg-[#2d323f]/20"
        >
          <span>View All Notifications</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
