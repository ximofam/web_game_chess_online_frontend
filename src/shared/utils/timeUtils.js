/**
 * Format a timestamp into a local time string (HH:MM).
 * @param {number|string|Date} timestamp 
 * @returns {string} Formatted time string
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
