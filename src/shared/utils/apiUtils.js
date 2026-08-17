/**
 * Formats a raw API URL by adding the appropriate protocol if missing.
 * @param {string} url - The raw URL string.
 * @returns {string} The formatted URL.
 */
export const formatApiUrl = (url) => {
  if (!url || url.trim() === '' || url.trim() === '/') return '';
  if (/^https?:\/\//i.test(url)) return url;
  return url.startsWith('localhost') || url.startsWith('127.0.0.1') ? `http://${url}` : `https://${url}`;
};
