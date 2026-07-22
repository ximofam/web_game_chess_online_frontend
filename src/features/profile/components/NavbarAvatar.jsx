/**
 * NavbarAvatar renders the circular avatar image with a premium gold border,
 * fallback initial letter, and a modern online/offline status dot at the bottom-right corner.
 */
export const NavbarAvatar = ({ src, username, onClick, isOnline = true }) => {
  const initial = username ? username.charAt(0).toUpperCase() : 'P';

  return (
    <div className="relative inline-flex items-center justify-center">
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

      {/* Modern Status Badge Dot at bottom-right corner */}
      <span
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#13161c] pointer-events-none transition-all ${
          isOnline
            ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] ring-1 ring-emerald-400/50'
            : 'bg-gray-500'
        }`}
        title={isOnline ? 'Online' : 'Offline'}
      />
    </div>
  );
};

export default NavbarAvatar;
