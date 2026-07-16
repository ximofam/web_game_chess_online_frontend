import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import NavbarAvatar from '../../profile/components/NavbarAvatar';
import AvatarDropdown from '../../profile/components/AvatarDropdown';
import NotificationBell from '../../notifications/components/NotificationBell';

/**
 * Global Navigation Header. Displays Arena brand logo and the
 * Profile Avatar with toggleable options dropdown.
 */
export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="border-b border-[#2d323f] bg-[#13161c] px-6 py-4 flex items-center justify-between relative z-40 select-none">
      {/* Brand Logo */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none focus:ring-1 focus:ring-[#d4af37] rounded"
        aria-label="Navigate to Dashboard"
      >
        <Trophy className="w-6 h-6 text-[#d4af37]" />
        <span className="font-playfair text-lg font-bold tracking-widest text-[#f3f4f6] m-0">
          CHESS ARENA
        </span>
      </Link>

      {/* User Actions */}
      {currentUser && (
        <div className="relative flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-[#f3f4f6] leading-tight">
              {currentUser.username}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mt-0.5">
              {currentUser.role}
            </span>
          </div>

          <NotificationBell />

          <NavbarAvatar
            src={currentUser.avatarUrl}
            username={currentUser.username}
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
      )}
    </header>
  );
};

export default Navbar;
