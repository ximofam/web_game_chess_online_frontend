import React from 'react';

/**
 * NotificationBadge displays the number of unread alerts.
 * Animates/pulses when values change.
 */
export const NotificationBadge = ({ count }) => {
  if (!count || count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count;

  return (
    <span
      className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-red-600 border border-[#13161c] text-[10px] font-bold text-white tracking-tight animate-pulse"
      aria-label={`${count} unread notifications`}
    >
      {displayCount}
    </span>
  );
};

export default NotificationBadge;
