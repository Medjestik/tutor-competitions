import type { FC } from 'react';
import type { IPersonLearningListenerCheckboxProps } from '../../interface/interface';

import { getListenerFieldNameAttribute } from '../../lib/listenerValidation';

import '../../styles/listener.css';

const PersonLearningListenerCheckbox: FC<IPersonLearningListenerCheckboxProps> = ({
  checked,
  onChange,
  hasError = false,
  errorText = '',
  fieldKey,
  disabled = false,
  children,
}) => {
  return (
    <div
      className='person-learning-listener-checkbox-wrap'
      data-listener-field={fieldKey ? getListenerFieldNameAttribute(fieldKey) : undefined}
    >
      <div
        className={`person-learning-listener-checkbox${hasError ? ' person-learning-listener-checkbox_has-error' : ''}${disabled ? ' person-learning-listener-checkbox_disabled' : ''}`}
        onClick={() => !disabled && onChange(!checked)}
        role='checkbox'
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        <div
          className={`person-learning-listener-checkbox__box${
            checked ? ' person-learning-listener-checkbox__box_checked' : ''
          }`}
        />
        <span className='person-learning-listener-checkbox__label'>{children}</span>
      </div>
      {hasError && errorText && (
        <p className='person-learning-listener-checkbox__error'>{errorText}</p>
      )}
    </div>
  );
};

export default PersonLearningListenerCheckbox;
