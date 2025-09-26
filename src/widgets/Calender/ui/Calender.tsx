import { FC, useState } from 'react';

import '../styles/style.css';

interface ICalendarProps {
  year: number;
  month: number; // 0 = Январь, 11 = Декабрь
  startDay?: number; // начало диапазона (например 5)
  endDay?: number;   // конец диапазона (например 20)
  onSelectDate?: (date: Date) => void;
}

interface IDay {
  day: number;
  currentMonth: boolean;
}

export const Calendar: FC<ICalendarProps> = ({
  year,
  month,
  startDay,
  endDay,
  onSelectDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const firstDay = new Date(year, month, 1);
  const startWeekDay = (firstDay.getDay() + 6) % 7; // понедельник = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days: IDay[] = [];

  // предыдущий месяц
  for (let i = startWeekDay - 1; i >= 0; i--) {
    days.push({ day: daysInPrevMonth - i, currentMonth: false });
  }

  // текущий месяц
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, currentMonth: true });
  }

  // следующий месяц (до 42 ячеек)
  while (days.length % 7 !== 0) {
    days.push({
      day: days.length - (startWeekDay + daysInMonth) + 1,
      currentMonth: false,
    });
  }

  const handleClick = (day: IDay) => {
    if (!day.currentMonth) return;
    if (startDay && endDay && (day.day < startDay || day.day > endDay)) return;

    const date = new Date(year, month, day.day);
    setSelectedDate(date);
    onSelectDate?.(date);
  };

  return (
    <div className='calendar'>
      <div className='calendar__weekdays'>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
          <div key={d} className='calendar__weekday'>
            {d}
          </div>
        ))}
      </div>
      <div className='calendar__grid'>
        {days.map((day, i) => {
          const isSelected =
            selectedDate?.getDate() === day.day && day.currentMonth;

          const isDisabled =
            !day.currentMonth ||
            (startDay && endDay && (day.day < startDay || day.day > endDay));

          return (
            <div
              key={i}
              className={`calendar__cell 
                ${day.currentMonth ? '' : 'calendar__cell--other'} 
                ${isDisabled ? 'calendar__cell--disabled' : ''} 
                ${isSelected ? 'calendar__cell--selected' : ''}`}
              onClick={() => handleClick(day)}
            >
              {day.day}
            </div>
          );
        })}
      </div>
    </div>
  );
};
