import { FC } from 'react';

import type { ITimeSelectProps, ITimeInterval } from '../interface/interface';

import '../styles/style.css';


export const TimeSelect: FC<ITimeSelectProps> = ({
  intervals,
  selected,
  onChange,
}) => {
  const toggleSelect = (slot: ITimeInterval) => {
    if (slot.status === 'busy') return;

    const key = `${slot.start}-${slot.end}`;
    const alreadySelected = selected.some(s => `${s.start}-${s.end}` === key);

    const newSelected = alreadySelected
      ? selected.filter(s => `${s.start}-${s.end}` !== key)
      : [...selected, slot];

    onChange?.(newSelected);
  };

  return (
    <div className='time-select'>
      <div className='time-select__header'>
        <h6 className='time-select__header-title'>Выберите временной интервал</h6>
      </div>
      {intervals.map(slot => {
        const key = `${slot.start}-${slot.end}`;
        const isSelected = selected.some(s => `${s.start}-${s.end}` === key);

        return (
          <div
            key={key}
            className={`time-slot 
              ${slot.status === 'busy' ? 'time-slot--busy' : ''} 
              ${isSelected ? 'time-slot--selected' : ''}`}
            onClick={() => toggleSelect(slot)}
          >
            {slot.start} - {slot.end}
          </div>
        );
      })}
    </div>
  );
};
