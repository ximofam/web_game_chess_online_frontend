import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, Shield } from 'lucide-react';

/**
 * AvatarDropdown displays profile information and options.
 * It listens for clicks outside and Escape keystrokes to close.
 */
export const AvatarDropdown = ({ user, onClose, onLogout }) => {
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

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'P';
  const roleText = user?.role || 'USER';

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-64 bg-[#1a1d24] border border-[#2d323f] rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in text-left"
      role="menu"
      aria-label="User profile dropdown"
    >
      {/* Header Info */}
      <div className="p-4 border-b border-[#2d323f] bg-[#13161c] flex items-center gap-3">
        <div className="w-12 h-12 rounded-full border border-[#d4af37]/60 bg-[#0d0e12] text-[#d4af37] flex items-center justify-center font-bold shrink-0 overflow-hidden select-none">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={`${user.username}'s avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-base font-bold">{initial}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#f3f4f6] truncate">
            {user?.username}
          </p>
          <p className="text-xs text-[#9ca3af] truncate mb-1">
            {user?.email}
          </p>
          <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider bg-[#d4af37]/10 text-[#d4af37] px-2 py-0.5 rounded-full font-semibold border border-[#d4af37]/30">
            <Shield className="w-2.5 h-2.5" />
            {roleText}
          </span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#f3f4f6] hover:bg-[#2d323f]/50 hover:text-[#d4af37] transition-colors"
          role="menuitem"
        >
          <User className="w-4 h-4 text-[#d4af37]" />
          <span>My Profile</span>
        </Link>
        <Link
          to="/profile?edit=true"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#f3f4f6] hover:bg-[#2d323f]/50 hover:text-[#d4af37] transition-colors"
          role="menuitem"
        >
          <Settings className="w-4 h-4 text-[#d4af37]" />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-[#2d323f] py-1 bg-[#13161c]/40">
        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer text-left"
          role="menuitem"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AvatarDropdown;
