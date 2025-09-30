export const formatDateShort = (dateStr: string) => {
  const [, month, day] = dateStr.split('-');
  return `${day}.${month}`;
};

export const convertDate = (dateStr: string): string => {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];

  const [year, month, day] = dateStr.split('-').map(Number);
  return `${day} ${months[month - 1]} ${year} года`;
};
