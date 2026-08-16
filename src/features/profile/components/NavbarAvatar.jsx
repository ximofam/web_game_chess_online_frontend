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
        className="w-10 h-10 rounded-full border border-chess-gold/60 bg-chess-surface text-chess-gold flex items-center justify-center font-bold hover:border-chess-gold-hover hover:shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-chess-gold cursor-pointer overflow-hidden select-none"
        aria-label="Open player profile menu"
      >
        {src ? (
          <img
            src={src}
            alt={`${username}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-playfair text-xl font-bold tracking-wider">{initial}</span>
        )}
      </button>

      {/* Modern Status Badge Dot at bottom-right corner */}
      <span
        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-chess-dark pointer-events-none transition-colors ${
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
