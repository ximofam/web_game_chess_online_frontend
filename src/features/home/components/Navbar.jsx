import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, MessageSquare, LogIn, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../../auth/context/AuthContext';
import NavbarAvatar from '../../profile/components/NavbarAvatar';
import AvatarDropdown from '../../profile/components/AvatarDropdown';
import NotificationBell from '../../notifications/components/NotificationBell';

/**
 * Global Navigation Header.
 * Features Navigation links (Home, Forum) and displays User Profile Dropdown or Guest Status & Auth CTAs.
 */
export const Navbar = () => {
  const { currentUser, isGuest, isRegisteredUser, logout, openGuestModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const isHomeActive = location.pathname === '/' || location.pathname === '/dashboard';
  const isForumActive = location.pathname.startsWith('/forum');

  return (
    <header className="w-full border-b border-[#2d323f] bg-[#13161c] px-4 md:px-8 py-3.5 flex items-center justify-between relative z-40 select-none shadow-md">
      {/* Brand Logo & Navigation Links */}
      <div className="flex items-center gap-6 md:gap-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity focus:outline-none focus:ring-1 focus:ring-[#d4af37] rounded"
          aria-label="Navigate to Home"
        >
          <Trophy className="w-6 h-6 text-[#d4af37]" />
          <span className="font-playfair text-lg font-bold tracking-widest text-[#f3f4f6] hidden sm:inline">
            CHESS ARENA
          </span>
        </Link>

        {/* Primary Nav Links (Home, Forum) */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              isHomeActive
                ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30'
                : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#242834]'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>

          <Link
            to="/forum"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              isForumActive
                ? 'bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30'
                : 'text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#242834]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Diễn đàn</span>
          </Link>
        </nav>
      </div>

      {/* User Actions & Auth Status */}
      <div className="flex items-center gap-3">
        {isRegisteredUser ? (
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-[#f3f4f6] leading-tight">
                {currentUser?.username}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold mt-0.5">
                {currentUser?.role || 'ROLE_USER'}
              </span>
            </div>

            <NotificationBell />

            <div className="relative">
              <NavbarAvatar
                src={currentUser?.avatarUrl}
                username={currentUser?.username}
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
          </div>
        ) : (
          /* Guest or Unauthenticated Status */
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#242834] border border-[#373d4e] text-[#9ca3af]">
              <UserCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{currentUser?.username || 'Khách (Guest)'}</span>
            </span>

            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-[#d4af37] text-[#0d0e12] hover:bg-[#b59226] font-semibold text-xs md:text-sm px-3.5 py-1.5 rounded-lg transition-all shadow cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </Link>

            <Link
              to="/register"
              className="hidden md:flex items-center gap-1.5 bg-[#242834] border border-[#373d4e] hover:bg-[#2d3242] text-[#f3f4f6] font-semibold text-sm px-3.5 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-[#d4af37]" />
              <span>Đăng ký</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
