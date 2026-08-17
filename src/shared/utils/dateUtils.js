/**
 * Group a list of items by date categories (Today, Yesterday, Older).
 * @param {Array} items - The array of items.
 * @param {string} dateKey - The object key containing the ISO date string.
 * @returns {Object} Grouped items: { today: [], yesterday: [], older: [] }
 */
export const groupItemsByDate = (items, dateKey = 'created_at') => {
  const grouped = {
    today: [],
    yesterday: [],
    older: []
  };

  if (!items || !Array.isArray(items)) return grouped;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;

  items.forEach(item => {
    if (!item[dateKey]) return;
    
    const itemDate = new Date(item[dateKey]).getTime();
    
    if (itemDate >= today) {
      grouped.today.push(item);
    } else if (itemDate >= yesterday) {
      grouped.yesterday.push(item);
    } else {
      grouped.older.push(item);
    }
  });

  return grouped;
};
