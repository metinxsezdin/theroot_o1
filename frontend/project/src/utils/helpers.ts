export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const generateColor = () => {
  const colors = [
    '#818cf8', // Indigo
    '#34d399', // Emerald
    '#fb923c', // Orange
    '#f472b6', // Pink
    '#a78bfa', // Purple
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};