import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, MailOpen, User } from 'lucide-react';

/**
 * Helper to display human-readable relative time intervals.
 */
export const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  if (isNaN(diffMs)) return '';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

/**
 * NotificationItem represents a single notification row with details and actions.
 */
export const NotificationItem = ({ item, onMarkRead, onDelete, onCloseDropdown }) => {
  const navigate = useNavigate();
  const { sender, type, title, message, createdAt, read, metadata } = item;
  const initial = sender?.username ? sender.username.charAt(0).toUpperCase() : 'U';

  const handleItemClick = async (e) => {
    // If clicking action buttons, do not trigger navigation
    if (e.target.closest('.action-btn')) return;

    // Mark as read
    if (!read && onMarkRead) {
      await onMarkRead(item.id);
    }

    if (onCloseDropdown) {
      onCloseDropdown();
    }

    // Contextual navigation
    if (type === 'POST_LIKE' && metadata?.postId) {
      navigate(`/posts/${metadata.postId}`);
    } else if (type === 'ROOM_INVITE' && metadata?.roomId) {
      navigate(`/rooms/${metadata.roomId}`);
    } else {
      // Default fallback
      navigate('/notifications');
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className={`p-3.5 border-b border-[#2d323f]/60 flex items-start gap-3 transition-colors duration-200 cursor-pointer ${
        read ? 'bg-[#1a1d24]/40 hover:bg-[#2d323f]/30' : 'bg-[#d4af37]/5 hover:bg-[#d4af37]/10'
      }`}
      role="listitem"
    >
      {/* Sender Avatar */}
      <div className="w-9 h-9 rounded-full border border-[#d4af37]/45 bg-[#0d0e12] text-[#d4af37] flex items-center justify-center font-semibold shrink-0 overflow-hidden select-none">
        {sender?.avatarUrl ? (
          <img src={sender.avatarUrl} alt={sender.username} className="w-full h-full object-cover" />
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-xs font-semibold text-[#f3f4f6] truncate">
            {sender?.username || 'System'}
          </span>
          <span className="text-[10px] text-[#9ca3af] whitespace-nowrap">
            {formatRelativeTime(createdAt)}
          </span>
        </div>
        <p className={`text-xs text-[#f3f4f6] font-semibold mb-1 leading-normal ${!read ? 'font-semibold' : 'font-normal'}`}>
          {title}
        </p>
        <p className="text-xs text-[#9ca3af] leading-relaxed break-words">
          {message}
        </p>
      </div>

      {/* Individual Actions */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        {/* Unread circle status */}
        {!read && (
          <span className="w-2.5 h-2.5 bg-[#d4af37] rounded-full border border-[#1a1d24]" title="Unread" />
        )}

        <div className="flex items-center gap-1">
          {!read && onMarkRead && (
            <button
              onClick={() => onMarkRead(item.id)}
              className="action-btn p-1 hover:bg-[#2d323f] text-[#9ca3af] hover:text-[#d4af37] rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#d4af37]"
              title="Mark as read"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="action-btn p-1 hover:bg-[#2d323f] text-[#9ca3af] hover:text-red-400 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-red-400"
              title="Delete notification"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
