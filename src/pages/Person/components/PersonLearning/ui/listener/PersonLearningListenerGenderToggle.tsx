import type { FC } from 'react';
import type { IPersonLearningListenerGenderToggleProps } from '../../interface/interface';

import '../../styles/listener.css';

const PersonLearningListenerGenderToggle: FC<IPersonLearningListenerGenderToggleProps> = ({
  value,
  onChange,
  hasError = false,
  disabled = false,
}) => {
  return (
    <div className={`person-learning-listener-gender${hasError ? ' person-learning-listener-gender_has-error' : ''}${disabled ? ' person-learning-listener-gender_disabled' : ''}`}>
      <button
        type='button'
        className={`person-learning-listener-gender__btn${
          value === 'female' ? ' person-learning-listener-gender__btn_active' : ''
        }`}
        onClick={() => !disabled && onChange('female')}
        disabled={disabled}
      >
        Женский
      </button>
      <button
        type='button'
        className={`person-learning-listener-gender__btn${
          value === 'male' ? ' person-learning-listener-gender__btn_active' : ''
        }`}
        onClick={() => !disabled && onChange('male')}
        disabled={disabled}
      >
        Мужской
      </button>
    </div>
  );
};

export default PersonLearningListenerGenderToggle;
