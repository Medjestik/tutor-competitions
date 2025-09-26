export const formatDateShort = (dateStr: string) => {
  const [, month, day] = dateStr.split('-');
  return `${day}.${month}`;
};
