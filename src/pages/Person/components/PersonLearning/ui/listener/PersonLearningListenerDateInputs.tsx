import type { FC, ChangeEvent } from 'react';
import type { IPersonLearningListenerDateInputsProps } from '../../interface/interface';

import '../../styles/listener.css';

const PersonLearningListenerDateInputs: FC<IPersonLearningListenerDateInputsProps> = ({
  value,
  onChange,
  hasError = false,
  disabled = false,
}) => {
  const handleChange = (field: 'day' | 'month' | 'year') => (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const raw = e.target.value.replace(/\D/g, '');
    const maxLen = field === 'year' ? 4 : 2;
    onChange({ ...value, [field]: raw.slice(0, maxLen) });
  };

  return (
    <div className={`person-learning-listener-date${hasError ? ' person-learning-listener-date_has-error' : ''}`}>
      <input
        className={`person-learning-listener-date__input${hasError ? ' person-learning-listener-date__input_error' : ''}`}
        type='number'
        min={1}
        placeholder='ДД'
        value={value.day}
        onChange={handleChange('day')}
        disabled={disabled}
      />
      <input
        className={`person-learning-listener-date__input person-learning-listener-date__input_month${hasError ? ' person-learning-listener-date__input_error' : ''}`}
        type='number'
        min={1}
        placeholder='ММ'
        value={value.month}
        onChange={handleChange('month')}
        disabled={disabled}
      />
      <input
        className={`person-learning-listener-date__input person-learning-listener-date__input_year${hasError ? ' person-learning-listener-date__input_error' : ''}`}
        type='number'
        min={1}
        placeholder='ГГГГ'
        value={value.year}
        onChange={handleChange('year')}
        disabled={disabled}
      />
    </div>
  );
};

export default PersonLearningListenerDateInputs;
