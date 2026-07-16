import React from 'react';

/**
 * NavbarAvatar renders the circular avatar image with a premium gold border,
 * or a fallback with the first letter of the username.
 */
export const NavbarAvatar = ({ src, username, onClick }) => {
  const initial = username ? username.charAt(0).toUpperCase() : 'P';

  return (
    <button
      onClick={onClick}
      className="w-10 h-10 rounded-full border border-[#d4af37]/60 bg-[#1a1d24] text-[#d4af37] flex items-center justify-center font-bold hover:border-[#f3cd57] hover:shadow-[0_0_8px_rgba(212,175,55,0.4)] transition-all focus:outline-none focus:ring-2 focus:ring-[#d4af37] cursor-pointer overflow-hidden select-none"
      aria-label="Open player profile menu"
    >
      {src ? (
        <img
          src={src}
          alt={`${username}'s avatar`}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-bold tracking-wider">{initial}</span>
      )}
    </button>
  );
};

export default NavbarAvatar;
