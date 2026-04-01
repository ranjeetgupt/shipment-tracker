export const generateTrackingId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomSegment = (len) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `SHP-${randomSegment(6)}-${randomSegment(6)}`;
};

export const getEstimatedDelivery = (serviceType) => {
  const daysMap = {
    Overnight: 1,
    Express: 2,
    Standard: 5,
    Economy: 10,
  };
  const days = daysMap[serviceType] || 5;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
