export const getDayBegin = (day: number) => {
  const epochMs = Date.UTC(2022, 0);
  const msInDay = 86400000;
  return new Date(epochMs + msInDay * day);
};
